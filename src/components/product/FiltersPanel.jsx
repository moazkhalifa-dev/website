import { X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function FiltersPanel({
  filters,
  brands,
  onChange,
  onClear,
  onCloseMobile,
}) {
  const { t } = useTranslation();

  const toggleBrand = (brand) => {
    const exists = filters.brands.includes(brand);
    const nextBrands = exists
      ? filters.brands.filter((item) => item !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: nextBrands });
  };

  return (
    <aside className="filters-panel">
      <div className="panel-head">
        <h3>{t("filters.title")}</h3>
        <div>
          <button type="button" className="link-btn" onClick={onClear}>
            {t("filters.clearAll")}
          </button>
          {onCloseMobile ? (
            <button
              type="button"
              className="icon-btn"
              onClick={onCloseMobile}
              aria-label={t("filters.closeFilters")}
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="filter-block">
        <h4>{t("filters.priceRange")}</h4>
        <div className="inline-fields">
          <input
            type="number"
            min={0}
            placeholder={t("filters.min")}
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <input
            type="number"
            min={0}
            placeholder={t("filters.max")}
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="filter-block">
        <h4>{t("filters.minimumRating")}</h4>
        <select
          value={filters.minRating ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              minRating: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        >
          <option value="">{t("filters.any")}</option>
          <option value="4">4.0+</option>
          <option value="3">3.0+</option>
          <option value="2">2.0+</option>
        </select>
      </div>

      <div className="filter-block">
        <h4>{t("filters.brand")}</h4>
        <div className="brand-list">
          {brands.length === 0 ? (
            <p className="muted">{t("filters.noBrands")}</p>
          ) : null}
          {brands.map((brand) => (
            <label key={brand}>
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <h4>{t("filters.discount")}</h4>
        {[10, 20, 30].map((threshold) => (
          <label key={threshold}>
            <input
              type="radio"
              name="discount"
              checked={filters.discountThreshold === threshold}
              onChange={() =>
                onChange({ ...filters, discountThreshold: threshold })
              }
            />
            <span>{t("filters.andAbove", { value: threshold })}</span>
          </label>
        ))}
        <button
          type="button"
          className="link-btn"
          onClick={() => onChange({ ...filters, discountThreshold: undefined })}
        >
          {t("filters.resetDiscount")}
        </button>
      </div>
    </aside>
  );
}
