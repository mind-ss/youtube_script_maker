import { useState } from 'react';
import { Download, Copy, Check, Youtube, FileText, File } from 'lucide-react';
import { useScriptStore } from '../../store/useScriptStore';
import { generateYouTubeChapters, generatePlainText, generateMarkdown, downloadFile, copyToClipboard } from '../../utils/formatters';
import jsPDF from 'jspdf';

export function ExportMenu() {
  const { currentScript } = useScriptStore();
  const [copied, setCopied] = useState(false);

  if (!currentScript) return null;

  const handleCopyYouTubeChapters = async () => {
    const chapters = generateYouTubeChapters(currentScript);
    const success = await copyToClipboard(chapters);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportText = () => {
    const text = generatePlainText(currentScript);
    const filename = `${currentScript.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.txt`;
    downloadFile(text, filename, 'text/plain;charset=utf-8');
  };

  const handleExportMarkdown = () => {
    const markdown = generateMarkdown(currentScript);
    const filename = `${currentScript.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.md`;
    downloadFile(markdown, filename, 'text/markdown;charset=utf-8');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text(currentScript.title, 20, yPosition);
    yPosition += 15;

    // Hook
    if (currentScript.hook) {
      doc.setFontSize(12);
      doc.text('[Intro]', 20, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      const hookLines = doc.splitTextToSize(currentScript.hook, 170);
      doc.text(hookLines, 20, yPosition);
      yPosition += hookLines.length * 7 + 10;
    }

    // Sections
    currentScript.sections.forEach((section) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(`${section.title} (${section.timestamp})`, 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      const contentLines = doc.splitTextToSize(section.content, 170);
      doc.text(contentLines, 20, yPosition);
      yPosition += contentLines.length * 7 + 10;
    });

    // Outro
    if (currentScript.outro) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.text('[Outro]', 20, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      const outroLines = doc.splitTextToSize(currentScript.outro, 170);
      doc.text(outroLines, 20, yPosition);
    }

    const filename = `${currentScript.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.pdf`;
    doc.save(filename);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(currentScript, null, 2);
    const filename = `${currentScript.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.json`;
    downloadFile(json, filename, 'application/json');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Download className="w-5 h-5" />
        내보내기
      </h3>

      <div className="space-y-3">
        {/* YouTube Chapters */}
        <button
          onClick={handleCopyYouTubeChapters}
          className="w-full flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <Youtube className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">유튜브 챕터</div>
              <div className="text-xs opacity-75">설명란에 붙여넣기</div>
            </div>
          </div>
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>

        {/* Text */}
        <button
          onClick={handleExportText}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">텍스트 파일</div>
              <div className="text-xs opacity-75">프롬프터 앱용</div>
            </div>
          </div>
          <Download className="w-5 h-5" />
        </button>

        {/* Markdown */}
        <button
          onClick={handleExportMarkdown}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <File className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">마크다운</div>
              <div className="text-xs opacity-75">문서 편집용</div>
            </div>
          </div>
          <Download className="w-5 h-5" />
        </button>

        {/* PDF */}
        <button
          onClick={handleExportPDF}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <File className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">PDF</div>
              <div className="text-xs opacity-75">인쇄용</div>
            </div>
          </div>
          <Download className="w-5 h-5" />
        </button>

        {/* JSON */}
        <button
          onClick={handleExportJSON}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <File className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">JSON</div>
              <div className="text-xs opacity-75">데이터 백업용</div>
            </div>
          </div>
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
