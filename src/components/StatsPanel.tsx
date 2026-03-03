import React from 'react';
import { CharacterStats, RouteTag } from '../types/game';

interface StatsPanelProps {
  stats: CharacterStats;
  age: number;
  career: RouteTag;
  playerName: string;
}

const CAREER_EMOJI: Record<RouteTag, string> = {
  startup: '🚀',
  soldier: '⚔️',
  office: '💼',
  scholar: '📚',
  creator: '🎨',
  freelance: '🌊',
  universal: '🌐',
};

const CAREER_NAMES: Record<RouteTag, string> = {
  startup: '创业者',
  soldier: '军人',
  office: '打工人',
  scholar: '学者',
  creator: '创作者',
  freelance: '自由人',
  universal: '全能者',
};

function getHealthColor(value: number): string {
  if (value > 60) return '#22c55e';
  if (value > 30) return '#f59e0b';
  return '#ef4444';
}

function getStressColor(value: number): string {
  if (value < 30) return '#22c55e';
  if (value < 60) return '#f59e0b';
  return '#ef4444';
}

function getGenericColor(key: string): string {
  const colors: Record<string, string> = {
    Happiness: '#fbbf24',
    Skill: '#3b82f6',
    Charm: '#ec4899',
    Risk: '#f97316',
    Reputation: '#a855f7',
    Impact: '#06b6d4',
  };
  return colors[key] ?? '#6b7280';
}

interface BarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  warn?: boolean;
  unit?: string;
}

function StatBar({ label, value, max = 100, color, warn, unit }: BarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: warn ? '#ef4444' : '#9ca3af',
          marginBottom: '3px',
          animation: warn ? 'blink 1s step-start infinite' : 'none',
        }}
      >
        <span>{label}</span>
        <span style={{ color: '#e0e0ff', fontWeight: 600 }}>
          {value.toFixed(0)}{unit ?? ''}
        </span>
      </div>
      <div
        style={{
          height: '6px',
          background: '#1f1f2e',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: '3px',
            transition: 'width 0.5s ease',
            boxShadow: warn ? `0 0 6px ${color}` : 'none',
          }}
        />
      </div>
    </div>
  );
}

export function StatsPanel({ stats, age, career, playerName }: StatsPanelProps) {
  const moneyColor = stats.Money < 0 ? '#ef4444' : '#ffd700';

  return (
    <div
      style={{
        background: '#12121a',
        border: '1px solid #1f1f2e',
        borderRadius: '12px',
        padding: '1.2rem',
        minWidth: '220px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>
          {CAREER_EMOJI[career]}
        </div>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#e0e0ff' }}>
          {playerName}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
          {CAREER_NAMES[career]}
        </div>
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: '#ffd700',
            lineHeight: 1.2,
            marginTop: '0.4rem',
          }}
        >
          {age}<span style={{ fontSize: '1rem', color: '#9ca3af' }}>岁</span>
        </div>
      </div>

      <div
        style={{
          height: '1px',
          background: '#1f1f2e',
          marginBottom: '0.6rem',
        }}
      />

      {/* Core Stats */}
      <div style={{ fontSize: '0.7rem', color: '#4b5563', marginBottom: '4px', letterSpacing: '0.1em' }}>
        核心属性
      </div>
      <StatBar
        label="❤️ 健康"
        value={stats.Health}
        color={getHealthColor(stats.Health)}
        warn={stats.Health < 25}
      />
      <StatBar
        label="😊 幸福"
        value={stats.Happiness}
        color={getGenericColor('Happiness')}
        warn={stats.Happiness < 20}
      />
      <StatBar
        label="⚡ 技能"
        value={stats.Skill}
        color={getGenericColor('Skill')}
      />
      <StatBar
        label="✨ 魅力"
        value={stats.Charm}
        color={getGenericColor('Charm')}
      />
      <StatBar
        label="🎲 风险"
        value={stats.Risk}
        color={getGenericColor('Risk')}
      />
      <StatBar
        label="😤 压力"
        value={stats.Stress}
        color={getStressColor(stats.Stress)}
        warn={stats.Stress > 80}
      />

      <div
        style={{
          height: '1px',
          background: '#1f1f2e',
          margin: '0.4rem 0',
        }}
      />

      {/* External Stats */}
      <div style={{ fontSize: '0.7rem', color: '#4b5563', marginBottom: '4px', letterSpacing: '0.1em' }}>
        外部属性
      </div>

      {/* Money special display */}
      <div style={{ marginBottom: '0.6rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: moneyColor,
            fontWeight: 700,
          }}
        >
          <span>💰 资产</span>
          <span>
            {stats.Money < 0 ? '-' : ''}¥{Math.abs(stats.Money).toFixed(1)}万
          </span>
        </div>
        {stats.Debt > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#ef4444',
              marginTop: '2px',
            }}
          >
            <span>💳 负债</span>
            <span>¥{stats.Debt.toFixed(1)}万</span>
          </div>
        )}
      </div>

      <StatBar
        label="🌟 声望"
        value={Math.max(0, Math.min(100, stats.Reputation))}
        color={getGenericColor('Reputation')}
      />
      <StatBar
        label="🌍 影响力"
        value={Math.max(0, Math.min(100, stats.Impact))}
        color={getGenericColor('Impact')}
      />

      {/* Flags */}
      {Object.keys(stats.flags).length > 0 && (
        <>
          <div
            style={{
              height: '1px',
              background: '#1f1f2e',
              margin: '0.4rem 0',
            }}
          />
          <div style={{ fontSize: '0.7rem', color: '#4b5563', marginBottom: '4px', letterSpacing: '0.1em' }}>
            状态标记
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {Object.entries(stats.flags)
              .filter(([, v]) => v !== false && v !== 0)
              .map(([k, v]) => (
                <span
                  key={k}
                  style={{
                    background: '#1f1f2e',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '0.65rem',
                    color: '#a855f7',
                  }}
                >
                  {k}: {String(v)}
                </span>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
