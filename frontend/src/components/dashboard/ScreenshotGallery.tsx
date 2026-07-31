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
    return <div className="text-center text-[rgb(var(--color-text-muted))] py-12">No screenshots yet.</div>;
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
            className="aspect-video bg-[rgb(var(--color-surface))] rounded-lg overflow-hidden border hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-full h-full flex items-center justify-center text-[rgb(var(--color-text-muted))] text-xs">
              <div className="text-center">
                <div className="text-2xl mb-1">▣</div>
                <div className="truncate px-2">{s.domain}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closePreview}>
          <div className="max-w-5xl max-h-[90vh] bg-[rgb(var(--color-surface))] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="text-sm text-[rgb(var(--color-text))]">Screenshot</span>
              <button onClick={closePreview} className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] text-lg leading-none">&times;</button>
            </div>
            <div className="p-2">
              {loading ? (
                <div className="w-[800px] h-[500px] skeleton rounded" />
              ) : imageSrc ? (
                <img src={imageSrc} alt="Screenshot" className="max-w-full max-h-[80vh] object-contain rounded" />
              ) : (
                <div className="text-[rgb(var(--color-text-muted))] p-12">Failed to load screenshot.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}