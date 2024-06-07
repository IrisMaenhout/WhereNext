// src/components/global/editor/Editor.jsx
import { useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { useRoom, useSelf } from "../../../liveblocks.config"; // Adjust the path
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/react/style.css";

function BlockNoteComponent({ doc, provider }) {
    // const userInfo = useSelf((me) => me.info);
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: "My Username",
        color: "#ff0000",
      }
    // Information for this user:
    // user: {
    //     name: userInfo.name,
    //     color: userInfo.color,
    //   },
    },
  });

  if (!editor) {
    return null;
  }

  return <BlockNoteView editor={editor} editable={true} theme={'light'} onChange={() => {
    // Saves the document JSON to state.
    console.log(editor.document);
  }}/>;
}

export default function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return <BlockNoteComponent doc={doc} provider={provider} />;
}
