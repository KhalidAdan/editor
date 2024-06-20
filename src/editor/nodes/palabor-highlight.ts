import { Mark } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    PalaborHighlight: {
      // Create a comment highlight mark
      setHighlight: (attributes: {
        color?: string;
        commentId: string | null;
      }) => ReturnType;

      // Toggle a comment highlight mark
      toggleHighlight: (attributes: {
        color?: string;
        commentId: string | null;
      }) => ReturnType;

      // Remove a comment highlight mark
      unsetHighlight: () => ReturnType;
    };
  }
}

type PalaborHighlightOptions = {
  HTMLAttributes: Record<string, unknown>;
};

type PalaborHighlightStorage = {
  currentCommentId: string | null;
  activeCommentId: string | null;
};

let PalaborHighlight = Mark.create<
  PalaborHighlightOptions,
  PalaborHighlightStorage
>({
  name: "palabor-highlight",
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addStorage() {
    return {
      currentCommentId: null,
      activeCommentId: null,
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-comment-id"),
        renderHTML: (attributes) => {
          // Don't render attribute if no commentId defined
          if (!attributes.commentId) {
            return;
          }

          return {
            "data-comment-id": attributes.commentId,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "mark",
        priority: 51,
      },
    ];
  },

  addCommands() {
    return {
      setHighlight:
        (attributes) =>
        ({ commands }) => {
          this.storage.currentCommentId = attributes.commentId;
          return commands.setMark(this.name, attributes);
        },
      toggleHighlight:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    let commentId = HTMLAttributes?.["data-comment-id"] || null;
    let elem = document.createElement("mark");

    // Merge attributes
    Object.entries(
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-selected": "false",
      })
    ).forEach(([attr, val]) => elem.setAttribute(attr, val));

    // On hover, highlight the sidebar comment
    let handlePointerEnter = (event: MouseEvent) => {
      let targetIsCurrentMark =
        event.target instanceof HTMLElement
          ? event.target === elem || elem.contains(event.target)
          : false;
      elem.dataset.selected = targetIsCurrentMark ? "true" : "false";

      if (!this.editor) {
        return;
      }

      if (targetIsCurrentMark) {
        this.editor.storage["palabor-highlight"].activeCommentId = commentId;
        return;
      }
    };

    // On hover end, stop highlighting sidebar comment
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let handlePointerLeave = (_event: MouseEvent) => {
      elem.dataset.selected = "false";

      if (!this.editor) {
        return;
      }

      //highlightEvent(null);
      this.editor.storage["palabor-highlight"].activeCommentId = null;
    };

    let handleClick = () => {
      // Dispatch a custom event with the commentId
      let customEvent = new CustomEvent("comment-click", {
        detail: { commentId },
        bubbles: true, // Allow the event to bubble up through the DOM
      });
      elem.dispatchEvent(customEvent);
    };

    // Avoid memory leak with `.on...`
    elem.onpointerenter = handlePointerEnter;
    elem.onpointerleave = handlePointerLeave;
    elem.onclick = handleClick;

    return elem;
  },
});

export default PalaborHighlight;
