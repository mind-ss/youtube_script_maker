// Content types for different YouTube video styles
export type ContentType =
  | 'tutorial'
  | 'review'
  | 'vlog'
  | 'news'
  | 'entertainment';

// Tone and manner options
export type ToneType =
  | 'friendly'
  | 'professional'
  | 'humorous'
  | 'serious';

// Target audience levels
export type AudienceLevel =
  | 'beginner'
  | 'intermediate'
  | 'expert'
  | 'general';

// Individual script section
export interface ScriptSection {
  id: string;
  title: string;
  content: string;
  speakingNotes: string[];
  visualCues: string[];
  estimatedDuration: number; // in seconds
  timestamp: string; // format: "00:45"
  completed?: boolean; // for shooting checklist
}

// Complete script structure
export interface Script {
  id: string;
  title: string;
  hook: string; // First 10 seconds
  sections: ScriptSection[];
  outro: string;
  estimatedDuration: number; // total in seconds
  createdAt: string;
  updatedAt: string;
  contentType: ContentType;
  metadata?: ScriptMetadata;
}

// Additional metadata for the script
export interface ScriptMetadata {
  topic: string;
  targetAudience: AudienceLevel;
  tone: ToneType;
  targetDuration: number; // desired duration in minutes
  keyPoints?: string[];
  customCTA?: string;
}

// Parameters for script generation
export interface ScriptGenerationParams {
  topic: string;
  contentType: ContentType;
  duration: number; // in minutes
  targetAudience: AudienceLevel;
  tone: ToneType;
  keyPoints?: string[];
  customCTA?: string;
}

// Version history
export interface ScriptVersion {
  id: number;
  name: string;
  script: Script;
  timestamp: string;
}

// Export formats
export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'json' | 'youtube-chapters';

// Storage structure
export interface StorageData {
  currentScript: Script | null;
  savedScripts: Script[];
  versions: ScriptVersion[];
  lastSaved: string | null;
  settings: UserSettings;
}

// User settings
export interface UserSettings {
  autoSaveInterval: number;
  darkMode: boolean;
  defaultTone: ToneType;
  defaultAudience: AudienceLevel;
  charactersPerMinute: number; // for Korean
  wordsPerMinute: number; // for English
}

// Teleprompter state
export interface TeleprompterState {
  isActive: boolean;
  scrollSpeed: number;
  fontSize: number;
  currentSectionIndex: number;
}

// Shooting checklist item
export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  category: 'pre-shoot' | 'during-shoot' | 'post-shoot';
}

// Statistics
export interface ScriptStatistics {
  totalCharacters: number;
  totalWords: number;
  estimatedDuration: number;
  sectionsCount: number;
  averageSectionDuration: number;
  readabilityScore?: number;
}
