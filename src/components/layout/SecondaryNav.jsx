import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { getCategories } from "@/api/products";
import { useTranslation } from "@/hooks/useTranslation";

const quickLinks = [
  { key: "nav.deals", slug: "groceries" },
  { key: "nav.electronics", slug: "smartphones" },
  { key: "nav.fashion", slug: "mens-shirts" },
  { key: "nav.home", slug: "furniture" },
  { key: "nav.beauty", slug: "beauty" },
];

export function SecondaryNav() {
  const { t } = useTranslation();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 900_000,
  });

  return (
    <div className="sub-nav">
      <div className="container sub-nav-row">
        <details className="category-dropdown">
          <summary>
            {t("nav.allCategories")} <ChevronDown size={14} />
          </summary>
          <div className="dropdown-panel">
            {categories.map((item) => (
              <Link key={item.slug} to={`/category/${item.slug}`}>
                {item.name}
              </Link>
            ))}
          </div>
        </details>

        <Link to="/products">{t("nav.allProducts")}</Link>
        <Link to="/products?sort=discount-desc">{t("nav.flashDeals")}</Link>
        {quickLinks.map((link) => (
          <Link key={link.slug} to={`/category/${link.slug}`}>
            {t(link.key)}
          </Link>
        ))}
      </div>
    </div>
  );
}
