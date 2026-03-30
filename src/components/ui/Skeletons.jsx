export function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-line" />
    </div>
  );
}

export function ProductsGridSkeleton({ count = 12 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ChipsSkeleton({ count = 8 }) {
  return (
    <div className="chips-row">
      {Array.from({ length: count }).map((_, idx) => (
        <span key={idx} className="skeleton chip-skeleton" />
      ))}
    </div>
  );
}
