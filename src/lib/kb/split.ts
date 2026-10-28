// What #4471 really holds: the desk's two causes plus the reports it read as a one-day move.
// Built on causes.ts; the one-day reports are a third problem, so they leave the parser count.
import { groupByCause, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day';

export type ProblemRow = { problem: Problem; reports: number; tenants: number; ids: string[] };

export function splitTicket(
  all: Report[],
  ticket: number,
  oneDayMove: readonly string[],
  tenantOf: (r: Report) => Tenant | undefined,
): { total: number; rows: ProblemRow[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  const rest = merged.filter((r) => !oneDayMove.includes(r.id));
  const rows: ProblemRow[] = groupByCause(rest, tenantOf)
    .filter((g) => g.cause !== 'unplaced')
    .map((g) => ({
      problem: g.cause as Problem,
      reports: g.reports.length,
      tenants: g.tenants,
      ids: g.reports.map((r) => r.id),
    }));
  rows.push({
    problem: 'one-day',
    reports: moved.length,
    tenants: new Set(moved.map((r) => r.tenant)).size,
    ids: moved.map((r) => r.id),
  });
  return { total: merged.length, rows: rows.sort((a, b) => b.reports - a.reports) };
}
