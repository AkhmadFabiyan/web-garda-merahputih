// One source of truth for PKKMB stage timing, shared by the website (Peta Perjalanan, /jadwal)
// and the chatbot (todayEngine). Pure functions: pass the stages and "now" in.

export type StageStatus = 'Done' | 'Ongoing' | 'Upcoming';

interface Timed {
  startDate: string;
  endDate: string;
}

export function stageStatus(stage: Timed, now: number): StageStatus {
  if (now > new Date(stage.endDate).getTime()) return 'Done';
  if (now >= new Date(stage.startDate).getTime()) return 'Ongoing';
  return 'Upcoming';
}

/** Index of the last stage that has started; 0 before anything starts. */
export function currentStageIndex(stages: Timed[], now: number): number {
  for (let i = stages.length - 1; i >= 0; i--) {
    if (now >= new Date(stages[i].startDate).getTime()) return i;
  }
  return 0;
}

/** The stage running now (if any) and the next one still to come. */
export function activeAndUpcoming<T extends Timed>(stages: T[], now: number): { active: T | null; upcoming: T | null } {
  return {
    active: stages.find((s) => stageStatus(s, now) === 'Ongoing') ?? null,
    upcoming: stages.find((s) => stageStatus(s, now) === 'Upcoming') ?? null,
  };
}
