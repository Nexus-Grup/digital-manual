// Automatic page translation (client only). The site is written in pt-BR only; other languages come from:
//  1. the browser's built-in Translator API (Chrome/Edge): on-device, private, no third-party script;
//  2. otherwise the Google Translate website widget, loaded only when the visitor picks a language.

export type TargetLanguage = { code: string; name: string; short: string };

/** "pt" = original page. Codes are BCP 47 (Translator API); Google uses the same except Chinese. */
export const LANGUAGES: TargetLanguage[] = [
  { code: 'pt', name: 'Português (original)', short: 'PT-BR' },
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'es', name: 'Español', short: 'ES' },
  { code: 'fr', name: 'Français', short: 'FR' },
  { code: 'it', name: 'Italiano', short: 'IT' },
  { code: 'de', name: 'Deutsch', short: 'DE' },
  { code: 'ja', name: '日本語', short: 'JA' },
  { code: 'zh', name: '中文', short: 'ZH' },
];

const SOURCE = 'pt';
const STORAGE_KEY = 'md-translate-lang';
const GOOGLE_CODE: Record<string, string> = { zh: 'zh-CN' };

export type Engine = 'browser' | 'google';
export type TranslatorState = {
  lang: string;
  engine: Engine | null;
  status: 'idle' | 'downloading' | 'translating' | 'error';
  /** model download progress 0–1 (browser engine) */
  progress: number;
};

// ---------------------------------------------------------------- tiny store (useSyncExternalStore)
let state: TranslatorState = { lang: SOURCE, engine: null, status: 'idle', progress: 0 };
const listeners = new Set<() => void>();
const set = (patch: Partial<TranslatorState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
export const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l));
export const getState = () => state;
export const getServerState = () => state;

// ---------------------------------------------------------------- browser Translator API
type Availability = 'unavailable' | 'downloadable' | 'downloading' | 'available';
type BrowserTranslator = { translate(text: string): Promise<string>; destroy?: () => void };
type TranslatorApi = {
  availability(o: { sourceLanguage: string; targetLanguage: string }): Promise<Availability>;
  create(o: {
    sourceLanguage: string;
    targetLanguage: string;
    monitor?: (m: EventTarget) => void;
  }): Promise<BrowserTranslator>;
};
const browserApi = () => (globalThis as { Translator?: TranslatorApi }).Translator;

async function browserAvailability(lang: string): Promise<Availability> {
  const api = browserApi();
  if (!api) return 'unavailable';
  try {
    return await api.availability({ sourceLanguage: SOURCE, targetLanguage: lang });
  } catch {
    return 'unavailable';
  }
}

// ---- DOM walker: translates text nodes and a few accessible attributes in place
const ATTRS = ['alt', 'title', 'placeholder', 'aria-label'];
const SKIP = 'script,style,noscript,code,pre,textarea,svg,[translate="no"],.notranslate';
const HAS_WORDS = /[A-Za-zÀ-ÿ]{2,}/;

const textOriginal = new Map<Text, string>();
const textMine = new WeakMap<Text, string>(); // last value we wrote (to ignore our own mutations)
const attrOriginal = new Map<Element, Map<string, string>>();
const attrMine = new WeakMap<Element, Map<string, string>>();
const cache = new Map<string, string>(); // `${lang}\u0000${text}` -> translation
let active: { lang: string; translator: BrowserTranslator } | null = null;
let observer: MutationObserver | null = null;

const skipped = (el: Element | null) => !el || !!el.closest(SKIP);

async function translateText(text: string): Promise<string> {
  if (!active) return text;
  const core = text.trim();
  if (!core || !HAS_WORDS.test(core)) return text;
  const key = `${active.lang}\u0000${core}`;
  let out = cache.get(key);
  if (out === undefined) {
    const lang = active.lang;
    out = await active.translator.translate(core);
    if (active?.lang !== lang) return text; // switched meanwhile
    cache.set(key, out);
  }
  return text.replace(core, out);
}

async function translateNode(node: Text) {
  if (skipped(node.parentElement)) return;
  if (textMine.get(node) === node.data) return; // already ours
  const original = node.data;
  if (!HAS_WORDS.test(original)) return;
  textOriginal.set(node, original);
  const value = await translateText(original);
  if (node.data !== original || value === original) return; // changed meanwhile / nothing to do
  textMine.set(node, value);
  node.data = value;
}

async function translateAttrs(el: Element) {
  if (skipped(el)) return;
  for (const attr of ATTRS) {
    const current = el.getAttribute(attr);
    if (!current || attrMine.get(el)?.get(attr) === current || !HAS_WORDS.test(current)) continue;
    if (!attrOriginal.has(el)) attrOriginal.set(el, new Map());
    attrOriginal.get(el)!.set(attr, current);
    const value = await translateText(current);
    if (el.getAttribute(attr) !== current || value === current) continue;
    if (!attrMine.has(el)) attrMine.set(el, new Map());
    attrMine.get(el)!.set(attr, value);
    el.setAttribute(attr, value);
  }
}

