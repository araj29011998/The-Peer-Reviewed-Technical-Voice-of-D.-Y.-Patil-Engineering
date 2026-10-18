import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface RichArticleViewerProps {
  content: string;
}

export const RichArticleViewer: React.FC<RichArticleViewerProps> = ({ content }) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Safe line-by-line / block parser
  const renderFormattedContent = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let codeBlockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block start/end
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim() || 'text';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const currentCode = codeBuffer.join('\n');
          const blockId = `code-block-${codeBlockIndex++}`;
          elements.push(
            <div key={blockId} className="my-6 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>{codeLanguage}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(currentCode, blockId)}
                  className="hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedCodeId === blockId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
                <code>{currentCode}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Headings
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="font-serif text-2xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">
            {line.replace('## ', '')}
          </h2>
        );
        continue;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="font-sans text-lg font-bold text-slate-900 mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={`quote-${i}`} className="border-l-2 border-slate-300 pl-4 py-1 my-4 italic text-slate-600 text-base">
            {line.replace('> ', '')}
          </blockquote>
        );
        continue;
      }

      // Unordered list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={`li-${i}`} className="ml-6 list-disc text-slate-700 text-base leading-relaxed my-1">
            {parseInlineMarkdown(line.substring(2))}
          </li>
        );
        continue;
      }

      // Empty lines
      if (!line.trim()) {
        continue;
      }

      // Standard paragraphs
      elements.push(
        <p key={`p-${i}`} className="text-slate-800 text-base sm:text-lg leading-relaxed mb-5">
          {parseInlineMarkdown(line)}
        </p>
      );
    }

    return elements;
  };

  // Helper for inline markdown: bold, inline code, sanitized links
  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={`b-${match.index}`} className="font-bold text-slate-900">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={`c-${match.index}`} className="font-mono text-xs sm:text-sm bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('[') && token.includes('](')) {
        const titleMatch = token.match(/\[(.*?)\]/);
        const urlMatch = token.match(/\((.*?)\)/);
        if (titleMatch && urlMatch) {
          const rawUrl = urlMatch[1];
          // Sanitize URL protocol to prevent javascript: or data: injection
          const safeUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('/')
            ? rawUrl
            : '#';
          parts.push(
            <a
              key={`a-${match.index}`}
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 underline hover:text-blue-950 inline-flex items-center gap-0.5"
            >
              <span>{titleMatch[1]}</span>
              <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-60" />
            </a>
          );
        }
      }

      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="article-prose font-sans max-w-none">
      {renderFormattedContent()}
    </div>
  );
};
