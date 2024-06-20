import React from "react";
import ReactDOM from "react-dom/client";
import { Editor } from "./editor";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="khld-h-full khld-w-full">
      <div className="khld-max-w-3xl khld-mx-auto khld-px-4 khld-py-8">
        <Editor
          autofocus="start"
          editorProps={{
            attributes: {
              class:
                "khld-prose-xl khld-dark:prose-invert khld-min-w-full focus:khld-outline-none khld-scroll-smooth",
            },
          }}
          content="One thing you may have noticed is that in a Vite project, index.html is front-and-central instead of being tucked away inside public. This is intentional: during development Vite is a server, and index.html is the entry point to your application.Vite treats index.html as source code and part of the module graph. It resolves script type='module' that references your JavaScript source code. Even inline script type='module' and CSS referenced via <link href> also enjoy Vite-specific features. In addition, URLs inside index.html are automatically rebased so there's no need for special %PUBLIC_URL% placeholders. Similar to static http servers, Vite has the concept of a 'root directory' which your files are served from. You will see it referenced as <root> throughout the rest of the docs. Absolute URLs in your source code will be resolved using the project root as base, so you can write code as if you are working with a normal static file server (except way more powerful!). Vite is also capable of handling dependencies that resolve to out-of-root file system locations, which makes it usable even in a monorepo-based setup. Vite also supports multi-page apps with multiple .html entry points. Specifying Alternative Root Running vite starts the dev server using the current working directory as root. You can specify an alternative root with vite serve some/sub/dir. Note that Vite will also resolve its config file (i.e. vite.config.js) inside the project root, so you'll need to move it if the root is changed."
        />
      </div>
    </div>
  </React.StrictMode>
);
