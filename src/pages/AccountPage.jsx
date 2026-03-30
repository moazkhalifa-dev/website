import { useTranslation } from "@/hooks/useTranslation";

export function AccountPage() {
  const { t } = useTranslation();

  return (
    <div className="account-grid">
      <section className="card">
        <h1 className="page-title">{t("account.title")}</h1>
        <p className="muted">{t("account.subtitle")}</p>
        <div className="profile-row">
          <span>{t("account.name")}</span>
          <strong>Alex Shopper</strong>
        </div>
        <div className="profile-row">
          <span>{t("account.email")}</span>
          <strong>alex@example.com</strong>
        </div>
        <div className="profile-row">
          <span>{t("account.phone")}</span>
          <strong>+971 50 000 0000</strong>
        </div>
      </section>

      <section className="card">
        <h2>{t("account.recentOrders")}</h2>
        <div className="order-placeholder">
          Order #3021 · {t("account.delivered")}
        </div>
        <div className="order-placeholder">
          Order #2964 · {t("account.inTransit")}
        </div>
        <div className="order-placeholder">
          Order #2910 · {t("account.cancelled")}
        </div>
      </section>
    </div>
  );
}
