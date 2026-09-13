const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const Session = require('../models/Session');
const Invitation = require('../models/Invitation');
const {
  IN_MEMORY_USERS,
  IN_MEMORY_ROLES,
  IN_MEMORY_SESSIONS,
  IN_MEMORY_INVITATIONS,
} = require('../utils/securityStore');
const { isDbConnected } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const {
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
  SYSTEM_ROLES,
  logSecurityEvent,
} = require('../services/securityService');
const { logActivity } = require('./adminController');

/**
 * Helper: Count active sessions for a user
 */
async function countUserSessions(userId, userEmail) {
  let count = 0;
  if (isDbConnected()) {
    try {
      count = await Session.countDocuments({
        $or: [{ userId: String(userId) }, { userEmail: (userEmail || '').toLowerCase() }],
        isActive: true,
        expiresAt: { $gt: new Date() },
      });
      return count;
    } catch (_) {}
  }
  return IN_MEMORY_SESSIONS.filter(
    s =>
      (s.userId === String(userId) || s.userEmail === (userEmail || '').toLowerCase()) &&
      s.isActive &&
      new Date(s.expiresAt) > new Date()
  ).length;
}

/**
 * Helper: Count active administrators (OWNER + ADMIN)
 */
async function countActiveAdmins() {
  let count = 0;
  if (isDbConnected()) {
    try {
      count = await User.countDocuments({
        role: { $in: ['OWNER', 'ADMIN', 'owner', 'admin'] },
        isActive: true,
        status: { $ne: 'DISABLED' },
      });
      return count;
    } catch (_) {}
  }
  return IN_MEMORY_USERS.filter(
    u =>
      ['OWNER', 'ADMIN', 'owner', 'admin'].includes(u.role) &&
      u.isActive !== false &&
      u.status !== 'DISABLED'
  ).length;
}

/**
 * Helper: Count active owners
 */
async function countActiveOwners() {
  let count = 0;
  if (isDbConnected()) {
    try {
      count = await User.countDocuments({
        role: { $in: ['OWNER', 'owner'] },
        isActive: true,
        status: { $ne: 'DISABLED' },
      });
      return count;
    } catch (_) {}
  }
  return IN_MEMORY_USERS.filter(
    u => ['OWNER', 'owner'].includes(u.role) && u.isActive !== false && u.status !== 'DISABLED'
  ).length;
}

// ─── USER MANAGEMENT ────────────────────────────────────────────

/**
 * GET /api/admin/users
 * Returns all admin accounts (never passwords/hashes) with session tallies.
 */
