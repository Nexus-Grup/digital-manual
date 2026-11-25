'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, SendHorizontal } from 'lucide-react';
import styles from '@/_styles/cssProductPage/ChatPanel.module.css';
import { useVideos } from './VideosContext';

type Source = { label: string; href: string; external?: boolean };
type Message = { id: number; from: 'user' | 'lucca'; paragraphs: string[]; sources?: Source[] };

const MAX_QUESTION = 300;
const GREETING: Message = {
  id: 0,
  from: 'lucca',
  paragraphs: ['Oi! Eu sou o Lucca. Pergunte o que quiser sobre esta ferramenta: ficha técnica, montagem, uso ou cuidados.'],
};

/**
 * "Pergunte ao Lucca": answers come from the product's own content (sheet, highlights, assembly
 * steps and the manual), searched on the server. Free, no external AI.
 */
export default function ChatPanel({ productId, active }: { productId: string; active: boolean }) {
  const { close } = useVideos();
  const inputId = useId();
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const logRef = useRef<HTMLOListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadedSuggestions = useRef(false);
  const nextId = useRef(1);

  // starter questions for this product, once, when the chat is first opened
  useEffect(() => {
    if (!active || loadedSuggestions.current) return;
    loadedSuggestions.current = true;
    fetch(`/api/products/${productId}/ask`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.suggestions && setSuggestions(d.suggestions))
      .catch(() => {});
  }, [active, productId]);

  // focus the field when the chat opens (not on touch screens: it would pop the keyboard up)
  useEffect(() => {
    if (active && window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, [active]);

  // keep the latest message in view
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, loading]);

  async function ask(text: string) {
    const q = text.trim().slice(0, MAX_QUESTION);
    if (!q || loading) return;
    setQuestion('');
    setMessages((m) => [...m, { id: nextId.current++, from: 'user', paragraphs: [q] }]);
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json().catch(() => ({}));
      const reply: Message = res.ok
        ? { id: nextId.current++, from: 'lucca', paragraphs: data.paragraphs ?? [], sources: data.sources ?? [] }
        : { id: nextId.current++, from: 'lucca', paragraphs: [data.error ?? 'Não consegui responder agora. Tente de novo.'] };
      setMessages((m) => [...m, reply]);
    } catch {
      setMessages((m) => [...m, { id: nextId.current++, from: 'lucca', paragraphs: ['Sem conexão no momento. Confira a internet e tente de novo.'] }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(question);
  };

  // on phones the panel covers the page: close it when following a link to another page
  const onInternalLink = () => {
    if (window.matchMedia('(max-width: 640px)').matches) close();
  };

  const showSuggestions = suggestions.length > 0 && messages.length === 1;

  return (
    <div className={styles['chat']}>
      <ol ref={logRef} className={styles['chat__log']} role="log" aria-live="polite" aria-label="Conversa com o Lucca">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`${styles['chat__message']} ${m.from === 'user' ? styles['chat__message--user'] : styles['chat__message--lucca']}`}
          >
            <span className={styles['chat__sr-only']}>{m.from === 'user' ? 'Você: ' : 'Lucca: '}</span>
            {m.paragraphs.map((p, i) => (
              <p key={i} className={styles['chat__text']}>{p}</p>
            ))}
            {m.sources && m.sources.length > 0 && (
              <ul className={styles['chat__sources']} aria-label="Fontes">
                {m.sources.map((s) => (
                  <li key={s.href}>
                    {s.external ? (
                      <a className={styles['chat__source']} href={s.href} target="_blank" rel="noopener noreferrer">
                        {s.label}
                        <ArrowUpRight size={14} aria-hidden />
                        <span className={styles['chat__sr-only']}> (abre em nova aba)</span>
                      </a>
                    ) : (
                      <Link className={styles['chat__source']} href={s.href} onClick={onInternalLink}>
                        {s.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        {loading && (
          <li className={`${styles['chat__message']} ${styles['chat__message--lucca']}`}>
            <span className={styles['chat__typing']} aria-hidden="true">
              <span className={styles['chat__dot']} />
              <span className={styles['chat__dot']} />
              <span className={styles['chat__dot']} />
            </span>
            <span className={styles['chat__sr-only']}>Lucca está procurando a resposta…</span>
          </li>
        )}
      </ol>

      {showSuggestions && (
        <div className={styles['chat__suggestions']}>
          <p className={styles['chat__suggestions-title']}>Experimente perguntar</p>
          <ul className={styles['chat__chips']}>
            {suggestions.map((s) => (
              <li key={s}>
                <button type="button" className={styles['chat__chip']} onClick={() => ask(s)} disabled={loading}>
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form className={styles['chat__form']} onSubmit={onSubmit}>
        <label className={styles['chat__sr-only']} htmlFor={inputId}>Sua pergunta</label>
        <input
          ref={inputRef}
          id={inputId}
          className={styles['chat__input']}
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pergunte sobre a ferramenta…"
          maxLength={MAX_QUESTION}
          autoComplete="off"
          enterKeyHint="send"
        />
        <button type="submit" className={styles['chat__send']} disabled={loading || !question.trim()} aria-label="Enviar pergunta">
          <SendHorizontal size={20} aria-hidden />
        </button>
      </form>
    </div>
  );
}
