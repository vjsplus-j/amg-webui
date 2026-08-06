/**
 * Score packages/components/base maturity → example/component-maturity.json
 *
 * HONEST CONTRACT (v2):
 * - Directory / catalog count ≠ product maturity. ~280 folders is inventory, not 1.0 readiness.
 * - Primary axis is **capability tier**, then depth level (stub/shell/beta/ready).
 *
 * Capability tiers:
 *   thin         — native/slot wrapper or scaffold; missing form/interaction contracts
 *   form         — FormItem auto-integration (+ native attrs when applicable)
 *   interaction  — rich control surface (permission / confirm / throttle / telemetry patterns)
 *   composite    — multi-part kit / deep provide-inject / domain composite
 *
 * Depth levels (honest debug labels, not marketing / not 1.0 claims):
 *   stub  — generic scaffold / placeholder
 *   shell — thin capability; mounts but below feature bar
 *   beta  — usable for debug; known gaps vs product bar
 *   ready — substantial baseline for *that capability tier* — still not library 1.0
 *
 * Usage: node scripts/score-component-maturity.mjs
 */
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseDir = resolve(root, "packages/components/base");

const LEVELS = ["stub", "shell", "beta", "ready"];
const CAPABILITIES = ["thin", "form", "interaction", "composite"];

/** Form-control family expected to use useFormItem / FORM_ITEM_INJECTION_KEY */
const FORM_CONTROL_FAMILY = new Set([
  "InputText",
  "Textarea",
  "InputNumber",
  "Password",
  "InputOTP",
  "InputCaptcha",
  "Select",
  "Checkbox",
  "Radio",
  "Switch",
  "Cascader",
  "TimeSelect",
  "Mention",
  "DatePicker",
  "DateTimePicker",
  "TimePicker",
  "ColorPicker",
  "Slider",
  "Rate",
  "Transfer",
  "TreeSelect",
  "Autocomplete",
  "InputTag",
]);

const STRUCTURAL_PRIMITIVES = new Set([
  "ColumnLayout",
  "StackLayout",
  "Main",
  "DescriptionsItem",
  "ScaleLayout",
  "FlowLayout",
  "Row",
  "Center",
  "Col",
  "FormLayout",
]);

function readTreeText(dir) {
  if (!existsSync(dir)) return "";
  return readdirSync(dir, { withFileTypes: true })
    .map((entry) =>
      entry.isDirectory()
        ? readTreeText(join(dir, entry.name))
        : /\.(?:spec|test)\.[cm]?[jt]sx?$/.test(entry.name)
          ? readFileSync(join(dir, entry.name), "utf8")
          : "",
    )
    .join("\n");
}

function readDirSource(dir) {
  if (!existsSync(dir)) return "";
  return readdirSync(dir, { withFileTypes: true })
    .map((entry) => {
      if (entry.isDirectory()) return readDirSource(join(dir, entry.name));
      if (!/\.(vue|ts|tsx|js|mjs)$/.test(entry.name)) return "";
      if (/\.(?:spec|test)\./.test(entry.name)) return "";
      return readFileSync(join(dir, entry.name), "utf8");
    })
    .join("\n");
}

const testSource = readTreeText(resolve(root, "tests"));

