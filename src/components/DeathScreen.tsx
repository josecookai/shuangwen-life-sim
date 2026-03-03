import React from 'react';
import { useGameStore } from '../store/gameStore';
import { GameEvent } from '../types/game';

const RARITY_COLORS: Record<string, string> = {
  COMMON: '#6b7280',
  RARE: '#3b82f6',
  EPIC: '#a855f7',
  LEGENDARY: '#ffd700',
  MEME: '#ec4899',
};

function LifeSummaryCard({
  playerName,
  age,
  career,
  stats,
  eventHistory,
  gamePhase,
}: {
  playerName: string;
  age: number;
  career: string;
  stats: { Money: number; Reputation: number; Impact: number; Health: number };
  eventHistory: Array<{ event: GameEvent; choiceIndex: number; age: number }>;
  gamePhase: string;
}) {
  const isDead = gamePhase === 'dead';
  const legendaryEvents = eventHistory.filter((h) => h.event.rarity === 'LEGENDARY');
  const epicEvents = eventHistory.filter((h) => h.event.rarity === 'EPIC');

  const maxMoney = eventHistory.reduce((max, _) => Math.max(max, stats.Money), stats.Money);

  const scoreRating = () => {
    const total =
      stats.Money * 0.3 + stats.Reputation + stats.Impact + age * 2;
    if (total > 300) return '传说级';
    if (total > 200) return '史诗级';
    if (total > 100) return '优秀';
    if (total > 50) return '普通';
    return '悲剧';
  };

  return (
    <div
      style={{
        background: '#12121a',
        border: isDead ? '2px solid #ef4444' : '2px solid #ffd700',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: isDead ? '0 0 40px #ef444420' : '0 0 40px #ffd70020',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          {isDead ? '💀' : '🏆'}
        </div>
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: isDead ? '#ef4444' : '#ffd700',
            marginBottom: '0.3rem',
          }}
        >
          {isDead ? '人生终结' : '功成身退'}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          {isDead ? '这一生，也算是活过了' : '你完成了这段人生旅途'}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.8rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatItem label="姓名" value={playerName} />
        <StatItem label="享年" value={`${age}岁`} />
        <StatItem label="职业" value={career} />
        <StatItem label="人生评级" value={scoreRating()} highlight />
        <StatItem
          label="最高资产"
          value={`¥${maxMoney.toFixed(1)}万`}
          color={maxMoney > 0 ? '#ffd700' : '#ef4444'}
        />
        <StatItem
          label="声望"
          value={stats.Reputation.toFixed(0)}
          color="#a855f7"
        />
        <StatItem
          label="传说事件"
          value={`${legendaryEvents.length}个`}
          color="#ffd700"
        />
        <StatItem
          label="史诗事件"
          value={`${epicEvents.length}个`}
          color="#a855f7"
        />
        <StatItem label="经历总数" value={`${eventHistory.length}个`} />
        <StatItem label="影响力" value={stats.Impact.toFixed(0)} color="#06b6d4" />
      </div>

      {/* Key Events */}
      {legendaryEvents.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              fontSize: '0.7rem',
              color: '#ffd700',
              marginBottom: '0.5rem',
              letterSpacing: '0.1em',
            }}
          >
            传说时刻
          </div>
          {legendaryEvents.slice(0, 3).map((h, i) => (
            <div
              key={i}
              style={{
                padding: '0.4rem 0.8rem',
                background: '#1a1400',
                borderRadius: '6px',
                borderLeft: '3px solid #ffd700',
                marginBottom: '0.3rem',
                fontSize: '0.8rem',
                color: '#e0e0ff',
              }}
            >
              {h.age}岁：{h.event.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatItem({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: '#0d0d1a',
        borderRadius: '8px',
        padding: '0.6rem 0.8rem',
      }}
    >
      <div style={{ fontSize: '0.7rem', color: '#4b5563', marginBottom: '2px' }}>
        {label}
      </div>
      <div
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: color ?? (highlight ? '#ffd700' : '#e0e0ff'),
        }}
      >
        {value}
      </div>
    </div>
  );
}

const CAREER_NAMES: Record<string, string> = {
  startup: '创业者',
  soldier: '军人',
  office: '打工人',
  scholar: '学者',
  creator: '创作者',
  freelance: '自由人',
  universal: '全能者',
};

export function DeathScreen() {
  const { playerName, age, career, stats, eventHistory, gamePhase, outcomeText } =
    useGameStore();
  const restartGame = useGameStore((s) => s.restartGame);
  const isDead = gamePhase === 'dead';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        color: '#e0e0ff',
        fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {/* Death cause */}
      {isDead && outcomeText && (
        <div
          style={{
            background: '#1a0000',
            border: '1px solid #ef4444',
            borderRadius: '10px',
            padding: '1rem 1.5rem',
            maxWidth: '500px',
            width: '100%',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.4rem' }}>
            死亡原因
          </div>
          <div style={{ fontSize: '0.95rem', color: '#fca5a5', lineHeight: 1.6 }}>
            {outcomeText}
          </div>
        </div>
      )}

      <LifeSummaryCard
        playerName={playerName}
        age={age}
        career={CAREER_NAMES[career] ?? career}
        stats={stats}
        eventHistory={eventHistory}
        gamePhase={gamePhase}
      />

      {/* Recent history */}
      {eventHistory.length > 0 && (
        <div
          style={{
            maxWidth: '500px',
            width: '100%',
            marginTop: '1.5rem',
            background: '#12121a',
            borderRadius: '12px',
            padding: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              color: '#4b5563',
              marginBottom: '0.8rem',
              letterSpacing: '0.1em',
            }}
          >
            人生回顾（最后5件事）
          </div>
          {eventHistory.slice(-5).reverse().map((h, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'flex-start',
                padding: '0.4rem 0',
                borderBottom: i < 4 ? '1px solid #1f1f2e' : 'none',
              }}
            >
              <span style={{ color: '#4b5563', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                {h.age}岁
              </span>
              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: RARITY_COLORS[h.event.rarity] ?? '#6b7280',
                  }}
                >
                  {h.event.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                  {h.event.choices[h.choiceIndex]?.choice_text ?? ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restart button */}
      <button
        style={{
          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          padding: '0.9rem 3rem',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: '2rem',
          transition: 'all 0.2s',
          letterSpacing: '0.05em',
        }}
        onClick={restartGame}
      >
        再来一次 ↺
      </button>
    </div>
  );
}
