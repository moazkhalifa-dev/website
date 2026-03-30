import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-row">
        <p>© {new Date().getFullYear()} NOONIX</p>
        <p>{t("footer.poweredBy")}</p>
      </div>
    </footer>
  );
}
