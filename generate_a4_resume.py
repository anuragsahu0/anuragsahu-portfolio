import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def create_a4_pdf(filename):
    width, height = A4 # 595.275, 841.889 pt
    
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=20,
        rightMargin=20,
        topMargin=18,
        bottomMargin=18
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette matching original reference image
    C_NAVY = colors.HexColor("#0F172A")
    C_BLUE = colors.HexColor("#1E3A8A")
    C_TEXT = colors.HexColor("#1E293B")
    C_MUTED = colors.HexColor("#475569")
    C_ACCENT = colors.HexColor("#2563EB")
    C_BG_PILL = colors.HexColor("#F8FAFC")
    C_BORDER_PILL = colors.HexColor("#CBD5E1")
    C_LINE = colors.HexColor("#94A3B8")

    # Typography Styles
    style_name = ParagraphStyle(
        'NameStyle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=26,
        textColor=C_NAVY,
        alignment=TA_CENTER
    )

    style_subtitle = ParagraphStyle(
        'SubTitleStyle',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=C_BLUE,
        alignment=TA_CENTER
    )

    style_contact = ParagraphStyle(
        'ContactStyle',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=C_TEXT,
        alignment=TA_CENTER
    )

    style_section_heading = ParagraphStyle(
        'SecHeading',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=C_BLUE,
        spaceAfter=3
    )

    style_body = ParagraphStyle(
        'BodyTextCustom',
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=C_TEXT,
        alignment=TA_JUSTIFY
    )

    style_bullet = ParagraphStyle(
        'BulletCustom',
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.2,
        textColor=C_TEXT,
        leftIndent=8,
        firstLineIndent=-6
    )

    style_subbullet = ParagraphStyle(
        'SubBulletCustom',
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        leading=9.5,
        textColor=C_MUTED,
        leftIndent=8
    )

    style_pill = ParagraphStyle(
        'PillText',
        fontName='Helvetica',
        fontSize=7,
        leading=8.5,
        textColor=C_TEXT,
        alignment=TA_CENTER
    )

    story = []

    # 1. HEADER SECTION
    story.append(Paragraph("ANURAG SAHU", style_name))
    story.append(Spacer(1, 3))
    story.append(Paragraph("AI &amp; MACHINE LEARNING UNDERGRADUATE &nbsp;|&nbsp; FULL STACK WEB DEVELOPER &nbsp;|&nbsp; FLUTTER DEVELOPER", style_subtitle))
    story.append(Spacer(1, 4))
    
    contact_line1 = "📞 +91-9214654534 &nbsp;&nbsp;|&nbsp;&nbsp; ✉ shivasahu0612@gmail.com &nbsp;&nbsp;|&nbsp;&nbsp; 📍 Unnao, Uttar Pradesh, India"
    contact_line2 = "🔗 github.com/anuragsahu0 &nbsp;&nbsp;|&nbsp;&nbsp; 🌐 anuragsahu.com &nbsp;&nbsp;|&nbsp;&nbsp; 💼 linkedin.com/in/anurag-sahu-5a46b9360"
    story.append(Paragraph(contact_line1, style_contact))
    story.append(Paragraph(contact_line2, style_contact))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=0.8, color=C_LINE, spaceAfter=8, spaceBefore=0))

    # Helper function for rendering pill tags in a table layout
    def make_pill_table(pill_list, max_cols=3):
        rows = []
        curr_row = []
        for p_text in pill_list:
            p_para = Paragraph(f"<font color='#1E293B'><b>{p_text}</b></font>", style_pill)
            cell_table = Table([[p_para]], colWidths=[None])
            cell_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), C_BG_PILL),
                ('BOX', (0,0), (-1,-1), 0.5, C_BORDER_PILL),
                ('ROUNDEDCORNERS', [3, 3, 3, 3]),
                ('TOPPADDING', (0,0), (-1,-1), 2),
                ('BOTTOMPADDING', (0,0), (-1,-1), 2),
                ('LEFTPADDING', (0,0), (-1,-1), 5),
                ('RIGHTPADDING', (0,0), (-1,-1), 5),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ]))
            curr_row.append(cell_table)
            if len(curr_row) == max_cols:
                rows.append(curr_row)
                curr_row = []
        if curr_row:
            while len(curr_row) < max_cols:
                curr_row.append("")
            rows.append(curr_row)
        
        t = Table(rows, hAlign='LEFT')
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('RIGHTPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        return t

    # LEFT COLUMN CONTENT
    left_flowables = []

    # Professional Summary
    left_flowables.append(Paragraph("👤 <b>PROFESSIONAL SUMMARY</b>", style_section_heading))
    left_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))
    summary_text = ("AI &amp; Machine Learning undergraduate with strong skills in <b>Full Stack Web Development, "
                    "Flutter, and AI-powered applications</b>. Experienced in building scalable, responsive, and "
                    "user-friendly web and mobile applications, REST APIs, and AI-integrated projects. Currently "
                    "developing \"Ultron\", an intelligent voice assistant using modern AI technologies. Quick learner, "
                    "problem solver, and passionate about creating impactful software solutions.")
    left_flowables.append(Paragraph(summary_text, style_body))
    left_flowables.append(Spacer(1, 8))

    # Education
    left_flowables.append(Paragraph("🎓 <b>EDUCATION</b>", style_section_heading))
    left_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))
    
    edu_table_data = [
        [Paragraph("<b>Maharana Institute Of Professional Studies (AKTU)</b>", style_body), Paragraph("<font color='#475569'><b>2026 – Present</b></font>", ParagraphStyle('R', parent=style_body, alignment=TA_RIGHT))],
        [Paragraph("<font color='#475569'>Bachelor of Technology | Artificial Intelligence &amp; Machine Learning<br/>CGPA: <b>7.7 / 10</b></font>", style_body), ""]
    ]
    t_edu = Table(edu_table_data, colWidths=[240, 95])
    t_edu.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('SPAN', (0,1), (1,1)),
    ]))
    left_flowables.append(t_edu)
    left_flowables.append(Spacer(1, 3))

    edu_sub_data = [
        [Paragraph("<b>Higher Secondary (Class XII)</b> — Percentage: <b>72.6%</b>", style_body)],
        [Paragraph("<b>Secondary (Class X)</b> — Percentage: <b>88.4%</b>", style_body)]
    ]
    t_sub = Table(edu_sub_data, colWidths=[335])
    t_sub.setStyle(TableStyle([
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    left_flowables.append(t_sub)
    left_flowables.append(Spacer(1, 8))

    # Experience
    left_flowables.append(Paragraph("💼 <b>EXPERIENCE</b>", style_section_heading))
    left_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))
    
    exp_table_data = [
        [Paragraph("<b>Independent Full Stack Developer</b>", style_body), Paragraph("<font color='#475569'><b>2024 – Present</b></font>", ParagraphStyle('R', parent=style_body, alignment=TA_RIGHT))]
    ]
    t_exp = Table(exp_table_data, colWidths=[240, 95])
    t_exp.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    left_flowables.append(t_exp)

    left_flowables.append(Paragraph("• Developed 15+ responsive websites using React.js, Node.js, Express.js and MongoDB.", style_bullet))
    left_flowables.append(Paragraph("• Designed modern UI/UX with a focus on performance and accessibility.", style_bullet))
    left_flowables.append(Paragraph("• Integrated REST APIs, authentication, and payment gateways.", style_bullet))
    left_flowables.append(Paragraph("• Achieved <b>95+ Lighthouse Performance score</b> on most projects.", style_bullet))
    left_flowables.append(Paragraph("• Deployed applications on Vercel and Render with CI/CD best practices.", style_bullet))
    left_flowables.append(Spacer(1, 8))

    # Projects
    left_flowables.append(Paragraph("&lt;/&gt; <b>PROJECTS</b>", style_section_heading))
    left_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))

    # Project 1
    left_flowables.append(Paragraph("<b>Portfolio Website</b> &nbsp;<font color='#475569' size=7>(React.js • Node.js • Express • MongoDB)</font>", style_body))
    left_flowables.append(Paragraph("• Developed a fully responsive portfolio website with dark/light mode.", style_bullet))
    left_flowables.append(Paragraph("• Integrated contact form API, SEO optimization and telemetry analytics.", style_bullet))
    left_flowables.append(Paragraph("• Achieved <b>98+ Lighthouse Performance and 100 SEO score</b>.", style_bullet))
    left_flowables.append(Paragraph("• Deployed on Vercel with custom domain (anuragsahu.com).", style_bullet))
    left_flowables.append(Paragraph("<i>Tech: React.js, Node.js, Express.js, MongoDB, Vercel</i>", style_subbullet))
    left_flowables.append(Spacer(1, 4))

    # Project 2
    left_flowables.append(Paragraph("<b>Meoww Racing Game</b> &nbsp;<font color='#475569' size=7>(HTML5 Canvas • JS • Web Audio)</font>", style_body))
    left_flowables.append(Paragraph("• Action-packed arcade cat racing game with Canvas physics engine.", style_bullet))
    left_flowables.append(Paragraph("• Dynamic race tracks, nitro boosters, obstacle dodging &amp; sound FX.", style_bullet))
    left_flowables.append(Paragraph("<i>Tech: HTML5 Canvas, JavaScript, Web Audio API, Game Physics</i>", style_subbullet))
    left_flowables.append(Spacer(1, 3))

    # Project 3
    left_flowables.append(Paragraph("<b>Restaurant Management System</b> &nbsp;<font color='#475569' size=7>(Node • Express • WebSockets • MongoDB)</font>", style_body))
    left_flowables.append(Paragraph("• Multi-tenant POS, kitchen order display (KDS), billing &amp; inventory control.", style_bullet))
    left_flowables.append(Paragraph("• Secure JWT auth and multi-role user access control system.", style_bullet))
    left_flowables.append(Paragraph("<i>Tech: Node.js, Express.js, MongoDB, WebSockets, Redis</i>", style_subbullet))
    left_flowables.append(Spacer(1, 3))

    # Project 4
    left_flowables.append(Paragraph("<b>Smart College ERP</b> &nbsp;<font color='#475569' size=7>(React.js • Node.js • Express • MongoDB)</font>", style_body))
    left_flowables.append(Paragraph("• Academic ERP managing student attendance, result portal &amp; fee gateway.", style_bullet))
    left_flowables.append(Paragraph("• Role-based access control for students, faculty &amp; admin.", style_bullet))
    left_flowables.append(Paragraph("<i>Tech: React.js, Node.js, Express.js, MongoDB</i>", style_subbullet))
    left_flowables.append(Spacer(1, 6))

    # Relevant Coursework Chips
    left_flowables.append(Paragraph("📖 <b>RELEVANT COURSEWORK</b>", style_section_heading))
    left_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))
    cw_pills = ["Data Structures & Algorithms", "Object-Oriented Programming", "Database Management Systems", "Operating Systems", "Computer Networks", "Software Engineering"]
    left_flowables.append(make_pill_table(cw_pills, max_cols=3))

    # RIGHT COLUMN CONTENT
    right_flowables = []

    # Technical Skills
    right_flowables.append(Paragraph("⚙ <b>TECHNICAL SKILLS</b>", style_section_heading))
    right_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))

    right_flowables.append(Paragraph("<b>Programming Languages</b>", style_body))
    right_flowables.append(make_pill_table(["C", "C++", "Python", "JavaScript", "Dart"], max_cols=5))
    right_flowables.append(Spacer(1, 4))

    right_flowables.append(Paragraph("<b>Frameworks &amp; Technologies</b>", style_body))
    fw_pills = ["Flutter", "React.js", "Node.js", "Express.js", "MongoDB", "Firebase", "HTML5", "CSS3", "Tailwind CSS", "REST APIs", "JSON"]
    right_flowables.append(make_pill_table(fw_pills, max_cols=4))
    right_flowables.append(Spacer(1, 4))

    right_flowables.append(Paragraph("<b>Developer Tools</b>", style_body))
    dt_pills = ["Git", "GitHub", "Postman", "VS Code", "Android Studio", "Vercel", "Render"]
    right_flowables.append(make_pill_table(dt_pills, max_cols=3))
    right_flowables.append(Spacer(1, 8))

    # Certifications
    right_flowables.append(Paragraph("🏅 <b>CERTIFICATIONS</b>", style_section_heading))
    right_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))
    right_flowables.append(Paragraph("• <b>NPTEL Soft Skills</b> Certification", style_bullet))
    right_flowables.append(Paragraph("• <b>Python Programming</b> Certification", style_bullet))
    right_flowables.append(Spacer(1, 8))

    # Achievements
    right_flowables.append(Paragraph("🏆 <b>ACHIEVEMENTS</b>", style_section_heading))
    right_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))
    right_flowables.append(Paragraph("• Built multiple Full Stack Web Projects from scratch.", style_bullet))
    right_flowables.append(Paragraph("• Developed AI Assistant with advanced voice and memory features.", style_bullet))
    right_flowables.append(Paragraph("• Active GitHub Developer and contributor to open-source projects.", style_bullet))
    right_flowables.append(Paragraph("• Strong interest in AI Engineering, Flutter &amp; Mobile Dev.", style_bullet))
    right_flowables.append(Spacer(1, 8))

    # Coursework List
    right_flowables.append(Paragraph("📚 <b>COURSEWORK</b>", style_section_heading))
    right_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))
    cw_items = [
        "• Artificial Intelligence",
        "• Machine Learning",
        "• Data Structures",
        "• Database Management Systems",
        "• Operating Systems",
        "• Computer Networks",
        "• Object-Oriented Programming",
        "• Software Engineering",
        "• Discrete Mathematics"
    ]
    for item in cw_items:
        right_flowables.append(Paragraph(item, style_bullet))
    right_flowables.append(Spacer(1, 8))

    # Languages
    right_flowables.append(Paragraph("🌐 <b>LANGUAGES</b>", style_section_heading))
    right_flowables.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER_PILL, spaceAfter=4, spaceBefore=1))
    right_flowables.append(Paragraph("• <b>Hindi</b> (Native)", style_bullet))
    right_flowables.append(Paragraph("• <b>English</b> (Professional)", style_bullet))
    right_flowables.append(Spacer(1, 8))

    # Combine Left & Right Columns into Master Table
    main_table_data = [[left_flowables, right_flowables]]
    main_table = Table(main_table_data, colWidths=[338, 207])
    main_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (0,0), 0),
        ('RIGHTPADDING', (0,0), (0,0), 10),
        ('LEFTPADDING', (1,0), (1,0), 10),
        ('RIGHTPADDING', (1,0), (1,0), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(main_table)

    # 3. BOTTOM FOOTER RIBBON
    story.append(Spacer(1, 8))
    footer_text = Paragraph("<font color='white'><b>★ &nbsp;Passionate about building innovative solutions, learning new technologies and solving real-world problems.</b></font>", ParagraphStyle('FooterText', parent=style_pill, textColor=colors.white, alignment=TA_CENTER))
    footer_table = Table([[footer_text]], colWidths=[555])
    footer_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_BLUE),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(footer_table)

    doc.build(story)
    print(f"✓ Crisp High-Quality A4 ATS Resume PDF created successfully: {filename}")

if __name__ == '__main__':
    create_a4_pdf('/Users/anuragsahu/Desktop/Portfolio/assets/anurag-sahu-resume.pdf')
    create_a4_pdf('/Users/anuragsahu/Desktop/Portfolio/assets/resume.pdf')
    create_a4_pdf('/Users/anuragsahu/Desktop/Portfolio/public/assets/anurag-sahu-resume.pdf')
    create_a4_pdf('/Users/anuragsahu/Desktop/Portfolio/public/assets/resume.pdf')
