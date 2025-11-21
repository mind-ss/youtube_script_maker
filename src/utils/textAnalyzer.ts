import type { ScriptSection } from '../types/script.types';

/**
 * Calculate speech duration based on text content
 * Korean: ~200-250 characters per minute
 * English: ~150-160 words per minute
 */
export function calculateSpeechDuration(
  text: string,
  language: 'ko' | 'en' = 'ko'
): number {
  const koreanCharsPerMinute = 225; // Average Korean speaking speed
  const englishWordsPerMinute = 155; // Average English speaking speed

  if (language === 'ko') {
    // Remove spaces and count characters
    const charCount = text.replace(/\s/g, '').length;
    return Math.ceil((charCount / koreanCharsPerMinute) * 60); // Return seconds
  } else {
    // Count words
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil((wordCount / englishWordsPerMinute) * 60); // Return seconds
  }
}

/**
 * Add buffer time for transitions between sections
 */
export function addBufferTime(
  sections: Omit<ScriptSection, 'estimatedDuration' | 'timestamp'>[]
): ScriptSection[] {
  const transitionBuffer = 3; // 3 seconds between sections
  let cumulativeTime = 0;

  return sections.map((section, index) => {
    const baseDuration = calculateSpeechDuration(section.content);
    const buffer = index > 0 ? transitionBuffer : 0;
    const totalDuration = baseDuration + buffer;

    cumulativeTime += totalDuration;

    return {
      ...section,
      estimatedDuration: totalDuration,
      timestamp: formatTimestamp(cumulativeTime - totalDuration),
    } as ScriptSection;
  });
}

/**
 * Convert seconds to timestamp format (MM:SS or HH:MM:SS)
 */
export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Calculate cumulative timestamp for a section based on previous sections
 */
export function calculateCumulativeTimestamp(
  sections: ScriptSection[],
  currentIndex: number
): string {
  const totalSeconds = sections
    .slice(0, currentIndex)
    .reduce((sum, section) => sum + section.estimatedDuration, 0);

  return formatTimestamp(totalSeconds);
}

/**
 * Recalculate all timestamps when script is modified
 */
export function recalculateTimestamps(sections: ScriptSection[]): ScriptSection[] {
  let cumulativeTime = 0;

  return sections.map(section => {
    const currentTimestamp = formatTimestamp(cumulativeTime);
    cumulativeTime += section.estimatedDuration;

    return {
      ...section,
      timestamp: currentTimestamp,
    };
  });
}

/**
 * Calculate total duration of script
 */
export function calculateTotalDuration(sections: ScriptSection[]): number {
  return sections.reduce((sum, section) => sum + section.estimatedDuration, 0);
}

/**
 * Get text statistics
 */
export function getTextStatistics(text: string) {
  const chars = text.replace(/\s/g, '').length;
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  return {
    characters: chars,
    words,
    sentences,
    averageWordLength: chars / words || 0,
    averageSentenceLength: words / sentences || 0,
  };
}

/**
 * Detect if text is primarily Korean or English
 */
export function detectLanguage(text: string): 'ko' | 'en' {
  const koreanChars = text.match(/[가-힣]/g)?.length || 0;
  const englishChars = text.match(/[a-zA-Z]/g)?.length || 0;

  return koreanChars > englishChars ? 'ko' : 'en';
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (minutes === 0) {
    return `${secs}초`;
  }

  return secs > 0 ? `${minutes}분 ${secs}초` : `${minutes}분`;
}
