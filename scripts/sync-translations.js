// sync-translations.js
// Scans project files for translation keys and adds missing keys to JSON locale files.
// Usage: node scripts/sync-translations.js

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const localesDir = path.join(projectRoot, "locales");
const searchDirs = [projectRoot];
const fileExtensions = [".js", ".jsx", ".ts", ".tsx", ".json", ".vue"];

function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip node_modules, android, ios, build, .git
      if (
        [
          "node_modules",
          ".git",
          "android",
          "ios",
          "build",
          "dist",
          "out",
        ].includes(entry.name)
      )
        continue;
      walkDir(full, fileList);
    } else if (entry.isFile()) {
      if (fileExtensions.includes(path.extname(entry.name)))
        fileList.push(full);
    }
  }
  return fileList;
}

function extractKeysFromFile(content) {
  const keys = new Set();
  // patterns
  const patterns = [
    /t\(\s*['`\"]([^'`\"]+)['`\"]\s*\)/g, // t('key')
    /i18n\.t\(\s*['`\"]([^'`\"]+)['`\"]\s*\)/g, // i18n.t('key')
    /<Trans[^>]*i18nKey\s*=\s*['`\"]([^'`\"]+)['`\"]/g, // <Trans i18nKey="key"
    /i18nKey\s*=\s*['`\"]([^'`\"]+)['`\"]/g, // i18nKey="key"
    /t\?\(\s*['`\"]([^'`\"]+)['`\"]\s*\)/g, // some ternary-ish usage (just in case)
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(content))) {
      if (m[1]) keys.add(m[1]);
    }
  }
  return keys;
}

function setNested(obj, keyPath, value) {
  const parts = keyPath.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === parts.length - 1) {
      if (cur[p] === undefined) cur[p] = value;
    } else {
      if (typeof cur[p] !== "object" || cur[p] === null) cur[p] = {};
      cur = cur[p];
    }
  }
}

function main() {
  console.log("Scanning project for translation keys...");
  const files = walkDir(projectRoot);
  const allKeys = new Set();

  for (const f of files) {
    // skip locales directory itself
    if (f.startsWith(localesDir)) continue;
    let content;
    try {
      content = fs.readFileSync(f, "utf8");
    } catch (err) {
      continue;
    }
    const keys = extractKeysFromFile(content);
    for (const k of keys) allKeys.add(k);
  }

  const keysArray = Array.from(allKeys).sort();
  console.log(`Found ${keysArray.length} unique translation keys.`);

  // read locale files
  if (!fs.existsSync(localesDir)) {
    console.error("Locales directory not found:", localesDir);
    process.exit(1);
  }

  const localeFiles = fs
    .readdirSync(localesDir)
    .filter((f) => f.endsWith(".json"));
  if (localeFiles.length === 0) {
    console.error("No JSON locale files found in", localesDir);
    process.exit(1);
  }

  const summary = {};

  for (const lf of localeFiles) {
    const full = path.join(localesDir, lf);
    let raw;
    try {
      raw = fs.readFileSync(full, "utf8");
    } catch (err) {
      console.error(err);
      continue;
    }
    let json;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid JSON in", full, err.message);
      continue;
    }
    const added = [];
    for (const key of keysArray) {
      // check nested presence
      const parts = key.split(".");
      let cur = json;
      let present = true;
      for (let i = 0; i < parts.length; i++) {
        if (cur && Object.prototype.hasOwnProperty.call(cur, parts[i])) {
          cur = cur[parts[i]];
        } else {
          present = false;
          break;
        }
      }
      if (!present) {
        // set nested value to fallback equal to the key
        setNested(json, key, key);
        added.push(key);
      }
    }
    if (added.length > 0) {
      try {
        fs.writeFileSync(full, JSON.stringify(json, null, 2) + "\n", "utf8");
        console.log(`Updated ${lf}: added ${added.length} keys`);
      } catch (err) {
        console.error("Failed to write", full, err.message);
      }
    } else {
      console.log(`${lf} already contains all keys.`);
    }
    summary[lf] = added;
  }

  console.log("--- Summary ---");
  for (const [lf, added] of Object.entries(summary)) {
    console.log(
      lf + ": " + (added.length ? added.length + " added" : "no change")
    );
  }

  console.log("Done.");
}

main();