function isScaffold(vue) {
  const lines = vue.split(/\r?\n/).length;
  if (
    vue.includes("data-component=") &&
    vue.includes("__btn") &&
    /t\(['"]common\.search['"]\)/.test(vue) &&
    /t\(['"]button\.confirm['"]\)/.test(vue) &&
    lines < 100
  ) {
    return true;
  }
  if (
    vue.includes("data-variant=") &&
    vue.includes("letter-spacing:0.2em") &&
    lines < 60
  ) {
    return true;
  }
  if (/mode: string = 'bubbles'/.test(vue) && lines < 80) return true;
  return false;
}

function countProps(typesSrc) {
  if (!typesSrc) return 0;
  const iface = typesSrc.match(
    /export interface \w+Props[^{]*\{([\s\S]*?)\n\}/,
  );
  if (!iface) return 0;
  return (iface[1].match(/^\s+\w+\??:/gm) || []).length;
}

function fileLines(path) {
  if (!existsSync(path)) return 0;
  return readFileSync(path, "utf8").split(/\r?\n/).length;
}

function scoreOne(name) {
  const dir = join(baseDir, name);
  const primaryVuePath = join(dir, "index.vue");
  const vueCandidates = readdirSync(dir)
    .filter((file) => file.endsWith(".vue"))
    .map((file) => join(dir, file));
  const vuePath = existsSync(primaryVuePath)
    ? primaryVuePath
    : vueCandidates.sort((a, b) => fileLines(b) - fileLines(a))[0];
  const typesPath = join(dir, "types.ts");
  const stylePath = join(dir, "style.scss");
  const vue =
    vuePath && existsSync(vuePath) ? readFileSync(vuePath, "utf8") : "";
  const types = existsSync(typesPath) ? readFileSync(typesPath, "utf8") : "";
  const style = existsSync(stylePath) ? readFileSync(stylePath, "utf8") : "";
  const allSrc = readDirSource(dir);

  const vueLines = vue ? vue.split(/\r?\n/).length : 0;
  const styleLines = style ? style.split(/\r?\n/).length : 0;
  const propCount = countProps(types);
  const hasEmits =
    /defineEmits|Emits\s*\{/.test(vue) ||
    /export interface \w+Emits/.test(types);
  const hasComposable = readdirSync(dir).some((f) =>
    /^use[A-Z].*\.ts$/.test(f),
  );
  const hasProvideInject = /provide\(|inject\(/.test(allSrc);
  const hasVModel = /update:modelValue|modelValue/.test(vue);
  const handlers = (
    vue.match(
      /@(?:click|change|input|keydown|scroll|focus|blur|submit|contextmenu)=/g,
    ) || []
  ).length;
  const hasAria = /aria-|role=/.test(vue);
  const hasTokens =
    /var\(--(?:ds|theme|spacing|font-size|border-radius|shadow|text|surface|height)-/.test(
      style + vue,
    );
  const hasBehaviorTest = new RegExp(
    `components/base/${name}/index\\.vue`,
  ).test(testSource.replaceAll("\\\\", "/"));
  const delegatesComponent =
    /import\s+\w+\s+from\s+['"]\.\.\/\w+\/index\.vue['"]/.test(vue);
  const slotOnly =
    /<slot\s*\/>/.test(vue) &&
    !(
      vue.includes("v-for") ||
      vue.includes("v-if") ||
      handlers > 0 ||
      hasVModel
    );
  const templateLight = vueLines < 45 && styleLines < 40 && propCount <= 4;

  const hasFormItem = /useFormItem|FORM_ITEM_INJECTION_KEY/.test(allSrc);
  const hasNativeAttrs = /useNativeInputAttrs/.test(allSrc);
  const hasTelemetry = /trackEmit/.test(allSrc);
  const hasPermission = /\bpermission\b/.test(allSrc);
  const hasConfirm =
    /\bconfirm\b/.test(allSrc) && /Popconfirm|needsConfirm/.test(allSrc);
  const hasThrottleWait =
    /\b(?:resolvedWait|wait)\b/.test(allSrc) &&
    /throttle|debounce|Locked|lock/i.test(allSrc);

  const signals = [];
  let score = 0;

  if (isScaffold(vue)) {
    return {
      level: "stub",
      capability: "thin",
      score: 5,
      signals: ["scaffold"],
      vueLines,
      styleLines,
      propCount,
      formIntegrated: false,
      nativeAttrs: false,
    };
  }

  // Soft size signal — capped so LOC cannot alone manufacture "ready"
  score += Math.min(20, Math.floor(vueLines / 6));
  score += Math.min(10, Math.floor(styleLines / 6));
  score += Math.min(12, propCount * 1.5);
  if (hasEmits) {
    score += 6;
    signals.push("emits");
  }
  if (hasComposable) {
    score += 8;
    signals.push("composable");
  }
  if (hasProvideInject) {
    score += 6;
    signals.push("provide-inject");
  }
  if (hasVModel) {
    score += 5;
    signals.push("v-model");
  }
  score += Math.min(8, handlers * 2);
  if (handlers) signals.push(`handlers:${handlers}`);
  if (hasAria) {
    score += 5;
    signals.push("a11y");
  }
  if (hasTokens) {
    score += 4;
    signals.push("tokens");
  }
  if (existsSync(join(dir, "index.ts"))) score += 2;
  if (hasBehaviorTest) {
    score += 8;
    signals.push("behavior-test");
  }
  if (delegatesComponent) {
    score += 4;
    signals.push("delegate");
  }

  // Capability-weighted bonuses (honest: contracts > LOC)
  if (hasFormItem) {
    score += 12;
    signals.push("form-item");
  }
  if (hasNativeAttrs) {
    score += 6;
    signals.push("native-attrs");
  }
  if (hasTelemetry) {
    score += 4;
    signals.push("telemetry");
  }
  if (hasPermission) {
    score += 6;
    signals.push("permission");
  }
  if (hasConfirm) {
    score += 6;
    signals.push("confirm");
  }
  if (hasThrottleWait) {
    score += 4;
    signals.push("throttle-wait");
  }

  const isFormFamily = FORM_CONTROL_FAMILY.has(name);

  let capability = "thin";
  if (
    hasTelemetry &&
    (hasPermission || hasConfirm) &&
    (hasThrottleWait || /\bhref\b|\bto\b/.test(allSrc) || hasComposable)
  ) {
    capability = "interaction";
  } else if (isFormFamily && hasFormItem) {
    capability = "form";
  } else if (
    hasProvideInject &&
    (vueLines >= 120 || propCount >= 10) &&
    !templateLight
  ) {
    capability = "composite";
  } else if (
    !isFormFamily &&
    hasTelemetry &&
    hasComposable &&
    propCount >= 10 &&
    vueLines >= 150
  ) {
    capability = "interaction";
  } else if (isFormFamily && !hasFormItem) {
    capability = "thin";
    signals.push("gap:missing-form-item");
  } else if (templateLight || slotOnly) {
    capability = "thin";
  } else if (vueLines >= 100 && propCount >= 6 && hasComposable) {
    // Substantial but not form/interaction-classified → composite-ish presentation
    capability = "composite";
  }

  // Sub-primitives / thin shells — cap as shell unless clearly richer
  const subPrimitive =
    /Item$|Pane$|Group$/.test(name) ||
    name === "Steps" ||
    name === "Timeline" ||
    (slotOnly && templateLight);

  if (subPrimitive && score < 55) {
    signals.push(slotOnly ? "slot-shell" : "sub-primitive");
    return {
      level: "shell",
      capability: "thin",
      score: Math.min(score, 35),
      signals,
      vueLines,
      styleLines,
      propCount,
      formIntegrated: hasFormItem,
      nativeAttrs: hasNativeAttrs,
    };
  }

  if (isFormFamily && !hasFormItem) {
    signals.push("thin-form-control");
    return {
      level: "shell",
      capability: "thin",
      score: Math.min(score, 42),
      signals,
      vueLines,
      styleLines,
      propCount,
      formIntegrated: false,
      nativeAttrs: hasNativeAttrs,
    };
  }

  if (templateLight && score < 40 && capability === "thin") {
    signals.push("thin");
    return {
      level: "shell",
      capability: "thin",
      score: Math.min(score, 38),
      signals,
      vueLines,
      styleLines,
      propCount,
      formIntegrated: hasFormItem,
      nativeAttrs: hasNativeAttrs,
    };
  }

  let level = "beta";
  // Ready requires capability contracts — not LOC alone
  const readyBar =
    score >= 72 &&
    hasTokens &&
    (hasAria || capability === "composite") &&
    (hasComposable || hasBehaviorTest || capability === "interaction");

  if (capability === "form") {
    // Form tier ready: must have FormItem; native text controls should forward attrs
    const nativeText = ["InputText", "Textarea", "InputNumber", "Password"].includes(
      name,
    );
    if (
      hasFormItem &&
      score >= 68 &&
      hasTokens &&
      (!nativeText || hasNativeAttrs)
    ) {
      level = "ready";
    } else if (score >= 45) level = "beta";
    else level = "shell";
  } else if (capability === "interaction") {
    if (readyBar && (hasPermission || hasConfirm || hasThrottleWait)) {
      level = "ready";
    } else if (score >= 50) level = "beta";
    else level = "shell";
  } else if (capability === "composite") {
    if (readyBar && score >= 75) level = "ready";
    else if (score >= 45) level = "beta";
    else level = "shell";
  } else {
    // thin: never "ready" — at best beta when unusually fleshed out
    if (score >= 55 && hasTokens && hasAria) level = "beta";
    else if (score >= 40) level = "shell";
    else level = "shell";
    if (level === "beta") signals.push("thin-cap:no-ready");
  }

  if (
    STRUCTURAL_PRIMITIVES.has(name) &&
    score >= 55 &&
    hasAria &&
    hasTokens &&
    propCount >= 4 &&
    capability !== "thin"
  ) {
    level = "ready";
    signals.push("structural-primitive");
  }

  // Known doc gaps
  if (name === "TabsNav" && level === "ready") {
    level = "beta";
    signals.push("doc-gap:multi-tab");
  }

  return {
    level,
    capability,
    score: Math.min(100, Math.round(score)),
    signals,
    vueLines,
    styleLines,
    propCount,
    formIntegrated: hasFormItem,
    nativeAttrs: hasNativeAttrs,
  };
}

const names = readdirSync(baseDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const components = {};
const summary = { stub: 0, shell: 0, beta: 0, ready: 0 };
const byCapability = { thin: 0, form: 0, interaction: 0, composite: 0 };
const thinFormGaps = [];

for (const name of names) {
  const row = scoreOne(name);
  components[name] = row;
  summary[row.level] += 1;
  byCapability[row.capability] += 1;
  if (
    FORM_CONTROL_FAMILY.has(name) &&
    row.capability === "thin" &&
    !row.formIntegrated
  ) {
    thinFormGaps.push(name);
  }
}

const generatedAt = new Date().toISOString();
const out = {
  version: 2,
  generatedAt,
  /** Inventory size only — NOT a maturity or 1.0 claim */
  total: names.length,
  disclaimer:
    "total is directory inventory. Maturity is by capability tier + depth level. Not 1.0-ready.",
  summary,
  byCapability,
  capabilities: CAPABILITIES,
  levels: LEVELS,
  thinFormGaps,
  components,
};

const outPath = resolve(root, "example/component-maturity.json");
writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);

console.log("[score-component-maturity] capability-first (v2)");
console.log("  inventory (directories):", out.total, "← not a maturity metric");
console.log("  byCapability:", byCapability);
console.log("  byDepth:", summary);
if (thinFormGaps.length) {
  console.log("  thin form-control gaps (no FormItem):", thinFormGaps.join(", "));
}
console.log("  out: example/component-maturity.json");
console.log(
  "  note: ready ≠ 1.0 ship; thin never reaches ready; form requires FormItem (+ native attrs for text controls)",
);
