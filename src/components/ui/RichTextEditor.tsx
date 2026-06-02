"use client";

import React, { useRef, useEffect, useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  defaultValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ defaultValue = "", onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const [isEmpty, setIsEmpty] = useState(defaultValue === "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = defaultValue;
      setIsEmpty(defaultValue.replace(/<[^>]*>/g, "").trim() === "");
      isInitialized.current = true;
    }
  }, [defaultValue]);

  const handleCommand = (command: string, arg?: string) => {
    // Focus the editor first to ensure command is applied to it
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText.trim();
      setIsEmpty(text === "" && html !== "<br>");
      onChange(html);
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden transition-all bg-card flex flex-col ${
      isFocused ? "border-primary ring-2 ring-primary/20" : "border-border"
    }`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-secondary/30 border-b border-border/80 shrink-0 select-none">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent editor losing focus
            handleCommand("bold");
          }}
          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Tebal (Bold)"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleCommand("italic");
          }}
          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Miring (Italic)"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleCommand("underline");
          }}
          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Garis Bawah (Underline)"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
        <div className="w-px h-4 bg-border mx-1"></div>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleCommand("insertUnorderedList");
          }}
          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Daftar Poin (Unordered List)"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleCommand("insertOrderedList");
          }}
          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Daftar Angka (Ordered List)"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (editorRef.current && editorRef.current.innerText.trim() === "") {
              editorRef.current.innerHTML = "";
              setIsEmpty(true);
            }
          }}
          className="editor-content p-3 min-h-[140px] max-h-[220px] overflow-y-auto outline-none text-sm text-foreground focus:outline-none"
        />
        {isEmpty && (
          <div className="absolute top-3 left-3 text-sm text-muted-foreground/60 pointer-events-none whitespace-pre-line select-none">
            {placeholder}
          </div>
        )}
      </div>

      <style>{`
        .editor-content ul {
          list-style-type: disc !important;
          padding-left: 1.25rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .editor-content ol {
          list-style-type: decimal !important;
          padding-left: 1.25rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .editor-content li {
          margin-bottom: 0.25rem !important;
        }
        .editor-content b, .editor-content strong {
          font-weight: 700 !important;
        }
        .editor-content i, .editor-content em {
          font-style: italic !important;
        }
        .editor-content u {
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
}
