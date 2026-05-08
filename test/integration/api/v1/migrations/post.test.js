import webserver from "infra/webserver.js";
import orchestrator from "test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          `${webserver.origin}/api/v1/migrations`,
          {
            method: "POST",
          },
        );

        expect(response.status).toBe(403);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          action:
            'Verifique se o seu usuario possui a feature "create:migration"',
          message: "Voce nao possui permisssao para executar esta acao",
          name: "ForbiddenError",
          status_code: 403,
        });
      });
    });
  });

  describe("Deafault user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const createdUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(createdUser);
        const sessionToken = await orchestrator.createSession(activatedUser);
        const response = await fetch(
          `${webserver.origin}/api/v1/migrations`,
          {
            method: "POST",
            headers: {
              Cookie: `session_id:${sessionToken.id}`,
            },
          },
        );

        const responseBody = await response.json();

        expect(response.status).toBe(403);

        expect(responseBody).toEqual({
          action:
            'Verifique se o seu usuario possui a feature "create:migration"',
          message: "Voce nao possui permisssao para executar esta acao",
          name: "ForbiddenError",
          status_code: 403,
        });
      });
    });
  });

  describe("Privileged user", () => {
    describe("Running pending migrations", () => {
      test("With `create:migration`", async () => {
        const privilegedUser = await orchestrator.createUser();

        const activatedPrivilegedUser =
          await orchestrator.activateUser(privilegedUser);

        await orchestrator.addFeaturesToUser(privilegedUser, [
          "create:migration",
        ]);
        const privilegedUserSession = await orchestrator.createSession(
          activatedPrivilegedUser,
        );

        const response = await fetch(
          `${webserver.origin}/api/v1/migrations`,
          {
            method: "POST",
            headers: {
              Cookie: `session_id=${privilegedUserSession.token}`,
            },
          },
        );

        expect(response.status).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
      });
    });
  });
});
