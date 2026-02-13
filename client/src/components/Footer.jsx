import { useLanguage } from '../LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 text-center">
      <p className="text-sm text-gray-400">
        {t('footerText')}
      </p>
    </footer>
  );
}
