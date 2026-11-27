'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '@/_styles/cssProductPage/ReadAloud.module.css';
import IconAudio from '@/_assets/image/hub icon/icone-audio.svg';

const t = {
  titleReading: 'Lendo em voz alta',
  titlePaused: 'Leitura pausada',
  titleDone: 'Leitura concluída',
  titleError: 'Leitura interrompida',
  fab: 'Ler texto selecionado em voz alta',
  pause: 'Pausar',
  resume: 'Continuar',
  replay: 'Ler de novo',
  close: 'Fechar leitura',
  missingVoice: 'Este aparelho não tem uma voz neste idioma. A leitura pode soar estranha.',
  error: 'Não foi possível ler este texto.',
};

type Props = {
  /** idioma da voz (ex.: 'pt-BR', 'en-US'). Depois liga no botão de idioma do header. */
  lang?: string;
};

type Chunk = { start: number; end: number };
type Highlight = { s: number; e: number; kind: 'word' | 'chunk' };
type Status = 'reading' | 'paused' | 'done' | 'error';
type Sel = { text: string; x: number; top: number | null; bottom: number | null };

// Chrome's online Google voices stop after ~15s of speech, so their chunks stay short.
// Other voices (local, Edge "Natural", Apple) read long chunks fine: fewer chunks = fewer pauses.
const MAX_CHUNK_GOOGLE = 200;
const MAX_CHUNK = 1000;

/**
 * Splits the text into chunks that keep their positions in the original text.
 * Only sentence ends (. ! ? … or a line break) split; short sentences are merged up to `max`,
 * so the voice keeps a natural flow instead of stopping at every ; or :.
 */
function splitText(text: string, max: number): Chunk[] {
  const sentences: Chunk[] = [];
  const re = /[^.!?…\n]+(?:[.!?…]+|\n+|$)\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) && m[0].length) {
    sentences.push({ start: m.index, end: m.index + m[0].length });
  }

  const out: Chunk[] = [];
  for (const sentence of sentences) {
    let { start } = sentence;
    const { end } = sentence;
    // a sentence longer than max: cut at the last comma/semicolon, or else at the last space
    while (end - start > max) {
      const slice = text.slice(start, start + max);
      const pause = Math.max(slice.lastIndexOf(', '), slice.lastIndexOf('; '));
      const space = slice.lastIndexOf(' ');
      const cut = pause > max / 3 ? start + pause + 2 : space > 0 ? start + space + 1 : start + max;
      out.push({ start, end: cut });
      start = cut;
    }
    if (!text.slice(start, end).trim()) continue;
    const last = out[out.length - 1];
    if (last && last.end === start && end - last.start <= max) last.end = end;
    else out.push({ start, end });
  }
  return out;
}

const normLang = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();

/** How natural a voice sounds: neural/online voices first, robotic engines last. */
function voiceScore(v: SpeechSynthesisVoice, lang: string) {
  const name = v.name.toLowerCase();
  let score = 0;
  if (/natural|neural|online/.test(name)) score += 100; // Edge: "Microsoft Francisca Online (Natural)"
  if (/premium|enhanced|aprimorad|melhorad/.test(name)) score += 80; // Apple downloaded voices
  if (name.includes('google')) score += 60; // Chrome online voices
  if (!v.localService) score += 10;
  if (normLang(v) === lang) score += 20; // pt-BR over pt-PT, for example
  if (/espeak|compact/.test(name)) score -= 100;
  return score;
}

function pickVoice(lang: string) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return { voice: null, missing: false }; // ainda carregando
  const full = lang.toLowerCase();
  const base = full.split('-')[0];
  const candidates = voices.filter((v) => normLang(v).split('-')[0] === base);
  const voice = candidates.sort((a, b) => voiceScore(b, full) - voiceScore(a, full))[0] ?? null;
  return { voice, missing: !voice };
}

const isGoogleOnline = (v: SpeechSynthesisVoice | null) =>
  Boolean(v && !v.localService && v.name.toLowerCase().includes('google'));

