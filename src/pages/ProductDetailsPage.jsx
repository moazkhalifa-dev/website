import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, getProductsByCategory } from "@/api/products";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProductsGridSkeleton } from "@/components/ui/Skeletons";
import { RatingStars } from "@/components/product/RatingStars";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { ProductCard } from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/components/ui/ToastProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { calcOldPrice, formatPrice, toTitleCase } from "@/utils/format";

export function ProductDetailsPage() {
  const { t } = useTranslation();
  const { id = "" } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const { pushToast } = useToast();

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: Number.isFinite(productId),
    staleTime: 120_000,
  });

  const product = productQuery.data;

  const relatedQuery = useQuery({
    queryKey: ["related", product?.category],
    queryFn: () => getProductsByCategory(product.category, 12, 0),
    enabled: Boolean(product?.category),
    staleTime: 120_000,
  });

  const related = useMemo(() => {
    const list = relatedQuery.data?.products || [];
    return list.filter((item) => item.id !== productId).slice(0, 8);
  }, [relatedQuery.data, productId]);

  if (productQuery.isLoading) return <ProductsGridSkeleton count={1} />;
  if (productQuery.isError || !product)
    return <ErrorState onRetry={productQuery.refetch} />;

  const oldPrice = calcOldPrice(product.price, product.discountPercentage);
  const galleryImage =
    selectedImage || product.thumbnail || product.images?.[0];

  return (
    <div className="stack-lg">
      <section className="product-detail">
        <div className="gallery">
          <div className="main-image-wrap">
            <img
              src={galleryImage}
              alt={product.title}
              className="main-image"
              loading="lazy"
            />
          </div>
          <div className="thumb-row">
            {(product.images || []).slice(0, 6).map((img) => (
              <button
                key={img}
                type="button"
                className={img === galleryImage ? "active" : ""}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={product.title} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-info">
          <h1>{product.title}</h1>
          <p className="muted">
            {product.brand || t("product.generic")} •{" "}
            {toTitleCase(product.category)}
          </p>
          <RatingStars rating={product.rating} />

          <div className="price-group">
            <strong>{formatPrice(product.price)}</strong>
            <span>{formatPrice(oldPrice)}</span>
            <em>-{Math.round(product.discountPercentage)}%</em>
          </div>

          <p className={`stock ${product.stock > 0 ? "in" : "out"}`}>
            {product.stock > 0
              ? t("product.inStock", { count: product.stock })
              : t("product.outOfStock")}
          </p>

          <p className="description">{product.description}</p>

          <QuantitySelector
            value={quantity}
            min={1}
            max={product.stock || 1}
            onChange={setQuantity}
          />

          <div className="actions-row">
            <button
              type="button"
              className="btn btn-brand"
              onClick={() => {
                addToCart(product, quantity);
                pushToast(t("toast.addedToCart"), "success");
              }}
              disabled={product.stock <= 0}
            >
              {t("product.addToCart")}
            </button>

            <button
              type="button"
              className="btn btn-dark"
              onClick={() => {
                addToCart(product, quantity);
                navigate("/cart");
              }}
              disabled={product.stock <= 0}
            >
              {t("product.buyNow")}
            </button>

            <button
              type="button"
              className={`btn ${isWishlisted(product.id) ? "btn-dark" : ""}`}
              onClick={() => {
                const added = toggleWishlist(product);
                pushToast(
                  added
                    ? t("toast.addedToWishlist")
                    : t("toast.removedFromWishlist"),
                  "info",
                );
              }}
              aria-label={t("product.toggleWishlist")}
            >
              <Heart size={16} /> {t("product.wishlist")}
            </button>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>{t("product.relatedProducts")}</h2>
          <Link to={`/category/${product.category}`}>{t("nav.viewAll")}</Link>
        </div>

        {relatedQuery.isLoading ? <ProductsGridSkeleton count={4} /> : null}
        {relatedQuery.isError ? (
          <ErrorState onRetry={relatedQuery.refetch} />
        ) : null}

        {!relatedQuery.isLoading && !relatedQuery.isError ? (
          <div className="products-grid">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isWishlisted={isWishlisted(item.id)}
                onToggleWishlist={(selected) => {
                  const added = toggleWishlist(selected);
                  pushToast(
                    added
                      ? t("toast.addedToWishlist")
                      : t("toast.removedFromWishlist"),
                    "info",
                  );
                }}
                onAddToCart={(selected) => {
                  addToCart(selected, 1);
                  pushToast(t("toast.addedToCart"), "success");
                }}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
