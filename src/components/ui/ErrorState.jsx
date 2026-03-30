import { useTranslation } from "@/hooks/useTranslation";

export function ErrorState({ title, message, onRetry }) {
  const { t } = useTranslation();
  const resolvedTitle = title || t("error.title");
  const resolvedMessage = message || t("error.message");

  return (
    <div className="error-state">
      <h3>{resolvedTitle}</h3>
      <p>{resolvedMessage}</p>
      {onRetry ? (
        <button type="button" className="btn btn-dark" onClick={onRetry}>
          {t("error.retry")}
        </button>
      ) : null}
    </div>
  );
}
