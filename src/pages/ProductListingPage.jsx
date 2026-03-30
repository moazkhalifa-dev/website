import { useEffect, useMemo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { FiltersPanel } from "@/components/product/FiltersPanel";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { ProductsGridSkeleton } from "@/components/ui/Skeletons";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/components/ui/ToastProvider";
import { useTranslation } from "@/hooks/useTranslation";
import {
  activeFilterChips,
  filterProducts,
  getBrands,
  sortProducts,
} from "@/utils/productHelpers";

const CLIENT_PAGE_SIZE = 10;
const API_FETCH_LIMIT = 200;
const API_FETCH_SKIP = 0;
const PAGE_TRANSITION_MS = 180;

export function ProductListingPage({ title, queryBuilder, emptyText }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawPage = Number(searchParams.get("page") || "1");
  const initialPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const [filters, setFilters] = useState({
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    brands: [],
    discountThreshold: undefined,
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const hasMounted = useRef(false);

  const query = useQuery({
    ...queryBuilder(API_FETCH_LIMIT, API_FETCH_SKIP),
    placeholderData: keepPreviousData,
  });

  const products = query.data?.products || [];
  const filteredSorted = useMemo(
    () => sortProducts(filterProducts(products, filters), sortBy),
    [products, filters, sortBy],
  );
  const brands = useMemo(() => getBrands(products), [products]);
  const chips = useMemo(() => activeFilterChips(filters), [filters]);

  const filteredCount = filteredSorted.length;
  const totalAvailable = query.data?.total || filteredCount;
  const totalPages = Math.max(1, Math.ceil(filteredCount / CLIENT_PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * CLIENT_PAGE_SIZE;
    return filteredSorted.slice(start, start + CLIENT_PAGE_SIZE);
  }, [currentPage, filteredSorted]);

  const syncSearchParams = (nextPage, nextSort = sortBy) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set("page", String(nextPage));
      if (nextSort === "newest") updated.delete("sort");
      else updated.set("sort", nextSort);
      return updated;
    });
  };

  useEffect(() => {
    const pageFromUrl =
      Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [currentPage, rawPage]);

  useEffect(() => {
    if (currentPage <= totalPages) return;

    setCurrentPage(totalPages);
    syncSearchParams(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setIsPageTransitioning(true);
    const timeoutId = window.setTimeout(
      () => setIsPageTransitioning(false),
      PAGE_TRANSITION_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [currentPage]);

  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const { pushToast } = useToast();
  const resolvedEmptyText = emptyText || t("listing.noProductsFound");

  const onPageChange = (nextPage) => {
    const safePage = Math.min(Math.max(1, nextPage), totalPages);
    if (safePage === currentPage) return;

    setCurrentPage(safePage);
    syncSearchParams(safePage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => {
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      brands: [],
      discountThreshold: undefined,
    });
  };

  const removeChip = (chipKey) => {
    if (chipKey === "minPrice")
      return setFilters((s) => ({ ...s, minPrice: undefined }));
    if (chipKey === "maxPrice")
      return setFilters((s) => ({ ...s, maxPrice: undefined }));
    if (chipKey === "minRating")
      return setFilters((s) => ({ ...s, minRating: undefined }));
    if (chipKey === "discount")
      return setFilters((s) => ({ ...s, discountThreshold: undefined }));
    if (chipKey.startsWith("brand-")) {
      const target = chipKey.replace("brand-", "");
      return setFilters((s) => ({
        ...s,
        brands: s.brands.filter((b) => b !== target),
      }));
    }
    return undefined;
  };

  return (
    <div className="listing-layout">
      <div className={`mobile-drawer ${mobileFiltersOpen ? "open" : ""}`}>
        <div className="mobile-drawer-panel">
          <FiltersPanel
            filters={filters}
            brands={brands}
            onChange={setFilters}
            onClear={clearAll}
            onCloseMobile={() => setMobileFiltersOpen(false)}
          />
        </div>
        <button
          className="mobile-drawer-overlay"
          type="button"
          onClick={() => setMobileFiltersOpen(false)}
          aria-label="Close filters overlay"
        />
      </div>

      <aside className="desktop-sidebar">
        <FiltersPanel
          filters={filters}
          brands={brands}
          onChange={setFilters}
          onClear={clearAll}
        />
      </aside>

      <section>
        <div className="section-head top-head">
          <h1>{title}</h1>
          <div className="top-controls">
            <button
              type="button"
              className="btn"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} /> {t("listing.filtersButton")}
            </button>
            <select
              value={sortBy}
              onChange={(e) => {
                const next = e.target.value;
                setSortBy(next);
                setCurrentPage(1);
                syncSearchParams(1, next);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label={t("listing.sortProducts")}
            >
              <option value="newest">{t("sort.newest")}</option>
              <option value="price-asc">{t("sort.priceAsc")}</option>
              <option value="price-desc">{t("sort.priceDesc")}</option>
              <option value="rating-desc">{t("sort.ratingDesc")}</option>
              <option value="discount-desc">{t("sort.discountDesc")}</option>
            </select>
          </div>
        </div>

        <div className="results-count">
          {totalAvailable > filteredCount
            ? t("listing.resultsOf", {
                count: filteredCount,
                total: totalAvailable,
              })
            : t("listing.results", { count: filteredCount })}
        </div>

        {chips.length > 0 ? (
          <div className="chips-row active-filters">
            {chips.map((chip) => (
              <button
                key={chip.key}
                className="chip"
                type="button"
                onClick={() => removeChip(chip.key)}
              >
                {chip.label} ×
              </button>
            ))}
            <button type="button" className="link-btn" onClick={clearAll}>
              {t("filters.clearAll")}
            </button>
          </div>
        ) : null}

        {query.isLoading ? <ProductsGridSkeleton count={12} /> : null}
        {query.isError ? <ErrorState onRetry={query.refetch} /> : null}

        {!query.isLoading && !query.isError ? (
          paginatedProducts.length > 0 ? (
            <div
              className={`products-grid ${isPageTransitioning ? "is-page-transitioning" : ""}`}
              aria-busy={isPageTransitioning}
            >
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={(item) => {
                    const added = toggleWishlist(item);
                    pushToast(
                      added
                        ? t("toast.addedToWishlist")
                        : t("toast.removedFromWishlist"),
                      "info",
                    );
                  }}
                  onAddToCart={(item) => {
                    addToCart(item, 1);
                    pushToast(t("toast.addedToCart"), "success");
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="empty-box">{resolvedEmptyText}</div>
          )
        ) : null}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </section>
    </div>
  );
}
