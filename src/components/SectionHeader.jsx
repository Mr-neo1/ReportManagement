export default function SectionHeader({
  id,
  title,
  Icon,
  iconColor,
  darkMode,
  collapsedSections,
  toggleSection,
}) {
  const isCollapsed = collapsedSections[id];

  return (
    <div
      className={`flex items-center justify-between mb-6 pb-4 border-b-2 ${
        darkMode ? 'border-gray-700' : 'border-gray-100'
      } cursor-pointer`}
      onClick={() => toggleSection(id)}
    >
      <div className="flex items-center gap-3">
        <div className={`bg-gradient-to-br ${iconColor} p-3 rounded-xl`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
      </div>
      {isCollapsed ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      )}
    </div>
  );
}




