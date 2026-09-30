# Global Load Meter and Rest System Implementation Plan

## Overview
Implement a global "System Load" tracking mechanism that monitors the cognitive load of pending tasks across all active skills. When load exceeds a threshold, the system will suggest "Rest" tasks and potentially inject them into the learning path.

## 1. Global Shell & Load Meter Component

### Goals
- Create a persistent UI element that shows current system load across all pages.
- Ensure the load value is reactive and updated when tasks are completed.

### Implementation Steps
1. **Create `app/components/layout/Shell.tsx`**:
   - This component will wrap the page content.
   - It will host the `LoadMeter` component in a fixed or absolute position (e.g., top-right or top-center).
2. **Create `app/components/layout/LoadMeter.tsx`**:
   - Refactor the UI logic from `FocusMode.tsx` (lines 69-78).
   - Props: `currentLoad`, `maxLoad`.
   - Styling: Maintain the "neon" aesthetic with a progress bar and mono-spaced text.
3. **Modify `app/layout.tsx`**:
   - Wrap `{children}` in the `Shell` component.

## 2. Load Calculation & Data Logic

### Goals
- Centralize the load calculation logic to avoid duplication between `FocusMode` and the new global `LoadMeter`.
- Transition from purely calculated load to a persisted `User.currentLoad` where appropriate.

### Implementation Steps
1. **Create `lib/load-utils.ts`**:
   - Implement `calculateTotalLoad(userId: string)`:
     - Fetch all skills for user.
     - For each skill, find the active level.
     - Sum `estimatedLoad` of all `Pending` tasks in those levels.
2. **Update `lib/supabase.ts` (`MockDB`)**:
   - Add `updateUserLoad(userId: string, load: number)` to persist the `currentLoad` in the `User` object.
   - Ensure `getUser` returns the updated load.
3. **Integrate Calculation**:
   - The `Shell` or a dedicated `LoadProvider` (React Context) will call `calculateTotalLoad` on mount and whenever a task status changes.

## 3. Rest System Integration

### Goals
- Treat "Rest" as a first-class task.
- Automate the suggestion and insertion of rest periods based on load.

### Strategy
1. **Data Model Extension**:
   - Add a `type: 'Learning' | 'Rest'` property to the `Task` type in `types/index.ts`.
   - Rest tasks will have `estimatedLoad: 0` (or even negative to represent recovery) and `xpReward: 0` (or a small "wellness" reward).
2. **Task Completion Flow (`TaskBoard.tsx`)**:
   - In `completeTask`, after marking a task as completed, trigger a load recalculation.
   - If the load is still too high after several tasks, trigger a "Rest Suggested" notification.
3. **Path Generation Flow (`app/api/generate-path/route.ts`)**:
   - Modify `generateAIPath` to analyze the total estimated load of a level.
   - If a level's total load exceeds a certain threshold (e.g., 15 units), automatically insert a "Rest & Reflect" task at the end of that level.
4. **Focus Mode Integration (`FocusMode.tsx`)**:
   - Modify the task selection logic:
     - If `currentLoad > maxLoad * 0.8`, prioritize showing a "Rest" task as the "Right Now" task, even if other pending learning tasks exist.

## 4. Step-by-Step Execution Sequence

1. **Types & DB**: Update `Task` type $\rightarrow$ Add `updateUserLoad` to `MockDB`.
2. **Utilities**: Create `lib/load-utils.ts`.
3. **UI Shell**: Create `LoadMeter` $\rightarrow$ Create `Shell` $\rightarrow$ Update `app/layout.tsx`.
4. **Integration**: Refactor `FocusMode` to use the global load state.
5. **Rest Logic**: Update `TaskBoard` completion $\rightarrow$ Update `generate-path` API $\rightarrow$ Update `FocusMode` task selection.

## Critical Files for Implementation
- `types/index.ts`
- `lib/supabase.ts`
- `lib/load-utils.ts` (New)
- `app/components/layout/LoadMeter.tsx` (New)
- `app/components/layout/Shell.tsx` (New)
- `app/layout.tsx`
- `app/api/generate-path/route.ts`
- `app/components/focus/FocusMode.tsx`
- `app/components/dashboard/TaskBoard.tsx`
EOF`
