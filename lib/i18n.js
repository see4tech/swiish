const fs = require('fs');
const path = require('path');

// Cache loaded translations
const translations = {};

/**
 * Load translation files from public/locales/{lang}/translation.json
 * Files are cached after first load.
 */
function loadTranslations(lang) {
  if (translations[lang]) return translations[lang];

  const filePath = path.join(__dirname, '..', 'public', 'locales', lang, 'translation.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    translations[lang] = JSON.parse(data);
  } catch {
    // Fallback to English if requested language not found
    if (lang !== 'en') {
      return loadTranslations('en');
    }
    translations[lang] = {};
  }
  return translations[lang];
}

/**
 * Get a nested value from an object using a dot-separated key path.
 * e.g., getNestedValue(obj, 'email.invitation.subject')
 */
function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

/**
 * Translate a key with optional interpolation.
 *
 * @param {string} key - Dot-separated translation key (e.g., 'email.invitation.subject')
 * @param {string} [lang='en'] - Language code
 * @param {Object} [interpolations={}] - Key-value pairs for interpolation ({{key}} in strings)
 * @returns {string} Translated string, or the key itself as fallback
 */
function t(key, lang = 'en', interpolations = {}) {
  const supportedLangs = ['en', 'es'];
  const effectiveLang = supportedLangs.includes(lang) ? lang : 'en';

  let translation = getNestedValue(loadTranslations(effectiveLang), key);

  // Fallback to English if translation not found
  if (translation === null && effectiveLang !== 'en') {
    translation = getNestedValue(loadTranslations('en'), key);
  }

  // If still no translation found, return the key
  if (translation === null) {
    return key;
  }

  // Apply interpolations ({{variableName}} pattern, matching i18next format)
  if (typeof translation === 'string' && Object.keys(interpolations).length > 0) {
    Object.entries(interpolations).forEach(([k, v]) => {
      translation = translation.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
    });
  }

  return translation;
}

/**
 * Clear the translation cache (useful for testing or hot reload)
 */
function clearCache() {
  Object.keys(translations).forEach(key => delete translations[key]);
}

module.exports = { t, clearCache, loadTranslations };
