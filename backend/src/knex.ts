import knex from "knex";
import { Application } from "./declarations";

export default function (app: Application): void {
  const { client, connection } = app.get("sqlite");
  const db = knex({
    client,
    connection,
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn: any, done: any) =>
        conn.run("PRAGMA foreign_keys = ON", done),
    },
  });

  app.set("knexClient", db);
}
