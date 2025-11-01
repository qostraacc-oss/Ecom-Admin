import React, { useState } from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-600">Welcome back, {user?.name || 'User'}!</p>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center space-x-6">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors"
                aria-label="Notifications"
              >
                <BellIcon className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="p-4 border-b border-gray-200 font-semibold text-gray-900">
                    Notifications
                  </div>
                  <ul className="max-h-60 overflow-y-auto">
                    {[1, 2, 3].map((item) => (
                      <li
                        key={item}
                        className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                      >
                        Notification {item}
                        <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <UserCircleIcon className="w-8 h-8 text-gray-600" />
                <span className="hidden sm:block text-gray-700 font-medium">{user?.name || 'User'}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-gray-900 font-semibold">{user?.name || 'User'}</p>
                    <p className="text-gray-500 text-sm">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="flex flex-col p-2 space-y-1">
                    <button className="text-left px-4 py-2 rounded hover:bg-gray-100 text-sm text-gray-700 transition-colors">
                      Profile Settings
                    </button>
                    <button className="text-left px-4 py-2 rounded hover:bg-gray-100 text-sm text-gray-700 transition-colors">
                      Change Password
                    </button>
                    <button className="text-left px-4 py-2 rounded hover:bg-gray-100 text-sm text-red-700 transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


