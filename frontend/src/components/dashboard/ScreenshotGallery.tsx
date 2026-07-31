import { useState } from 'react';
import { fetchScreenshotWithImage } from '@/api/screenshots';
import type { ScreenshotRecord } from '@/api/screenshots';

interface GalleryProps {
  screenshots: ScreenshotRecord[];
}

export default function ScreenshotGallery({ screenshots }: GalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!screenshots.length) {
    return <div className="text-center text-slate-500 py-12">No screenshots yet.</div>;
  }

  async function openPreview(id: string) {
    setSelectedId(id);
    setLoading(true);
    setImageSrc(null);
    try {
      const data = await fetchScreenshotWithImage(id);
      setImageSrc(`data:image/jpeg;base64,${data.imageBase64}`);
    } catch {
      setImageSrc(null);
    } finally {
      setLoading(false);
    }
  }

  function closePreview() {
    setSelectedId(null);
    setImageSrc(null);
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {screenshots.map((s) => (
          <button
            key={s.id}
            onClick={() => openPreview(s.id!)}
            className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-brand-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
              <div className="text-center">
                <div className="text-2xl mb-1">▣</div>
                <div className="truncate px-2">{new URL(s.url).hostname}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedId && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div
            className="max-w-5xl max-h-[90vh] bg-slate-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
              <span className="text-sm text-slate-300">Screenshot</span>
              <button
                onClick={closePreview}
                className="text-slate-500 hover:text-slate-300 text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-2">
              {loading ? (
                <div className="w-[800px] h-[500px] skeleton rounded" />
              ) : imageSrc ? (
                <img src={imageSrc} alt="Screenshot" className="max-w-full max-h-[80vh] object-contain rounded" />
              ) : (
                <div className="text-slate-500 p-12">Failed to load screenshot.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}