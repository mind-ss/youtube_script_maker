import type { Script } from '../types/script.types';

/**
 * Generate YouTube chapters format
 */
export function generateYouTubeChapters(script: Script): string {
  let output = '타임스탬프:\n';

  // Add intro
  output += '0:00 인트로\n';

  // Add each section
  script.sections.forEach(section => {
    // Convert MM:SS to M:SS format for YouTube
    const timestamp = section.timestamp.replace(/^0/, '');
    output += `${timestamp} ${section.title}\n`;
  });

  return output;
}

/**
 * Generate plain text script
 */
export function generatePlainText(script: Script): string {
  let output = `${script.title}\n\n`;
  output += `=`.repeat(script.title.length) + '\n\n';

  // Hook
  if (script.hook) {
    output += `[인트로 - ${script.sections[0]?.timestamp || '0:00'}]\n`;
    output += `${script.hook}\n\n`;
  }

  // Sections
  script.sections.forEach(section => {
    output += `[${section.title} - ${section.timestamp}]\n`;
    output += `${section.content}\n\n`;

    if (section.speakingNotes.length > 0) {
      output += `촬영 노트:\n`;
      section.speakingNotes.forEach(note => {
        output += `- ${note}\n`;
      });
      output += '\n';
    }

    if (section.visualCues.length > 0) {
      output += `영상 연출:\n`;
      section.visualCues.forEach(cue => {
        output += `- ${cue}\n`;
      });
      output += '\n';
    }
  });

  // Outro
  if (script.outro) {
    const lastTimestamp = script.sections[script.sections.length - 1]?.timestamp || '0:00';
    output += `[아웃트로 - ${lastTimestamp}]\n`;
    output += `${script.outro}\n`;
  }

  return output;
}

/**
 * Generate markdown format
 */
export function generateMarkdown(script: Script): string {
  let output = `# ${script.title}\n\n`;

  // Metadata
  if (script.metadata) {
    output += `**주제:** ${script.metadata.topic}\n`;
    output += `**콘텐츠 타입:** ${script.contentType}\n`;
    output += `**타겟 시청자:** ${script.metadata.targetAudience}\n`;
    output += `**예상 길이:** ${Math.floor(script.estimatedDuration / 60)}분\n\n`;
  }

  output += '---\n\n';

  // Hook
  if (script.hook) {
    output += `## 인트로 (0:00)\n\n`;
    output += `${script.hook}\n\n`;
  }

  // Sections
  script.sections.forEach(section => {
    output += `## ${section.title} (${section.timestamp})\n\n`;
    output += `${section.content}\n\n`;

    if (section.speakingNotes.length > 0) {
      output += `### 촬영 노트\n\n`;
      section.speakingNotes.forEach(note => {
        output += `- ${note}\n`;
      });
      output += '\n';
    }

    if (section.visualCues.length > 0) {
      output += `### 영상 연출\n\n`;
      section.visualCues.forEach(cue => {
        output += `- ${cue}\n`;
      });
      output += '\n';
    }
  });

  // Outro
  if (script.outro) {
    const lastSection = script.sections[script.sections.length - 1];
    const outroTime = lastSection
      ? `(${lastSection.timestamp})`
      : '(0:00)';
    output += `## 아웃트로 ${outroTime}\n\n`;
    output += `${script.outro}\n`;
  }

  return output;
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
