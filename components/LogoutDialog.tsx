import { useMessages } from "@/lib/store/messages";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useUser } from "@/lib/store/user";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { wait } from "@/lib/utils";

const LogoutDialog = () => {
   const router = useRouter();
   const supabase = createClient();
   const [loading, setIsloading] = useState<boolean>(false);
   const handleLogOut = async () => {
      setIsloading(true);
      await wait(1000);
      await supabase.auth.signOut();
      useMessages.setState({ messages: [] });
      useUser.setState({ user: null });
      setIsloading(false);
      router.refresh();
   };
   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <button className="hidden" id="trigger-logout"></button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <AlertDialogAction disabled={loading} onClick={handleLogOut}>
                  {loading ? "Logging out..." : "Continue"}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};

export default LogoutDialog;
