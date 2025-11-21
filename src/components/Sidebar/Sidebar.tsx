import { useState } from 'react';
import { Save, FolderOpen, Trash2, Clock, BarChart3 } from 'lucide-react';
import { useScriptStore } from '../../store/useScriptStore';
import { StorageService } from '../../services/storageService';
import { formatDate } from '../../utils/formatters';
import { formatDuration } from '../../utils/textAnalyzer';

export function Sidebar() {
  const { currentScript, saveScript, loadScript, clearScript } = useScriptStore();
  const [savedScripts, setSavedScripts] = useState(StorageService.getSavedScripts());
  const [activeTab, setActiveTab] = useState<'saved' | 'stats'>('saved');

  const handleSave = () => {
    saveScript();
    setSavedScripts(StorageService.getSavedScripts());
  };

  const handleLoad = (scriptId: string) => {
    loadScript(scriptId);
  };

  const handleDelete = (scriptId: string) => {
    if (confirm('이 스크립트를 삭제하시겠습니까?')) {
      StorageService.deleteScript(scriptId);
      setSavedScripts(StorageService.getSavedScripts());
    }
  };

  const handleNew = () => {
    if (!currentScript || confirm('현재 작업 중인 스크립트를 닫으시겠습니까?')) {
      clearScript();
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          스크립트 관리
        </h2>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleNew}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
          >
            새로 만들기
          </button>
          {currentScript && (
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-youtube-red hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              저장
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'saved'
              ? 'text-youtube-red border-b-2 border-youtube-red'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          저장된 스크립트
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'stats'
              ? 'text-youtube-red border-b-2 border-youtube-red'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          통계
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'saved' ? (
          <div className="p-4 space-y-2">
            {savedScripts.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                저장된 스크립트가 없습니다
              </div>
            ) : (
              savedScripts.map(script => (
                <div
                  key={script.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    currentScript?.id === script.id
                      ? 'border-youtube-red bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                  onClick={() => handleLoad(script.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                      {script.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(script.id);
                      }}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(script.estimatedDuration)}</span>
                    <span>•</span>
                    <span>{formatDate(script.updatedAt)}</span>
                  </div>

                  {script.metadata && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                        {script.contentType}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                        {script.sections.length}개 섹션
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-4">
            {currentScript ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    총 예상 시간
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatDuration(currentScript.estimatedDuration)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">총 글자 수</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {currentScript.sections.reduce(
                        (sum, s) => sum + s.content.replace(/\s/g, '').length,
                        0
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">섹션 수</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {currentScript.sections.length}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">평균 섹션 길이</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDuration(
                        Math.floor(
                          currentScript.estimatedDuration / currentScript.sections.length
                        )
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">콘텐츠 타입</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {currentScript.contentType}
                    </span>
                  </div>

                  {currentScript.metadata && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">타겟 시청자</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {currentScript.metadata.targetAudience}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">톤앤매너</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {currentScript.metadata.tone}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                스크립트를 선택하거나 생성해주세요
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
