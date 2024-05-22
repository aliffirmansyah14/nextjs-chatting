import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant";

export type TMessage = {
   created_at: string;
   id: string;
   is_edit: boolean;
   send_by: string;
   text: string;
   users: {
      avatar_url: string;
      created_at: string;
      display_name: string;
      id: string;
   } | null;
};

interface MessageState {
   page: number;
   hasMore: boolean;
   messages: TMessage[];
   setMessages: (newMessages: TMessage[]) => void;
   actionMessage: TMessage | null;
   optimisticId: string[];
   optimisticAddMessage: (newMessage: TMessage) => void;
   setActionMessage: (message: TMessage) => void;
   setOptimisticId: (id: string) => void;
   removeActionMessage: () => void;
   optimisticDeleteMessage: (messageId: string) => void;
   optimisticEditMessage: (message: TMessage) => void;
}

export const useMessages = create<MessageState>()(set => ({
   page: 1,
   hasMore: true,
   messages: [],
   setMessages: (newMessages: TMessage[]) =>
      set(state => ({
         messages: [...newMessages, ...state.messages],
         page: state.page + 1,
         hasMore: newMessages.length >= LIMIT_MESSAGE,
      })),
   actionMessage: null,
   optimisticId: [],
   optimisticAddMessage: newMessage =>
      set(state => ({ messages: [...state.messages, newMessage] })),
   setOptimisticId: (id: string) =>
      set(state => ({ optimisticId: [...state.optimisticId, id] })),
   setActionMessage: (message: TMessage) => set({ actionMessage: message }),
   removeActionMessage: () => set({ actionMessage: null }),
   optimisticDeleteMessage: (messageId: string) =>
      set(state => {
         return {
            messages: state.messages.filter(
               message => message.id !== messageId
            ),
         };
      }),
   optimisticEditMessage: (UpdateMessage: TMessage) =>
      set(state => {
         return {
            messages: state.messages.filter(message => {
               if (message.id == UpdateMessage.id) {
                  message.text = UpdateMessage.text;
                  message.is_edit = UpdateMessage.is_edit;
               }
               return message;
            }),
         };
      }),
}));
