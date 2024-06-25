import { Extension, FocusPosition } from "@tiptap/core";
import { EditorProps as TiptapEditorProps } from "@tiptap/pm/view";
import { EditorContent, EditorEvents, useEditor } from "@tiptap/react";
import { BubbleMenu } from "./components/bubble-menu";
import { DEFAULT_EXTENSIONS } from "./extensions";

export type EditorProps = {
  extensions?: Extension[];
  content?: string;
  autofocus?: FocusPosition;
  editorProps?: TiptapEditorProps;
  onUpdate?: (props: EditorEvents["update"]) => void;
  showReadTime?: boolean;
};

export function CodeworksEditor(props: EditorProps) {
  let { extensions, content, autofocus, editorProps, onUpdate, showReadTime } =
    props;

  let formattedContent = content ?? {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [],
      },
    ],
  };

  let editor = useEditor({
    extensions: [...DEFAULT_EXTENSIONS, ...(extensions ?? [])],
    content: formattedContent,
    autofocus,
    editorProps,
    // when onUpdate is is not provided, bug in the editor causes multiple new paragraphs to be added on Enter
    onUpdate: onUpdate ?? (() => {}),
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="khld-w-full khld-mb-40">
      <BubbleMenu editor={editor} />
      {showReadTime && (
        <div className="khld-flex khld-gap-2 khld-items-center khld-fixed khld-bottom-6 khld-right-6 khld-text-sm khld-font-normal khld-px-3 khld-py-2 khld-bg-primary-foreground khld-z-10 khld-rounded-lg">
          {editor.storage.characterCount.words()} words
          <span>- TODO</span>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="khld-bg-background khld-prose khld-max-w-full dark:khld-prose-invert
          prose-ul:khld-list-disc prose-ol:khld-list-decimal
          prose-h2:khld-text-3xl prose-h2:khld-text-wrap prose-h2:khld-whitespace-pre prose-h2:khld-tracking-tighter prose-h2:khld-font-semibold
          prose-h3:khld-text-2xl prose-h3:khld-text-wrap prose-h3:khld-whitespace-pre prose-h3:khld-tracking-tighter prose-h3:khld-font-semibold
          prose-p:khld-my-4"
      />
    </div>
  );
}
