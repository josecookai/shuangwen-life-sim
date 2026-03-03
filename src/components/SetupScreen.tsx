import React, { useState } from 'react';
import { RouteTag } from '../types/game';
import { useGameStore } from '../store/gameStore';

interface CareerOption {
  tag: RouteTag;
  emoji: string;
  name: string;
  desc: string;
  color: string;
}

const CAREERS: CareerOption[] = [
  {
    tag: 'startup',
    emoji: '🚀',
    name: '创业者',
    desc: '用梦想融资，用PPT改变世界。高风险高回报，可能一夜暴富也可能负债累累。',
    color: '#f59e0b',
  },
  {
    tag: 'soldier',
    emoji: '⚔️',
    name: '军人',
    desc: '保家卫国，铁血丹心。稳定但艰苦，声望极高，特殊事件频发。',
    color: '#22c55e',
  },
  {
    tag: 'office',
    emoji: '💼',
    name: '打工人',
    desc: '朝九晚九，Excel战士。稳中有升，偶尔有意外惊喜或加班猝死。',
    color: '#3b82f6',
  },
  {
    tag: 'scholar',
    emoji: '📚',
    name: '学者',
    desc: '板凳坐得十年冷，一朝成名天下知。技能天花板最高，金钱...随缘。',
    color: '#8b5cf6',
  },
  {
    tag: 'creator',
    emoji: '🎨',
    name: '创作者',
    desc: 'B站/微博/抖音，流量就是金钱。爆红或糊穿地心，命运掌握在算法手中。',
    color: '#ec4899',
  },
  {
    tag: 'freelance',
    emoji: '🌊',
    name: '自由人',
    desc: '接单为生，今天咸鱼明天暴富。自由度最高，也最不稳定。',
    color: '#06b6d4',
  },
];

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    color: '#e0e0ff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
  },
  title: {
    fontSize: '3rem',
    fontWeight: 900,
    background: 'linear-gradient(90deg, #ffd700, #a855f7, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
    textAlign: 'center',
    letterSpacing: '0.05em',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2.5rem',
    textAlign: 'center',
  },
  nameSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#9ca3af',
  },
  input: {
    background: '#1a1a2e',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#e0e0ff',
    fontSize: '1.1rem',
    padding: '0.6rem 1.2rem',
    outline: 'none',
    width: '220px',
    textAlign: 'center',
    transition: 'border-color 0.2s',
  },
  careerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    maxWidth: '800px',
    width: '100%',
    marginBottom: '2rem',
  },
  careerCard: {
    background: '#12121a',
    border: '2px solid transparent',
    borderRadius: '12px',
    padding: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  careerEmoji: {
    fontSize: '2.5rem',
  },
  careerName: {
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  careerDesc: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    lineHeight: 1.5,
  },
  startButton: {
    background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
    color: '#0a0a0f',
    border: 'none',
    borderRadius: '10px',
    padding: '0.9rem 3rem',
    fontSize: '1.2rem',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.05em',
  },
};

export function SetupScreen() {
  const [playerName, setPlayerName] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<RouteTag | null>(null);
  const [hoveredCareer, setHoveredCareer] = useState<RouteTag | null>(null);
  const setupCharacter = useGameStore((s) => s.setupCharacter);

  const handleStart = () => {
    if (!selectedCareer) return;
    const name = playerName.trim() || '主角';
    setupCharacter(name, selectedCareer);
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>爽文人生模拟器</div>
      <div style={styles.subtitle}>每一个选择，都是你人生的序章</div>

      <div style={styles.nameSection}>
        <label style={styles.label}>你叫什么名字？</label>
        <input
          style={styles.input}
          type="text"
          placeholder="输入你的名字"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={10}
        />
      </div>

      <div style={{ marginBottom: '1rem', color: '#9ca3af', fontSize: '0.9rem' }}>
        选择你的人生路线：
      </div>

      <div style={styles.careerGrid}>
        {CAREERS.map((c) => {
          const isSelected = selectedCareer === c.tag;
          const isHovered = hoveredCareer === c.tag;
          return (
            <div
              key={c.tag}
              style={{
                ...styles.careerCard,
                borderColor: isSelected ? c.color : isHovered ? '#374151' : 'transparent',
                boxShadow: isSelected ? `0 0 20px ${c.color}40` : 'none',
                transform: isHovered || isSelected ? 'translateY(-3px)' : 'none',
              }}
              onClick={() => setSelectedCareer(c.tag)}
              onMouseEnter={() => setHoveredCareer(c.tag)}
              onMouseLeave={() => setHoveredCareer(null)}
            >
              <div style={styles.careerEmoji}>{c.emoji}</div>
              <div style={{ ...styles.careerName, color: isSelected ? c.color : '#e0e0ff' }}>
                {c.name}
              </div>
              <div style={styles.careerDesc}>{c.desc}</div>
            </div>
          );
        })}
      </div>

      <button
        style={{
          ...styles.startButton,
          opacity: selectedCareer ? 1 : 0.4,
          cursor: selectedCareer ? 'pointer' : 'not-allowed',
        }}
        onClick={handleStart}
        disabled={!selectedCareer}
      >
        开始人生 →
      </button>
    </div>
  );
}
