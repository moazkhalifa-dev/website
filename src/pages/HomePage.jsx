import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getCategories, getProducts } from "@/api/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ChipsSkeleton, ProductsGridSkeleton } from "@/components/ui/Skeletons";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { useTranslation } from "@/hooks/useTranslation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/components/ui/ToastProvider";

const HOME_SECTION_PAGE_SIZE = 10;

export function HomePage() {
  const { t } = useTranslation();
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const { pushToast } = useToast();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 900_000,
  });
  const productsQuery = useQuery({
    queryKey: ["home-products"],
    queryFn: () => getProducts(60, 0),
    staleTime: 120_000,
  });

  const sections = useMemo(() => {
    const items = productsQuery.data?.products || [];
    return {
      trending: items.slice(0, 12),
      deals: [...items]
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 12),
      rated: [...items].sort((a, b) => b.rating - a.rating).slice(0, 12),
    };
  }, [productsQuery.data]);

  const onAddToCart = (product) => {
    addToCart(product, 1);
    pushToast(t("toast.addedToCart"), "success");
  };

  const onToggleWishlist = (product) => {
    const added = toggleWishlist(product);
    pushToast(
      added ? t("toast.addedToWishlist") : t("toast.removedFromWishlist"),
      "info",
    );
  };

  return (
    <div className="stack-lg">
      <section className="hero">
        <div>
          <h1>{t("home.heroTitle")}</h1>
          <p>{t("home.heroSubtitle")}</p>
          <Link to="/products" className="btn btn-dark">
            {t("home.shopNow")}
          </Link>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>{t("home.shopByCategory")}</h2>
        </div>
        {categoriesQuery.isLoading ? (
          <ChipsSkeleton count={10} />
        ) : categoriesQuery.isError ? (
          <ErrorState onRetry={categoriesQuery.refetch} />
        ) : (
          <div className="chips-row">
            {categoriesQuery.data?.map((item) => (
              <Link
                key={item.slug}
                to={`/category/${item.slug}`}
                className="chip"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      <ProductSection
        title={t("home.trending")}
        to="/products"
        products={sections.trending}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
        onRetry={productsQuery.refetch}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        isWishlisted={isWishlisted}
      />

      <ProductSection
        title={t("home.bestDeals")}
        to="/products?sort=discount-desc"
        products={sections.deals}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
        onRetry={productsQuery.refetch}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        isWishlisted={isWishlisted}
      />

      <ProductSection
        title={t("home.topRated")}
        to="/products?sort=rating-desc"
        products={sections.rated}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
        onRetry={productsQuery.refetch}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        isWishlisted={isWishlisted}
      />
    </div>
  );
}

function ProductSection({
  title,
  to,
  products,
  isLoading,
  isError,
  onRetry,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef(null);

  const totalPages = Math.max(
    1,
    Math.ceil((products?.length || 0) / HOME_SECTION_PAGE_SIZE),
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * HOME_SECTION_PAGE_SIZE;
    return (products || []).slice(start, start + HOME_SECTION_PAGE_SIZE);
  }, [currentPage, products]);

  useEffect(() => {
    if (currentPage <= totalPages) return;
    setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const onPageChange = (nextPage) => {
    const safePage = Math.min(Math.max(1, nextPage), totalPages);
    if (safePage === currentPage) return;

    setCurrentPage(safePage);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="section-block" ref={sectionRef}>
      <div className="section-head">
        <h2>{title}</h2>
        <Link to={to}>{t("nav.viewAll")}</Link>
      </div>

      {isLoading ? <ProductsGridSkeleton count={10} /> : null}
      {isError ? <ErrorState onRetry={onRetry} /> : null}
      {!isLoading && !isError ? (
        <div className="products-grid">
          {paginatedProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isWishlisted={isWishlisted(item.id)}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </section>
  );
}
