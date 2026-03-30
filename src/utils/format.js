export function formatPrice(value) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 2,
  }).format(value);
}

export function calcOldPrice(price, discountPercentage) {
  if (!discountPercentage || discountPercentage <= 0) return price;
  return price / (1 - discountPercentage / 100);
}

export function toTitleCase(value) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
