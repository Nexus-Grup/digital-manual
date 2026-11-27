'use client';

import { useId } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from '@/_styles/cssUserPanelPage/Overview.module.css';

export type FilterField = {
  /** search param name (e.g. "periodo") */
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
};

/** Overview filters: each select updates the URL right away (the page re-renders on the server). */
export function OverviewFilters({ fields }: { fields: FilterField[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const uid = useId();

  const change = (name: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className={styles['overview-filters']}>
      {fields.map((f) => (
        <div className={styles['overview-filters__field']} key={f.name}>
          <label className={styles['overview-filters__label']} htmlFor={`${uid}-${f.name}`}>{f.label}</label>
          <select
            id={`${uid}-${f.name}`}
            className={styles['overview-filters__select']}
            value={f.value}
            onChange={(e) => change(f.name, e.target.value)}
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
