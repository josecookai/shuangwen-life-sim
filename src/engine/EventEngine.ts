import { GameEvent, CharacterStats, Rarity, RouteTag } from '../types/game';

const EVENT_FILES = [
  '/events/age_0_12.json',
  '/events/age_13_18.json',
  '/events/age_19_30.json',
  '/events/age_31_45.json',
  '/events/age_46_60.json',
  '/events/age_61_80.json',
];

const RARITY_MULTIPLIER: Record<Rarity, number> = {
  COMMON: 10,
  RARE: 4,
  EPIC: 1.5,
  LEGENDARY: 0.3,
  MEME: 0.5,
};

let cachedEvents: GameEvent[] | null = null;

export async function loadEvents(): Promise<GameEvent[]> {
  if (cachedEvents !== null) return cachedEvents;

  const results = await Promise.allSettled(
    EVENT_FILES.map(async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return [] as GameEvent[];
        const data = await res.json();
        return Array.isArray(data) ? (data as GameEvent[]) : [];
      } catch {
        return [] as GameEvent[];
      }
    })
  );

  const all: GameEvent[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      all.push(...r.value);
    }
  }

  cachedEvents = all;
  return all;
}

/**
 * Evaluate a single comparison token: "Money>=500", "Skill<=30", "startup=true", etc.
 */
function evaluateSingleCondition(
  token: string,
  stats: CharacterStats,
  flags: Record<string, boolean | number | string>
): boolean {
  token = token.trim();
  if (!token) return true;

  // Try operators: >=, <=, >, <, =
  const opMatch = token.match(/^([A-Za-z_]+)\s*(>=|<=|>|<|=)\s*(.+)$/);
  if (!opMatch) return true;

  const [, key, op, rawVal] = opMatch;

  // Resolve LHS value
  let lhsNum: number | undefined;
  let lhsStr: string | boolean | number | undefined;

  if (key in stats) {
    const statVal = stats[key as keyof CharacterStats];
    if (typeof statVal === 'number') {
      lhsNum = statVal;
      lhsStr = statVal;
    }
  } else if (key in flags) {
    const fv = flags[key];
    if (typeof fv === 'number') lhsNum = fv;
    lhsStr = fv;
  } else {
    // key not found – treat as 0/false
    lhsNum = 0;
    lhsStr = false;
  }

  const val = rawVal.trim();

  // Boolean comparison
  if (val === 'true' || val === 'false') {
    const boolVal = val === 'true';
    return lhsStr === boolVal || lhsStr === val;
  }

  // Numeric comparison
  const rhsNum = parseFloat(val);
  if (!isNaN(rhsNum) && lhsNum !== undefined) {
    switch (op) {
      case '>=': return lhsNum >= rhsNum;
      case '<=': return lhsNum <= rhsNum;
      case '>':  return lhsNum > rhsNum;
      case '<':  return lhsNum < rhsNum;
      case '=':  return lhsNum === rhsNum;
    }
  }

  // String / flag comparison
  if (op === '=') {
    return String(lhsStr) === val;
  }

  return true;
}

export function evaluateRequirements(
  event: GameEvent,
  stats: CharacterStats,
  flags: Record<string, boolean | number | string>
): boolean {
  const req = event.requirements?.trim();
  if (!req || req === 'none' || req === '') return true;

  // Split by OR first (lower precedence)
  const orParts = req.split(/\bOR\b/);
  return orParts.some((orPart) => {
    // Split by AND (higher precedence)
    const andParts = orPart.split(/\bAND\b/);
    return andParts.every((token) => evaluateSingleCondition(token, stats, flags));
  });
}

export function getEligibleEvents(
  age: number,
  career: RouteTag,
  stats: CharacterStats,
  flags: Record<string, boolean | number | string>,
  allEvents: GameEvent[],
  pendingIds: string[]
): GameEvent[] {
  // If there are pending events, return those first
  if (pendingIds.length > 0) {
    const pending = allEvents.filter((e) => pendingIds.includes(e.id));
    if (pending.length > 0) return pending;
  }

  return allEvents.filter((ev) => {
    // Age range check
    if (age < ev.age_range[0] || age > ev.age_range[1]) return false;

    // Route tag check
    const hasTag = ev.route_tags.includes('universal') || ev.route_tags.includes(career);
    if (!hasTag) return false;

    // Requirements check
    if (!evaluateRequirements(ev, stats, flags)) return false;

    return true;
  });
}

export function weightedRandom(events: GameEvent[]): GameEvent | null {
  if (events.length === 0) return null;

  const weights = events.map((e) => e.base_weight * (RARITY_MULTIPLIER[e.rarity] ?? 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;

  for (let i = 0; i < events.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return events[i];
  }
  return events[events.length - 1];
}

type StatKey = keyof Omit<CharacterStats, 'flags'>;
const STAT_KEYS: StatKey[] = [
  'Health', 'Happiness', 'Skill', 'Charm', 'Risk', 'Stress',
  'Money', 'Debt', 'Reputation', 'Impact',
];

function clampStat(key: StatKey, value: number): number {
  if (['Money', 'Debt', 'Reputation', 'Impact'].includes(key)) return value;
  return Math.max(0, Math.min(100, value));
}

export function applyEffects(
  effects: string[],
  stats: CharacterStats
): CharacterStats {
  const newStats = { ...stats, flags: { ...stats.flags } };

  for (const effect of effects) {
    const trimmed = effect.trim();

    // "set key=value"
    if (trimmed.toLowerCase().startsWith('set ')) {
      const rest = trimmed.slice(4);
      const eqIdx = rest.indexOf('=');
      if (eqIdx !== -1) {
        const k = rest.slice(0, eqIdx).trim();
        const v = rest.slice(eqIdx + 1).trim();
        if (v === 'true') newStats.flags[k] = true;
        else if (v === 'false') newStats.flags[k] = false;
        else if (!isNaN(Number(v))) newStats.flags[k] = Number(v);
        else newStats.flags[k] = v;
      }
      continue;
    }

    // "+Stat value" or "-Stat value"
    const match = trimmed.match(/^([+-])([A-Za-z]+)\s+([\d.]+)$/);
    if (match) {
      const sign = match[1] === '+' ? 1 : -1;
      const key = match[2] as StatKey;
      const amount = parseFloat(match[3]);

      if (STAT_KEYS.includes(key)) {
        const current = newStats[key] as number;
        (newStats as Record<string, unknown>)[key] = clampStat(key, current + sign * amount);
      }
      continue;
    }

    // "Stat=value" direct set
    const directMatch = trimmed.match(/^([A-Za-z]+)=([\d.]+)$/);
    if (directMatch) {
      const key = directMatch[1] as StatKey;
      const value = parseFloat(directMatch[2]);
      if (STAT_KEYS.includes(key)) {
        (newStats as Record<string, unknown>)[key] = clampStat(key, value);
      }
    }
  }

  return newStats;
}

export function checkDeath(
  event: GameEvent,
  stats: CharacterStats
): boolean {
  // Stat-based death
  if (stats.Health <= 0) return true;
  if (stats.Stress >= 100 && Math.random() < 0.3) return true;

  // Event death_risk
  if (event.death_risk && event.death_risk > 0) {
    if (Math.random() < event.death_risk) return true;
  }

  return false;
}
