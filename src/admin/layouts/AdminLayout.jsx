import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { MobileNavigation } from '../components/MobileNavigation';
import { ToastContainer } from '../components/Toast';

export const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#05070E] text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Auto-Fluid Navigation & Drawer */}
      <MobileNavigation />

      {/* Global Toast Feedback */}
      <ToastContainer />
    </div>
  );
};
