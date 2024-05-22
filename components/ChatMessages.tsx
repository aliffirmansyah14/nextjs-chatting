import ListMessages from "./ListMessages";
import { createClient } from "@/lib/supabase/server";
import InitMessage from "@/lib/store/InitMessage";
import { wait } from "@/lib/utils";
import { LIMIT_MESSAGE } from "@/lib/constant";

export default async function ChatMessages() {
   const supabase = createClient();
   // console.log("requested messages at :" + new Date());
   await wait(300);
   const { data } = await supabase
      .from("messages")
      .select("*,users(*)")
      .range(0, LIMIT_MESSAGE)
      .order("created_at", {
         ascending: false,
      });

   return (
      <>
         <InitMessage messages={data || []} />
         <ListMessages />
      </>
   );
}
