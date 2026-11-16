'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '@/_styles/cssProductPage/ReadAloud.module.css';
import IconAudio from '@/_assets/image/hub icon/icone-audio.svg';

type Props = {
  /** idioma da voz (ex.: 'pt-BR', 'en-US'). Depois liga no botão de idioma do header. */
  lang?: string;
};

type Chunk = { start: number; end: number };
type Highlight = { s: number; e: number; kind: 'word' | 'chunk' };
type Status = 'reading' | 'paused' | 'done' | 'error';
type Sel = { text: string; x: number; top: number | null; bottom: number | null };

const MAX_CHUNK = 180; // o Chrome corta falas longas, então lemos em pedaços

/** Divide o texto em frases/pedaços, guardando as posições no texto original. */
function splitText(text: string): Chunk[] {
  const out: Chunk[] = [];
  const re = /[^.!?;:\n]+[.!?;:]*\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    let s = m.index;
    const e = s + m[0].length;
    while (e - s > MAX_CHUNK) {
      let cut = text.lastIndexOf(' ', s + MAX_CHUNK);
      cut = cut <= s ? s + MAX_CHUNK : cut + 1;
      out.push({ start: s, end: cut });
      s = cut;
    }
    if (e > s && text.slice(s, e).trim()) out.push({ start: s, end: e });
  }
  return out;
}

function pickVoice(lang: string) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return { voice: null, missing: false }; // ainda carregando
  const full = lang.toLowerCase();
  const base = full.split('-')[0];
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  const voice =
    voices.find((v) => norm(v) === full) ?? voices.find((v) => norm(v).startsWith(base)) ?? null;
  return { voice, missing: !voice };
}

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

  /** Fala o pedaço `ci` a partir do deslocamento `off`, e segue para o próximo. */
  const speak = useCallback(
    function speak(ci: number, off: number) {
      const synth = window.speechSynthesis;
      const myRun = ++run.current;
      synth.cancel();

      const c = chunksRef.current[ci];
      if (!c) {
        setStatus('done');
        return;
      }

      const full = textRef.current;
      const u = new SpeechSynthesisUtterance(full.slice(c.start + off, c.end));
      u.lang = lang;
      if (voiceRef.current) u.voice = voiceRef.current;

      u.onstart = () => {
        if (myRun !== run.current) return;
        pos.current = { ci, off };
        setHl({ s: c.start + off, e: c.end, kind: 'chunk' });
      };

      // palavra atual (Chrome/Edge/Android). Onde não existir, fica o grifo da frase.
      u.onboundary = (ev) => {
        if (myRun !== run.current || ev.name === 'sentence') return;
        const g = c.start + off + ev.charIndex;
        const rest = full.slice(g);
        const space = rest.search(/\s/);
        const len = ev.charLength || (space === -1 ? rest.length : space);
        pos.current = { ci, off: g - c.start };
        setHl({ s: g, e: Math.min(g + len, c.end), kind: 'word' });
      };

      u.onend = () => {
        if (myRun !== run.current) return;
        if (ci + 1 < chunksRef.current.length) speak(ci + 1, 0);
        else setStatus('done');
      };

      u.onerror = (ev) => {
        if (myRun !== run.current) return;
        if (ev.error === 'canceled' || ev.error === 'interrupted') return;
        setStatus('error');
      };

      synth.speak(u);
    },
    [lang],
  );

  const start = (t: string) => {
    const { voice, missing } = pickVoice(lang);
    voiceRef.current = voice;
    setMissingVoice(missing);

    textRef.current = t;
    chunksRef.current = splitText(t);
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

  const mainAction =
    status === 'reading'
      ? { label: 'Pausar', onClick: pause, icon: 'pause' }
      : status === 'paused'
        ? { label: 'Continuar', onClick: resume, icon: 'play' }
        : { label: 'Ler de novo', onClick: replay, icon: 'replay' };

  return (
    <>
      {sel && (
        <button
          type="button"
          className={styles.fab}
          style={{ left: sel.x, top: sel.top ?? undefined, bottom: sel.bottom ?? undefined }}
          aria-label="Ler texto selecionado em voz alta"
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
          aria-label="Leitura em voz alta"
          data-read-aloud-ignore
        >
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
            <p className={styles.warn}>
              Este aparelho não tem uma voz neste idioma. A leitura pode soar estranha.
            </p>
          )}
          {status === 'error' && (
            <p className={styles.warn}>Não foi possível ler este texto.</p>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={mainAction.onClick}>
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

            <button type="button" className={styles.close} onClick={stop} aria-label="Fechar leitura">
              ✕
            </button>
          </div>
        </section>
      )}
    </>
  );
}