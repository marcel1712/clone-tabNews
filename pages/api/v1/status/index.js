import database from "infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 as sum;");
  console.log(result.rows);
  console.log(typeof result);
  response.status(200).json({ informacao: "valor_informacao" });
}

export default status;
