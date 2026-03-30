import { fetchJson } from "@/api/client";

export function getProducts(limit, skip) {
  return fetchJson(`/products?limit=${limit}&skip=${skip}`);
}

export function getProductById(id) {
  return fetchJson(`/products/${id}`);
}

export function searchProducts(query, limit, skip) {
  return fetchJson(
    `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`,
  );
}

export async function getCategories() {
  const raw = await fetchJson("/products/categories");
  return raw.map((item) => {
    if (typeof item === "string") {
      return {
        slug: item,
        name: item.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    }

    return {
      slug: item.slug,
      name: item.name,
      url: item.url,
    };
  });
}

export function getProductsByCategory(category, limit, skip) {
  return fetchJson(
    `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`,
  );
}
