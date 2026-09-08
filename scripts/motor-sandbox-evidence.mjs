import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const endpoint = process.env.MOTOR_EVIDENCE_ENDPOINT?.trim();
const token = process.env.MOTOR_EVIDENCE_BEARER_TOKEN?.trim();
const outputRoot = process.env.MOTOR_EVIDENCE_OUTPUT?.trim() || 'artifacts/motor-evidence';

if (!endpoint || !token) {
  console.error('Set MOTOR_EVIDENCE_ENDPOINT and MOTOR_EVIDENCE_BEARER_TOKEN.');
  process.exit(2);
}

const endpointUrl = new URL(endpoint);
const isLocalEndpoint = endpointUrl.hostname === 'localhost' || endpointUrl.hostname === '127.0.0.1';
if (endpointUrl.protocol !== 'https:' && !isLocalEndpoint) {
  console.error('MOTOR_EVIDENCE_ENDPOINT must use HTTPS unless it targets localhost.');
  process.exit(2);
}

const catalog = JSON.parse(await readFile(new URL('../data/motorSandboxVehicles.json', import.meta.url), 'utf8'));
const startedAt = new Date();
const runId = startedAt.toISOString().replaceAll(':', '').replaceAll('.', '');
const outputDirectory = path.resolve(outputRoot, runId);
await mkdir(outputDirectory, { recursive: true });

const rows = [];
for (const expected of catalog) {
  const before = Date.now();
  let status = 0;
  let body;
  let requestError = null;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vin: expected.vin }),
      signal: AbortSignal.timeout(15_000),
    });
    status = response.status;
    body = await response.json();
  } catch (error) {
    requestError = error instanceof Error ? error.message : String(error);
  }

  const actual = body && !body.error ? body : null;
  const checks = actual ? {
    vin: actual.vin === expected.vin,
    year: actual.year === expected.year,
    make: actual.make === expected.make,
    model: actual.model === expected.model,
    motorVehicleId: actual.motorVehicleId === expected.motorVehicleId,
    motorBaseVehicleId: actual.motorBaseVehicleId === expected.motorBaseVehicleId,
    source: actual.source === 'motor-sandbox',
  } : {};
  const passed = status === 200 && Object.values(checks).every(Boolean);
  rows.push({
    vin: expected.vin,
    expected,
    status,
    durationMs: Date.now() - before,
    passed,
    checks,
    actual,
    error: requestError || body?.error || null,
  });
}

const finishedAt = new Date();
const report = {
  schemaVersion: 1,
  startedAt: startedAt.toISOString(),
  finishedAt: finishedAt.toISOString(),
  endpointOrigin: endpointUrl.origin,
  total: rows.length,
  passed: rows.filter((row) => row.passed).length,
  failed: rows.filter((row) => !row.passed).length,
  rows,
};

const markdownRows = rows.map((row) => {
  const error = row.error ? JSON.stringify(row.error).replaceAll('|', '\\|') : '';
  return `| ${row.vin} | ${row.expected.year} ${row.expected.make} ${row.expected.model} | ${row.status || 'ERROR'} | ${row.passed ? 'PASS' : 'FAIL'} | ${row.durationMs} | ${error} |`;
});
const markdown = `# MOTOR Sandbox 15-VIN Evidence\n\n` +
  `Run: ${report.startedAt}\n\n` +
  `Endpoint origin: ${report.endpointOrigin}\n\n` +
  `Result: ${report.passed}/${report.total} passed\n\n` +
  `| VIN | Expected | HTTP | Result | ms | Error |\n| --- | --- | ---: | --- | ---: | --- |\n` +
  `${markdownRows.join('\n')}\n\n` +
  `## Manual gates\n\n` +
  `- [ ] Written sandbox and production licensing confirmation attached\n` +
  `- [ ] Rate limits and error behavior confirmed\n` +
  `- [ ] Caching, retention, logging, attribution, geography, and OEM notices confirmed\n` +
  `- [ ] Hosted response headers confirm no-store\n` +
  `- [ ] Hosted route requires a valid WRNC session\n` +
  `- [ ] Server-only credential placement reviewed\n` +
  `- [ ] Production flags remain disabled\n` +
  `- [ ] Human review recorded on PR 63\n`;

await Promise.all([
  writeFile(path.join(outputDirectory, 'evidence.json'), `${JSON.stringify(report, null, 2)}\n`),
  writeFile(path.join(outputDirectory, 'evidence.md'), markdown),
]);

console.log(`MOTOR evidence: ${report.passed}/${report.total} passed`);
console.log(`Report: ${path.join(outputDirectory, 'evidence.md')}`);
process.exitCode = report.failed === 0 ? 0 : 1;
