import orchestrator from "test/orchestrator.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.waitForAllServices();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/status`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
      expect(responseBody.dependencies.database).not.toHaveProperty("version");
    });
  });

  describe("Privileged user", () => {
    test("With `read:status:all`", async () => {
      const privilegedUser = await orchestrator.createUser();
      const activatedPrivilegedUser =
        await orchestrator.activateUser(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["read:status:all"]);
      const privilegedUserSession = await orchestrator.createSession(
        activatedPrivilegedUser,
      );

      const response = await fetch(`${webserver.origin}/api/v1/status`, {
        headers: {
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(responseBody.dependencies.database.version).toEqual("16.12");
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    });
  });
});

// eslint-disable-next-line jest/expect-expect
test("Teste de SQL Injection", async () => {
  await fetch(
    `${webserver.origin}/api/v1/status?dataBaseName='; SELECT pg_sleep(4); --`,
  );
});
