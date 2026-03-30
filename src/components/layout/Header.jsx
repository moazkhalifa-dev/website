import {
  Globe,
  Heart,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { searchProducts } from "@/api/products";
import { useTranslation } from "@/hooks/useTranslation";
import { selectCartCount, useCartStore } from "@/store/cartStore";
import { selectWishlistCount, useWishlistStore } from "@/store/wishlistStore";
import { useDebouncedValue } from "@/utils/debounce";

export function Header() {
  const navigate = useNavigate();
  const cartCount = useCartStore(selectCartCount);
  const wishlistCount = useWishlistStore(selectWishlistCount);
  const { t, language, toggleLanguage } = useTranslation();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const debounced = useDebouncedValue(query, 300);

  const { data } = useQuery({
    queryKey: ["search-suggestions", debounced],
    queryFn: () => searchProducts(debounced, 5, 0),
    enabled: debounced.trim().length > 1,
    staleTime: 60_000,
  });

  const suggestions = useMemo(() => data?.products || [], [data]);

  const submit = (value) => {
    const text = value.trim();
    if (!text) return;
    navigate(`/search?q=${encodeURIComponent(text)}`);
    setFocused(false);
  };

  return (
    <header className="header sticky">
      <div className="container header-main">
        <button
          type="button"
          className="language-toggle"
          onClick={toggleLanguage}
          aria-label={t("header.toggleLanguage")}
        >
          <Globe size={15} /> {language.toUpperCase()}
        </button>

        <button
          type="button"
          className="location-chip"
          aria-label={t("header.selectLocation")}
        >
          <MapPin size={16} /> {t("header.deliverToCairo")}
        </button>

        <Link to="/" className="logo">
          NOONIX
        </Link>

        <div className="search-wrap">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit(query);
            }}
            placeholder={t("header.searchPlaceholder")}
            aria-label={t("header.searchProducts")}
          />
          <button
            type="button"
            className="btn btn-brand"
            onClick={() => submit(query)}
          >
            {t("header.search")}
          </button>

          {focused && suggestions.length > 0 ? (
            <div className="suggestions" role="listbox">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img src={item.thumbnail} alt={item.title} loading="lazy" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <nav className="quick-actions" aria-label={t("header.headerActions")}>
          <ActionLink
            to="/account"
            icon={<User size={18} />}
            label={t("header.account")}
          />
          <ActionLink
            to="/account"
            icon={<Package size={18} />}
            label={t("header.orders")}
          />
          <ActionLink
            to="/wishlist"
            icon={<Heart size={18} />}
            label={t("header.wishlist")}
            badge={wishlistCount}
          />
          <ActionLink
            to="/cart"
            icon={<ShoppingCart size={18} />}
            label={t("header.cart")}
            badge={cartCount}
          />
        </nav>
      </div>
    </header>
  );
}

function ActionLink({ to, icon, label, badge = 0 }) {
  return (
    <Link to={to} className="action-link" aria-label={label}>
      {icon}
      <span>{label}</span>
      {badge > 0 ? <em>{badge}</em> : null}
    </Link>
  );
}
