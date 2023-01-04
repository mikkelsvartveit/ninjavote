import knex from "knex";
import { Application } from "./declarations";

export default function (app: Application): void {
  const { client, connection } = app.get("database");
  const db = knex({
    client,
    connection,
    useNullAsDefault: true,
  });

  app.set("knexClient", db);
}
