import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { ScriptGenerationParams, ContentType, ToneType, AudienceLevel } from '../../types/script.types';
import { generateScript } from '../../services/claudeAPI';
import { useScriptStore } from '../../store/useScriptStore';
import { contentTypeLabels, toneLabels, audienceLabels } from '../../templates';

export function ScriptGeneratorForm() {
  const { setCurrentScript, setIsGenerating, setError, isGenerating } = useScriptStore();

  const [formData, setFormData] = useState<ScriptGenerationParams>({
    topic: '',
    contentType: 'tutorial',
    duration: 10,
    targetAudience: 'general',
    tone: 'friendly',
    keyPoints: [],
    customCTA: '',
  });

  const [keyPointInput, setKeyPointInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.topic.trim()) {
      setError('주제를 입력해주세요');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const script = await generateScript(formData);
      setCurrentScript(script);
    } catch (error) {
      console.error('Script generation failed:', error);
      setError(error instanceof Error ? error.message : '스크립트 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
    }
  };

  const addKeyPoint = () => {
    if (keyPointInput.trim()) {
      setFormData(prev => ({
        ...prev,
        keyPoints: [...(prev.keyPoints || []), keyPointInput.trim()],
      }));
      setKeyPointInput('');
    }
  };

  const removeKeyPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyPoints: prev.keyPoints?.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-youtube-red" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            스크립트 생성하기
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              주제/키워드 *
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="예: 초보자를 위한 요가, 아이폰 15 리뷰"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-youtube-red focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isGenerating}
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              콘텐츠 타입 *
            </label>
            <select
              value={formData.contentType}
              onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value as ContentType }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-youtube-red focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isGenerating}
            >
              {Object.entries(contentTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration & Audience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                목표 영상 길이 (분)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-youtube-red focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isGenerating}
              >
                <option value={5}>5분</option>
                <option value={10}>10분</option>
                <option value={15}>15분</option>
                <option value={20}>20분</option>
                <option value={30}>30분</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                타겟 시청자
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value as AudienceLevel }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-youtube-red focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isGenerating}
              >
                {Object.entries(audienceLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              톤앤매너
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(toneLabels).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tone: value as ToneType }))}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.tone === value
                      ? 'border-youtube-red bg-youtube-red text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-youtube-red'
                  }`}
                  disabled={isGenerating}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              핵심 포인트 (선택사항)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keyPointInput}
                onChange={(e) => setKeyPointInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyPoint())}
                placeholder="포함할 핵심 내용"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-youtube-red focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isGenerating}
              />
              <button
                type="button"
                onClick={addKeyPoint}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                disabled={isGenerating}
              >
                추가
              </button>
            </div>
            {formData.keyPoints && formData.keyPoints.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keyPoints.map((point, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {point}
                    <button
                      type="button"
                      onClick={() => removeKeyPoint(index)}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                      disabled={isGenerating}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Custom CTA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              맞춤 CTA (선택사항)
            </label>
            <input
              type="text"
              value={formData.customCTA}
              onChange={(e) => setFormData(prev => ({ ...prev, customCTA: e.target.value }))}
              placeholder="예: 무료 강의 신청하기"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-youtube-red focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isGenerating}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-youtube-red text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                스크립트 생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                스크립트 생성하기
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
