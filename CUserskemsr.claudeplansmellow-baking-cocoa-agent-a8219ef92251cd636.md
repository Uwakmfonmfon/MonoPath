# Implementation Plan: Breakthroughs and Plateaus (Modules 11 & 12)

## Overview
Implement a system to detect when a user is "stuck" (Plateau), route them to the appropriate intervention (Breakthrough), and reward the resolution with a 'Zone' status.

## 1. Tracking Loop (Data Layer)
To feed `detectPlateau(attempts, completions, avgTime, globalLoad)`, we need to track "attempts" at the task level.

### Changes to `types/index.ts`
- Update `Task` type to include `attempts: number`.
- Update `Skill` type to include `isInTheZone: boolean`.

### Changes to `lib/supabase.ts` (MockDB)
- Ensure `updateTask` correctly increments `attempts` when a task is started but not completed.
- Add `updateSkillZone(skillId: string, status: boolean)` to mark 'Zone' status.

## 2. Integrated Diagnosis (Logic Layer)
The plateau detection should be triggered at key interaction points.

### Trigger Points
- **TaskBoard**: When a user attempts to complete a task but fails (if we add a "fail" action) or when they have multiple `InProgress` tasks without completions.
- **FocusMode**: When a session ends without task completion.

### Routing Logic Integration
- Use `detectPlateau` $\rightarrow$ `getBreakthroughAction`.
- If `Confusion` $\rightarrow$ Surface `PairingUI` or route to `AssistantPanel`.
- If `Motivation` $\rightarrow$ Force a `Rest` task or suggest a break.

## 3. UI Intervention (Presentation Layer)
Surface the plateau diagnosis without interrupting the flow too aggressively.

### TaskBoard Intervention
- Add a "Plateau Alert" banner or popup when `detectPlateau` returns a non-None value.
- Provide a "Get Help" button that triggers the routing logic.

### FocusMode Override
- If a `Motivation` plateau is detected, the prioritization logic in `FocusMode.tsx` (lines 35-40) should be extended to prioritize `Rest` tasks more aggressively.

## 4. Collaborative Breakthroughs & Pairing
### Pairing Integration
- When a `Confusion` plateau is diagnosed, trigger the `PairingUI`.
- Connect `PairingUI` to `db.addToPairingQueue` and `db.findMatch`.
- Upon a successful match and subsequent task completion, trigger the "Breakthrough" event.

## 5. The 'Zone' Transition
### Unlocking 'The Zone'
- **Trigger**: Completing a Milestone task while in a `Confusion` plateau or after a `Pairing` session.
- **Recording**: Log a `Breakthrough` event in `LifeLedger` and set `skill.isInTheZone = true`.
- **Visuals**: 
    - In `TaskBoard`, add a "ZONE" badge to the skill header.
    - Apply a distinct visual effect (e.g., neon glow, different border color) to the skill's progression path.

## 6. Verification Plan
- **Simulate Confusion**: Create a skill with 4+ tasks marked as `InProgress` (simulated attempts) and 0 `Completed`. Verify `PairingUI` appears.
- **Simulate Motivation**: Lower `globalLoad` and set `attempts` to 0. Verify `Rest` task priority in `FocusMode`.
- **Verify Breakthrough**: Complete a milestone task after a plateau. Verify `LifeLedger` entry and "Zone" visual update.

## Critical Files for Implementation
- `types/index.ts`
- `lib/plateau-detection.ts`
- `lib/supabase.ts`
- `app/components/dashboard/TaskBoard.tsx`
- `app/components/focus/FocusMode.tsx`
- `app/components/pairing/PairingUI.tsx`
