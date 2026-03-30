export function sortProducts(products, sortBy) {
  const list = [...products];

  switch (sortBy) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return list.sort((a, b) => b.rating - a.rating);
    case "discount-desc":
      return list.sort((a, b) => b.discountPercentage - a.discountPercentage);
    case "newest":
    default:
      return list.sort((a, b) => b.id - a.id);
  }
}

export function filterProducts(products, filters) {
  return products.filter((product) => {
    if (
      typeof filters.minPrice === "number" &&
      product.price < filters.minPrice
    )
      return false;
    if (
      typeof filters.maxPrice === "number" &&
      product.price > filters.maxPrice
    )
      return false;
    if (
      typeof filters.minRating === "number" &&
      product.rating < filters.minRating
    )
      return false;
    if (
      filters.discountThreshold &&
      product.discountPercentage < filters.discountThreshold
    )
      return false;
    if (filters.brands.length > 0) {
      const brand = product.brand || "Generic";
      if (!filters.brands.includes(brand)) return false;
    }

    return true;
  });
}

export function getBrands(products) {
  return [...new Set(products.map((p) => p.brand || "Generic"))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function activeFilterChips(filters) {
  const chips = [];
  if (typeof filters.minPrice === "number")
    chips.push({ key: "minPrice", label: `Min ${filters.minPrice}` });
  if (typeof filters.maxPrice === "number")
    chips.push({ key: "maxPrice", label: `Max ${filters.maxPrice}` });
  if (typeof filters.minRating === "number")
    chips.push({ key: "minRating", label: `Rating ${filters.minRating}+` });
  if (filters.discountThreshold)
    chips.push({
      key: "discount",
      label: `${filters.discountThreshold}%+ off`,
    });
  filters.brands.forEach((brand) =>
    chips.push({ key: `brand-${brand}`, label: brand }),
  );
  return chips;
}
