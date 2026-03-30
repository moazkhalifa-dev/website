import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== product.id),
          }));
          return false;
        }

        set((state) => ({ items: [product, ...state.items] }));
        return true;
      },
      removeFromWishlist: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      isWishlisted: (id) => get().items.some((item) => item.id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "store-wishlist-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectWishlistCount = (state) => state.items.length;
