import { Upload, XCircle } from 'lucide-react';

export default function ScreenshotBox({
  section,
  title,
  desc,
  Icon,
  screenshots,
  activeSection,
  setActiveSection,
  darkMode,
  uploadProgress,
  handleScreenshotUpload,
  handleDrop,
  handleDragOver,
  reorderScreenshot,
  removeScreenshot,
  setPreviewImage,
}) {
  return (
    <div
      className={`${
        darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-indigo-300'
      } border-2 border-dashed rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer relative`}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, section)}
      onClick={() => setActiveSection(section)}
      tabIndex={0}
    >
      {activeSection === section && (
        <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse z-10">
          Active
        </div>
      )}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
          </div>
        </div>
        <label className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 font-bold cursor-pointer shadow-md">
          <Upload className="w-4 h-4" />
          Browse
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleScreenshotUpload(e, section)}
            className="hidden"
          />
        </label>
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-600">Uploading {Math.round(uploadProgress)}%</p>
        </div>
      )}
      {screenshots.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {screenshots.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              className="relative group cursor-move"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('index', i.toString())}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('index'), 10);
                reorderScreenshot(section, fromIndex, i);
              }}
            >
              <img
                src={s.data}
                alt={s.name}
                className="w-full h-28 object-cover rounded-xl border-2 border-gray-200 shadow-sm cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewImage(s);
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeScreenshot(i, section);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110 z-10"
              >
                <XCircle className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-xl">
                <p className="text-xs text-white font-bold">{s.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




