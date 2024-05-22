"use client";
import { TMessage, useMessages } from "@/lib/store/messages";
import Message from "./Message";
import { useUser } from "@/lib/store/user";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import { DeleteAlertMessage, EditAlertMessage } from "./MessageAction";
import LoadMoreMessages from "./LoadMoreMessages";
import { LIMIT_MESSAGE } from "@/lib/constant";

export default function ListMessages() {
   const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
   const [userScrolled, setUserScrolled] = useState<boolean>(false);
   const [notification, setNotification] = useState<number>(0);
   const supabase = createClient();
   const {
      messages,
      optimisticAddMessage,
      optimisticId,
      optimisticDeleteMessage,
      optimisticEditMessage,
   } = useMessages(state => state);
   const user = useUser(state => state.user);

   useEffect(() => {
      const channel = supabase
         .channel("chat-room")
         .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "messages" },
            async payload => {
               if (!optimisticId.includes(payload.new.id)) {
                  const { data, error } = await supabase
                     .from("users")
                     .select("*")
                     .eq("id", payload.new.send_by)
                     .single();
                  if (error) {
                     toast.error(error.message);
                  } else {
                     const newMessage = {
                        ...payload.new,
                        users: data,
                     } as TMessage;
                     optimisticAddMessage(newMessage);
                  }
                  setNotification(prev => prev + 1);
               }
            }
         )
         .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "messages" },
            async payload => {
               optimisticDeleteMessage(payload.old.id);
            }
         )
         .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "messages" },
            async payload => {
               optimisticEditMessage(payload.new as TMessage);
            }
         )
         .subscribe();
      return () => {
         channel.unsubscribe();
      };
      // eslint-disable-next-line
   }, [messages]);

   useEffect(() => {
      const scrollContainer = scrollRef.current;
      if (scrollContainer && !userScrolled) {
         scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
   }, [messages, userScrolled]);

   const handleOnScroll = () => {
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
         const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
         const isScroll = scrollTop + clientHeight < scrollHeight - 15;
         setUserScrolled(isScroll);
         if (scrollTop === scrollHeight - clientHeight) {
            setNotification(0);
         }
      }
   };

   const scrollToDown = () => {
      setNotification(0);
      const scrollContainer = scrollRef.current;
      scrollContainer.scrollTo({
         top: scrollContainer.scrollHeight,
         behavior: "smooth",
      });
   };

   return (
      <div
         className="flex-1 flex flex-col p-5 md:p-3 h-full overflow-y-auto"
         ref={scrollRef}
         onScroll={handleOnScroll}
      >
         <div className="flex-1 mb-4">
            {messages.length > LIMIT_MESSAGE && <LoadMoreMessages />}
         </div>
         <div className="space-y-5 md:space-y-7">
            {messages.map((message, idx) => (
               <Message user={user} message={message} key={idx} />
            ))}
         </div>
         <DeleteAlertMessage />
         <EditAlertMessage />
         {userScrolled && (
            <div className="absolute -left-[.9rem] md:left-0 bottom-[5.5rem] md:bottom-[4.5rem] w-full">
               {notification > 0 ? (
                  <div
                     className="w-36 bg-blue-500 rounded px-1 flex justify-center items-center mx-auto hover:bg-gray-400 cursor-pointer transition-colors"
                     onClick={scrollToDown}
                  >
                     New message {notification}
                  </div>
               ) : (
                  <div
                     className="size-10 bg-blue-500 rounded-full flex justify-center items-center mx-auto hover:bg-gray-400 cursor-pointer transition-colors"
                     onClick={scrollToDown}
                  >
                     <ArrowDown />
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
