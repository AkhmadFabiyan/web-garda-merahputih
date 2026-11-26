// Self-check for the shared helpers in src/lib. Run: node scripts/check-shared-helpers.mjs
import assert from 'node:assert/strict';
import { waLink } from '../src/lib/links.ts';
import { sortByPopularity } from '../src/lib/popularity.ts';
import { stageStatus, currentStageIndex, activeAndUpcoming } from '../src/lib/schedule.ts';

// waLink: every way the number is written gives the same link
for (const p of ['085649272426', '0856-4927-2426', '+62 856 4927 2426', '62 856 4927 2426']) {
  assert.equal(waLink(p), 'https://wa.me/6285649272426', p);
}

// sortByPopularity: ranked first, unranked keep their original order
const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
assert.deepEqual(sortByPopularity(items, ['c', 'a'], (x) => x.id).map((x) => x.id), ['c', 'a', 'b', 'd']);
assert.deepEqual(sortByPopularity(items, [], (x) => x.id).map((x) => x.id), ['a', 'b', 'c', 'd']);

// schedule
const stages = [
  { startDate: '2026-08-14T08:00:00+07:00', endDate: '2026-08-14T12:00:00+07:00' },
  { startDate: '2026-08-17T06:00:00+07:00', endDate: '2026-08-17T17:00:00+07:00' },
  { startDate: '2026-08-18T07:00:00+07:00', endDate: '2026-08-21T17:00:00+07:00' },
];
const t = (iso) => new Date(iso).getTime();
assert.equal(stageStatus(stages[0], t('2026-08-13T00:00:00+07:00')), 'Upcoming');
assert.equal(stageStatus(stages[0], t('2026-08-14T09:00:00+07:00')), 'Ongoing');
assert.equal(stageStatus(stages[0], t('2026-08-15T00:00:00+07:00')), 'Done');
assert.equal(currentStageIndex(stages, t('2026-08-01T00:00:00+07:00')), 0);
assert.equal(currentStageIndex(stages, t('2026-08-17T10:00:00+07:00')), 1);
assert.equal(currentStageIndex(stages, t('2026-09-01T00:00:00+07:00')), 2);
const mid = activeAndUpcoming(stages, t('2026-08-17T10:00:00+07:00'));
assert.equal(mid.active, stages[1]);
assert.equal(mid.upcoming, stages[2]);
const between = activeAndUpcoming(stages, t('2026-08-15T10:00:00+07:00'));
assert.equal(between.active, null);
assert.equal(between.upcoming, stages[1]);

console.log('shared helpers: all checks passed');
