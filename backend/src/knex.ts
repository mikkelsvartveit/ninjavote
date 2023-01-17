import knex from "knex";
import { Application } from "./declarations";

export default function (app: Application): void {
  const { client, connection, pool } = app.get("database");
  const db = knex({
    client,
    connection,
    pool,
    useNullAsDefault: true,
  });

  app.set("knexClient", db);
}
