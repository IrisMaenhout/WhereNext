// src/components/global/editor/Editor.jsx
import { useContext, useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { useRoom, useSelf } from "../../../liveblocks.config"; // Adjust the path
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/react/style.css";
import { LoggedInUserContext } from "../../../context/LoggedInUserContext";

function BlockNoteComponent({ doc, provider, googleLocationId, tripId }) {
  const loggedInUser = useContext(LoggedInUserContext);
  const [currentNoteData, setCurrentNoteData] = useState();


  const handleSaveNote = async () =>{

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${googleLocationId}/addNote/${tripId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'authorization': loggedInUser._id
          },
          body: JSON.stringify({
            content: currentNoteData
          }),
      });

      if (!response.ok) {
          console.log(response);
          throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log('upload', data);
    } catch (error) {
        console.error(error);
    }
  }

  const getNoteData = async () =>{
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${googleLocationId}/inTrip/${tripId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'authorization': loggedInUser._id
          }
      });

      if (!response.ok || response.status === 404) {
          console.log(response);
          return;
      }

      const data = await response.json();
      setCurrentNoteData(data);
    } catch (error) {
        console.error(error);
    }
  }


  useEffect(()=>{
    getNoteData();
  }, [])

  useEffect(()=> {
    
    const interval = setInterval(() => {
      if(currentNoteData.length > 0){
        handleSaveNote();
      }
      // upload automaticly every 2 minutes
    }, 1200);

    return () => clearInterval(interval);
  }, [currentNoteData])




    // const userInfo = useSelf((me) => me.info);
  const editor = useCreateBlockNote({
    initialContent: currentNoteData,
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: `${loggedInUser.firstname} ${loggedInUser.lastname}`,
        color: "#FB6026",
      }
    },
  });

  if (!editor) {
    return null;
  }

  return <BlockNoteView editor={editor} editable={true} theme={'light'} onChange={() => {
    // Saves the document JSON to state.
    console.log(editor.document);
    setCurrentNoteData(editor.document);
  }}/>;
}

export default function Editor({tripId, googleLocationId}) {
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

  return <BlockNoteComponent doc={doc} provider={provider} googleLocationId={googleLocationId} tripId={tripId}/>;
}
