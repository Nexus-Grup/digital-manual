import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, AudioLines, BookOpen, Download, Images, Info, Layers, PlayCircle, Sparkles, Wrench,
  type LucideIcon,
} from 'lucide-react';
import styles from '@/_styles/cssProductPage/ProductHome.module.css';
import type { PublicProduct } from '@/_data/publicProduct';
import type { ProductAssembly } from '@/_data/getAssembly';
import { toSpecs } from '@/_lib/productSpecs';
import { highlightIcon } from '../highlightIcons';
import HomeMediaButton from './HomeMediaButton';

type Props = {
  product: PublicProduct;
  assembly: ProductAssembly | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  ELECTRONICS: 'Eletrônicos',
  FURNITURE: 'Móveis',
  APPLIANCES: 'Eletrodomésticos',
  TOOLS: 'Ferramentas',
  AUTOMOTIVE: 'Automotivo',
  SOFTWARE: 'Software',
};

const MAX_STATS = 3;
const MAX_PREVIEW_STEPS = 4;

// only these hosts go through the image optimizer (see next.config images.remotePatterns)
const optimizable = (src: string) =>
  src.startsWith('/') || /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(src);

function Picture({ src, alt, sizes, className, priority }: {
  src: string; alt: string; sizes: string; className: string; priority?: boolean;
}) {
  if (!optimizable(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} />;
  }
  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}

/** Index for staggered entrance animations (CSS reads --i). */
const stagger = (i: number) => ({ '--i': i }) as CSSProperties;

/** descriptive values (e.g. material) get a wider card and a smaller font */
const isLongText = (value: string) => value.length > 24;

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

type Action = {
  key: string;
  icon: LucideIcon;
  title: string;
  meta: string;
  href?: string;
  tab?: 'video' | 'sound';
};

/**
 * Product home ("Início"): a landing page that sums up the product and leads to each part of the
 * digital manual. Every section only renders when the product has that content.
 */
