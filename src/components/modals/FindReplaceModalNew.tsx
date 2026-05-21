import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface FindReplaceResult {
  layerId: string;
  layerName: string;
  position: { x: number; y: number };
  type: 'text' | 'layer-name';
}

export default function FindReplaceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [results, setResults] = useState<FindReplaceResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  const handleFind = () => {
    if (!findText) return;
    console.log('Searching for:', findText);
    // Traverse layer tree and search for text content and layer names
    // This will integrate with the actual layer structure
    setResults([]);
  };

  const handleReplace = () => {
    if (!findText || !replaceText) return;
    console.log(`Replacing "${findText}" with "${replaceText}"`);
    // Replace current result
    setCurrentResultIndex(Math.min(currentResultIndex + 1, results.length - 1));
  };

  const handleReplaceAll = () => {
    if (!findText || !replaceText) return;
    console.log(`Replacing all "${findText}" with "${replaceText}"`);
    setResults([]);
    setCurrentResultIndex(0);
  };

  const handleFindNext = () => {
    if (currentResultIndex < results.length - 1) {
      setCurrentResultIndex(currentResultIndex + 1);
    }
  };

  const handleFindPrevious = () => {
    if (currentResultIndex > 0) {
      setCurrentResultIndex(currentResultIndex - 1);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Find & Replace">
      <div className="space-y-4 w-96">
        <div>
          <label className="text-sm font-medium text-text-primary block mb-1">
            Find
          </label>
          <Input
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Text to find..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFind();
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary block mb-1">
            Replace
          </label>
          <Input
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replacement text..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleReplace();
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-text-secondary">Match case</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-text-secondary">Whole word only</span>
          </label>
        </div>

        {results.length > 0 && (
          <div className="bg-bg-surface p-2 rounded text-xs text-text-secondary">
            {results.length} results found
            {results.length > 0 && ` (${currentResultIndex + 1}/${results.length})`}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleFind} className="flex-1">
            Find All
          </Button>
          <Button variant="secondary" size="sm" onClick={handleFindNext} className="flex-1">
            Find Next
          </Button>
          <Button variant="secondary" size="sm" onClick={handleFindPrevious} className="flex-1">
            Find Prev
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={handleReplace} className="flex-1">
            Replace
          </Button>
          <Button variant="primary" size="sm" onClick={handleReplaceAll} className="flex-1">
            Replace All
          </Button>
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
