import orchestrator from "test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/migrations", () => {
  (describe("Anonymous user", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Voce nao possui permisssao para executar esta acao",
        action: `Verifique se o seu usuario possui a feature "read:migration"`,
        status_code: 403,
      });
    });
  }),
    describe("Default user", () => {
      test("Retrieving pending migrations", async () => {
        const createdUser = await orchestrator.createUser();
        await orchestrator.activateUser(createdUser);
        const sessionObject = await orchestrator.createSession(createdUser.id);

        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            headers: {
              Cookie: `session_id=${sessionObject.token}`,
            },
          },
        );
        expect(response.status).toBe(403);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ForbiddenError",
          message: "Voce nao possui permisssao para executar esta acao",
          action: `Verifique se o seu usuario possui a feature "read:migration"`,
          status_code: 403,
        });
      });
    }),
    describe("Privileged user", () => {
      test("With `read:migration`", async () => {
        const privilegedUser = await orchestrator.createUser();

        const activatedPrivilegedUser = await orchestrator.activateUser(privilegedUser);

        await orchestrator.addFeaturesToUser(privilegedUser, [
          "read:migration",
        ]);

        const privilegedUserSession = await orchestrator.createSession(
          activatedPrivilegedUser.id,
        );

        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            headers: {
              Cookie: `session_id=${privilegedUserSession.token}`,
            },
          },
        );
        expect(response.status).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
      });
    }));
});
