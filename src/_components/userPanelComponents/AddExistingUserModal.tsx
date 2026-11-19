'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/CompanyUsers.module.css';
import { request } from '@/lib/request';
import { Modal } from './Modal';

type Candidate = { id: number; firstName: string; lastName: string; email: string };

type Props = {
  companyId: number;
  onClose: () => void;
  onAdded: () => void;
};

export function AddExistingUserModal({ companyId, onClose, onAdded }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [role, setRole] = useState<'OWNER' | 'MEMBER'>('MEMBER');
  const [saving, setSaving] = useState(false);

  const term = query.trim();
  const searching = term.length >= 2;

  // busca com atraso de 300 ms; o estado só muda dentro do callback assíncrono
  useEffect(() => {
    if (!searching) return;
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/companies/${companyId}/available-users?q=${encodeURIComponent(term)}`,
          { signal: ctrl.signal },
        );
        const data = await res.json().catch(() => ({}));
        setResults(res.ok ? data.users : []);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setResults([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [term, searching, companyId]);

  const shown = searching ? results : [];
  const selected = shown.find((u) => u.id === selectedId);

  async function add() {
    if (!selected) return;
    setSaving(true);
    const err = await request(`/api/companies/${companyId}/members`, 'POST', {
      userId: selected.id,
      companyRole: role,
    });
    setSaving(false);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success('User added to the company.');
    onAdded();
  }

  return (
    <Modal label="Add existing user" onClose={onClose}>
      <h2 className={styles.modalTitle}>Add existing user</h2>

      <label htmlFor="user-search" className={styles.modalLabel}>Search user</label>
      <input
        id="user-search"
        type="search"
        className={styles.search}
        placeholder="Search by name or email ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        autoFocus
      />

      <ul className={styles.candidates} aria-live="polite">
        {searching && loading && <li className={styles.hint}>Searching...</li>}
        {searching && !loading && shown.length === 0 && <li className={styles.hint}>No users found.</li>}
        {shown.map((u) => (
          <li key={u.id}>
            <button
              type="button"
              className={`${styles.candidate} ${u.id === selectedId ? styles.candidateActive : ''}`}
              aria-pressed={u.id === selectedId}
              onClick={() => setSelectedId(u.id)}
            >
              <span className={styles.avatar}><User size={18} aria-hidden /></span>
              <span className={styles.who}>
                <span className={styles.whoName}>{u.firstName} {u.lastName}</span>
                <span className={styles.whoEmail}>{u.email}</span>
              </span>
              <span className={styles.availableBadge}>Available</span>
            </button>
          </li>
        ))}
      </ul>

      <fieldset className={styles.fieldset}>
        <legend>Company role</legend>
        <label className={styles.radioRow}>
          <input type="radio" name="add-role" checked={role === 'OWNER'} onChange={() => setRole('OWNER')} />
          Owner
        </label>
        <label className={styles.radioRow}>
          <input type="radio" name="add-role" checked={role === 'MEMBER'} onChange={() => setRole('MEMBER')} />
          Member
        </label>
      </fieldset>

      <button type="button" className={styles.wideBtn} onClick={add} disabled={!selected || saving}>
        <User size={14} aria-hidden /> {saving ? 'Adding...' : 'Add to company'}
      </button>
    </Modal>
  );
}