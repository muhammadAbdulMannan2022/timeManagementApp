// fill-placeholder-translations.js
// Replace placeholder dotted values in locales/*.json with language-appropriate strings.
// Usage: node scripts/fill-placeholder-translations.js

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const localesDir = path.join(projectRoot, "locales");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

// Map of placeholder -> { localeId: translation }
const mapping = {
  "calendar.error": {
    ar: "خطأ في التقويم",
    de: "Kalenderfehler",
    en: "Calendar error",
    "en-ca": "Calendar error",
    es: "Error del calendario",
    "es-mx": "Error del calendario",
    fr: "Erreur du calendrier",
    hi: "कैलेंडर त्रुटि",
    it: "Errore del calendario",
    ja: "カレンダーエラー",
    ko: "캘린더 오류",
    "pt-br": "Erro no calendário",
    ru: "Ошибка календаря",
    th: "ข้อผิดพลาดปฏิทิน",
    vi: "Lỗi lịch",
    "zh-cn": "日历错误",
    "zh-tw": "行事曆錯誤",
  },
  "calendar.loadingData": {
    ar: "جارٍ تحميل البيانات...",
    de: "Daten werden geladen...",
    en: "Loading data...",
    "en-ca": "Loading data...",
    es: "Cargando datos...",
    "es-mx": "Cargando datos...",
    fr: "Chargement des données...",
    hi: "डेटा लोड हो रहा है...",
    it: "Caricamento dati...",
    ja: "データを読み込み中...",
    ko: "데이터 로드 중...",
    "pt-br": "Carregando dados...",
    ru: "Загрузка данных...",
    th: "กำลังโหลดข้อมูล...",
    vi: "Đang tải dữ liệu...",
    "zh-cn": "正在加载数据...",
    "zh-tw": "正在載入資料...",
  },
  "calendar.loadingDates": {
    ar: "جارٍ تحميل التواريخ...",
    de: "Termine werden geladen...",
    en: "Loading dates...",
    "en-ca": "Loading dates...",
    es: "Cargando fechas...",
    "es-mx": "Cargando fechas...",
    fr: "Chargement des dates...",
    hi: "तिथियाँ लोड हो रही हैं...",
    it: "Caricamento date...",
    ja: "日付を読み込み中...",
    ko: "날짜 로드 중...",
    "pt-br": "Carregando datas...",
    ru: "Загрузка дат...",
    th: "กำลังโหลดวันที่...",
    vi: "Đang tải ngày...",
    "zh-cn": "正在加载日期...",
    "zh-tw": "正在載入日期...",
  },
  "analytics.noData": {
    ar: "لا تتوفر بيانات",
    de: "Keine Daten verfügbar",
    en: "No data available",
    "en-ca": "No data available",
    es: "No hay datos disponibles",
    "es-mx": "No hay datos disponibles",
    fr: "Aucune donnée disponible",
    hi: "कोई डेटा उपलब्ध नहीं",
    it: "Nessun dato disponibile",
    ja: "データがありません",
    ko: "데이터 없음",
    "pt-br": "Nenhum dado disponível",
    ru: "Данные отсутствуют",
    th: "ไม่มีข้อมูล",
    vi: "Không có dữ liệu",
    "zh-cn": "没有可用数据",
    "zh-tw": "沒有可用的資料",
  },
  "calendar.exportTabs.noPhotos": {
    ar: "لا توجد صور",
    de: "Keine Fotos",
    en: "No photos",
    "en-ca": "No photos",
    es: "No hay fotos",
    "es-mx": "No hay fotos",
    fr: "Aucune photo",
    hi: "कोई फ़ोटो नहीं",
    it: "Nessuna foto",
    ja: "写真がありません",
    ko: "사진 없음",
    "pt-br": "Sem fotos",
    ru: "Фотографий нет",
    th: "ไม่มีรูปภาพ",
    vi: "Không có ảnh",
    "zh-cn": "没有照片",
    "zh-tw": "沒有照片",
  },
  "calendar.services.add": {
    ar: "إضافة",
    de: "Hinzufügen",
    en: "Add",
    "en-ca": "Add",
    es: "Agregar",
    "es-mx": "Agregar",
    fr: "Ajouter",
    hi: "जोड़ें",
    it: "Aggiungi",
    ja: "追加",
    ko: "추가",
    "pt-br": "Adicionar",
    ru: "Добавить",
    th: "เพิ่ม",
    vi: "Thêm",
    "zh-cn": "添加",
    "zh-tw": "新增",
  },
  "error.defaultMessage": {
    ar: "حدث خطأ",
    de: "Ein Fehler ist aufgetreten",
    en: "An error occurred",
    "en-ca": "An error occurred",
    es: "Ocurrió un error",
    "es-mx": "Ocurrió un error",
    fr: "Une erreur est survenue",
    hi: "एक त्रुटि हुई",
    it: "Si è verificato un errore",
    ja: "エラーが発生しました",
    ko: "오류가 발생했습니다",
    "pt-br": "Ocorreu um erro",
    ru: "Произошла ошибка",
    th: "เกิดข้อผิดพลาด",
    vi: "Đã xảy ra lỗi",
    "zh-cn": "发生错误",
    "zh-tw": "發生錯誤",
  },
  "error.retry": {
    ar: "إعادة المحاولة",
    de: "Erneut versuchen",
    en: "Retry",
    "en-ca": "Retry",
    es: "Reintentar",
    "es-mx": "Reintentar",
    fr: "Réessayer",
    hi: "पुनः प्रयास करें",
    it: "Riprova",
    ja: "再試行",
    ko: "다시 시도",
    "pt-br": "Tentar novamente",
    ru: "Повторить",
    th: "ลองอีกครั้ง",
    vi: "Thử lại",
    "zh-cn": "重试",
    "zh-tw": "重試",
  },
  "error.title": {
    ar: "خطأ",
    de: "Fehler",
    en: "Error",
    "en-ca": "Error",
    es: "Error",
    "es-mx": "Error",
    fr: "Erreur",
    hi: "त्रुटि",
    it: "Errore",
    ja: "エラー",
    ko: "오류",
    "pt-br": "Erro",
    ru: "Ошибка",
    th: "ข้อผิดพลาด",
    vi: "Lỗi",
    "zh-cn": "错误",
    "zh-tw": "錯誤",
  },
  "error.tryAgainMessage": {
    ar: "الرجاء المحاولة مرة أخرى",
    de: "Bitte versuchen Sie es erneut",
    en: "Please try again",
    "en-ca": "Please try again",
    es: "Por favor, inténtelo de nuevo",
    "es-mx": "Por favor, inténtelo de nuevo",
    fr: "Veuillez réessayer",
    hi: "कृपया पुनः प्रयास करें",
    it: "Per favore riprova",
    ja: "もう一度お試しください",
    ko: "다시 시도해주세요",
    "pt-br": "Por favor, tente novamente",
    ru: "Пожалуйста, попробуйте снова",
    th: "กรุณาลองอีกครั้ง",
    vi: "Vui lòng thử lại",
    "zh-cn": "请再试一次",
    "zh-tw": "請再試一次",
  },
  "noData.message": {
    ar: "لا توجد بيانات",
    de: "Keine Daten verfügbar",
    en: "No data available",
    "en-ca": "No data available",
    es: "No hay datos disponibles",
    "es-mx": "No hay datos disponibles",
    fr: "Aucune donnée disponible",
    hi: "कोई डेटा उपलब्ध नहीं",
    it: "Nessun dato disponibile",
    ja: "データがありません",
    ko: "데이터 없음",
    "pt-br": "Nenhum dado disponível",
    ru: "Данные отсутствуют",
    th: "ไม่มีข้อมูล",
    vi: "Không có dữ liệu",
    "zh-cn": "没有可用数据",
    "zh-tw": "沒有可用的資料",
  },
  "noData.retry": {
    ar: "إعادة المحاولة",
    de: "Erneut versuchen",
    en: "Retry",
    "en-ca": "Retry",
    es: "Reintentar",
    "es-mx": "Reintentar",
    fr: "Réessayer",
    hi: "पुनः प्रयास करें",
    it: "Riprova",
    ja: "再試行",
    ko: "다시 시도",
    "pt-br": "Tentar novamente",
    ru: "Повторить",
    th: "ลองอีกครั้ง",
    vi: "Thử lại",
    "zh-cn": "重试",
    "zh-tw": "重試",
  },
  "noData.title": {
    ar: "لا توجد بيانات",
    de: "Keine Daten",
    en: "No Data",
    "en-ca": "No Data",
    es: "Sin datos",
    "es-mx": "Sin datos",
    fr: "Aucune donnée",
    hi: "कोई डेटा नहीं",
    it: "Nessun dato",
    ja: "データなし",
    ko: "데이터 없음",
    "pt-br": "Sem dados",
    ru: "Нет данных",
    th: "ไม่มีข้อมูล",
    vi: "Không có dữ liệu",
    "zh-cn": "无数据",
    "zh-tw": "無資料",
  },
};

