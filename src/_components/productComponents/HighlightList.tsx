'use client';

import { highlightIcon } from './highlightIcons';
import SideCard from './SideCard';
import SnapList from './SnapList';

export type Highlight = { id: number; title: string; description: string | null; icon: string | null };

// "Destaques" column of the information page.
export default function HighlightList({ cards }: { cards: Highlight[] }) {
  return (
    <SnapList
      title="Destaques"
      label="Destaques da ferramenta"
      items={cards}
      getKey={(card) => card.id}
      renderItem={(card, _i, active) => {
        const Icon = highlightIcon(card.icon);
        return (
          <SideCard
            variant="icon"
            leading={<Icon size={22} />}
            title={card.title}
            text={card.description}
            active={active}
          />
        );
      }}
    />
  );
}
