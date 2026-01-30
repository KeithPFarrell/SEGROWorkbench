import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { UL360Uploads } from './pages/UL360Uploads';
import { MeterExceptions } from './pages/MeterExceptions';
import { DataValidation } from './pages/DataValidation';
import { ActivityLog } from './pages/ActivityLog';
import { FilesArchive } from './pages/FilesArchive';
import { useStore } from './store/useStore';

const basePath = import.meta.env.VITE_BASE_PATH || '/';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface User {
  id: string;
  name: string;
  initials: string;
  role: string;
}

const users: User[] = [
  { id: '1', name: 'Sarah Mitchell', initials: 'SM', role: 'ESG Manager' },
  { id: '2', name: 'James Thompson', initials: 'JT', role: 'Data Analyst' },
  { id: '3', name: 'Emma Rodriguez', initials: 'ER', role: 'Compliance Officer' },
];

function AppContent() {
  const location = useLocation();
  const { ul360Tasks, meterExceptionTasks, validationTasks, setCurrentUsername } = useStore();
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update store when user changes
  const handleUserChange = (user: User) => {
    setCurrentUser(user);
    setCurrentUsername(user.name);
    setIsUserDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ul360Badge = ul360Tasks.filter((t) => t.status === 'attention' || t.status === 'pending').length;
  const exceptionsBadge = meterExceptionTasks.filter((t) => t.status === 'attention').length;
  const validationBadge = validationTasks.filter((t) => t.status === 'attention').length;

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: '/ul360-uploads',
      label: 'UL 360 Uploads',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
      badge: ul360Badge,
    },
    {
      path: '/meter-exceptions',
      label: 'Meter Registry Exceptions',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      badge: exceptionsBadge,
    },
    {
      path: '/data-validation',
      label: 'Data Validation Errors',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      badge: validationBadge,
    },
    {
      path: '/activity-log',
      label: 'Activity Log',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      path: '/files-archive',
      label: 'Files Archive',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-segro-offwhite via-white to-segro-offwhite">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-segro-red rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-segro-teal rounded-full blur-3xl"></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="bg-segro-charcoal shadow-lg sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src={`${import.meta.env.BASE_URL}segro-logo.png`}
                alt="SEGRO Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all relative ${
                      isActive
                        ? 'bg-segro-red text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    <span className="hidden lg:inline">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-segro-charcoal text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Info & HCL Logo */}
            <div className="flex items-center gap-4">
              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-segro-red flex items-center justify-center font-bold text-sm">
                    {currentUser.initials}
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-segro-lightgray overflow-hidden z-50">
                    <div className="p-3 bg-segro-offwhite border-b border-segro-lightgray">
                      <p className="text-xs font-semibold text-segro-midgray uppercase">Select User</p>
                    </div>
                    <div className="py-2">
                      {users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserChange(user)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-segro-offwhite transition-colors ${
                            currentUser.id === user.id ? 'bg-segro-teal/10' : ''
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-segro-red flex items-center justify-center font-bold text-white">
                            {user.initials}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-segro-charcoal text-sm">{user.name}</div>
                            <div className="text-xs text-segro-midgray">{user.role}</div>
                          </div>
                          {currentUser.id === user.id && (
                            <svg className="w-5 h-5 text-segro-teal" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Separator */}
              <div className="h-8 w-px bg-white/20"></div>

              {/* HCL Software Logo */}
              <img
                src={`${import.meta.env.BASE_URL}hcl-logo.png`}
                alt="Powered by HCL Software"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-6 py-8 pb-16 relative z-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ul360-uploads" element={<UL360Uploads />} />
          <Route path="/meter-exceptions" element={<MeterExceptions />} />
          <Route path="/data-validation" element={<DataValidation />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/files-archive" element={<FilesArchive />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={basePath}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
