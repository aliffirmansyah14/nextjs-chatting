import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

const wait = async (time: number = 1000) => {
   return await new Promise(resolve => setTimeout(resolve, time));
};

const getFromAndTo = (page: number, itemPerPage: number) => {
   let from = page * itemPerPage;
   let to = from + itemPerPage;
   if (page > 0) {
      from += 1;
   }
   return { from, to };
};

export { cn, wait, getFromAndTo };
