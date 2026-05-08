import webserver from "infra/webserver.js";
import orchestrator from "test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
});

describe("PUT /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Rerunning pending migrations", () => {
      test("For the first time", async () => {
        const response1 = await fetch(
          `${webserver.origin}/api/v1/migrations`,
          {
            method: "PUT",
          },
        );

        expect(response1.status).toBe(405);
        const response1Body = await response1.json();
        expect(response1Body).toEqual({
          name: "MethodNotAllowedError",
          message: "Método não permitido para este endpoint.",
          action:
            "Verifique se o método HTTP enviado é válido para este endpoint.",
          status_code: 405,
        });
      });

      test("For the second time", async () => {
        const response2 = await fetch(
          `${webserver.origin}/api/v1/migrations`,
          {
            method: "PUT",
          },
        );

        expect(response2.status).toBe(405);
        const response2Body = await response2.json();
        expect(response2Body).toEqual({
          name: "MethodNotAllowedError",
          message: "Método não permitido para este endpoint.",
          action:
            "Verifique se o método HTTP enviado é válido para este endpoint.",
          status_code: 405,
        });
      });
    });
  });
});
