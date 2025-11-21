import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { useScriptStore } from '../../store/useScriptStore';

export function ScriptEditor() {
  const { currentScript, reorderSections, addSection } = useScriptStore();

  if (!currentScript) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          스크립트를 생성하거나 불러와주세요
        </p>
      </div>
    );
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentScript) return;

    const items = Array.from(currentScript.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderSections(items);
  };

  const handleAddSection = () => {
    addSection({
      title: '새 섹션',
      content: '',
      speakingNotes: [],
      visualCues: [],
      estimatedDuration: 0,
      timestamp: '00:00',
    });
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {currentScript.title}
        </h1>
        {currentScript.hook && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              🎣 훅 (처음 10초)
            </p>
            <p className="text-gray-700 dark:text-gray-300">{currentScript.hook}</p>
          </div>
        )}
      </div>

      {/* Sections with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {currentScript.sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={snapshot.isDragging ? 'opacity-50' : ''}
                    >
                      <SectionCard
                        section={section}
                        index={index}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Section Button */}
      <button
        onClick={handleAddSection}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-youtube-red hover:text-youtube-red transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>새 섹션 추가</span>
      </button>

      {/* Outro */}
      {currentScript.outro && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🎬 아웃트로
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{currentScript.outro}</p>
        </div>
      )}
    </div>
  );
}
