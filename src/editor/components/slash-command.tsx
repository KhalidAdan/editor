import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Editor, Extension, Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { ReactNode, useCallback, useRef, useState } from "react";
import tippy, { GetReferenceClientRect } from "tippy.js";

export interface CommandProps {
  editor: Editor;
  range: Range;
}

export type SlashCommandItem = {
  title: string;
  description: string;
  searchTerms: string[];
  icon: JSX.Element;
  command: (options: CommandProps) => void;
};

export let DEFAULT_SLASH_COMMANDS: SlashCommandItem[] = [
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Icons.text className="h-4 w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <Icons.heading2 className="h-4 w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Icons.heading3 className="h-4 w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: <Icons.list className="h-4 w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: <Icons.listOrdered className="h-4 w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Image",
    description: "Full width image",
    searchTerms: ["image"],
    icon: <Icons.image className="h-4 w-4" />,
    command: ({ editor, range }: CommandProps) => {
      let imageUrl = prompt("Image URL: ") || "";

      if (!imageUrl) {
        return;
      }

      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().setImage({ src: imageUrl }).run();
    },
  },
  {
    title: "Hard Break",
    description: "Add a break between lines.",
    searchTerms: ["break", "line"],
    icon: <Icons.moveVertical className="h-4 w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).setHardBreak().run();
    },
  },
  {
    title: "Blockquote",
    description: "Add blockquote.",
    searchTerms: ["quote", "blockquote"],
    icon: <Icons.textQuote className="h-4 w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
];

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export let SlashCommand = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export let updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  let containerHeight = container.offsetHeight;
  let itemHeight = item ? item.offsetHeight : 0;

  let top = item.offsetTop;
  let bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

let CommandList = ({
  items,
  command,
  editor,
}: {
  items: CommandItemProps[];
  command: (item: CommandItemProps) => void;
  editor: Editor;
}) => {
  let [selectedIndex, setSelectedIndex] = useState(0);

  let selectItem = useCallback(
    (index: number) => {
      let item = items[index];
      if (item) {
        command(item);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [command, editor, items]
  );

  // useEffect(() => {
  //   let navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
  //   let onKeyDown = (e: KeyboardEvent) => {
  //     if (navigationKeys.includes(e.key)) {
  //       e.preventDefault();
  //       if (e.key === "ArrowUp") {
  //         setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  //         return true;
  //       }
  //       if (e.key === "ArrowDown") {
  //         setSelectedIndex((selectedIndex + 1) % items.length);
  //         return true;
  //       }
  //       if (e.key === "Enter") {
  //         selectItem(selectedIndex);
  //         return true;
  //       }
  //       return false;
  //     }
  //   };
  //   document.addEventListener("keydown", onKeyDown, true);
  //   return () => {
  //     document.removeEventListener("keydown", onKeyDown, true);
  //   };
  // }, [items, selectedIndex, setSelectedIndex, selectItem]);

  // useEffect(() => {
  //   setSelectedIndex(0);
  // }, [items]);

  let commandListContainer = useRef<HTMLDivElement>(null);

  // useLayoutEffect(() => {
  //   let container = commandListContainer?.current;

  //   let item = container?.children[selectedIndex] as HTMLElement;

  //   if (item && container) updateScrollView(container, item);
  // }, [selectedIndex]);

  return items.length > 0 ? (
    <div className="khld-shadow">
      <div
        className="
        khld-select-all
        khld-inline-flex khld-flex-col
        khld-z-50 khld-h-auto khld-w-72 khld-max-h-80 
        khld-rounded-md khld-border khld-border-b-0 khld-border-input khld-rounded-br-none khld-rounded-bl-none khld-bg-background
        khld-overflow-y-auto
        khld-p-2"
        id="slash-command"
        ref={commandListContainer}
      >
        {items.map((item: CommandItemProps, index: number) => {
          return (
            <button
              className={cn(
                "khld-flex khld-w-full khld-items-center khld-space-x-2 khld-rounded-md khld-px-2 khld-py-1 khld-text-left khld-text-sm hover:khld-bg-muted-foreground/5",
                index === selectedIndex
                  ? "khld-bg-muted-foreground/15"
                  : "khld-bg-transparent"
              )}
              key={index}
              onClick={() => selectItem(index)}
              type="button"
            >
              <div className="khld-flex khld-h-6 khld-w-6 khld-shrink-0 khld-items-center khld-justify-center">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="khld-text-xs khld-text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="khld-bg-background khld-rounded-br-md khld-rounded-bl-md khld-border khld-border-input khld-px-1 khld-py-3 khld-pl-4">
        <div className="khld-flex khld-items-center">
          <p className="khld-text-center khld-text-xs khld-text-muted-foreground">
            <kbd className="khld-rounded khld-border khld-py-1 khld-px-2 khld-font-medium">
              ↑
            </kbd>
            <kbd className="khld-ml-1 khld-rounded khld-border khld-py-1 khld-px-2 khld-font-medium">
              ↓
            </kbd>{" "}
            to navigate
          </p>
          <span aria-hidden="true" className="khld-select-none khld-px-1">
            ·
          </span>
          <p className="khld-text-center khld-text-xs khld-text-muted-foreground">
            <kbd className="khld-rounded khld-border khld-py-1 khld-px-1.5 khld-font-medium">
              Enter
            </kbd>{" "}
            to select
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

export function getSlashCommandSuggestions(
  commands: SlashCommandItem[] = []
): Omit<SuggestionOptions, "editor"> {
  return {
    items: ({ query }) => {
      return [...DEFAULT_SLASH_COMMANDS, ...commands].filter((item) => {
        if (typeof query === "string" && query.length > 0) {
          let search = query.toLowerCase();
          return (
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            (item.searchTerms &&
              item.searchTerms.some((term: string) => term.includes(search)))
          );
        }
        return true;
      });
    },
    render: () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let component: ReactRenderer<any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let popup: InstanceType<any> | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(CommandList, {
            props,
            editor: props.editor,
          });

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect as GetReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
          });
        },
        onUpdate: (props) => {
          component?.updateProps(props);

          popup &&
            popup[0].setProps({
              getReferenceClientRect: props.clientRect,
            });
        },
        onKeyDown: (props) => {
          if (props.event.key === "Escape") {
            popup?.[0].hide();

            return true;
          }

          return component?.ref?.onKeyDown(props);
        },
        onExit: () => {
          if (!popup || !popup?.[0] || !component) {
            return;
          }

          popup?.[0].destroy();
          component?.destroy();
        },
      };
    },
  };
}
