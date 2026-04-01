const { execSync } = require("child_process");

function scanSecrets() {
  const output = execSync(
    'detect-secrets scan . --disable-filter detect_secrets.filters.gibberish.should_exclude_secret --exclude-files "package.json|.env.development"',
    { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }, // ignora stderr
  );

  const result = JSON.parse(output);
  const hasSecrets = Object.keys(result.results).length > 0;

  return { hasSecrets, results: result.results };
}

function handleReturn({ hasSecrets, results }) {
  if (hasSecrets) {
    console.error("🚨 Segredos encontrados!");
    console.error(JSON.stringify(results, null, 2));
    process.exit(1);
  }

  console.log("✅ Nenhum segredo encontrado!");
  process.exit(0);
}

handleReturn(scanSecrets());
