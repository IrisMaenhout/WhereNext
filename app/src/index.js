import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import 'react-tooltip/dist/react-tooltip.css';
import { RoomProvider } from "./liveblocks.config";
// import { Editor } from "./Editor";
import { ClientSideSuspense } from "@liveblocks/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    

    <RoomProvider id="my-room" initialPresence={{}}>
      {/* <ClientSideSuspense fallback="Loading…">
        {() => <Editor />}
      </ClientSideSuspense> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RoomProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
