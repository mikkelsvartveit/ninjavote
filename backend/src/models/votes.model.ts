// votes-model.ts - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
import { Knex } from "knex";
import { Application } from "../declarations";

export default function (app: Application): Knex {
  const db: Knex = app.get("knexClient");
  const tableName = "votes";
  db.schema.hasTable(tableName).then((exists) => {
    if (!exists) {
      db.schema
        .createTable(tableName, (table) => {
          table.increments("id").primary();
          table.string("name").notNullable();
          table.string("voterId").notNullable();
          table.string("voterSecret").notNullable();
          table
            .integer("optionId")
            .unsigned()
            .references("id")
            .inTable("options")
            .notNullable();
          table.unique(["voterId", "optionId"]);
          table.unique(["name", "optionId"]);
        })
        .then(() => console.log(`Created ${tableName} table`))
        .catch((e) => console.error(`Error creating ${tableName} table`, e));
    }
  });

  return db;
}
