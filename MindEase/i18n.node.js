import I18n from "i18n-js";
import translations from "./languages/index.js"; // ✅ explicit index.js

I18n.translations = translations;
I18n.fallbacks = true;
I18n.defaultLocale = "en";
I18n.locale = "en"; // ✅ hardcode locale for Node test

export default I18n;
