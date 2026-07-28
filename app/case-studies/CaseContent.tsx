import Image from 'next/image';
import type { ReactNode } from 'react';
import ShatterSlideshow from './ShatterSlideshow';

type SectionProps = {
  eyebrow?: string;
  title?: string;
  className?: string;
  children: ReactNode;
};

export function CaseSection({ eyebrow, title, className = '', children }: SectionProps) {
  return (
    <section className={`cs-section ${className}`}>
      <div className="cs-container">
        {eyebrow && <p className="cs-eyebrow">{eyebrow}</p>}
        {title && <h2 className="cs-section-title">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

type CaseSplitProps = {
  image: string;
  images?: string[];
  collage?: string[];
  imageAlt: string;
  reverse?: boolean;
  children: ReactNode;
};

export function CaseSplit({ image, images, collage, imageAlt, reverse, children }: CaseSplitProps) {
  return (
    <div className={`cs-split${reverse ? ' cs-split-reverse' : ''}`}>
      <div className="cs-split-media">
        {collage && collage.length > 1 ? (
          <div className="cs-collage">
            {collage.map((src) => (
              <div className="cs-collage-item" key={src}>
                <Image
                  src={src}
                  alt={imageAlt}
                  fill
                  // Sized for the full split-media box, not the resting quarter-tile —
                  // .cs-collage-item:hover expands a tile to 100% of the container, so
                  // the image needs to be downloaded at that larger size upfront.
                  sizes="(max-width: 900px) 90vw, 45vw"
                  className="cs-collage-img"
                />
              </div>
            ))}
          </div>
        ) : images && images.length > 1 ? (
          <ShatterSlideshow images={images} alt={imageAlt} />
        ) : (
          <Image src={image} alt={imageAlt} fill sizes="(max-width: 900px) 90vw, 45vw" style={{ objectFit: 'cover' }} />
        )}
      </div>
      <div className="cs-split-content">{children}</div>
    </div>
  );
}

type MetaItem = { label: string; value: string };

export function CaseIntro({
  title,
  meta,
  paragraphs,
  visual,
}: {
  title: string;
  meta: MetaItem[];
  paragraphs: string[];
  visual?: ReactNode;
}) {
  return (
    <CaseSection eyebrow="Overview" title={title}>
      <div className={visual ? 'cs-intro-grid' : undefined}>
        <div>
          <div className="cs-meta-row">
            {meta.map((m) => (
              <div className="cs-meta-item" key={m.label}>
                <p className="cs-meta-label">{m.label}</p>
                <p className="cs-meta-value">{m.value}</p>
              </div>
            ))}
          </div>
          {paragraphs.map((p) => (
            <p className="cs-lead" key={p}>{p}</p>
          ))}
        </div>
        {visual && <div className="cs-intro-visual">{visual}</div>}
      </div>
    </CaseSection>
  );
}

export function CaseChallenges({
  title = 'Challenges',
  intro,
  items,
}: {
  title?: string;
  intro?: string;
  items: string[];
}) {
  return (
    <>
      <p className="cs-eyebrow">The Brief</p>
      <h2 className="cs-section-title">{title}</h2>
      {intro && <p className="cs-lead">{intro}</p>}
      <div className="cs-challenge-list">
        {items.map((item, i) => (
          <div className="cs-challenge-item" key={item}>
            <span className="cs-challenge-num">{String(i + 1).padStart(2, '0')}</span>
            <p className="cs-challenge-text">{item}</p>
          </div>
        ))}
      </div>
    </>
  );
}

type ProcessStep = { title: string; description: string };

export function CaseProcess({ steps }: { steps: ProcessStep[] }) {
  return (
    <>
      <p className="cs-eyebrow">Our Approach</p>
      <h2 className="cs-section-title">Our Work Process</h2>
      <div className="cs-process-list">
        {steps.map((step) => (
          <div className="cs-process-step" key={step.title}>
            <p className="cs-process-step-title">{step.title}</p>
            <p className="cs-process-step-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ServiceCheck() {
  return (
    <span className="cs-service-check">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
    </span>
  );
}

export function CaseServices({
  eyebrow = 'Scope of Work',
  title = 'Services We Provided',
  items,
}: {
  eyebrow?: string;
  title?: string;
  items: string[];
}) {
  return (
    <CaseSection eyebrow={eyebrow} title={title}>
      <div className="cs-services-grid">
        {items.map((item) => (
          <div className="cs-service-item" key={item}>
            <ServiceCheck />
            {item}
          </div>
        ))}
      </div>
    </CaseSection>
  );
}

type ServiceGroup = { heading: string; items: string[] };

export function CaseServiceGroups({
  eyebrow = 'Scope of Work',
  title = 'Services We Provide',
  groups,
}: {
  eyebrow?: string;
  title?: string;
  groups: ServiceGroup[];
}) {
  return (
    <CaseSection eyebrow={eyebrow} title={title}>
      <div className="cs-service-groups">
        {groups.map((group) => (
          <div className="cs-service-group" key={group.heading}>
            <p className="cs-service-group-title">{group.heading}</p>
            <div className="cs-services-grid cs-services-grid-single">
              {group.items.map((item) => (
                <div className="cs-service-item" key={item}>
                  <ServiceCheck />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CaseSection>
  );
}

type ResultGroup = { heading: string; items: string[] };

export function CaseResults({ groups }: { groups: ResultGroup[] }) {
  return (
    <CaseSection eyebrow="The Outcome" title="Results & Business Impact">
      <div className="cs-results-groups">
        {groups.map((group) => (
          <div key={group.heading}>
            <p className="cs-result-group-title">{group.heading}</p>
            <div className="cs-result-list">
              {group.items.map((item) => (
                <div className="cs-result-item" key={item}>
                  <span className="cs-result-bullet" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CaseSection>
  );
}

type ImpactItem = { heading: string; description: string };

export function CaseImpactList({
  eyebrow = 'The Outcome',
  title = 'Results & Business Impact',
  items,
}: {
  eyebrow?: string;
  title?: string;
  items: ImpactItem[];
}) {
  return (
    <CaseSection eyebrow={eyebrow} title={title}>
      <div className="cs-impact-list">
        {items.map((item) => (
          <div className="cs-impact-item" key={item.heading}>
            <p className="cs-impact-heading">{item.heading}</p>
            <p className="cs-impact-desc">{item.description}</p>
          </div>
        ))}
      </div>
    </CaseSection>
  );
}

export function CaseTestimonial({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <section className="cs-section cs-section-alt cs-testimonial-section">
      <div className="cs-container">
        <blockquote className="cs-testimonial">
          <p className="cs-testimonial-quote">{quote}</p>
          <p className="cs-testimonial-attribution">{attribution}</p>
        </blockquote>
      </div>
    </section>
  );
}

type PlatformMetric = { label: string; a: number; b: number; format?: (n: number) => string };

export function CaseStats({
  note,
  platformA,
  platformB,
  metrics,
}: {
  note?: string;
  platformA: string;
  platformB: string;
  metrics: PlatformMetric[];
}) {
  return (
    <CaseSection eyebrow="Performance" title="Performance at a Glance" className="cs-section-alt">
      {note && <p className="cs-stats-note">{note}</p>}
      <div className="cs-stats-grid">
        {metrics.map((metric) => {
          const max = Math.max(metric.a, metric.b) || 1;
          const format = metric.format ?? ((n: number) => n.toLocaleString('en-US'));
          return (
            <div className="cs-stat-card" key={metric.label}>
              <p className="cs-stat-label">{metric.label}</p>

              <div className="cs-stat-row">
                <span className="cs-stat-platform">{platformA}</span>
                <span className="cs-stat-value">{format(metric.a)}</span>
              </div>
              <div className="cs-stat-bar-track">
                <div className="cs-stat-bar-fill ig" style={{ width: `${(metric.a / max) * 100}%` }} />
              </div>

              <div className="cs-stat-row">
                <span className="cs-stat-platform">{platformB}</span>
                <span className="cs-stat-value">{format(metric.b)}</span>
              </div>
              <div className="cs-stat-bar-track">
                <div className="cs-stat-bar-fill tiktok" style={{ width: `${(metric.b / max) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </CaseSection>
  );
}

export function CaseWebsitePreview({
  eyebrow = 'The Website',
  title = 'See It Live',
  lead,
  url,
  label,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  url?: string;
  label?: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}) {
  const displayUrl = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : label;

  const chrome = (
    <div className="cs-site-preview-chrome">
      <span className="cs-site-preview-dot cs-dot-red" />
      <span className="cs-site-preview-dot cs-dot-yellow" />
      <span className="cs-site-preview-dot cs-dot-green" />
      <span className="cs-site-preview-url">{displayUrl}</span>
    </div>
  );

  const window = (
    <div className="cs-site-preview-window">
      <Image src={image} alt={imageAlt} width={imageWidth} height={imageHeight} className="cs-site-preview-img" />
    </div>
  );

  return (
    <CaseSection eyebrow={eyebrow} title={title} className="cs-website-preview-section">
      {lead && <p className="cs-lead">{lead}</p>}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="cs-site-preview">
          {chrome}
          {window}
        </a>
      ) : (
        <div className="cs-site-preview">
          {chrome}
          {window}
        </div>
      )}
    </CaseSection>
  );
}
