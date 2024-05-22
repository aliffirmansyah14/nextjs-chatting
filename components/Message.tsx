"use client";
import { TMessage, useMessages } from "@/lib/store/messages";
import Image from "next/image";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { User } from "@supabase/supabase-js";

export default function Message({
   message,
   user,
}: {
   message: TMessage;
   user: User | null;
}) {
   return (
      <div className="flex gap-2">
         <div>
            <Image
               src={message.users?.avatar_url || "/placeholder-profile.png"}
               alt="profile image"
               height={40}
               width={40}
               className="rounded-full ring-2 size-10"
            />
         </div>
         <div className="flex-1  flex justify-between">
            <div className="space-y-[.5] flex-1">
               <div className="flex items-center gap-1 justify-between">
                  <div className="flex items-center gap-1">
                     <h1 className="hidden sm:block font-bold">
                        {message.users?.display_name}
                     </h1>
                     <h1 className="block sm:hidden font-bold">
                        {message.users?.display_name.slice(0, 5)}...
                     </h1>
                     <h1 className="text-sm text-gray-400">
                        {new Date(message.created_at).toDateString()}
                     </h1>
                     {message.is_edit && (
                        <h1 className="text-sm text-gray-400"> edited</h1>
                     )}
                  </div>

                  {user?.id === message.users?.id ? (
                     <MessageMenu message={message} />
                  ) : null}
               </div>
               <p className="text-gray-300">{message.text}</p>
            </div>
         </div>
      </div>
   );
}

function MessageMenu({ message }: { message: TMessage }) {
   const { setActionMessage } = useMessages();
   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <MoreHorizontal />
         </DropdownMenuTrigger>
         <DropdownMenuContent className="mr-5">
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
               onClick={() => {
                  setActionMessage(message);
                  document.getElementById("trigger-edit")?.click();
               }}
            >
               Edit
            </DropdownMenuItem>
            <DropdownMenuItem
               onClick={() => {
                  setActionMessage(message);
                  document.getElementById("trigger-delete")?.click();
               }}
            >
               Delete
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