function traverseAndReplace(obj, localeId, changes) {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === "string") {
        // If the value looks like a dotted placeholder (no spaces, contains a dot), try to replace
        if (/^[a-z0-9_\-]+(\.[a-z0-9_\-]+)+$/i.test(val)) {
          const placeholder = val;
          const localeMap = mapping[placeholder];
          let replacement = null;
          if (localeMap) {
            // Try direct match
            if (Object.prototype.hasOwnProperty.call(localeMap, localeId))
              replacement = localeMap[localeId];
            else {
              // try language prefix (e.g., en-ca -> en)
              const prefix = localeId.split(/[-_]/)[0];
              if (Object.prototype.hasOwnProperty.call(localeMap, prefix))
                replacement = localeMap[prefix];
            }
          }
          if (!replacement) {
            // fallback: use last segment and humanize
            const last = placeholder.split(".").pop();
            replacement = humanize(last, localeId);
          }

          if (replacement && replacement !== val) {
            obj[key] = replacement;
            changes.push({ keyPath: key, from: val, to: replacement });
          }
        }
      } else if (typeof val === "object" && val !== null) {
        traverseAndReplace(val, localeId, changes);
      }
    }
  }
}

function humanize(segment, localeId) {
  // Convert camelCase or snake_case to spaced words; we won't translate programmatically.
  const spaced = segment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // Simple localization heuristics for some locales (only a few common words)
  const word = spaced.toLowerCase();
  // Basic mapping for 'error', 'loading', 'loadingData', 'loadingDates', 'noPhotos', 'add'
  const heuristics = {
    error: { ar: "خطأ", en: "Error", de: "Fehler", fr: "Erreur" },
    loading: {
      ar: "جارٍ التحميل",
      en: "Loading",
      de: "Wird geladen",
      fr: "Chargement",
    },
    loadingdata: {
      ar: "جارٍ تحميل البيانات",
      en: "Loading data",
      de: "Daten werden geladen",
      fr: "Chargement des données",
    },
    loadingdates: {
      ar: "جارٍ تحميل التواريخ",
      en: "Loading dates",
      de: "Termine werden geladen",
      fr: "Chargement des dates",
    },
    nophotos: {
      ar: "لا توجد صور",
      en: "No photos",
      de: "Keine Fotos",
      fr: "Aucune photo",
    },
    add: { ar: "إضافة", en: "Add", de: "Hinzufügen", fr: "Ajouter" },
  };
  const key = word.replace(/\s+/g, "");
  if (heuristics[key]) {
    const h = heuristics[key];
    return h[localeId] || h[localeId.split(/[-_]/)[0]] || h.en;
  }
  // default: capitalize (for languages that use Latin script)
  if (/^[a-zA-Z0-9 ]+$/.test(spaced))
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  // otherwise return as-is
  return spaced;
}

function main() {
  if (!fs.existsSync(localesDir)) {
    console.error("Locales directory not found:", localesDir);
    process.exit(1);
  }
  const localeFiles = fs
    .readdirSync(localesDir)
    .filter((f) => f.endsWith(".json"));
  const report = {};
  for (const lf of localeFiles) {
    const full = path.join(localesDir, lf);
    let json;
    try {
      json = readJson(full);
    } catch (err) {
      console.error("Failed to parse", full, err.message);
      continue;
    }
    const localeId = path.basename(lf, ".json");
    const changes = [];
    traverseAndReplace(json, localeId, changes);
    if (changes.length > 0) {
      // backup original just in case
      try {
        fs.copyFileSync(full, full + ".bak");
      } catch (err) {
        console.warn("Could not create backup for", full);
      }
      writeJson(full, json);
      console.log(`Updated ${lf}: ${changes.length} replacements`);
      report[lf] = changes;
    } else {
      console.log(`${lf}: no replacements needed`);
    }
  }

  console.log("--- Summary ---");
  for (const [lf, changes] of Object.entries(report)) {
    console.log(`${lf}: ${changes.length} replacements`);
  }
  console.log("Done. Backups created with .bak extension for modified files.");
}

main();