const getUsers = async (req, res, next) => {
  try {
    let usersList = [];

    if (isDbConnected()) {
      try {
        const dbUsers = await User.find().select('-password').sort({ createdAt: -1 });
        usersList = dbUsers.map(u => ({
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: (u.role || 'VIEWER').toUpperCase(),
          status: u.status || (u.isActive ? 'ACTIVE' : 'DISABLED'),
          lastLoginAt: u.lastLoginAt,
          lastActivityAt: u.lastActivityAt,
          createdAt: u.createdAt,
        }));
      } catch (_) {}
    }

    // Include / merge in-memory users if any
    IN_MEMORY_USERS.forEach(memU => {
      const exists = usersList.some(u => u.email === memU.email);
      if (!exists) {
        usersList.push({
          id: memU.id || memU._id || `mem_${memU.email}`,
          name: memU.name,
          email: memU.email,
          role: (memU.role || 'VIEWER').toUpperCase(),
          status: memU.status || (memU.isActive ? 'ACTIVE' : 'DISABLED'),
          lastLoginAt: memU.lastLoginAt,
          lastActivityAt: memU.lastActivityAt,
          createdAt: memU.createdAt || new Date(),
        });
      }
    });

    // If still empty, supply the provisioned system administrator
    if (usersList.length === 0) {
      usersList.push({
        id: 'primary-owner',
        name: 'Anurag Sahu',
        email: (process.env.ADMIN_EMAIL || 'admin@anuragsahu.dev').toLowerCase(),
        role: 'OWNER',
        status: 'ACTIVE',
        lastLoginAt: new Date(),
        lastActivityAt: new Date(),
        createdAt: new Date(),
      });
    }

    // Attach active session counts
    const enrichedUsers = await Promise.all(
      usersList.map(async u => ({
        ...u,
        sessionCount: await countUserSessions(u.id, u.email),
      }))
    );

    return sendSuccess(res, { users: enrichedUsers, total: enrichedUsers.length });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/users
 * Allows primary admin to create or invite another admin account.
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, role = 'VIEWER', password, status = 'ACTIVE' } = req.body;

    if (!name || !email) {
      return sendError(res, 'Full name and email are required.', 'VALIDATION_ERROR', 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanRole = role.toUpperCase();
    const cleanStatus = status.toUpperCase();

    // Check existing in DB
    if (isDbConnected()) {
      try {
        const existing = await User.findOne({ email: cleanEmail });
        if (existing) {
          return sendError(res, 'An administrator account with this email already exists.', 'CONFLICT', 409);
        }
      } catch (_) {}
    }

    // Check existing in Memory
    const existingMem = IN_MEMORY_USERS.find(u => u.email === cleanEmail);
    if (existingMem) {
      return sendError(res, 'An administrator account with this email already exists.', 'CONFLICT', 409);
    }

    // If password provided, hash it; otherwise initiate invitation token
    let setupToken = null;
    let initialPassword = password;
    let userStatus = cleanStatus;

    if (!initialPassword) {
      setupToken = crypto.randomBytes(32).toString('hex');
      initialPassword = crypto.randomBytes(16).toString('hex'); // Random temporary password
      userStatus = 'INVITED';
    }

    const userDocData = {
      name: name.trim(),
      email: cleanEmail,
      password: initialPassword,
      role: cleanRole,
      status: userStatus,
      isActive: userStatus === 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let createdId = `user_${Date.now()}`;

    if (isDbConnected()) {
      try {
        const newUser = await User.create(userDocData);
        createdId = newUser._id.toString();
      } catch (dbErr) {
        console.warn('[Access] User DB create error, falling back to memory:', dbErr.message);
      }
    }

    userDocData.id = createdId;
    userDocData._id = createdId;
    IN_MEMORY_USERS.push(userDocData);

    // If invitation flow, persist Invitation record
    if (setupToken) {
      const tokenHash = crypto.createHash('sha256').update(setupToken).digest('hex');
      const invData = {
        invitationId: `inv_${Date.now()}`,
        email: cleanEmail,
        name: name.trim(),
        role: cleanRole,
        tokenHash,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
        invitedBy: req.user ? req.user.email : 'system',
      };
      IN_MEMORY_INVITATIONS.push(invData);
      if (isDbConnected()) {
        await Invitation.create(invData).catch(() => {});
      }
    }

    await logSecurityEvent({
      eventType: setupToken ? 'USER_INVITED' : 'USER_CREATED',
      severity: 'MEDIUM',
      userEmail: cleanEmail,
      resource: 'User',
      action: 'CREATE',
      details: {
        createdUserId: createdId,
        role: cleanRole,
        status: userStatus,
        invitedBy: req.user ? req.user.email : 'system',
      },
      req,
    });

    await logActivity(setupToken ? 'ADMIN_USER_INVITED' : 'ADMIN_USER_CREATED', 'User', { email: cleanEmail, role: cleanRole }, req);

    return res.status(201).json({
      success: true,
      message: setupToken
        ? `Invitation successfully created for ${cleanEmail}.`
        : `Account for ${cleanEmail} created successfully.`,
      data: {
        user: {
          id: createdId,
          name: name.trim(),
          email: cleanEmail,
          role: cleanRole,
          status: userStatus,
        },
        setupUrl: setupToken ? `/admin?setupToken=${setupToken}` : null,
        invitationUrl: setupToken ? `/admin?setupToken=${setupToken}&token=${setupToken}` : null,
        setupToken: setupToken || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/users/:id
 * Update user details, role, or status with Owner & Last Admin Protection.
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, status } = req.body;

    let targetUser = null;

    if (isDbConnected()) {
      try {
        targetUser = await User.findById(id);
      } catch (_) {}
    }
    if (!targetUser) {
      targetUser = IN_MEMORY_USERS.find(u => u.id === id || u._id === id || u.email === id);
    }

    if (!targetUser) {
      return sendError(res, 'Administrator account not found.', 'NOT_FOUND', 404);
    }

    const currentRole = (targetUser.role || 'VIEWER').toUpperCase();
    const currentStatus = (targetUser.status || (targetUser.isActive ? 'ACTIVE' : 'DISABLED')).toUpperCase();
    const newRole = role ? role.toUpperCase() : currentRole;
    const newStatus = status ? status.toUpperCase() : currentStatus;

    // ─── OWNER PROTECTION ───
    if (currentRole === 'OWNER') {
      // Prevent disabling or suspending sole owner
      if (newStatus === 'DISABLED' || newStatus === 'SUSPENDED') {
        return sendError(res, 'Security Violation: The primary OWNER account cannot be disabled or suspended.', 'FORBIDDEN', 403);
      }
      // Prevent demoting sole owner
      if (newRole !== 'OWNER') {
        const totalOwners = await countActiveOwners();
        if (totalOwners <= 1) {
          return sendError(res, 'Security Violation: Cannot demote the sole system OWNER.', 'FORBIDDEN', 403);
        }
      }
    }

    // ─── LAST ADMIN PROTECTION ───
    if (['OWNER', 'ADMIN'].includes(currentRole)) {
      if ((newStatus === 'DISABLED' || newStatus === 'SUSPENDED') || !['OWNER', 'ADMIN'].includes(newRole)) {
        const totalAdmins = await countActiveAdmins();
        if (totalAdmins <= 1) {
          return sendError(res, 'Security Violation: Cannot disable or demote the final active administrator.', 'FORBIDDEN', 403);
        }
      }
    }

    // Update in DB
    if (isDbConnected() && targetUser.save) {
      if (name) targetUser.name = name.trim();
      if (role) targetUser.role = newRole;
      if (status) {
        targetUser.status = newStatus;
        targetUser.isActive = newStatus === 'ACTIVE';
      }
      await targetUser.save();
    }

    // Update in Memory
    const memIdx = IN_MEMORY_USERS.findIndex(u => u.id === id || u._id === id || u.email === targetUser.email);
    if (memIdx !== -1) {
      if (name) IN_MEMORY_USERS[memIdx].name = name.trim();
      if (role) IN_MEMORY_USERS[memIdx].role = newRole;
      if (status) {
        IN_MEMORY_USERS[memIdx].status = newStatus;
        IN_MEMORY_USERS[memIdx].isActive = newStatus === 'ACTIVE';
      }
    }

    // If disabled or suspended, revoke all active sessions
    if (newStatus === 'DISABLED' || newStatus === 'SUSPENDED') {
      IN_MEMORY_SESSIONS.forEach(s => {
        if (s.userId === id || s.userEmail === targetUser.email) {
          s.isActive = false;
          s.revokedAt = new Date();
          s.revokedReason = `Account ${newStatus}`;
        }
      });
      if (isDbConnected()) {
        await Session.updateMany(
          { $or: [{ userId: id }, { userEmail: targetUser.email }] },
          { isActive: false, revokedAt: new Date(), revokedReason: `Account ${newStatus}` }
        ).catch(() => {});
      }
    }

    await logSecurityEvent({
      eventType: currentRole !== newRole ? 'ROLE_CHANGED' : 'SECURITY_CONFIG_CHANGED',
      severity: 'MEDIUM',
      userEmail: targetUser.email,
      resource: 'User',
      action: 'UPDATE',
      details: {
        userId: id,
        previousRole: currentRole,
        newRole,
        previousStatus: currentStatus,
        newStatus,
        updatedBy: req.user ? req.user.email : 'system',
      },
      req,
    });

    await logActivity('ADMIN_USER_UPDATED', 'User', { email: targetUser.email, role: newRole, status: newStatus }, req);

    return sendSuccess(res, {
      user: {
        id,
        name: name ? name.trim() : targetUser.name,
        email: targetUser.email,
        role: newRole,
        status: newStatus,
      },
    }, 'Administrator account updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/users/:id
 * Delete admin account with Owner & Last Admin Protection.
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    let targetUser = null;
    if (isDbConnected()) {
      try {
        targetUser = await User.findById(id);
      } catch (_) {}
    }
    if (!targetUser) {
      targetUser = IN_MEMORY_USERS.find(u => u.id === id || u._id === id || u.email === id);
    }

    if (!targetUser) {
      return sendError(res, 'Administrator account not found.', 'NOT_FOUND', 404);
    }

    const targetRole = (targetUser.role || 'VIEWER').toUpperCase();

    // ─── OWNER PROTECTION ───
    if (targetRole === 'OWNER') {
      return sendError(res, 'Security Violation: The primary OWNER account cannot be deleted.', 'FORBIDDEN', 403);
    }

    // ─── LAST ADMIN PROTECTION ───
    if (targetRole === 'ADMIN') {
      const totalAdmins = await countActiveAdmins();
      if (totalAdmins <= 1) {
        return sendError(res, 'Security Violation: Cannot delete the final active administrator.', 'FORBIDDEN', 403);
      }
    }

    // Delete in DB
    if (isDbConnected()) {
      await User.findByIdAndDelete(id).catch(() => {});
      await Session.deleteMany({ $or: [{ userId: id }, { userEmail: targetUser.email }] }).catch(() => {});
    }

    // Delete in Memory
    const memIdx = IN_MEMORY_USERS.findIndex(u => u.id === id || u._id === id || u.email === targetUser.email);
    if (memIdx !== -1) {
      IN_MEMORY_USERS.splice(memIdx, 1);
    }
    for (let i = IN_MEMORY_SESSIONS.length - 1; i >= 0; i--) {
      if (IN_MEMORY_SESSIONS[i].userId === id || IN_MEMORY_SESSIONS[i].userEmail === targetUser.email) {
        IN_MEMORY_SESSIONS.splice(i, 1);
      }
    }

    await logSecurityEvent({
      eventType: 'USER_DELETED',
      severity: 'HIGH',
      userEmail: targetUser.email,
      resource: 'User',
      action: 'DELETE',
      details: { userId: id, role: targetRole, deletedBy: req.user ? req.user.email : 'system' },
      req,
    });

    await logActivity('ADMIN_USER_DELETED', 'User', { email: targetUser.email }, req);

    return sendSuccess(res, { id }, 'Administrator account permanently deleted.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/users/:id/resend-invite
 * Regenerate setup token for invited user.
 */
const resendInvitation = async (req, res, next) => {
  try {
    const { id } = req.params;

    let targetUser = null;
    if (isDbConnected()) {
      try { targetUser = await User.findById(id); } catch (_) {}
    }
    if (!targetUser) {
      targetUser = IN_MEMORY_USERS.find(u => u.id === id || u._id === id || u.email === id);
    }

    if (!targetUser) {
      return sendError(res, 'Account not found.', 'NOT_FOUND', 404);
    }

    const setupToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(setupToken).digest('hex');

    const invData = {
      invitationId: `inv_${Date.now()}`,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      tokenHash,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      invitedBy: req.user ? req.user.email : 'system',
    };

    IN_MEMORY_INVITATIONS.push(invData);
    if (isDbConnected()) {
      await Invitation.create(invData).catch(() => {});
    }

    await logSecurityEvent({
      eventType: 'USER_INVITED',
      severity: 'LOW',
      userEmail: targetUser.email,
      resource: 'User',
      action: 'RESEND_INVITE',
      details: { resendBy: req.user ? req.user.email : 'system' },
      req,
    });

    return sendSuccess(res, {
      setupUrl: `/admin?setupToken=${setupToken}`,
    }, `Invitation setup link refreshed for ${targetUser.email}.`);
  } catch (err) {
    next(err);
  }
};

// ─── ROLE & PERMISSION MANAGEMENT ───────────────────────────────

/**
 * GET /api/admin/permissions
 * Lists all permissions grouped by the 10 categories.
 */
const getPermissions = (req, res) => {
  const formattedGroups = Object.entries(PERMISSION_GROUPS).map(([category, perms]) => ({
    category,
    label: category.charAt(0) + category.slice(1).toLowerCase(),
    permissions: perms,
  }));

  return sendSuccess(res, {
    groups: formattedGroups,
    permissionGroups: PERMISSION_GROUPS,
    permissions: ALL_PERMISSIONS,
    allPermissions: ALL_PERMISSIONS,
    total: ALL_PERMISSIONS.length,
  });
};

/**
 * GET /api/admin/roles
 * Lists all system and custom roles with user assignment counts.
 */
const getRoles = async (req, res, next) => {
  try {
    const rolesList = [];

    // 1. System Roles
    Object.values(SYSTEM_ROLES).forEach(r => {
      rolesList.push({
        id: `sys_${r.name.toLowerCase()}`,
        name: r.name,
        description: r.description,
        permissions: r.permissions,
        isSystem: true,
        isActive: true,
        permissionCount: r.permissions.length,
        assignedUsersCount: 0,
      });
    });

    // 2. Custom Roles in DB
    if (isDbConnected()) {
      try {
        const dbRoles = await Role.find();
        dbRoles.forEach(dr => {
          rolesList.push({
            id: dr._id.toString(),
            name: dr.name,
            description: dr.description,
            permissions: dr.permissions || [],
            isSystem: dr.isSystem || false,
            isActive: dr.isActive !== false,
            permissionCount: (dr.permissions || []).length,
            assignedUsersCount: 0,
          });
        });
      } catch (_) {}
    }

    // 3. Custom Roles in Memory
    IN_MEMORY_ROLES.forEach(mr => {
      if (!rolesList.some(r => r.name === mr.name)) {
        rolesList.push({
          id: mr.id || mr._id || `mem_role_${mr.name}`,
          name: mr.name,
          description: mr.description,
          permissions: mr.permissions || [],
          isSystem: false,
          isActive: mr.isActive !== false,
          permissionCount: (mr.permissions || []).length,
          assignedUsersCount: 0,
        });
      }
    });

    // Count user assignments per role
    let allUsers = [];
    if (isDbConnected()) {
      try {
        allUsers = await User.find().select('role');
      } catch (_) {}
    }
    IN_MEMORY_USERS.forEach(mu => {
      if (!allUsers.some(u => u.email === mu.email)) allUsers.push(mu);
    });

    rolesList.forEach(r => {
      r.assignedUsersCount = allUsers.filter(
        u => (u.role || '').toUpperCase() === r.name.toUpperCase()
      ).length;
    });

    return sendSuccess(res, { roles: rolesList, total: rolesList.length });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/roles
 * Create custom role.
 */
const createRole = async (req, res, next) => {
  try {
    const { name, description = '', permissions = [] } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 'Role name is required.', 'VALIDATION_ERROR', 400);
    }

    const cleanName = name.toUpperCase().trim();

    // Check system collisions
    if (SYSTEM_ROLES[cleanName]) {
      return sendError(res, `Cannot create role with reserved system name: ${cleanName}`, 'CONFLICT', 409);
    }

    // Check existing
    if (isDbConnected()) {
      const existing = await Role.findOne({ name: cleanName });
      if (existing) {
        return sendError(res, `Role ${cleanName} already exists.`, 'CONFLICT', 409);
      }
    }
    if (IN_MEMORY_ROLES.some(r => r.name === cleanName)) {
      return sendError(res, `Role ${cleanName} already exists.`, 'CONFLICT', 409);
    }

    const roleDocData = {
      name: cleanName,
      description: description.trim(),
      permissions: Array.isArray(permissions) ? permissions : [],
      isSystem: false,
      isActive: true,
      createdBy: req.user ? req.user.email : 'system',
      createdAt: new Date(),
    };

    let createdId = `role_${Date.now()}`;
    if (isDbConnected()) {
      try {
        const nr = await Role.create(roleDocData);
        createdId = nr._id.toString();
      } catch (_) {}
    }

    roleDocData.id = createdId;
    roleDocData._id = createdId;
    IN_MEMORY_ROLES.push(roleDocData);

    await logSecurityEvent({
      eventType: 'SECURITY_CONFIG_CHANGED',
      severity: 'MEDIUM',
      resource: 'Role',
      action: 'CREATE_ROLE',
      details: { name: cleanName, permissionCount: roleDocData.permissions.length },
      req,
    });

    return res.status(201).json({
      success: true,
      message: `Custom role ${cleanName} created successfully.`,
      data: { role: roleDocData },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/roles/:id
 * Edit custom role permissions or description.
 */
const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, permissions, isActive } = req.body;

    let targetRole = null;
    if (isDbConnected()) {
      try { targetRole = await Role.findById(id); } catch (_) {}
    }
    if (!targetRole) {
      targetRole = IN_MEMORY_ROLES.find(r => r.id === id || r._id === id || r.name === id.toUpperCase());
    }

    if (!targetRole) {
      return sendError(res, 'Role not found or cannot modify default system roles.', 'NOT_FOUND', 404);
    }

    if (targetRole.isSystem) {
      return sendError(res, 'Default system roles (OWNER, ADMIN, EDITOR, VIEWER) cannot be edited directly.', 'FORBIDDEN', 403);
    }

    if (isDbConnected() && targetRole.save) {
      if (description !== undefined) targetRole.description = description.trim();
      if (Array.isArray(permissions)) targetRole.permissions = permissions;
      if (isActive !== undefined) targetRole.isActive = Boolean(isActive);
      await targetRole.save();
    }

    const memIdx = IN_MEMORY_ROLES.findIndex(r => r.id === id || r._id === id || r.name === targetRole.name);
    if (memIdx !== -1) {
      if (description !== undefined) IN_MEMORY_ROLES[memIdx].description = description.trim();
      if (Array.isArray(permissions)) IN_MEMORY_ROLES[memIdx].permissions = permissions;
      if (isActive !== undefined) IN_MEMORY_ROLES[memIdx].isActive = Boolean(isActive);
    }

    await logSecurityEvent({
      eventType: 'ROLE_CHANGED',
      severity: 'MEDIUM',
      resource: 'Role',
      action: 'UPDATE_ROLE',
      details: { roleName: targetRole.name, newPermissionCount: (permissions || []).length },
      req,
    });

    return sendSuccess(res, { role: targetRole }, `Role ${targetRole.name} updated successfully.`);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/roles/:id/duplicate
 * Duplicate existing role.
 */
const duplicateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nameCandidate = req.body.newName || req.body.name;

    if (!nameCandidate || !nameCandidate.trim()) {
      return sendError(res, 'New role name is required for duplication.', 'VALIDATION_ERROR', 400);
    }

    const cleanNewName = nameCandidate.toUpperCase().trim();

    let sourcePermissions = [];
    let sourceDesc = '';

    // Check system roles first
    const sysRole = Object.values(SYSTEM_ROLES).find(r => r.name === id.toUpperCase() || id === `sys_${r.name.toLowerCase()}`);
    if (sysRole) {
      sourcePermissions = [...sysRole.permissions];
      sourceDesc = `Duplicated from ${sysRole.name}: ${sysRole.description}`;
    } else {
      let r = null;
      if (isDbConnected()) {
        try { r = await Role.findById(id); } catch (_) {}
      }
      if (!r) r = IN_MEMORY_ROLES.find(item => item.id === id || item._id === id);
      if (!r) return sendError(res, 'Source role not found.', 'NOT_FOUND', 404);

      sourcePermissions = [...(r.permissions || [])];
      sourceDesc = `Duplicated from ${r.name}: ${r.description || ''}`;
    }

    const roleData = {
      name: cleanNewName,
      description: sourceDesc,
      permissions: sourcePermissions,
      isSystem: false,
      isActive: true,
      createdBy: req.user ? req.user.email : 'system',
      createdAt: new Date(),
    };

    let createdId = `role_${Date.now()}`;
    if (isDbConnected()) {
      try {
        const nr = await Role.create(roleData);
        createdId = nr._id.toString();
      } catch (_) {}
    }

    roleData.id = createdId;
    roleData._id = createdId;
    IN_MEMORY_ROLES.push(roleData);

    return res.status(201).json({
      success: true,
      message: `Role successfully duplicated as ${cleanNewName}.`,
      data: { role: roleData },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/roles/:id
 * Delete custom role (enforces system protection & zero assigned users check).
 */
const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cleanId = (id || '').toUpperCase();

    // Reject deletion of system roles immediately
    if (SYSTEM_ROLES[cleanId] || id.startsWith('sys_')) {
      return sendError(res, 'System roles cannot be deleted.', 'FORBIDDEN', 403);
    }

    let targetRole = null;
    if (isDbConnected()) {
      try { targetRole = await Role.findById(id); } catch (_) {}
    }
    if (!targetRole) {
      targetRole = IN_MEMORY_ROLES.find(r => r.id === id || r._id === id || r.name === cleanId);
    }

    if (!targetRole) {
      return sendError(res, 'Role not found.', 'NOT_FOUND', 404);
    }

    if (targetRole.isSystem) {
      return sendError(res, 'System roles cannot be deleted.', 'FORBIDDEN', 403);
    }

    // Check if any users are currently assigned to this role
    let assignedCount = 0;
    if (isDbConnected()) {
      try {
        assignedCount = await User.countDocuments({ role: targetRole.name });
      } catch (_) {}
    }
    assignedCount += IN_MEMORY_USERS.filter(u => (u.role || '').toUpperCase() === targetRole.name).length;

    if (assignedCount > 0) {
      return sendError(
        res,
        `Cannot delete role ${targetRole.name}. ${assignedCount} user(s) are currently assigned to this role. Please reassign them first.`,
        'CONFLICT',
        409
      );
    }

    if (isDbConnected()) {
      await Role.findByIdAndDelete(id).catch(() => {});
    }

    const memIdx = IN_MEMORY_ROLES.findIndex(r => r.id === id || r._id === id || r.name === targetRole.name);
    if (memIdx !== -1) {
      IN_MEMORY_ROLES.splice(memIdx, 1);
    }

    await logSecurityEvent({
      eventType: 'SECURITY_CONFIG_CHANGED',
      severity: 'MEDIUM',
      resource: 'Role',
      action: 'DELETE_ROLE',
      details: { roleName: targetRole.name },
      req,
    });

    return sendSuccess(res, { id }, `Custom role ${targetRole.name} deleted successfully.`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resendInvitation,
  getPermissions,
  getRoles,
  createRole,
  updateRole,
  duplicateRole,
  deleteRole,
};
