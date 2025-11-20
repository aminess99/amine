export enum BookTheme {
  CLASSIC = 'classic',
  MODERN = 'modern',
  MINIMAL = 'minimal',
  KIDS = 'kids'
}

export interface Chapter {
  title: string;
  content: string;
}

export interface Book {
  title: string;
  author: string;
  description: string;
  chapters: Chapter[];
}

export interface GenerateBookParams {
  topic: string;
  details: string; // New: detailed description
  chapterCount: number; // New: number of chapters
  audience: string;
  languageStyle: string;
}

// For html2pdf types since we load it via CDN
declare global {
  interface Window {
    html2pdf: any;
  }
}