/** Translates everything under root, a few strings at a time (keeps the page responsive). */
async function translateTree(root: Node) {
  const jobs: (() => Promise<void>)[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n: Node | null = walker.currentNode; n; n = walker.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) jobs.push(() => translateNode(n as Text));
    else jobs.push(() => translateAttrs(n as Element));
  }
  const CONCURRENCY = 6;
  let i = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < jobs.length && active) await jobs[i++]().catch(() => {});
    }),
  );
}

function watch() {
  observer?.disconnect();
  observer = new MutationObserver((records) => {
    if (!active) return;
    for (const r of records) {
      if (r.type === 'characterData') translateNode(r.target as Text).catch(() => {});
      else if (r.type === 'attributes') translateAttrs(r.target as Element).catch(() => {});
      else r.addedNodes.forEach((n) => translateTree(n).catch(() => {}));
    }
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
  });
}

function restoreBrowser() {
  observer?.disconnect();
  observer = null;
  active?.translator.destroy?.();
  active = null;
  for (const [node, original] of textOriginal) if (node.isConnected) node.data = original;
  for (const [el, attrs] of attrOriginal) if (el.isConnected) attrs.forEach((v, a) => el.setAttribute(a, v));
  textOriginal.clear();
  attrOriginal.clear();
}

async function applyBrowser(lang: string) {
  const api = browserApi()!;
  set({ status: 'downloading', progress: 0, engine: 'browser' });
  const translator = await api.create({
    sourceLanguage: SOURCE,
    targetLanguage: lang,
    monitor: (m) =>
      m.addEventListener('downloadprogress', (e) => set({ progress: (e as ProgressEvent).loaded ?? 0 })),
  });
  restoreBrowser();
  active = { lang, translator };
  set({ status: 'translating', lang });
  document.documentElement.lang = lang;
  watch();
  await translateTree(document.body);
  set({ status: 'idle' });
}

// ---------------------------------------------------------------- Google Translate widget (fallback)
type GoogleWindow = Window & {
  googleTranslateElementInit?: () => void;
  google?: { translate?: { TranslateElement: new (o: object, id: string) => unknown } };
};
let googleLoading: Promise<void> | null = null;

/**
 * Google Translate wraps text in <font> tags behind React's back; without this, React crashes when it
 * later removes or moves those nodes (react#11538). Applied only when the widget is used.
 */
function patchDomForGoogle() {
  const proto = Node.prototype as Node & { __mdPatched?: boolean };
  if (proto.__mdPatched) return;
  proto.__mdPatched = true;
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return insertBefore.call(this, node, null) as T;
    return insertBefore.call(this, node, ref) as T;
  };
}

function loadGoogle(): Promise<void> {
  if (googleLoading) return googleLoading;
  patchDomForGoogle();
  googleLoading = new Promise<void>((resolve, reject) => {
    const w = window as GoogleWindow;
    const host = document.createElement('div');
    host.id = 'google-translate-element';
    host.className = 'notranslate';
    host.hidden = true;
    document.body.appendChild(host);
    w.googleTranslateElementInit = () => {
      new w.google!.translate!.TranslateElement({ pageLanguage: SOURCE, autoDisplay: false }, host.id);
      resolve();
    };
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => reject(new Error('google translate unavailable'));
    document.head.appendChild(script);
  });
  return googleLoading;
}

function setGoogleCookie(lang: string | null) {
  const value = lang ? `/${SOURCE}/${lang}` : '';
  const age = lang ? 'max-age=31536000' : 'max-age=0';
  document.cookie = `googtrans=${value}; path=/; ${age}`;
  document.cookie = `googtrans=${value}; path=/; domain=${location.hostname}; ${age}`;
}

async function applyGoogle(lang: string) {
  set({ status: 'translating', engine: 'google' });
  const code = GOOGLE_CODE[lang] ?? lang;
  setGoogleCookie(code);
  await loadGoogle();
  // the widget's hidden <select> appears a moment after init
  for (let i = 0; i < 50; i++) {
    const select = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
      break;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  document.documentElement.lang = lang;
  set({ status: 'idle', lang });
}

// ---------------------------------------------------------------- public API
/** Translates the page to `lang` ("pt" restores the original). Call from a click (model download). */
export async function translatePage(lang: string) {
  try {
    if (lang === SOURCE) {
      localStorage.removeItem(STORAGE_KEY);
      if (state.engine === 'google') {
        setGoogleCookie(null);
        location.reload(); // the widget has no clean "undo": reload the original page
        return;
      }
      restoreBrowser();
      document.documentElement.lang = 'pt-BR';
      set({ lang: SOURCE, status: 'idle', engine: null });
      return;
    }
    localStorage.setItem(STORAGE_KEY, lang);
    const availability = await browserAvailability(lang);
    if (availability !== 'unavailable') await applyBrowser(lang);
    else await applyGoogle(lang);
  } catch (err) {
    console.error('page translation failed', err);
    set({ status: 'error' });
  }
}

/** Re-applies the saved language on a new visit (only when no download/permission is needed). */
export async function restoreSavedLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved || saved === SOURCE || state.lang === saved) return;
  if ((await browserAvailability(saved)) === 'available') return translatePage(saved);
  if (document.cookie.includes('googtrans=/')) return applyGoogle(saved).catch(() => {});
}
