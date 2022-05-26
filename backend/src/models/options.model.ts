// options-model.ts - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
import { Knex } from "knex";
import { Application } from "../declarations";

export default function (app: Application): Knex {
  const db: Knex = app.get("knexClient");
  const tableName = "options";
  db.schema.hasTable(tableName).then((exists) => {
    if (!exists) {
      db.schema
        .createTable(tableName, (table) => {
          table.increments("id").primary();
          table.string("text").notNullable();
          table
            .integer("poll_id")
            .unsigned()
            .references("id")
            .inTable("polls")
            .notNullable();
        })
        .then(() => console.log(`Created ${tableName} table`))
        .catch((e) => console.error(`Error creating ${tableName} table`, e));
    }
  });

  return db;
}
