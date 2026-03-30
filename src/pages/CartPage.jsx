import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/format";
import { selectCartSubtotal, useCartStore } from "@/store/cartStore";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { useTranslation } from "@/hooks/useTranslation";

export function CartPage() {
  const { t } = useTranslation();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <div className="cart-layout">
      <section>
        <h1 className="page-title">{t("cartPage.title")}</h1>
        {items.length === 0 ? (
          <div className="empty-box">
            {t("cartPage.empty")}{" "}
            <Link to="/products">{t("cartPage.browseProducts")}</Link>
          </div>
        ) : (
          <div className="cart-list">
            {items.map((item) => (
              <article key={item.id} className="cart-item">
                <img src={item.thumbnail} alt={item.title} loading="lazy" />
                <div>
                  <h3>{item.title}</h3>
                  <p className="muted">{item.brand || t("product.generic")}</p>
                  <strong>{formatPrice(item.price)}</strong>
                </div>
                <QuantitySelector
                  value={item.quantity}
                  min={1}
                  max={item.stock || 99}
                  onChange={(next) => updateQuantity(item.id, next)}
                />
                <strong>{formatPrice(item.price * item.quantity)}</strong>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  {t("cartPage.remove")}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <aside className="summary-card">
        <h2>{t("cartPage.summary")}</h2>
        <div className="summary-row">
          <span>{t("cartPage.subtotal")}</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className="summary-row">
          <span>{t("cartPage.shipping")}</span>
          <strong>{formatPrice(shipping)}</strong>
        </div>
        <div className="summary-row total">
          <span>{t("cartPage.total")}</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <input
          type="text"
          placeholder={t("cartPage.promoCode")}
          aria-label={t("cartPage.promoCode")}
        />
        <button type="button" className="btn btn-brand full">
          {t("cartPage.proceedCheckout")}
        </button>
      </aside>
    </div>
  );
}
