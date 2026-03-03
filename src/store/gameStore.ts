import { create } from 'zustand';
import { GameState, CharacterStats, RouteTag, GameEvent } from '../types/game';
import {
  loadEvents,
  getEligibleEvents,
  weightedRandom,
  applyEffects,
  checkDeath,
} from '../engine/EventEngine';

const DEFAULT_STATS: CharacterStats = {
  Health: 80,
  Happiness: 70,
  Skill: 20,
  Charm: 50,
  Risk: 30,
  Stress: 10,
  Money: 0,
  Debt: 0,
  Reputation: 0,
  Impact: 0,
  flags: {},
};

interface GameStore extends GameState {
  allEvents: GameEvent[];
  isLoading: boolean;
  outcomeText: string | null;
  pendingNextIds: string[];

  // Actions
  initGame: () => Promise<void>;
  setupCharacter: (name: string, career: RouteTag) => void;
  advanceYear: () => void;
  makeChoice: (choiceIndex: number) => void;
  continueAfterOutcome: () => void;
  restartGame: () => void;
}

const INITIAL_STATE: Omit<GameState, 'stats'> & { stats: CharacterStats } = {
  age: 6,
  year: 2000,
  career: 'office',
  stats: { ...DEFAULT_STATS, flags: {} },
  eventHistory: [],
  pendingEventIds: [],
  isAlive: true,
  gamePhase: 'setup',
  currentEvent: null,
  playerName: '主角',
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,
  allEvents: [],
  isLoading: false,
  outcomeText: null,
  pendingNextIds: [],

  initGame: async () => {
    set({ isLoading: true });
    try {
      const events = await loadEvents();
      set({ allEvents: events, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setupCharacter: (name: string, career: RouteTag) => {
    const birthYear = 1990 + Math.floor(Math.random() * 10);
    set({
      playerName: name,
      career,
      age: 6,
      year: birthYear,
      stats: { ...DEFAULT_STATS, flags: {} },
      eventHistory: [],
      pendingEventIds: [],
      isAlive: true,
      gamePhase: 'playing',
      currentEvent: null,
      outcomeText: null,
      pendingNextIds: [],
    });
    // Immediately pick first event
    setTimeout(() => get().advanceYear(), 0);
  },

  advanceYear: () => {
    const { age, career, stats, allEvents, pendingEventIds, gamePhase, isAlive } = get();
    if (!isAlive || gamePhase !== 'playing') return;

    // Retirement at 65
    if (age >= 65) {
      set({ gamePhase: 'retired' });
      return;
    }

    const eligible = getEligibleEvents(
      age,
      career,
      stats,
      stats.flags,
      allEvents,
      pendingEventIds
    );

    const event = weightedRandom(eligible);

    if (!event) {
      // No event this year, just age up
      set((state) => ({ age: state.age + 1, year: state.year + 1 }));
      return;
    }

    // Remove from pending if it was pending
    const newPending = pendingEventIds.filter((id) => id !== event.id);

    set({
      currentEvent: event,
      pendingEventIds: newPending,
      outcomeText: null,
      pendingNextIds: [],
    });
  },

  makeChoice: (choiceIndex: number) => {
    const { currentEvent, stats, age, pendingEventIds } = get();
    if (!currentEvent) return;

    const choice = currentEvent.choices[choiceIndex];
    if (!choice) return;

    const newStats = applyEffects(choice.effects, stats);
    const isDead = checkDeath(currentEvent, newStats);

    // Queue next events from choice
    const nextIds = choice.next_event_ids ?? [];

    const newHistory = [
      ...get().eventHistory,
      { event: currentEvent, choiceIndex, age },
    ];

    if (isDead) {
      set({
        stats: newStats,
        isAlive: false,
        gamePhase: 'dead',
        eventHistory: newHistory,
        outcomeText: choice.outcome_text,
      });
      return;
    }

    // Merge pending
    const mergedPending = [...pendingEventIds, ...nextIds].filter(
      (id, idx, arr) => arr.indexOf(id) === idx
    );

    const newAge = age + 1;

    if (newAge >= 65) {
      set({
        stats: newStats,
        age: newAge,
        year: get().year + 1,
        eventHistory: newHistory,
        pendingEventIds: mergedPending,
        currentEvent: null,
        outcomeText: choice.outcome_text,
        pendingNextIds: nextIds,
        gamePhase: 'retired',
      });
      return;
    }

    set({
      stats: newStats,
      age: newAge,
      year: get().year + 1,
      eventHistory: newHistory,
      pendingEventIds: mergedPending,
      currentEvent: null,
      outcomeText: choice.outcome_text,
      pendingNextIds: nextIds,
    });
  },

  continueAfterOutcome: () => {
    const { isAlive, gamePhase } = get();
    if (!isAlive || gamePhase !== 'playing') return;

    set({ outcomeText: null, pendingNextIds: [] });

    // Find next eligible event
    const { age, career, stats, allEvents, pendingEventIds } = get();

    const eligible = getEligibleEvents(
      age,
      career,
      stats,
      stats.flags,
      allEvents,
      pendingEventIds
    );

    const event = weightedRandom(eligible);
    const newPending = event
      ? pendingEventIds.filter((id) => id !== event.id)
      : pendingEventIds;

    set({
      currentEvent: event ?? null,
      pendingEventIds: newPending,
    });
  },

  restartGame: () => {
    set({
      ...INITIAL_STATE,
      stats: { ...DEFAULT_STATS, flags: {} },
      allEvents: get().allEvents,
      isLoading: false,
      outcomeText: null,
      pendingNextIds: [],
    });
  },
}));
