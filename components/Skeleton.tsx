export const SkeletonMessages = ({ size = 5 }: { size: number }) => {
   return (
      <div className="flex-1 flex flex-col p-5 md:p-3 h-full overflow-y-hidden">
         <div className="flex-1"></div>
         <div className="space-y-5 md:space-y-7">
            {[...new Array(size).fill(0)].map((_, idx) => (
               <SkeletonMessage key={idx} />
            ))}
         </div>
      </div>
   );
};

export const SkeletonMessage = () => {
   return (
      <div className="flex gap-2 animate-pulse">
         <div>
            <div className=" size-10 rounded-full bg-secondary" />
         </div>
         <div className="flex-1 flex justify-between">
            <div className="space-y-2 flex-1">
               <div className="flex items-center gap-1">
                  <div className="h-3 w-16 bg-secondary rounded"></div>
                  <div className="h-3 w-12 bg-secondary rounded"></div>
               </div>
               <p className="w-[95%] h-4 bg-secondary rounded"></p>
            </div>
         </div>
      </div>
   );
};
