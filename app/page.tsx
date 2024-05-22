import ChatAbout from "@/components/ChatAbout";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import { SkeletonMessages } from "@/components/Skeleton";
import InitUser from "@/lib/store/InitUser";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function HomePage() {
   const supabase = createClient();
   const { data, error } = await supabase.auth.getUser();
   if (error || !data.user) {
      if (error) {
         console.log({ error: error.message });
      } else {
         console.log("User Not Found");
      }
   }

   return (
      <>
         <InitUser user={data?.user} />
         <main className="mx-auto max-w-3xl h-[100svh] md:py-12 overflow-hidden ">
            <div className="border md:rounded-md size-full flex flex-col relative">
               <ChatHeader user={data?.user} />
               {!data.user ? (
                  <ChatAbout />
               ) : (
                  <>
                     <Suspense fallback={<SkeletonMessages size={8} />}>
                        <ChatMessages />
                     </Suspense>
                     <ChatInput />
                  </>
               )}
            </div>
         </main>
      </>
   );
}
