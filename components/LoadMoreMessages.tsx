"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { getFromAndTo } from "@/lib/utils";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { useMessages } from "@/lib/store/messages";
import { toast } from "sonner";
import { useState } from "react";
import clsx from "clsx";

export default function LoadMoreMessages() {
   const { page, hasMore, setMessages } = useMessages(state => state);
   const [isLoading, setIsloading] = useState<boolean>(false);

   const fetchMore = async () => {
      const supabase = createClient();
      const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);
      setIsloading(true);
      const { data, error } = await supabase
         .from("messages")
         .select("*,users(*)")
         .range(from, to)
         .order("created_at", {
            ascending: false,
         });
      setIsloading(false);
      if (error) {
         toast.error(error.message);
      } else {
         setMessages(data.reverse());
      }
   };

   if (!hasMore) return <></>;

   return (
      <Button
         variant={"outline"}
         className={clsx("w-full", {
            "cursor-pointer": !isLoading,
            "cursor-not-allowed": isLoading,
         })}
         onClick={fetchMore}
         disabled={isLoading}
      >
         {isLoading ? "....." : "Load more"}
      </Button>
   );
}
