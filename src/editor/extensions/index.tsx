import { CharacterCount } from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { Youtube } from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import {
  SlashCommand,
  getSlashCommandSuggestions,
} from "../components/slash-command";
import CodeworksImage from "../nodes/codeworks-image";
import { SoundCloud } from "../nodes/soundcloud";

export let DEFAULT_EXTENSIONS = [
  StarterKit,
  Typography,
  CodeworksImage.configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: "khld-w-full khld-h-auto",
    },
  }),
  Youtube.configure({
    modestBranding: true,
    inline: false,
    allowFullscreen: false,
    ccLanguage: "en",
    HTMLAttributes: {
      class: "khld-w-full khld-h-96",
    },
  }),
  SoundCloud.configure({
    autoplay: false,
    inline: false,
    HTMLAttributes: {
      class: "khld-w-full khld-h-96",
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }

      return "Write something or / to see commands...";
    },
    includeChildren: true,
  }),
  SlashCommand.configure({
    suggestion: getSlashCommandSuggestions(),
  }),
  CharacterCount,
  Link.configure({
    protocols: ["ftp", "mailto"],
  }),
];
