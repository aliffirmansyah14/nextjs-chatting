"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { wait } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import ChatPresense from "./ChatPresense";
import { Github } from "lucide-react";
import LogoutDialog from "./LogoutDialog";

const ChatHeader = ({ user }: { user: User | null }) => {
   const supabase = createClient();

   const [isLoading, setIsLoading] = useState<boolean>(false);

   const handleLoginWithGithub = async () => {
      await supabase.auth.signInWithOAuth({
         provider: "github",
         options: {
            redirectTo: location.origin + "/auth/callback",
         },
      });
   };
   return (
      <header className="flex p-5 justify-between items-center border-b h-20">
         <div>
            <h1 className="text-xl font-bold tracking-tight"> Chat</h1>
            <ChatPresense />
         </div>
         <div>
            {user ? (
               <Button
                  size="default"
                  variant="outline"
                  className="font-bold"
                  disabled={isLoading}
                  onClick={() => {
                     document.getElementById("trigger-logout")?.click();
                  }}
               >
                  Logout
               </Button>
            ) : (
               <Button
                  size="default"
                  variant="default"
                  className="font-bold"
                  disabled={isLoading}
                  onClick={async () => {
                     setIsLoading(true);
                     await wait(1000);
                     await handleLoginWithGithub();
                     setIsLoading(false);
                  }}
               >
                  {isLoading ? (
                     "....."
                  ) : (
                     <>
                        Login <Github className="size-5 ml-1" />
                     </>
                  )}
               </Button>
            )}
         </div>
         <LogoutDialog />
      </header>
   );
};

export default ChatHeader;
