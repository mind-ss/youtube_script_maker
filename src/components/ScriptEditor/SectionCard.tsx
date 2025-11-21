import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Clock, ChevronDown, ChevronUp, Trash2, GripVertical } from 'lucide-react';
import type { ScriptSection } from '../../types/script.types';
import { useScriptStore } from '../../store/useScriptStore';
import { formatDuration, calculateSpeechDuration } from '../../utils/textAnalyzer';

interface SectionCardProps {
  section: ScriptSection;
  index: number;
  dragHandleProps?: any;
}

export function SectionCard({ section, index, dragHandleProps }: SectionCardProps) {
  const { updateSection, deleteSection } = useScriptStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '스크립트 내용을 입력하세요...',
      }),
    ],
    content: section.content,
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      const duration = calculateSpeechDuration(content);
      updateSection(section.id, {
        content,
        estimatedDuration: duration,
      });
    },
  });

  const handleTitleChange = (newTitle: string) => {
    updateSection(section.id, { title: newTitle });
    setIsEditingTitle(false);
  };

  const handleDelete = () => {
    if (confirm('이 섹션을 삭제하시겠습니까?')) {
      deleteSection(section.id);
    }
  };

  const toggleNote = (noteIndex: number, type: 'speakingNotes' | 'visualCues') => {
    const notes = [...section[type]];
    notes.splice(noteIndex, 1);
    updateSection(section.id, { [type]: notes });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        <div className="flex-1">
          {isEditingTitle ? (
            <input
              type="text"
              defaultValue={section.title}
              onBlur={(e) => handleTitleChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTitleChange(e.currentTarget.value)}
              autoFocus
              className="w-full px-2 py-1 text-lg font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
            />
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-youtube-red"
            >
              {index + 1}. {section.title}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{section.timestamp}</span>
          <span>({formatDuration(section.estimatedDuration)})</span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={handleDelete}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Editor */}
          <div className="prose max-w-none dark:prose-invert">
            <EditorContent
              editor={editor}
              className="border border-gray-300 dark:border-gray-600 rounded-lg min-h-[150px] custom-scrollbar"
            />
          </div>

          {/* Speaking Notes */}
          {section.speakingNotes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                촬영 노트:
              </h4>
              <ul className="space-y-1">
                {section.speakingNotes.map((note, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="flex-1">• {note}</span>
                    <button
                      onClick={() => toggleNote(idx, 'speakingNotes')}
                      className="text-gray-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Visual Cues */}
          {section.visualCues.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                영상 연출:
              </h4>
              <ul className="space-y-1">
                {section.visualCues.map((cue, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="flex-1">🎬 {cue}</span>
                    <button
                      onClick={() => toggleNote(idx, 'visualCues')}
                      className="text-gray-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Character Count */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>글자 수: {section.content.replace(/\s/g, '').length}</span>
            <span>예상 시간: {formatDuration(section.estimatedDuration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
