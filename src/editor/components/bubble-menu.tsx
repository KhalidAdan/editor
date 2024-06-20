import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
  Editor,
  BubbleMenu as TiptapBubbleMenu,
  BubbleMenuProps as TiptapBubbleMenuProps,
  isNodeSelection,
  isTextSelection,
} from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  Link,
  List,
  ListOrdered,
  LucideIcon,
  StrikethroughIcon,
} from "lucide-react";
import { FC } from "react";

export interface MenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: LucideIcon;
}

type BubbleMenuProps = Omit<TiptapBubbleMenuProps, "children" | "editor"> & {
  editor: Editor;
  menuItems?: MenuItem[];
};

export let BubbleMenu: FC<BubbleMenuProps> = (props) => {
  let { editor, menuItems } = props;

  let items: MenuItem[] = [
    ...(menuItems ?? []),
    {
      name: "h2",
      isActive: () => editor.isActive("heading", { level: 2 }),
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: Heading2Icon,
    },
    {
      name: "h3",
      isActive: () => editor.isActive("heading", { level: 3 }),
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: Heading3Icon,
    },
    {
      name: "bold",
      isActive: () => editor.isActive("bold"),
      command: () => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: () => editor.isActive("italic"),
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: Italic,
    },
    {
      name: "link",
      command: () => {
        const previousUrl = editor?.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) {
          return;
        }
        if (url === "") {
          editor?.chain().focus().extendMarkRange("link").unsetLink().run();

          return;
        }
        editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      },
      isActive: () => editor?.isActive("link"),
      icon: Link,
    },
    {
      name: "strike",
      isActive: () => editor.isActive("strike"),
      command: () => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: () => editor.isActive("code"),
      command: () => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
    {
      name: "bulletList",
      isActive: () => editor.isActive("bulletList"),
      command: () => editor.chain().focus().toggleBulletList().run(),
      icon: List,
    },
    {
      name: "orderedList",
      isActive: () => editor.isActive("orderedList"),
      command: () => editor.chain().focus().toggleOrderedList().run(),
      icon: ListOrdered,
    },
  ];

  let bubbleMenuProps: BubbleMenuProps = {
    ...props,
    shouldShow: ({ editor, state, from, to }) => {
      let { doc, selection } = state;
      let { empty } = selection;

      let isEmptyTextBlock =
        !doc.textBetween(from, to).length && isTextSelection(selection);

      if (
        empty ||
        isEmptyTextBlock ||
        !editor.isEditable ||
        editor.isActive("image") ||
        isNodeSelection(state.selection)
      ) {
        return false;
      }
      return true;
    },
  };

  return (
    <TiptapBubbleMenu
      {...bubbleMenuProps}
      className="khld-flex khld-gap-1 khld-w-fit khld-rounded-lg khld-border khld-border-input khld-bg-background khld-p-1 khld-shadow-md khld-text-primary/65"
    >
      <div className="khld-flex khld-items-center khld-justify-center khld-gap-1">
        {items.map((item, index) => (
          <button
            value={item.name}
            aria-label={`Toggle ${item.name}`}
            onClick={item.command}
            key={index}
            className={cn(
              toggleVariants({
                variant: "default",
                size: "default",
              }),
              {
                "khld-bg-accent": item.isActive(),
              }
            )}
          >
            <item.icon
              size={24}
              className={cn("khld-h-6 khld-w-6", {
                "khld-text-blue-500": item.isActive(),
              })}
            />
          </button>
        ))}
      </div>
    </TiptapBubbleMenu>
  );
};
