import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ListBulletIcon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  CubeIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const { logout } = useAuth();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isMenuOpen = (menuName) => {
    return expandedMenu === menuName;
  };

  const toggleMenu = (menuName) => {
    setExpandedMenu(isMenuOpen(menuName) ? null : menuName);
  };

  const menuItems = [
    {
      icon: HomeIcon,
      label: 'Dashboard',
      path: '/admin/dashboard',
      submenu: false,
    },
  
    // Products Management
    {
      icon: ShoppingBagIcon,
      label: 'Products',
      menuName: 'productsMenu',
      path: '/admin/products',
      submenu: false,
     
    },

    // Product Configuration
    {
      icon: CubeIcon,
      label: 'Product Config',
      menuName: 'productConfig',
      submenu: true,
      items: [
        { label: 'Categories', path: '/admin/categories' },
        { label: 'SubCategories', path: '/admin/subcategories' },
        { label: 'Attributes', path: '/admin/attributes' },
        { label: 'Brands', path: '/admin/brands' },
      ],
    },
    // Order management 
    {
      icon: ShoppingBagIcon,
      label: 'Orders',
      menuName: 'OrderMenu',
      path: '/admin/orders',
      submenu: false,   
    },

  ];

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-linear-to-b from-gray-900 to-gray-800 text-white h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out flex flex-col z-50 shadow-lg`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Admin
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 hover:scale-110"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            if (!item.submenu) {
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActiveRoute(item.path)
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className="w-6 h-6 flex shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            }

            return (
              <li key={index}>
                {/* Main Menu Button */}
                <button
                  onClick={() => toggleMenu(item.menuName)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                    isMenuOpen(item.menuName)
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 flex shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <ChevronRightIcon
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isMenuOpen(item.menuName) ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Submenu Items */}
                {isMenuOpen(item.menuName) && !isCollapsed && (
                  <ul className="mt-2 ml-4 space-y-1 border-l-2 border-gray-700">
                    {item.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subItem.path}
                          className={`block px-4 py-2 rounded transition-all duration-200 text-sm ${
                            isActiveRoute(subItem.path)
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-700 p-2">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all duration-200"
          title={isCollapsed ? 'Logout' : ''}
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 flex shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

