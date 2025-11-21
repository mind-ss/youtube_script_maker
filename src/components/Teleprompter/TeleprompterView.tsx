import { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Plus, Minus, SkipBack, SkipForward } from 'lucide-react';
import { useScriptStore } from '../../store/useScriptStore';

export function TeleprompterView() {
  const { currentScript, teleprompter, stopTeleprompter, updateTeleprompterSettings } = useScriptStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setScrollPosition(prev => prev + teleprompter.scrollSpeed / 60);
      }, 16); // ~60fps
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, teleprompter.scrollSpeed]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        adjustScrollSpeed(5);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        adjustScrollSpeed(-5);
      } else if (e.code === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!currentScript || !teleprompter.isActive) return null;

  const adjustFontSize = (delta: number) => {
    updateTeleprompterSettings({
      fontSize: Math.max(16, Math.min(48, teleprompter.fontSize + delta)),
    });
  };

  const adjustScrollSpeed = (delta: number) => {
    updateTeleprompterSettings({
      scrollSpeed: Math.max(10, Math.min(200, teleprompter.scrollSpeed + delta)),
    });
  };

  const handleClose = () => {
    setIsPlaying(false);
    setScrollPosition(0);
    stopTeleprompter();
  };

  const skipSection = (direction: 'prev' | 'next') => {
    const currentIndex = teleprompter.currentSectionIndex;
    const newIndex = direction === 'next'
      ? Math.min(currentIndex + 1, currentScript.sections.length - 1)
      : Math.max(currentIndex - 1, 0);

    updateTeleprompterSettings({ currentSectionIndex: newIndex });

    // Scroll to section
    const sectionElement = document.getElementById(`teleprompter-section-${newIndex}`);
    if (sectionElement && containerRef.current) {
      const offset = sectionElement.offsetTop - containerRef.current.offsetTop;
      setScrollPosition(offset);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Control Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Skip Buttons */}
          <button
            onClick={() => skipSection('prev')}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            disabled={teleprompter.currentSectionIndex === 0}
          >
            <SkipBack className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => skipSection('next')}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            disabled={teleprompter.currentSectionIndex === currentScript.sections.length - 1}
          >
            <SkipForward className="w-5 h-5 text-white" />
          </button>

          {/* Font Size */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustFontSize(-2)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Minus className="w-5 h-5 text-white" />
            </button>
            <span className="text-white text-sm min-w-[60px] text-center">
              {teleprompter.fontSize}px
            </span>
            <button
              onClick={() => adjustFontSize(2)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Scroll Speed */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustScrollSpeed(-10)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Minus className="w-5 h-5 text-white" />
            </button>
            <span className="text-white text-sm min-w-[80px] text-center">
              속도 {teleprompter.scrollSpeed}
            </span>
            <button
              onClick={() => adjustScrollSpeed(10)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Script Content */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto custom-scrollbar pt-24 pb-96"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-4xl mx-auto px-8 text-white teleprompter-text">
          {/* Hook */}
          {currentScript.hook && (
            <div className="mb-16">
              <p
                className="text-center leading-relaxed"
                style={{ fontSize: `${teleprompter.fontSize}px` }}
              >
                {currentScript.hook}
              </p>
            </div>
          )}

          {/* Sections */}
          {currentScript.sections.map((section, index) => (
            <div
              key={section.id}
              id={`teleprompter-section-${index}`}
              className="mb-16"
            >
              <h2
                className="text-center font-bold mb-8 text-yellow-400"
                style={{ fontSize: `${teleprompter.fontSize + 4}px` }}
              >
                {section.title}
              </h2>
              <p
                className="text-center leading-relaxed whitespace-pre-wrap"
                style={{ fontSize: `${teleprompter.fontSize}px` }}
              >
                {section.content}
              </p>
            </div>
          ))}

          {/* Outro */}
          {currentScript.outro && (
            <div className="mb-16">
              <p
                className="text-center leading-relaxed"
                style={{ fontSize: `${teleprompter.fontSize}px` }}
              >
                {currentScript.outro}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
        <div className="font-semibold mb-1">단축키</div>
        <div className="space-y-1 opacity-75">
          <div>Space: 재생/정지</div>
          <div>↑↓: 속도 조절</div>
          <div>Esc: 닫기</div>
        </div>
      </div>
    </div>
  );
}
