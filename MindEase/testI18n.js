// Use named import instead of default
import { I18n } from "i18n-js";
import translations from "./languages/index.js";

const i18n = new I18n(translations); // ✅ create instance

i18n.fallbacks = true;
i18n.defaultLocale = "en";
i18n.locale = "en"; // hardcode for Node test

console.log("Test:", i18n.t("welcome"));
