"use client";

import { useEffect, useRef } from "react";
import { TMessage, useMessages } from "./messages";

export default function InitMessage({ messages }: { messages: TMessage[] }) {
   const initState = useRef(false);

   useEffect(() => {
      if (!initState.current) {
         useMessages.setState({ messages });
      }
      initState.current = true;
      //eslint-disable-next-line
   }, []);

   return <></>;
}
