import { I18n } from "i18n-js";   // ✅ named import
import * as Localization from "expo-localization";
import translations from "./languages";

const i18n = new I18n(translations);   // ✅ instantiate

i18n.fallbacks = true;
i18n.defaultLocale = "en";
i18n.locale = Localization.locale?.split("-")[0] || "en";

export default i18n;   // ✅ export configured instance
