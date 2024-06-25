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
        />
      </div>
    </div>
  </React.StrictMode>
);
