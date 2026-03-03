import React, { useState } from 'react';
import { GameEvent, Rarity } from '../types/game';
import { useGameStore } from '../store/gameStore';

interface EventCardProps {
  event: GameEvent;
}

const RARITY_CONFIG: Record<
  Rarity,
  { label: string; color: string; glow: string; bg: string }
> = {
  COMMON: {
    label: '普通',
    color: '#6b7280',
    glow: 'none',
    bg: '#1a1a24',
  },
  RARE: {
    label: '稀有',
    color: '#3b82f6',
    glow: '0 0 15px #3b82f630',
    bg: '#0f172a',
  },
  EPIC: {
    label: '史诗',
    color: '#a855f7',
    glow: '0 0 25px #a855f740',
    bg: '#140d1f',
  },
  LEGENDARY: {
    label: '传说',
    color: '#ffd700',
    glow: '0 0 40px #ffd70050',
    bg: '#1a1400',
  },
  MEME: {
    label: '梗',
    color: '#ec4899',
    glow: '0 0 20px #ec489940',
    bg: '#1a0a18',
  },
};

function LegendaryEffect() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '16px',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#ffd700',
            animation: `particle${i % 4} ${1.5 + i * 0.3}s ease-in-out infinite`,
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

function MemeRainbowBorder() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: '-2px',
        borderRadius: '18px',
        background:
          'linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)',
        backgroundSize: '200% 100%',
        animation: 'rainbowShift 2s linear infinite',
        zIndex: -1,
      }}
    />
  );
}

export function EventCard({ event }: EventCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const makeChoice = useGameStore((s) => s.makeChoice);
  const outcomeText = useGameStore((s) => s.outcomeText);
  const continueAfterOutcome = useGameStore((s) => s.continueAfterOutcome);
  const gamePhase = useGameStore((s) => s.gamePhase);

  const cfg = RARITY_CONFIG[event.rarity];
  const showOutcome = outcomeText !== null && selectedChoice !== null;

  const handleChoice = (idx: number) => {
    if (showOutcome) return;
    setSelectedChoice(idx);
    makeChoice(idx);
  };

  const handleContinue = () => {
    setSelectedChoice(null);
    continueAfterOutcome();
  };

  return (
    <div
      style={{
        position: 'relative',
        background: cfg.bg,
        border: `2px solid ${cfg.color}`,
        borderRadius: '16px',
        padding: '1.8rem',
        boxShadow: cfg.glow,
        zIndex: 1,
        transition: 'all 0.3s ease',
      }}
    >
      {event.rarity === 'LEGENDARY' && <LegendaryEffect />}
      {event.rarity === 'MEME' && <MemeRainbowBorder />}

      {/* Rarity badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
        <span
          style={{
            background: cfg.color,
            color: event.rarity === 'LEGENDARY' ? '#000' : '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '999px',
            letterSpacing: '0.1em',
            animation:
              event.rarity === 'LEGENDARY'
                ? 'legendaryPulse 2s ease-in-out infinite'
                : 'none',
          }}
        >
          ◆ {cfg.label}
        </span>
        <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>{event.id}</span>
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: '1.6rem',
          fontWeight: 900,
          color: cfg.color,
          marginBottom: '1rem',
          lineHeight: 1.3,
          textShadow:
            event.rarity === 'LEGENDARY'
              ? `0 0 20px ${cfg.color}80`
              : 'none',
        }}
      >
        {event.title}
      </h2>

      {/* Intro */}
      {!showOutcome && (
        <p
          style={{
            fontSize: '0.95rem',
            color: '#c4c4e0',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
          }}
        >
          {event.intro}
        </p>
      )}

      {/* Outcome */}
      {showOutcome && (
        <div
          style={{
            background: '#0d0d1a',
            border: '1px solid #1f1f3a',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.2rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.5rem' }}>
            结果
          </div>
          <p style={{ color: '#c4c4e0', lineHeight: 1.7, fontSize: '0.95rem' }}>
            {outcomeText}
          </p>
        </div>
      )}

      {/* Choices */}
      {!showOutcome && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {event.choices.map((choice, idx) => (
            <ChoiceButton
              key={idx}
              text={choice.choice_text}
              onClick={() => handleChoice(idx)}
              accentColor={cfg.color}
            />
          ))}
        </div>
      )}

      {/* Continue button */}
      {showOutcome && gamePhase === 'playing' && (
        <button
          style={{
            background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}aa)`,
            color: event.rarity === 'LEGENDARY' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.7rem 2rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
            marginTop: '0.5rem',
            transition: 'all 0.2s',
          }}
          onClick={handleContinue}
        >
          继续人生 →
        </button>
      )}
    </div>
  );
}

function ChoiceButton({
  text,
  onClick,
  accentColor,
}: {
  text: string;
  onClick: () => void;
  accentColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        background: hovered ? `${accentColor}15` : '#0d0d1a',
        border: `1px solid ${hovered ? accentColor : '#1f1f3a'}`,
        borderRadius: '8px',
        color: hovered ? accentColor : '#c4c4e0',
        fontSize: '0.9rem',
        padding: '0.7rem 1rem',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.15s',
        transform: hovered ? 'translateX(4px)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ marginRight: '0.5rem', opacity: 0.5 }}>▶</span>
      {text}
    </button>
  );
}
