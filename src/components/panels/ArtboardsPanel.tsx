import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Artboard {
  id: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  backgroundColor: string;
  visible: boolean;
  locked: boolean;
}

export const ArtboardsPanel: React.FC = () => {
  const [artboards, setArtboards] = useState<Artboard[]>([
    {
      id: 'ab1',
      name: 'Desktop 1',
      width: 1920,
      height: 1080,
      x: 0,
      y: 0,
      backgroundColor: '#ffffff',
      visible: true,
      locked: false,
    },
    {
      id: 'ab2',
      name: 'Mobile',
      width: 375,
      height: 812,
      x: 2000,
      y: 0,
      backgroundColor: '#ffffff',
      visible: true,
      locked: false,
    },
  ]);

  const [selectedId, setSelectedId] = useState<string>('ab1');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const addArtboard = () => {
    const newArtboard: Artboard = {
      id: `ab${Date.now()}`,
      name: `Artboard ${artboards.length + 1}`,
      width: 1920,
      height: 1080,
      x: artboards.length * 2000,
      y: 0,
      backgroundColor: '#ffffff',
      visible: true,
      locked: false,
    };
    setArtboards([...artboards, newArtboard]);
    setSelectedId(newArtboard.id);
  };

  const deleteArtboard = (id: string) => {
    if (artboards.length > 1) {
      const filtered = artboards.filter(ab => ab.id !== id);
      setArtboards(filtered);
      if (selectedId === id) setSelectedId(filtered[0].id);
    }
  };

  const duplicateArtboard = (id: string) => {
    const original = artboards.find(ab => ab.id === id);
    if (!original) return;

    const duplicate: Artboard = {
      ...original,
      id: `ab${Date.now()}`,
      name: `${original.name} copy`,
      x: original.x + original.width + 100,
    };
    setArtboards([...artboards, duplicate]);
  };

  const toggleVisibility = (id: string) => {
    setArtboards(artboards.map(ab =>
      ab.id === id ? { ...ab, visible: !ab.visible } : ab
    ));
  };

  const toggleLock = (id: string) => {
    setArtboards(artboards.map(ab =>
      ab.id === id ? { ...ab, locked: !ab.locked } : ab
    ));
  };

  const startEdit = (ab: Artboard) => {
    setEditingId(ab.id);
    setEditingName(ab.name);
  };

  const commitEdit = (id: string) => {
    setArtboards(artboards.map(ab =>
      ab.id === id ? { ...ab, name: editingName } : ab
    ));
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900 text-white h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Artboards</h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={addArtboard}
          className="h-6 w-6 p-0"
        >
          +
        </Button>
      </div>

      {/* Artboards List */}
      <div className="overflow-y-auto flex-1 space-y-1">
        {artboards.map((ab) => (
          <div
            key={ab.id}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
              selectedId === ab.id
                ? 'bg-indigo-600 border border-indigo-500'
                : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => setSelectedId(ab.id)}
          >
            {/* Thumbnail */}
            <div
              className="w-8 h-8 border border-gray-600 rounded flex-shrink-0"
              style={{ backgroundColor: ab.backgroundColor }}
              title={`${ab.width}×${ab.height}`}
            />

            {/* Name */}
            <div className="flex-1 min-w-0">
              {editingId === ab.id ? (
                <Input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => commitEdit(ab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEdit(ab.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="h-6 text-xs px-1"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div
                  className="text-xs font-medium truncate hover:underline"
                  onDoubleClick={() => startEdit(ab)}
                >
                  {ab.name}
                </div>
              )}
              <div className="text-xs text-gray-400">{ab.width}×{ab.height}px</div>
            </div>

            {/* Controls */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVisibility(ab.id);
              }}
              className={`p-1 rounded ${ab.visible ? 'text-gray-300' : 'text-gray-600'}`}
              title={ab.visible ? 'Hide' : 'Show'}
            >
              👁️
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(ab.id);
              }}
              className={`p-1 rounded ${ab.locked ? 'text-indigo-400' : 'text-gray-600'}`}
              title={ab.locked ? 'Locked' : 'Click to lock'}
            >
              🔒
            </button>

            {/* Action Dropdown */}
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateArtboard(ab.id);
                }}
                className="p-1 rounded hover:bg-gray-700 text-gray-400"
                title="Duplicate"
              >
                ⎇
              </button>

              {artboards.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteArtboard(ab.id);
                  }}
                  className="p-1 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-400"
                  title="Delete"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Artboard Properties */}
      {selectedId && (
        <div className="mt-auto pt-3 border-t border-gray-700 space-y-2">
          <div className="text-xs font-medium text-gray-300">Properties</div>
          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">Width</label>
              <Input
                type="number"
                value={artboards.find(ab => ab.id === selectedId)?.width}
                className="h-6 text-xs"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Height</label>
              <Input
                type="number"
                value={artboards.find(ab => ab.id === selectedId)?.height}
                className="h-6 text-xs"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Background</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={artboards.find(ab => ab.id === selectedId)?.backgroundColor}
                  className="w-8 h-6"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtboardsPanel;
