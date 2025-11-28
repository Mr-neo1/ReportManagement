import { XCircle } from 'lucide-react';

export default function PreviewModal({ previewImage, setPreviewImage }) {
  if (!previewImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={() => setPreviewImage(null)}
    >
      <div className="relative max-w-6xl max-h-full">
        <button
          onClick={() => setPreviewImage(null)}
          className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
        >
          <XCircle className="w-6 h-6" />
        </button>
        <img
          src={previewImage.data}
          alt="Preview"
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
}




