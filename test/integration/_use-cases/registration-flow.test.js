import webserver from "infra/webserver";
import activation from "models/activation";
import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () => {
  let createUserResponseBody;

  test("Create user account", async () => {
    const createUserResponse = await fetch(
      "http://localhost:3000/api/v1/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "RegistrationFlow",
          email: "registration.flow@feldup.com.br",
          password: "registrationFlowPassword",
        }),
      },
    );

    createUserResponseBody = await createUserResponse.json();

    expect(createUserResponseBody).toEqual({
      id: createUserResponseBody.id,
      username: "RegistrationFlow",
      email: "registration.flow@feldup.com.br",
      features: ["read:activation_token"],
      password: createUserResponseBody.password,
      created_at: createUserResponseBody.created_at,
      updated_at: createUserResponseBody.updated_at,
    });
  });

  test("Receive activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@feldup.com.br>");
    expect(lastEmail.recipients[0]).toBe("<registration.flow@feldup.com.br>");
    expect(lastEmail.subject).toBe("Ative seu cadastro no Feldup!");
    expect(lastEmail.text).toContain("RegistrationFlow");

    const activationTokenId = await orchestrator.extractUUID(lastEmail.text);

    expect(lastEmail.text).toContain(
      `${webserver.origin}/cadastro/ativar/${activationTokenId}`,
    );

    const activationTokenObject =
      await activation.findOneValidById(activationTokenId);

    expect(activationTokenObject.user_id).toBe(createUserResponseBody.id);
    expect(activationTokenObject.used_at).toBe(null);
  });

  test("Activate account", async () => {});

  test("Login", async () => {});
});
