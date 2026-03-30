import { Link } from "react-router-dom";
import { ProductCard } from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/components/ui/ToastProvider";
import { useTranslation } from "@/hooks/useTranslation";

export function WishlistPage() {
  const { t } = useTranslation();
  const items = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const addToCart = useCartStore((s) => s.addToCart);
  const { pushToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="empty-box">
        {t("wishlistPage.empty")}{" "}
        <Link to="/products">{t("wishlistPage.exploreProducts")}</Link>
      </div>
    );
  }

  return (
    <section>
      <h1 className="page-title">{t("wishlistPage.title")}</h1>
      <div className="products-grid">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={isWishlisted(product.id)}
            onToggleWishlist={(item) => {
              removeFromWishlist(item.id);
              pushToast(t("toast.removedFromWishlist"), "info");
            }}
            onAddToCart={(item) => {
              addToCart(item, 1);
              removeFromWishlist(item.id);
              pushToast(t("toast.movedToCart"), "success");
            }}
          />
        ))}
      </div>
    </section>
  );
}
