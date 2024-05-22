"use client";

import { useRef } from "react";
import { Input } from "./ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { TMessage, useMessages } from "@/lib/store/messages";
import { Send } from "lucide-react";

export default function ChatInput() {
   const ref = useRef<HTMLInputElement | null>(null);
   const supabase = createClient();
   const user = useUser(state => state.user);
   const { optimisticAddMessage, setOptimisticId } = useMessages(
      state => state
   );

   const handleSendMessage = async (text: string) => {
      if (text.trim() !== "") {
         const newMessage = {
            id: uuidv4(),
            text: text,
            send_by: user?.id,
            is_edit: false,
            created_at: new Date().toISOString(),
            users: {
               id: user?.id,
               avatar_url: user?.user_metadata.avatar_url,
               display_name: user?.user_metadata.user_name,
               created_at: new Date().toISOString(),
            },
         };
         optimisticAddMessage(newMessage as TMessage);
         setOptimisticId(newMessage.id);

         const { error } = await supabase
            .from("messages")
            .insert({ id: newMessage.id, text });
         if (error) {
            toast.error(error.message);
         }
      } else {
         toast.error("Message can not be empty");
         return;
      }
      if (ref.current) {
         ref.current.value = "";
      }
   };
   return (
      <div className="p-5 md:p-3 border-t">
         <div className="relative">
            <Input
               ref={ref}
               placeholder="Send Message..."
               onKeyDown={e => {
                  if (e.key === "Enter") {
                     handleSendMessage(e.currentTarget.value);
                  }
               }}
               className="peer pr-10"
            />
            <button
               className="absolute h-[70%] top-1/2 border-l peer-focus-visible:text-primary hover:text-primary -translate-y-1/2 right-0 pr-2 pl-1"
               onClick={() => {
                  handleSendMessage(ref.current?.value || "");
               }}
            >
               <Send className="size-5" />
            </button>
         </div>
      </div>
   );
}
