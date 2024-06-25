import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useCallback, useReducer } from "react";

type ComponentProps = NodeViewProps & {
  id: string;
  src: string;
  alt: string;
  title: string;
};

type ReducerState = {
  activeElement: "alt" | "title";
  editing: boolean;
  src: string;
  alt: string;
  title: string;
};

type ReducerAction = {
  activeElement?: "alt" | "title";
  editing?: boolean;
  src?: string;
  alt?: string;
  title?: string;
};

export let CodeworksImageNodeView = (props: ComponentProps) => {
  let { id, src, alt, title } = props.node.attrs;

  let [state, dispatch] = useReducer<
    (prev: ReducerState, next: ReducerAction) => ReducerState
  >(
    (prev, next) => {
      let pos = props.getPos();
      let node = props.node;
      node &&
        props.editor.view.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          alt,
          title,
        });
      props.editor.view.dispatch(props.editor.view.state.tr);
      return { ...prev, ...next };
    },
    {
      editing: false,
      src,
      alt,
      title,
      activeElement: "title",
    }
  );

  let updateNodeAttributes = useCallback(
    (newAttributes: Partial<{ alt: string; title: string }>) => {
      let pos = props.getPos();
      // Change the type, attributes, and/or marks of the node at pos.
      // When type (second param) isn't given, the existing node type is preserved. Important for custom node types.
      let transaction = props.editor.view.state.tr.setNodeMarkup(
        pos,
        undefined,
        {
          ...props.node.attrs,
          ...newAttributes,
        }
      );
      props.editor.view.dispatch(transaction);
    },
    [props]
  );

  let handleAttributeChange = useCallback(
    (attribute: "alt" | "title", value: string | null) => {
      dispatch({ [attribute]: value });
      updateNodeAttributes({ [attribute]: value });
    },
    [dispatch, updateNodeAttributes]
  );

  return (
    <NodeViewWrapper
      as="div"
      data-id={id}
      className={cn("khld-mb-4 khld-outline-primary khld-outline-offset-2", {
        "khld-outline khld-outline-2": state.editing,
        "khld-hover:outline khld-hover:outline-1": !state.editing,
      })}
    >
      <img
        src={src}
        alt={state.alt}
        title={state.title}
        className="khld-block khld-m-0 khld-w-full khld-h-auto khld-rounded"
      />
      <div className="khld-flex khld-justify-between khld-items-center">
        <input
          type="text"
          name="alt"
          defaultValue={state.alt}
          onFocus={() => dispatch({ editing: true })}
          onBlur={() => dispatch({ editing: false })}
          onChange={(e) => handleAttributeChange("alt", e.target.value)}
          className={cn(
            {
              "khld-hidden": state.activeElement == "title",
            },
            "khld-w-full khld-text-center khld-bg-background khld-text-muted-foreground khld-border-none khld-rounded focus:khld-ring-0 focus:khld-outline-none khld-font-sans"
          )}
        />
        <input
          type="text"
          name="title"
          defaultValue={state.title}
          onFocus={() => dispatch({ editing: true })}
          onBlur={() => dispatch({ editing: false })}
          onChange={(e) => handleAttributeChange("title", e.target.value)}
          className={cn(
            {
              "khld-hidden": state.activeElement == "alt",
            },
            "khld-w-full khld-text-center khld-bg-background khld-text-muted-foreground khld-border-none khld-rounded focus:khld-ring-0 focus:khld-outline-none khld-font-sans"
          )}
        />
        <button
          onClick={() =>
            dispatch({
              activeElement: state.activeElement == "alt" ? "title" : "alt",
              editing: true,
            })
          }
          onBlur={() => dispatch({ editing: false })}
          className={toggleVariants({ variant: "default" })}
        >
          {state.activeElement == "alt" ? "Alt" : "Caption"}
        </button>
      </div>
    </NodeViewWrapper>
  );
};
