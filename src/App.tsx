import { useState } from 'react';
import { Moon, Sun, Video, AlertCircle } from 'lucide-react';
import { ScriptGeneratorForm } from './components/ScriptGenerator/ScriptGeneratorForm';
import { ScriptEditor } from './components/ScriptEditor/ScriptEditor';
import { TimelineView } from './components/Timeline/TimelineView';
import { ExportMenu } from './components/Export/ExportMenu';
import { TeleprompterView } from './components/Teleprompter/TeleprompterView';
import { Sidebar } from './components/Sidebar/Sidebar';
import { useScriptStore } from './store/useScriptStore';
import { useAutoSave } from './hooks/useAutoSave';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const { currentScript, error, setError, startTeleprompter } = useScriptStore();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [showGenerator, setShowGenerator] = useState(!currentScript);

  // Auto-save every 30 seconds
  useAutoSave(30000);

  const handleStartTeleprompter = () => {
    if (currentScript) {
      startTeleprompter();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="w-8 h-8 text-youtube-red" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                YouTube Script Writer
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI 기반 유튜브 스크립트 작성 도우미
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentScript && (
              <button
                onClick={handleStartTeleprompter}
                className="flex items-center gap-2 px-4 py-2 bg-youtube-red hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Video className="w-5 h-5" />
                텔레프롬프터
              </button>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-[calc(100vh-89px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto p-6">
            {!currentScript && showGenerator ? (
              <ScriptGeneratorForm />
            ) : currentScript ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Script Editor - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      스크립트 편집
                    </h2>
                    <button
                      onClick={() => setShowGenerator(true)}
                      className="text-sm text-youtube-red hover:text-red-700 font-medium"
                    >
                      새 스크립트 생성
                    </button>
                  </div>
                  <ScriptEditor />
                </div>

                {/* Right Panel - Timeline & Export */}
                <div className="space-y-6">
                  <TimelineView />
                  <ExportMenu />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96">
                <Video className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  스크립트를 시작해보세요
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                  왼쪽 사이드바에서 저장된 스크립트를 불러오거나<br />
                  새로운 스크립트를 생성해주세요
                </p>
                <button
                  onClick={() => setShowGenerator(true)}
                  className="px-6 py-3 bg-youtube-red hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  새 스크립트 생성
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Teleprompter Overlay */}
      <TeleprompterView />
    </div>
  );
}

export default App;
