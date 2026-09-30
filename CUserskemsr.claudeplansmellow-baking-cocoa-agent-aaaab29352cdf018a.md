# Implementation Plan: Global Character Leveling System (Module 13)

## Overview
Implement a global leveling system where the user's total XP across all skills contributes to a 'Global Character Level'.

## Requirements
1. Track total XP earned across all skills.
2. Calculate current Global Level based on total XP.
3. Trigger 'Global Level Up' events.
4. Visualize Global Level in the UI (Shell).

## Proposed Changes

### 1. Type Definitions (`types/index.ts`)
- Update `User` type to include:
    - `globalLevel: number`
    - `globalXp: number`

### 2. Leveling Utilities (`lib/level-utils.ts`)
Create a new utility file to handle XP-to-level logic.
- Formula: `floor(sqrt(xp / 100))` (as suggested).
- Function `calculateGlobalLevel(xp: number): number`.
- Function `calculateXpForLevel(level: number): number`.

### 3. Data Layer (`lib/supabase.ts`)
Add methods to `MockDB` to manage global progress:
- `updateGlobalXp(userId: string, xpGain: number)`: 
    - Increments `globalXp`.
    - Recalculates `globalLevel` using `level-utils`.
    - Checks if `globalLevel` increased.
    - If increased, logs a `LifeLedgerEntry` with `eventType: 'LevelUp'`.

### 4. Business Logic (`app/components/dashboard/TaskBoard.tsx`)
- In `completeTask(taskId: string)`:
    - Get the `xpReward` from the task.
    - Call `db.updateGlobalXp('user_1', xpReward)`.

### 5. User Interface (`app/components/layout/Shell.tsx`)
- Fetch and display the user's `globalLevel` and `globalXp` in the header.
- Design: A 'Character Rank' indicator next to the LoadMeter.
- Component: A small badge or text indicator (e.g., `RANK LVL 12`).

## Implementation Sequence
1. **Types**: Update `User` in `types/index.ts`.
2. **Utils**: Create `lib/level-utils.ts`.
3. **DB**: Implement `updateGlobalXp` in `lib/supabase.ts`.
4. **Task Logic**: Integrate XP reward into `TaskBoard.tsx`.
5. **UI**: Add rank display to `Shell.tsx`.
