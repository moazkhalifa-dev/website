import { useSearchParams } from "react-router-dom";
import { searchProducts } from "@/api/products";
import { ProductListingPage } from "@/pages/ProductListingPage";
import { useTranslation } from "@/hooks/useTranslation";

export function SearchPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  return (
    <ProductListingPage
      title={q ? t("search.resultsFor", { query: q }) : t("search.title")}
      queryBuilder={(limit, skip) => ({
        queryKey: ["search-products", { q, limit, skip }],
        queryFn: () => searchProducts(q, limit, skip),
        staleTime: 60_000,
        enabled: Boolean(q),
      })}
      emptyText={q ? t("search.empty") : t("search.prompt")}
    />
  );
}
