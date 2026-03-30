import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { calcOldPrice, formatPrice, toTitleCase } from "@/utils/format";
import { RatingStars } from "@/components/product/RatingStars";
import { useTranslation } from "@/hooks/useTranslation";

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) {
  const { t } = useTranslation();
  const oldPrice = calcOldPrice(product.price, product.discountPercentage);

  return (
    <article className="product-card">
      <button
        type="button"
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => onToggleWishlist(product)}
      >
        <Heart size={16} />
      </button>

      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-wrap">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="product-image"
          />
          <span className="discount-badge">
            -{Math.round(product.discountPercentage)}%
          </span>
        </div>

        <div className="product-content">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-meta">
            {product.brand || t("product.generic")} •{" "}
            {toTitleCase(product.category)}
          </p>

          <div className="product-pricing">
            <div className="price-row">
              <strong>{formatPrice(product.price)}</strong>
              <span>{formatPrice(oldPrice)}</span>
            </div>
            <RatingStars rating={product.rating} />
          </div>
        </div>
      </Link>

      <button
        type="button"
        className="btn btn-brand add-to-cart-btn"
        onClick={() => onAddToCart(product)}
      >
        <ShoppingCart size={15} /> {t("product.addToCart")}
      </button>
    </article>
  );
}
