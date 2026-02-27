import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dataBaseVersionResult = await database.query("SHOW server_version;");
  const dataBaseVersionValue = dataBaseVersionResult.rows[0].server_version;

  const dataBaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const dataBaseMaxConnectionsValue =
    dataBaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname= $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionValue =
    databaseOpenedConnectionResult.rows[0].count;

  console.log(databaseOpenedConnectionValue);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dataBaseVersionValue,
        max_connections: parseInt(dataBaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionValue,
      },
    },
  });
}

export default status;
