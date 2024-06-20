import { mergeAttributes, Node, nodePasteRule } from "@tiptap/core";

export interface SoundCloudOptions {
  HTMLAttributes: Record<string, unknown>;
  addPasteHandler: boolean;
  autoplay: boolean;
  inline: boolean;
  width: number | string;
  height: number | string;
  hideRelated: boolean;
  showComments: boolean;
  showUser: boolean;
  showReposts: boolean;
  showTeaser: boolean;
  visual: boolean;
}

type SetSoundCloudOptions = {
  url: string;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    soundcloud: {
      setSoundCloud: (options: SetSoundCloudOptions) => ReturnType;
    };
  }
}

export let SoundCloud = Node.create<SoundCloudOptions>({
  name: "soundcloud",
  draggable: true,

  addOptions() {
    return {
      addPasteHandler: true,
      autoplay: false,
      HTMLAttributes: {},
      inline: false,
      width: "100%",
      height: 400,
      hideRelated: true,
      showComments: false,
      showUser: true,
      showReposts: false,
      showTeaser: false,
      visual: true,
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  addAttributes() {
    return {
      url: {
        default: null,
      },
      width: {
        default: this.options.width,
      },
      height: {
        default: this.options.height,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src^="https://w.soundcloud.com/player/"]',
      },
    ];
  },

  addCommands() {
    return {
      setSoundCloud:
        (options: SetSoundCloudOptions) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: options,
          }),
    };
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /https:\/\/soundcloud\.com\/.+/g,
        type: this.type,
        getAttributes: (match) => {
          return { url: match.input };
        },
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    let url = HTMLAttributes.url;

    return [
      "iframe",
      mergeAttributes(
        this.options.HTMLAttributes,
        {
          width: this.options.width,
          height: this.options.height,
          scrolling: "no",
          frameborder: "no",
          allow: "autoplay",
          src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(
            url
          )}&color=%23ff5500&auto_play=${this.options.autoplay}&hide_related=${
            this.options.hideRelated
          }&show_comments=${this.options.showComments}&show_user=${
            this.options.showUser
          }&show_reposts=${this.options.showReposts}&show_teaser=${
            this.options.showTeaser
          }&visual=${this.options.visual}`,
        },
        HTMLAttributes
      ),
    ];
  },
});
