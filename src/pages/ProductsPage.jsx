import { getProducts } from "@/api/products";
import { ProductListingPage } from "@/pages/ProductListingPage";
import { useTranslation } from "@/hooks/useTranslation";

export function ProductsPage() {
  const { t } = useTranslation();

  return (
    <ProductListingPage
      title={t("nav.allProducts")}
      queryBuilder={(limit, skip) => ({
        queryKey: ["products", { limit, skip }],
        queryFn: () => getProducts(limit, skip),
        staleTime: 90_000,
      })}
    />
  );
}
