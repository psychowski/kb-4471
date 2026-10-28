<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket } from '#lib/kb/split';

  let { ticket }: { ticket: number } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, notes.oneDayMove, tenantOf));
</script>

<p class="sum"><strong>{split.total}</strong> reports in #{ticket} · <strong>{split.rows.length}</strong> problems</p>

<table>
  <thead><tr><th>problem</th><th>reports</th><th>tenants</th></tr></thead>
  <tbody>
    {#each split.rows as row (row.problem)}
      <tr><td><code>{row.problem}</code></td><td>{row.reports}</td><td>{row.tenants}</td></tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
</style>
