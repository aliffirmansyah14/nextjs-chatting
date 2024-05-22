"use client";

import { useUser } from "@/lib/store/user";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const ChatPresense = () => {
   const user = useUser(state => state.user);
   const supabase = createClient();
   const [onlines, setOnlines] = useState<Number>(0);
   useEffect(() => {
      const channel = supabase.channel("room1");
      channel
         .on("presence", { event: "sync" }, () => {
            let userId: string[] = [];
            // console.log("Synced presence state: ", channel.presenceState());
            for (let user in channel.presenceState()) {
               //@ts-ignore
               const id = channel.presenceState()[user][0].user_id;
               if (id) {
                  userId.push(id);
               }
            }
            setOnlines([...new Set(userId)].length);
         })
         .subscribe(async status => {
            if (status === "SUBSCRIBED") {
               await channel.track({
                  online_at: new Date().toISOString(),
                  user_id: user?.id,
               });
            }
         });

      return () => {
         channel.unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [user]);

   if (!user) {
      return <div className="h-3 w-1"></div>;
   }

   return (
      <div className="flex justify-center items-center gap-1">
         <div className="size-4 bg-green-500 rounded-full animate-pulse"></div>
         <h2>{onlines.toString()} Onlines</h2>
      </div>
   );
};

export default ChatPresense;
