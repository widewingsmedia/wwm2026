"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, type Variants } from "motion/react";

const CARD_SPACING = 28;

export type FanCardItem = {
  src: string;
  href?: string;
  alt?: string;
};

type SpringConfig = {
  type: "spring";
  bounce?: number;
  visualDuration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

const defaultSpring: SpringConfig = {
  type: "spring",
  visualDuration: 0.5,
  bounce: 0.2,
};

export interface FeyCardsProps {
  cards: FanCardItem[];
  spring?: SpringConfig;
  shiftDistance?: number;
  entranceStagger?: number;
  className?: string;
}

/**
 * A hand-of-cards hero visual: cards rest stacked with a slight left offset,
 * and hovering one pushes every card after it further right, fanning the
 * stack open. Adapted from the reference implementation — the two swap-text
 * headlines and the generic idle/spine artwork were dropped since they were
 * tied to demo-only assets; this version shows each card's real image at
 * all times and keeps only the entrance + hover-fan motion.
 */
export const FeyCards = ({
  cards,
  spring = defaultSpring,
  shiftDistance = 44,
  entranceStagger = 0.12,
  className,
}: FeyCardsProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: entranceStagger,
        staggerDirection: -1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: (offset: number) => ({ x: offset, opacity: 0 }),
    visible: { x: 0, opacity: 1, transition: spring },
  };

  return (
    <motion.div
      className={cn("relative h-[280px] w-[220px] sm:h-[340px] sm:w-[260px]", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => {
        const shouldShift = activeIndex !== null && index > activeIndex;
        const isActive = activeIndex === index;
        const entranceOffset = -index * CARD_SPACING;
        const Wrapper = card.href ? motion.a : motion.div;

        return (
          <Wrapper
            key={card.src}
            {...(card.href ? { href: card.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group absolute bottom-0 h-[220px] w-[150px] cursor-pointer sm:h-[270px] sm:w-[180px]"
            style={{ left: `${index * CARD_SPACING}px` }}
            variants={cardVariants}
            custom={entranceOffset}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <motion.div
              className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
              animate={{
                x: shouldShift ? shiftDistance : 0,
                scale: isActive ? 1.04 : 1,
              }}
              transition={spring}
            >
              <img
                src={card.src}
                alt={card.alt ?? ""}
                width={400}
                height={600}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </motion.div>
          </Wrapper>
        );
      })}
    </motion.div>
  );
};

export default FeyCards;
