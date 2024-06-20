import { PalaborImageNodeView } from "@/editor/components/palabor-image";
import { Image } from "@tiptap/extension-image";
import { PluginKey } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import {
  ReactNodeViewRenderer,
  mergeAttributes,
  nodePasteRule,
} from "@tiptap/react";
import { Plugin } from "prosemirror-state";
import { v4 as uuidv4 } from "uuid";

export interface PalaborImageOptions {
  inline: boolean;
  allowFileUploads: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, unknown>;
  handleFiles: (view: EditorView, files: File[]) => Promise<void>;
  handleImageUrls: (view: EditorView, urls: string[]) => Promise<void>;
}

export let insertImage = (view: EditorView, imageUrl: string) => {
  let { schema } = view.state;
  let pImageNode = schema.nodes["palabor-image"].create({
    src: imageUrl,
  });
  let transaction = view.state.tr.replaceSelectionWith(pImageNode);
  view.dispatch(transaction);
  view.focus();
};

function createExtension(options?: PalaborImageOptions) {
  return Image.extend<PalaborImageOptions>({
    name: "palabor-image",
    draggable: true,
    addOptions() {
      return {
        ...options,
        inline: false,
        allowFileUploads: true,
        allowBase64: true,
        HTMLAttributes: {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleFiles: async (_view: EditorView, _files: File[]) => {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleImageUrls: async (_view: EditorView, _urls: string[]) => {},
      };
    },
    addAttributes() {
      return {
        id: {
          default: uuidv4(),
          renderHTML: (attributes) => {
            if (!attributes.id) {
              return {};
            }
            return {
              id: attributes.id,
            };
          },
        },
        src: {
          default: null,
          renderHTML: (attributes) => {
            if (!attributes.src) {
              return {};
            }
            return {
              src: attributes.src,
            };
          },
        },
        alt: {
          default: null,
          renderHTML: (attributes) => {
            if (!attributes.alt) {
              return {};
            }
            return {
              alt: attributes.alt,
            };
          },
        },
        title: {
          default: null,
          renderHTML: (attributes) => {
            if (!attributes.title) {
              return {};
            }
            return {
              title: attributes.title,
            };
          },
        },
      };
    },
    addPasteRules() {
      return [
        nodePasteRule({
          find: /https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp)(\?.*)?/gi,
          type: this.type,
          getAttributes: (match) => {
            return { src: match[0].trim() };
          },
        }),
      ];
    },
    parseHTML() {
      return [
        {
          tag: "figure img[src]",
          contentElement: "img[src]",
          getAttrs: (node: string | HTMLElement) => {
            let image = (node as HTMLElement).querySelector("img");
            let figcaption = (node as HTMLElement).querySelector("figcaption");

            return {
              id: image?.getAttribute("data-id"),
              src: image?.getAttribute("src"),
              alt: image?.getAttribute("alt"),
              title: figcaption?.textContent,
            };
          },
        },
        {
          tag: "figcaption",
          ignore: true,
        },
      ];
    },
    renderHTML({ HTMLAttributes, node }) {
      return [
        "figure",
        {
          style: "margin: 12px 0 0 0;",
          "data-id": node.attrs.id,
        },
        [
          "img",
          {
            style: "width: 100%; border-radius: 6px;",
            ...mergeAttributes(HTMLAttributes),
          },
        ],
        [
          "figcaption",
          {
            style: "text-align: center; font-size: 0.8em; margin-top: 0.5em;",
          },
          HTMLAttributes.title || "",
        ],
      ];
    },
    addNodeView() {
      return ReactNodeViewRenderer(PalaborImageNodeView);
    },
    addProseMirrorPlugins() {
      let handleFiles = this.options.handleFiles;
      let handleImageUrls = this.options.handleImageUrls;
      return [
        new Plugin({
          key: new PluginKey("imageDropPastePlugin"),
          props: {
            handleDOMEvents: {
              drop(view, event) {
                event.preventDefault();
                event.stopPropagation();
                let dataTransfer = event.dataTransfer;
                if (!dataTransfer?.files.length) {
                  return;
                }

                let files = Array.from(dataTransfer.files).filter((file) =>
                  /image/i.test(file.type)
                );

                handleFiles(view, files);

                return false;
              },
              paste(view, event) {
                event.stopPropagation();

                let items = event.clipboardData?.items;
                let files: File[] = [];
                let imageUrls: string[] = [];

                if (!items) {
                  return false;
                }

                for (let i = 0; i < items.length; i++) {
                  if (/image/i.test(items[i].type)) {
                    let file = items[i].getAsFile();
                    if (file) {
                      let maxSize = 1024 * 1024 * 3;
                      if (file.size <= maxSize) {
                        files.push(file);
                      } else {
                        alert(
                          `Image size exceeds the allowed limit (${file.name})`
                        );
                      }
                    }
                  } else if (items[i].kind === "string") {
                    items[i].getAsString((str) => {
                      // add query params to the regex
                      let urlRegex =
                        /https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp)(\?.*)?/gi;
                      let matches = str.match(urlRegex);
                      if (matches) {
                        imageUrls.push(matches[0]);
                      }
                    });
                  }
                }

                handleFiles(view, files);
                handleImageUrls(view, imageUrls);

                return false;
              },
            },
          },
        }),
      ];
    },
  });
}

let PalaborImage = createExtension();
export default PalaborImage;
