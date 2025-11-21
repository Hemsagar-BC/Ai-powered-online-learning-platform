import React, { useState } from 'react';
import PropTypes from 'prop-types';

const QuickActions = ({ 
  onAction,
  actions = [
    { id: 'search', label: 'Search', icon: 'search' },
    { id: 'pin', label: 'Pin', icon: 'pin' },
    { id: 'call', label: 'Call', icon: 'call' },
    { id: 'info', label: 'Info', icon: 'info' }
  ],
  menuPosition = 'top',
  isOpen = false,
  onToggle
}) => {
  const [openMenu, setOpenMenu] = useState(isOpen);

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
    if (onToggle) onToggle(!openMenu);
  };

  const iconMap = {
    search: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    pin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
      </svg>
    ),
    call: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 10.5V7c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    )
  };

  const menuPositionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div className="relative">
      {/* Menu button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        title="Quick actions"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {/* Actions menu */}
      {openMenu && (
        <div className={`absolute ${menuPositionClasses[menuPosition]} bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-max`}>
          <div className="py-1">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  onAction(action.id);
                  setOpenMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <span className="text-purple-500 dark:text-purple-400">
                  {iconMap[action.icon] || action.icon}
                </span>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close menu */}
      {openMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenMenu(false)}
        />
      )}
    </div>
  );
};

QuickActions.propTypes = {
  onAction: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string
  })),
  menuPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func
};

export default QuickActions;
