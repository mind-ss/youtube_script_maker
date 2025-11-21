import { Clock, CheckCircle } from 'lucide-react';
import { useScriptStore } from '../../store/useScriptStore';
import { formatDuration } from '../../utils/textAnalyzer';

export function TimelineView() {
  const { currentScript } = useScriptStore();

  if (!currentScript) return null;

  const totalDuration = currentScript.estimatedDuration;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-youtube-red" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          타임라인
        </h3>
      </div>

      {/* Total Duration */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          총 예상 시간
        </div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatDuration(totalDuration)}
        </div>
        {currentScript.metadata?.targetDuration && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            목표: {currentScript.metadata.targetDuration}분
            {totalDuration > currentScript.metadata.targetDuration * 60 && (
              <span className="ml-2 text-red-500">
                ⚠️ 목표 시간 초과
              </span>
            )}
          </div>
        )}
      </div>

      {/* Timeline Items */}
      <div className="space-y-3">
        {currentScript.sections.map((section, index) => {
          const percentage = (section.estimatedDuration / totalDuration) * 100;

          return (
            <div key={section.id} className="relative">
              <div className="flex items-start gap-3">
                {/* Timeline Marker */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    section.completed
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                  {index < currentScript.sections.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {section.title}
                    </span>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {section.timestamp}
                    </span>
                  </div>

                  {/* Duration Bar */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-youtube-red rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDuration(section.estimatedDuration)} ({percentage.toFixed(1)}%)
                  </div>

                  {section.completed && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>촬영 완료</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