export default function ProductHome({ product, assembly }: Props) {
  const base = `/products/${product.id}`;
  const images = [...new Set([product.imgUrl, ...product.gallery].filter((u): u is string => Boolean(u)))];
  const mainImage = images[0] ?? null;
  const description = product.information?.description ?? product.description;
  const cards = product.information?.cards ?? [];
  const specs = toSpecs(product.technical?.specs);
  const stats = specs.slice(0, MAX_STATS);
  const steps = assembly?.steps ?? [];
  const manual = product.manuals.find((m) => m.documentType === 'USER_MANUAL') ?? product.manuals[0] ?? null;
  const category = product.category ? CATEGORY_LABELS[product.category] : null;

  const actions: Action[] = [
    // same order as the hub: manual, assembly, information
    ...(manual
      ? [{ key: 'manual', icon: BookOpen, title: 'Ler o manual', meta: 'Busca, sumário e texto ampliável', href: `${base}/manual` }]
      : []),
    ...(steps.length > 0
      ? [{ key: 'assembly', icon: Wrench, title: 'Montar passo a passo', meta: `${plural(steps.length, 'passo', 'passos')} com desenhos`, href: `${base}/assembly` }]
      : []),
    {
      key: 'information',
      icon: Info,
      title: 'Conhecer a ferramenta',
      meta: cards.length > 0 ? `${plural(cards.length, 'destaque', 'destaques')} e fotos` : 'Descrição e fotos',
      href: `${base}/information`,
    },
    ...(product.videos.length > 0
      ? [{ key: 'video', icon: PlayCircle, title: 'Assistir aos vídeos', meta: plural(product.videos.length, 'vídeo', 'vídeos'), tab: 'video' as const }]
      : []),
    ...(product.audios.length > 0
      ? [{ key: 'sound', icon: AudioLines, title: 'Ouvir a ferramenta', meta: 'Experiência sonora', tab: 'sound' as const }]
      : []),
  ];

  // numbers first, long text (material) last, so the grid rows close evenly
  const sheetRows: { key: string; label: string; value: string }[] = [
    ...specs.map((s) => ({ key: s.key, label: s.label, value: s.value })),
    ...(product.technical?.dimensions ? [{ key: 'dimensions', label: 'dimensões', value: product.technical.dimensions }] : []),
    ...(product.technical?.weightKg ? [{ key: 'weight', label: 'peso', value: `${product.technical.weightKg} kg` }] : []),
    ...(product.technical?.material ? [{ key: 'material', label: 'material', value: product.technical.material }] : []),
  ];

  const primary: { href: string; label: string } = steps.length > 0
    ? { href: `${base}/assembly`, label: 'Começar a montagem' }
    : manual
      ? { href: `${base}/manual`, label: 'Abrir o manual' }
      : { href: `${base}/information`, label: 'Ver informações' };

  return (
    <div className={styles['home']}>
      {/* ===== HERO ===== */}
      <section className={styles['home-hero']} aria-labelledby="home-title">
        <div className={styles['home-hero__container']}>
          <div className={styles['home-hero__content']}>
            <ul className={`${styles['home-hero__tags']} ${styles['home-enter']}`} style={stagger(0)} aria-label="Marca e categoria">
              {product.brand?.name && (
                <li className={`${styles['home-hero__tag']} ${styles['home-hero__tag--brand']}`}>{product.brand.name}</li>
              )}
              {category && <li className={styles['home-hero__tag']}>{category}</li>}
            </ul>

            <div className={`${styles['home-hero__heading']} ${styles['home-enter']}`} style={stagger(1)}>
              <h1 className={styles['home-hero__title']} id="home-title">
                {product.name.split('/').join('/​')}
              </h1>
              {(product.model || product.code) && (
                <p className={styles['home-hero__model']}>
                  {product.model && <>Modelo {product.model}</>}
                  {product.model && product.code && ' · '}
                  {product.code && <>Código {product.code}</>}
                </p>
              )}
            </div>

            {description && (
              <div className={`${styles['home-hero__about']} ${styles['home-enter']}`} style={stagger(2)}>
                <p className={styles['home-hero__text']}>{description}</p>
                <Link className={styles['home-hero__link']} href={`${base}/information`}>
                  Ver todas as informações
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            )}

            {stats.length > 0 && (
              <ul className={styles['home-hero__stats']} aria-label="Especificações principais">
                {stats.map((s, i) => (
                  <li key={s.key} className={styles['home-hero__stat']} style={stagger(i)}>
                    <strong className={styles['home-hero__stat-value']}>{s.value}</strong>
                    <span className={styles['home-hero__stat-label']}>{s.label}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className={`${styles['home-hero__actions']} ${styles['home-enter']}`} style={stagger(4)}>
              <Link className={styles['home-button']} href={primary.href}>
                {primary.label}
                <ArrowRight size={20} aria-hidden />
              </Link>
              {product.videos.length > 0 && (
                <HomeMediaButton tab="video" className={`${styles['home-button']} ${styles['home-button--outlined']}`}>
                  <PlayCircle size={20} aria-hidden />
                  Assistir vídeo
                </HomeMediaButton>
              )}
            </div>
          </div>

          <div className={styles['home-hero__visual']}>
            <div className={styles['home-hero__glow']} aria-hidden="true" />
            <div className={styles['home-hero__frame']}>
              {mainImage && <span className={styles['home-hero__shadow']} aria-hidden="true" />}
              {mainImage ? (
                <Picture
                  className={styles['home-hero__image']}
                  src={mainImage}
                  alt={product.name}
                  sizes="(min-width: 1200px) 520px, (min-width: 768px) 45vw, 92vw"
                  priority
                />
              ) : (
                <Sparkles className={styles['home-hero__placeholder']} size={64} aria-hidden />
              )}
            </div>
            {steps.length > 0 && (
              <p className={styles['home-hero__badge']}>
                <Layers size={18} aria-hidden />
                {plural(steps.length, 'passo ilustrado', 'passos ilustrados')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ===== QUICK ACTIONS ===== */}
      <section className={styles['home-actions']} aria-labelledby="home-actions-title">
        <div className={styles['home-actions__container']}>
          <h2 className={styles['home-heading']} id="home-actions-title">O que você precisa agora?</h2>
          <ul className={styles['home-actions__list']}>
            {actions.map(({ key, icon: Icon, title, meta, href, tab }, i) => {
              const content: ReactNode = (
                <>
                  <span className={styles['home-actions__icon']} aria-hidden="true"><Icon size={26} /></span>
                  <span className={styles['home-actions__body']}>
                    <span className={styles['home-actions__title']}>{title}</span>
                    <span className={styles['home-actions__meta']}>{meta}</span>
                  </span>
                  <ArrowRight className={styles['home-actions__arrow']} size={20} aria-hidden />
                </>
              );
              return (
                <li key={key} className={`${styles['home-actions__item']} ${styles['home-reveal']}`} style={stagger(i)}>
                  {href ? (
                    <Link className={styles['home-actions__card']} href={href}>{content}</Link>
                  ) : (
                    <HomeMediaButton tab={tab ?? 'video'} className={styles['home-actions__card']}>{content}</HomeMediaButton>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ===== HIGHLIGHTS ===== */}
      {cards.length > 0 && (
        <section className={styles['home-highlights']} aria-labelledby="home-highlights-title">
          <div className={styles['home-highlights__container']}>
            <div className={styles['home-highlights__header']}>
              <p className={styles['home-eyebrow']}>Destaques</p>
              <h2 className={styles['home-heading']} id="home-highlights-title">Feita para o seu dia a dia</h2>
            </div>
            <ul className={styles['home-highlights__list']}>
              {cards.map((card, i) => {
                const Icon = highlightIcon(card.icon);
                return (
                  <li key={card.id} className={`${styles['home-highlights__card']} ${styles['home-reveal']}`} style={stagger(i)}>
                    <span className={styles['home-highlights__icon']} aria-hidden="true"><Icon size={24} /></span>
                    <h3 className={styles['home-highlights__title']}>{card.title}</h3>
                    {card.description && <p className={styles['home-highlights__text']}>{card.description}</p>}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ===== ASSEMBLY PREVIEW ===== */}
      {assembly && steps.length > 0 && (
        <section className={styles['home-assembly']} aria-labelledby="home-assembly-title">
          <div className={styles['home-assembly__container']}>
            <div className={styles['home-assembly__header']}>
              <p className={styles['home-eyebrow']}>Montagem</p>
              <h2 className={styles['home-heading']} id="home-assembly-title">
                Pronta para usar em {plural(steps.length, 'passo', 'passos')}
              </h2>
              {assembly.description && <p className={styles['home-assembly__text']}>{assembly.description}</p>}
            </div>

            <ol className={styles['home-assembly__list']}>
              {steps.slice(0, MAX_PREVIEW_STEPS).map((step, i) => (
                <li key={step.id} className={`${styles['home-assembly__step']} ${styles['home-reveal']}`} style={stagger(i)}>
                  <div className={styles['home-assembly__thumb']}>
                    {step.imageUrl && (
                      <Picture
                        className={styles['home-assembly__image']}
                        src={step.imageUrl}
                        alt=""
                        sizes="(min-width: 1200px) 260px, (min-width: 768px) 25vw, 60vw"
                      />
                    )}
                    <span className={styles['home-assembly__letter']} aria-hidden="true">{step.label}</span>
                  </div>
                  <p className={styles['home-assembly__name']}>
                    <span className={styles['home-sr-only']}>Passo {step.label}: </span>
                    {step.name}
                  </p>
                </li>
              ))}
            </ol>

            <Link className={styles['home-button']} href={`${base}/assembly`}>
              Começar pelo passo A
              <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
        </section>
      )}

      {/* ===== GALLERY ===== */}
      {images.length > 1 && (
        <section className={styles['home-gallery']} aria-labelledby="home-gallery-title">
          <div className={styles['home-gallery__container']}>
            <div className={styles['home-gallery__header']}>
              <p className={styles['home-eyebrow']}>Galeria</p>
              <h2 className={styles['home-heading']} id="home-gallery-title">Veja de perto</h2>
            </div>
            {/* keyboard users scroll the row with the arrow keys once it has focus */}
            <ul className={styles['home-gallery__track']} tabIndex={0} aria-label="Fotos do produto (role para o lado)">
              {images.map((src, i) => (
                <li key={src} className={styles['home-gallery__item']}>
                  <Picture
                    className={styles['home-gallery__image']}
                    src={src}
                    alt={`${product.name}, foto ${i + 1} de ${images.length}`}
                    sizes="(min-width: 1200px) 360px, (min-width: 768px) 40vw, 75vw"
                  />
                </li>
              ))}
            </ul>
            <Link className={styles['home-hero__link']} href={`${base}/information`}>
              <Images size={18} aria-hidden />
              Ver fotos em tamanho maior
            </Link>
          </div>
        </section>
      )}

      {/* ===== TECHNICAL SHEET ===== */}
      {sheetRows.length > 0 && (
        <section className={styles['home-specs']} aria-labelledby="home-specs-title">
          <div className={styles['home-specs__container']}>
            <div className={styles['home-specs__header']}>
              <p className={styles['home-eyebrow']}>Ficha técnica</p>
              <h2 className={styles['home-heading']} id="home-specs-title">Os números da ferramenta</h2>
            </div>
            <dl className={styles['home-specs__list']}>
              {sheetRows.map((row, i) => (
                <div
                  key={row.key}
                  className={`${styles['home-specs__item']} ${isLongText(row.value) ? styles['home-specs__item--wide'] : ''} ${styles['home-reveal']}`}
                  style={stagger(i)}
                >
                  <dt className={styles['home-specs__label']}>{row.label}</dt>
                  <dd className={`${styles['home-specs__value']} ${isLongText(row.value) ? styles['home-specs__value--text'] : ''}`}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ===== CLOSING CTA ===== */}
      <section className={styles['home-cta']} aria-labelledby="home-cta-title">
        <div className={styles['home-cta__container']}>
          <div className={`${styles['home-cta__card']} ${styles['home-reveal']}`}>
            <div className={styles['home-cta__heading']}>
              <h2 className={styles['home-cta__title']} id="home-cta-title">Tudo sobre a sua ferramenta, num só lugar</h2>
              <p className={styles['home-cta__text']}>
                Manual com busca e leitura em voz alta, montagem ilustrada e vídeos, quando você precisar.
              </p>
            </div>
            <div className={styles['home-cta__actions']}>
              <Link className={`${styles['home-button']} ${styles['home-button--light']}`} href={primary.href}>
                {primary.label}
                <ArrowRight size={20} aria-hidden />
              </Link>
              {manual?.fileUrl && (
                <a
                  className={`${styles['home-button']} ${styles['home-button--ghost']}`}
                  href={manual.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download size={20} aria-hidden />
                  Baixar manual em PDF
                  <span className={styles['home-sr-only']}> (abre em nova aba)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