export default function ReadAloud({ lang = 'pt-BR' }: Props) {
  const [sel, setSel] = useState<Sel | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('reading');
  const [hl, setHl] = useState<Highlight | null>(null);
  const [missingVoice, setMissingVoice] = useState(false);

  const run = useRef(0); // invalida callbacks de falas antigas
  const textRef = useRef('');
  const chunksRef = useRef<Chunk[]>([]);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const pos = useRef({ ci: 0, off: 0 }); // onde parou (para continuar)
  const markRef = useRef<HTMLElement>(null);
  // voice language: the page's current one (automatic translation changes <html lang>)
  const langRef = useRef(lang);
  const titleId = useId();

  /**
   * Fala a partir do pedaço `ci` (deslocamento `off`). Todos os pedaços restantes entram na fila
   * do sintetizador de uma vez, então não há silêncio esperando o próximo começar.
   */
  const speak = useCallback(
    (ci: number, off: number) => {
      const synth = window.speechSynthesis;
      const myRun = ++run.current;
      synth.cancel();

      const chunks = chunksRef.current;
      if (!chunks[ci]) {
        setStatus('done');
        return;
      }

      const full = textRef.current;
      for (let i = ci; i < chunks.length; i++) {
        const c = chunks[i];
        const from = c.start + (i === ci ? off : 0);
        const u = new SpeechSynthesisUtterance(full.slice(from, c.end));
        u.lang = langRef.current;
        if (voiceRef.current) u.voice = voiceRef.current;

        u.onstart = () => {
          if (myRun !== run.current) return;
          pos.current = { ci: i, off: from - c.start };
          setHl({ s: from, e: c.end, kind: 'chunk' });
        };

        // palavra atual (Chrome/Edge/Android). Onde não existir, fica o grifo da frase.
        u.onboundary = (ev) => {
          if (myRun !== run.current || ev.name === 'sentence') return;
          const g = from + ev.charIndex;
          const rest = full.slice(g);
          const space = rest.search(/\s/);
          const len = ev.charLength || (space === -1 ? rest.length : space);
          pos.current = { ci: i, off: g - c.start };
          setHl({ s: g, e: Math.min(g + len, c.end), kind: 'word' });
        };

        if (i === chunks.length - 1) {
          u.onend = () => {
            if (myRun === run.current) setStatus('done');
          };
        }

        u.onerror = (ev) => {
          if (myRun !== run.current) return;
          if (ev.error === 'canceled' || ev.error === 'interrupted') return;
          setStatus('error');
        };

        synth.speak(u);
      }
    },
    [],
  );

  // As vozes chegam de forma assíncrona (principalmente no Chrome): pede a lista cedo para que
  // a melhor voz já esteja disponível no primeiro clique.
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const load = () => synth.getVoices();
    load();
    synth.addEventListener('voiceschanged', load);
    return () => synth.removeEventListener('voiceschanged', load);
  }, []);

  const start = (t: string) => {
    const pageLang = document.documentElement.lang;
    langRef.current = pageLang && !pageLang.startsWith('pt') ? pageLang : lang;
    const { voice, missing } = pickVoice(langRef.current);
    voiceRef.current = voice;
    setMissingVoice(missing);

    textRef.current = t;
    chunksRef.current = splitText(t, isGoogleOnline(voice) ? MAX_CHUNK_GOOGLE : MAX_CHUNK);
    if (!chunksRef.current.length) return;

    setText(t);
    setHl(null);
    setStatus('reading');
    speak(0, 0);
  };

  const stop = useCallback(() => {
    run.current++;
    window.speechSynthesis.cancel();
    setText(null);
    setHl(null);
  }, []);

  // pausar = cancelar e guardar a posição (o pause() nativo falha em vários Androids)
  const pause = () => {
    run.current++;
    window.speechSynthesis.cancel();
    setStatus('paused');
  };

  const resume = () => {
    setStatus('reading');
    speak(pos.current.ci, pos.current.off);
  };

  const replay = () => {
    setHl(null);
    setStatus('reading');
    speak(0, 0);
  };

  // seleção de texto -> mostra o botão do alto-falante
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    let timer: ReturnType<typeof setTimeout>;

    const update = () => {
      const s = window.getSelection();
      const t = s?.toString().trim() ?? '';
      if (!s || s.rangeCount === 0 || t.length < 2) {
        setSel(null);
        return;
      }

      const range = s.getRangeAt(0);
      const node = range.commonAncestorContainer;
      const el = node.nodeType === 1 ? (node as Element) : node.parentElement;
      if (el?.closest('[data-read-aloud-ignore], input, textarea')) {
        setSel(null);
        return;
      }

      const rect = range.getBoundingClientRect();
      const x = Math.min(Math.max(rect.left + rect.width / 2, 28), window.innerWidth - 28);
      // no celular o menu nativo aparece em cima da seleção: o botão vai embaixo
      const touch = window.matchMedia('(pointer: coarse)').matches;
      const below = touch || rect.top < 64;
      setSel({
        text: t,
        x,
        top: below ? null : rect.top - 48,
        bottom: below ? window.innerHeight - rect.bottom - 52 : null,
      });
    };

    const onChange = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 180);
    };

    document.addEventListener('selectionchange', onChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('selectionchange', onChange);
    };
  }, []);

  // ESC fecha o mini hub; ao sair da página, para a fala
  useEffect(() => {
    if (text === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stop();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [text, stop]);

  useEffect(
    () => () => {
      run.current++;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    [],
  );

  // mantém a palavra atual visível dentro da caixa de texto
  useEffect(() => {
    markRef.current?.scrollIntoView({ block: 'nearest' });
  }, [hl]);

  const before = text && hl ? text.slice(0, hl.s) : '';
  const marked = text && hl ? text.slice(hl.s, hl.e) : '';
  const after = text && hl ? text.slice(hl.e) : (text ?? '');

  // render data (label/icon) kept apart from the handler, which touches refs
  const mainAction =
    status === 'reading'
      ? { label: t.pause, icon: 'pause' }
      : status === 'paused'
        ? { label: t.resume, icon: 'play' }
        : { label: t.replay, icon: 'replay' };

  const onMainAction = () => {
    if (status === 'reading') pause();
    else if (status === 'paused') resume();
    else replay();
  };

  const title = {
    reading: t.titleReading,
    paused: t.titlePaused,
    done: t.titleDone,
    error: t.titleError,
  }[status];

  return (
    <>
      {sel && (
        <button
          type="button"
          className={styles.fab}
          // 'auto' (not undefined) on the unused edge: globals.css sets `top: 0` on every element
          style={{ left: sel.x, top: sel.top ?? 'auto', bottom: sel.bottom ?? 'auto' }}
          aria-label={t.fab}
          data-read-aloud-ignore
          onPointerDown={(e) => e.preventDefault()} // mantém a seleção
          onClick={() => {
            start(sel.text);
            setSel(null);
          }}
        >
          <Image src={IconAudio} alt="" width={22} height={22} />
        </button>
      )}

      {text !== null && (
        <section
          className={styles.hub}
          role="dialog"
          aria-labelledby={titleId}
          data-read-aloud-ignore
        >
          <div className={styles.top}>
            <h2 id={titleId} className={styles.title} aria-live="polite">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                <path d="M16.5 8.5a5 5 0 0 1 0 7" />
              </svg>
              {title}
            </h2>
            <button type="button" className={styles.close} onClick={stop} aria-label={t.close}>
              ✕
            </button>
          </div>

          <div className={styles.text} tabIndex={0}>
            {hl ? (
              <>
                {before}
                <mark
                  ref={markRef}
                  className={hl.kind === 'word' ? styles.word : styles.chunk}
                >
                  {marked}
                </mark>
                {after}
              </>
            ) : (
              text
            )}
          </div>

          {missingVoice && (
            <p className={styles.warn}>{t.missingVoice}</p>
          )}
          {status === 'error' && (
            <p className={styles.warn}>{t.error}</p>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={onMainAction}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
                fill={mainAction.icon === 'replay' ? 'none' : 'currentColor'}
                stroke={mainAction.icon === 'replay' ? 'currentColor' : 'none'}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {mainAction.icon === 'pause' && (
                  <>
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </>
                )}
                {mainAction.icon === 'play' && <path d="M8 5v14l11-7z" />}
                {mainAction.icon === 'replay' && (
                  <>
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                  </>
                )}
              </svg>
              {mainAction.label}
            </button>
          </div>
        </section>
      )}
    </>
  );
}