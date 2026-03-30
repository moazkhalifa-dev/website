import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation();

  if (totalPages < 1) return null;

  const pageNumbers = useMemo(() => {
    const pages = [];
    const windowSize = 5;
    const halfWindow = Math.floor(windowSize / 2);
    const start = Math.max(
      1,
      Math.min(currentPage - halfWindow, totalPages - windowSize + 1),
    );
    const end = Math.min(totalPages, start + windowSize - 1);

    for (let page = start; page <= end; page += 1) pages.push(page);
    return pages;
  }, [currentPage, totalPages]);

  const showFirst = pageNumbers[0] > 1;
  const showLast = pageNumbers[pageNumbers.length - 1] < totalPages;

  return (
    <nav className="pagination" aria-label={t("pagination.ariaLabel")}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {t("pagination.prev")}
      </button>

      {showFirst ? (
        <>
          <button type="button" onClick={() => onPageChange(1)}>
            1
          </button>
          {pageNumbers[0] > 2 ? <span className="page-dots">…</span> : null}
        </>
      ) : null}

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className={page === currentPage ? "active" : ""}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {showLast ? (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 ? (
            <span className="page-dots">…</span>
          ) : null}
          <button type="button" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      ) : null}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {t("pagination.next")}
      </button>

      <span className="page-summary" aria-live="polite">
        {t("pagination.pageOf", { page: currentPage, total: totalPages })}
      </span>
    </nav>
  );
}
