"use client";
import { TMessage, useMessages } from "@/lib/store/messages";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRef } from "react";

export function DeleteAlertMessage() {
   const { actionMessage, removeActionMessage, optimisticDeleteMessage } =
      useMessages(state => state);

   const handleDeleteMessage = async () => {
      if (!actionMessage) return;
      const supabase = createClient();
      const { error } = await supabase
         .from("messages")
         .delete()
         .eq("id", actionMessage.id);
      if (error) {
         toast.error(error.message);
         return;
      }
      removeActionMessage();
      optimisticDeleteMessage(actionMessage.id);
      toast.success("Successfully deleted");
   };

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <button className="hidden" id="trigger-delete"></button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
               <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  {actionMessage
                     ? actionMessage.users && actionMessage.users.id
                     : "Dont do that!"}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel
                  onClick={() => {
                     removeActionMessage();
                  }}
               >
                  Cancel
               </AlertDialogCancel>
               <AlertDialogAction onClick={handleDeleteMessage}>
                  Continue
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}

export function EditAlertMessage() {
   const { actionMessage, optimisticEditMessage, removeActionMessage } =
      useMessages(state => state);
   const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
   const handleEditMessage = async () => {
      const supabase = createClient();
      const text = ref.current.value.trim();
      if (text !== "") {
         optimisticEditMessage({
            ...actionMessage,
            text,
            is_edit: true,
         } as TMessage);
         const { error } = await supabase
            .from("messages")
            .update({ text, is_edit: true })
            .eq("id", actionMessage?.id!);
         if (error) {
            toast.error(error.message);
            return;
         }
         toast.success("Successfully edited");
      }
      removeActionMessage();
      document.getElementById("trigger-edit")?.click();
   };
   return (
      <Dialog>
         <DialogTrigger asChild>
            <button id="trigger-edit"></button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px] space-y-3">
            <DialogHeader>
               <DialogTitle>Edit Message</DialogTitle>
            </DialogHeader>
            <div className="w-full">
               <Input
                  ref={ref}
                  id="message"
                  defaultValue={actionMessage?.text || ""}
                  className="col-span-3"
               />
            </div>
            <DialogFooter>
               <Button type="submit" onClick={handleEditMessage}>
                  Save changes
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
