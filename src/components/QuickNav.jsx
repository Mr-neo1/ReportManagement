import { Menu, Moon, Sun, Settings } from 'lucide-react';

export default function QuickNav({ darkMode, setDarkMode, showNav, setShowNav, scrollToSection, onSettingsClick }) {
  const navItems = [
    { id: 'script', label: 'Script & Log' },
    { id: 'metrics', label: 'Email Metrics' },
    { id: 'testmail', label: 'Test Mail' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowNav((prev) => !prev)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
            title="Google Drive Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className={`${darkMode ? 'bg-yellow-500' : 'bg-gray-800'} text-white p-3 rounded-full shadow-lg`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      {showNav && (
        <div
          className={`fixed top-20 right-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-2xl p-4 z-40 w-64`}
        >
          <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quick Navigation</h3>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'
              } transition`}
            >
              {item.label}
            </button>
          ))}
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Shortcuts:</p>
            <p className="text-xs">
              <kbd className="bg-gray-200 px-2 py-1 rounded">Ctrl+S</kbd> Save
            </p>
            <p className="text-xs mt-1">
              <kbd className="bg-gray-200 px-2 py-1 rounded">Ctrl+D</kbd> Dark Mode
            </p>
          </div>
        </div>
      )}
    </>
  );
}




