import orchestrator from 'test/orchestrator.js';

beforeAll(async() => {
  await orchestrator.waitForAllServices();
})

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();
  const parseUpdateAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdateAt);

  expect(responseBody.dependencies.database.version).toEqual("16.12");
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});

test.only("Teste de SQL Injection", async () => {
  await fetch(
    "http://localhost:3000/api/v1/status?dataBaseName='; SELECT pg_sleep(4); --",
  );
});
