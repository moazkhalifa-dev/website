import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export function TopPromoBar() {
  const { t } = useTranslation();

  return (
    <div className="top-promo" role="status" aria-live="polite">
      <div className="container top-promo-row">
        <p>{t("promo.message")}</p>
        <div className="top-promo-links">
          <Link to="/products?sort=discount-desc">{t("promo.todayDeals")}</Link>
          <Link to="/account">{t("promo.help")}</Link>
        </div>
      </div>
    </div>
  );
}
