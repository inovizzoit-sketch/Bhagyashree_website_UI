"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-400 hover:text-indigo-300 underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "w-full bg-[#0b0b0f] text-slate-100 text-sm outline-none px-4 py-3 min-h-[220px] max-h-[500px] overflow-y-auto rich-text-content prose prose-invert max-w-none focus:ring-0",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync content from outside when value changes (only if it differs from current editor content)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="w-full bg-[#0b0b0f] border border-[#1e1e2e] rounded-lg p-4 text-xs text-slate-500">
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter the URL:", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const colors = [
    { name: "Default", value: "" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#eab308" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "White", value: "#ffffff" },
  ];

  const highlights = [
    { name: "None", value: "" },
    { name: "Yellow", value: "#eab308" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
  ];

  return (
    <div className="w-full border border-[#1e1e2e] rounded-lg overflow-hidden focus-within:border-indigo-500 transition-colors bg-[#0b0b0f]">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#13131a] border-b border-[#1e1e2e]">
        {/* History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-[#1e1e2e] text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo"
        >
          ↩️
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-[#1e1e2e] text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo"
        >
          ↪️
        </button>

        <div className="w-px h-4 bg-[#1e1e2e] mx-1" />

        {/* Formats */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
            editor.isActive("bold")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-xs italic transition-colors ${
            editor.isActive("italic")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded text-xs underline transition-colors ${
            editor.isActive("underline")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded text-xs line-through transition-colors ${
            editor.isActive("strike")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Strikethrough"
        >
          S
        </button>

        <div className="w-px h-4 bg-[#1e1e2e] mx-1" />

        {/* Headings */}
        <select
          value={
            editor.isActive("heading", { level: 1 })
              ? "1"
              : editor.isActive("heading", { level: 2 })
              ? "2"
              : editor.isActive("heading", { level: 3 })
              ? "3"
              : editor.isActive("heading", { level: 4 })
              ? "4"
              : editor.isActive("heading", { level: 5 })
              ? "5"
              : editor.isActive("heading", { level: 6 })
              ? "6"
              : "p"
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
            }
          }}
          className="bg-[#0b0b0f] border border-[#1e1e2e] rounded px-1.5 py-1 text-xs text-slate-300 outline-none"
        >
          <option value="p">Paragraph</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>

        <div className="w-px h-4 bg-[#1e1e2e] mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            editor.isActive("bulletList")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            editor.isActive("orderedList")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px h-4 bg-[#1e1e2e] mx-1" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-1.5 py-1 rounded text-xs transition-colors ${
            editor.isActive({ textAlign: "left" })
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Align Left"
        >
          ⬅️
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-1.5 py-1 rounded text-xs transition-colors ${
            editor.isActive({ textAlign: "center" })
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Align Center"
        >
          ↔️
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-1.5 py-1 rounded text-xs transition-colors ${
            editor.isActive({ textAlign: "right" })
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Align Right"
        >
          ➡️
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`px-1.5 py-1 rounded text-xs transition-colors ${
            editor.isActive({ textAlign: "justify" })
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Justify"
        >
          ↕️
        </button>

        <div className="w-px h-4 bg-[#1e1e2e] mx-1" />

        {/* Links */}
        <button
          type="button"
          onClick={setLink}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            editor.isActive("link")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Insert Link"
        >
          🔗
        </button>
        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="px-2 py-1 rounded text-xs text-red-400 hover:bg-[#1e1e2e] transition-colors"
            title="Remove Link"
          >
            ❌ Link
          </button>
        )}

        <div className="w-px h-4 bg-[#1e1e2e] mx-1" />

        {/* Text Color Picker */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Color:</span>
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                editor.chain().focus().setColor(val).run();
              } else {
                editor.chain().focus().unsetColor().run();
              }
            }}
            className="bg-[#0b0b0f] border border-[#1e1e2e] rounded px-1 py-0.5 text-[11px] text-slate-300 outline-none"
            title="Text Color"
          >
            {colors.map((c) => (
              <option key={c.name} value={c.value}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Highlight Color Picker */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Highlight:</span>
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                editor.chain().focus().setHighlight({ color: val }).run();
              } else {
                editor.chain().focus().unsetHighlight().run();
              }
            }}
            className="bg-[#0b0b0f] border border-[#1e1e2e] rounded px-1 py-0.5 text-[11px] text-slate-300 outline-none"
            title="Highlight Color"
          >
            {highlights.map((h) => (
              <option key={h.name} value={h.value}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-px h-4 bg-[#1e1e2e] mx-1" />

        {/* Extras */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            editor.isActive("blockquote")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Blockquote"
        >
          “ Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            editor.isActive("codeBlock")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200"
          }`}
          title="Code Block"
        >
          &lt;/&gt;
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 rounded text-xs text-slate-400 hover:bg-[#1e1e2e] hover:text-slate-200 transition-colors"
          title="Horizontal Line"
        >
          ― Line
        </button>

        <div className="w-px h-4 bg-[#1e1e2e] mx-1" />

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().clearNodes().unsetAllMarks().run();
          }}
          className="px-2 py-1 rounded text-xs text-yellow-500 hover:bg-[#1e1e2e] transition-colors"
          title="Clear Formatting"
        >
          🧹 Clear
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
