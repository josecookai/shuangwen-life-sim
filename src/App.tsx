import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { DeathScreen } from './components/DeathScreen';
import './index.css';

export default function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const isLoading = useGameStore((s) => s.isLoading);
  const initGame = useGameStore((s) => s.initGame);

  useEffect(() => {
    initGame();
  }, [initGame]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0f',
          color: '#e0e0ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
          fontSize: '1.2rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
          <div>加载事件数据中…</div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'setup') {
    return <SetupScreen />;
  }

  if (gamePhase === 'dead' || gamePhase === 'retired') {
    return <DeathScreen />;
  }

  return <GameScreen />;
}
