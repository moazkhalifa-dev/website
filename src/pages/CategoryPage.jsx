import { useParams } from "react-router-dom";
import { getProductsByCategory } from "@/api/products";
import { ProductListingPage } from "@/pages/ProductListingPage";
import { toTitleCase } from "@/utils/format";

export function CategoryPage() {
  const { slug = "" } = useParams();

  return (
    <ProductListingPage
      title={toTitleCase(slug)}
      queryBuilder={(limit, skip) => ({
        queryKey: ["category-products", { slug, limit, skip }],
        queryFn: () => getProductsByCategory(slug, limit, skip),
        staleTime: 90_000,
        enabled: Boolean(slug),
      })}
    />
  );
}
