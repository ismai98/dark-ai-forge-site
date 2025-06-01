
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Edit2 } from 'lucide-react';

interface InlineEditorProps {
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'textarea';
  placeholder?: string;
  className?: string;
}

const InlineEditor = ({ value, onSave, type = 'text', placeholder, className = '' }: InlineEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text') {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, type]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-start gap-2 ${className}`}>
        <div className="flex-1">
          {type === 'textarea' ? (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-[80px] bg-gray-800 border-gray-700 text-white focus:border-blue-500"
            />
          ) : (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
            />
          )}
        </div>
        <div className="flex gap-1">
          <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0">
            <Check size={14} />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-700 h-8 w-8 p-0">
            <X size={14} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors ${className}`} onClick={() => setIsEditing(true)}>
      <span className="flex-1 text-white">{value || placeholder}</span>
      <Edit2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default InlineEditor;
