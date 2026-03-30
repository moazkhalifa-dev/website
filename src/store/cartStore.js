import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + quantity, item.stock),
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                brand: product.brand,
                stock: product.stock,
                quantity: Math.min(quantity, product.stock || 99),
              },
            ],
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;
            return {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.stock || 99)),
            };
          }),
        }));
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "store-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectCartCount = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
