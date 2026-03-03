import React from 'react';
import { useGameStore } from '../store/gameStore';
import { StatsPanel } from './StatsPanel';
import { EventCard } from './EventCard';
import { GameEvent } from '../types/game';

const RARITY_COLORS: Record<string, string> = {
  COMMON: '#6b7280',
  RARE: '#3b82f6',
  EPIC: '#a855f7',
  LEGENDARY: '#ffd700',
  MEME: '#ec4899',
};

function HistoryItem({
  event,
  choiceIndex,
  age,
}: {
  event: GameEvent;
  choiceIndex: number;
  age: number;
}) {
  const choice = event.choices[choiceIndex];
  const color = RARITY_COLORS[event.rarity] ?? '#6b7280';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.6rem',
        padding: '0.5rem 0.8rem',
        background: '#0d0d1a',
        borderRadius: '6px',
        borderLeft: `3px solid ${color}`,
        flexShrink: 0,
      }}
    >
      <span style={{ color: '#4b5563', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
        {age}岁
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.8rem',
            color: color,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {event.title}
        </div>
        {choice && (
          <div
            style={{
              fontSize: '0.7rem',
              color: '#6b7280',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            → {choice.choice_text}
          </div>
        )}
      </div>
    </div>
  );
}

function NoEventCard({ age, onAdvance }: { age: number; onAdvance: () => void }) {
  return (
    <div
      style={{
        background: '#12121a',
        border: '2px solid #1f1f2e',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
      <div style={{ fontSize: '1.2rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
        {age}岁 — 平静的一年
      </div>
      <div style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '1.5rem' }}>
        这一年没有什么特别的事情发生，日子就这样过去了…
      </div>
      <button
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.7rem 2rem',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
        }}
        onClick={onAdvance}
      >
        快进一年 →
      </button>
    </div>
  );
}

export function GameScreen() {
  const { stats, age, career, playerName, currentEvent, eventHistory, gamePhase } =
    useGameStore();
  const advanceYear = useGameStore((s) => s.advanceYear);

  const recentHistory = eventHistory.slice(-5).reverse();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        color: '#e0e0ff',
        fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          background: '#0d0d1a',
          borderBottom: '1px solid #1f1f2e',
          padding: '0.6rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(90deg, #ffd700, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 900,
            fontSize: '1.1rem',
          }}
        >
          爽文人生模拟器
        </div>
        <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
          {playerName} · {age}岁 · {gamePhase === 'playing' ? '人生进行中' : ''}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: '1.5rem',
          padding: '1.5rem',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Stats Panel */}
        <div style={{ flexShrink: 0 }}>
          <StatsPanel stats={stats} age={age} career={career} playerName={playerName} />
        </div>

        {/* Right: Event Area */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Current Event */}
          {currentEvent ? (
            <EventCard event={currentEvent} />
          ) : (
            <NoEventCard age={age} onAdvance={advanceYear} />
          )}

          {/* History */}
          {recentHistory.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#4b5563',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.1em',
                }}
              >
                最近经历
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                {recentHistory.map((h, i) => (
                  <HistoryItem
                    key={i}
                    event={h.event}
                    choiceIndex={h.choiceIndex}
                    age={h.age}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
