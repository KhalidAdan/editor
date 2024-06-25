# Editor

## Development

To run the editor locally, run `npm run dev` and open `http://localhost:5173` in your browser.

## Building

To build the editor, run `npm run build`. The starting point for the build is `src\editor\index.tsx`, and can be configured by modifying the `vite.config.ts` file.

## Publishing

To publish the editor, run `npm run publish`.

[!NOTE] This will publish the editor to the npm registry, so make sure you have the necessary permissions to do so. You can also publish the editor to a custom registry by specifying the `--registry` flag when running the `npm run publish` command.

### Misc

1. Image uploads need to be handled by the developer, bu there is a basic implementation in `src\editor\nodes\codeworks-image.ts` that can be used as a starting point, but uses data-urls which is not recommended for production use.

2. Tiptap is an opinionated wrapper around Prosemirror, so there are some instances where you'll need to be aware of the Prosemirror API.
