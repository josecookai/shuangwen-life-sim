export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MEME';
export type RouteTag = 'startup' | 'soldier' | 'office' | 'scholar' | 'creator' | 'freelance' | 'universal';

export interface Choice {
  choice_text: string;
  outcome_text: string;
  effects: string[]; // e.g. ["+Money 500", "-Health 10", "set burnout=true"]
  next_event_ids: string[];
}

export interface GameEvent {
  id: string;
  title: string;
  rarity: Rarity;
  age_range: [number, number];
  route_tags: RouteTag[];
  base_weight: number;
  requirements: string;
  intro: string;
  choices: Choice[];
  death_risk?: number;
  notes?: string;
}

export interface CharacterStats {
  // Core 0-100
  Health: number;
  Happiness: number;
  Skill: number;
  Charm: number;
  Risk: number;
  Stress: number;
  // External
  Money: number;   // 万元
  Debt: number;
  Reputation: number;
  Impact: number;
  // Flags
  flags: Record<string, boolean | number | string>;
}

export interface GameState {
  age: number;
  year: number; // 出生年份起算
  career: RouteTag;
  stats: CharacterStats;
  eventHistory: Array<{ event: GameEvent; choiceIndex: number; age: number }>;
  pendingEventIds: string[]; // 连锁事件队列
  isAlive: boolean;
  gamePhase: 'setup' | 'playing' | 'dead' | 'retired';
  currentEvent: GameEvent | null;
  playerName: string;
}
