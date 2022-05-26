import knex, { Knex } from "knex";

export default class DatabaseConnection {
  private db: Knex<any, unknown[]>;

  constructor() {
    // Connect to database
    this.db = this.connect();

    // Create tables if they don't exist
    this.createSchema(this.db);
  }

  private connect(): Knex<any, unknown[]> {
    return knex({
      client: "better-sqlite3",
      connection: {
        filename: "./db.sqlite",
      },
      useNullAsDefault: true,
    });
  }

  private createSchema(db: Knex<any, unknown[]>): void {
    db.schema.hasTable("polls").then((exists) => {
      if (!exists) {
        return this.db.schema
          .createTable("polls", (table) => {
            table.increments("id").primary();
            table.string("slug").unique();
            table.string("question");
            table.string("created_by");
          })
          .then(() => {
            console.log("Knex: Created table 'polls'.");
          });
      }
    });

    db.schema.hasTable("options").then((exists) => {
      if (!exists) {
        return this.db.schema
          .createTable("options", (table) => {
            table.increments("id").primary();
            table.string("text").notNullable();
            table
              .integer("poll_id")
              .unsigned()
              .references("id")
              .inTable("polls");
          })
          .then(() => {
            console.log("Knex: Created table 'options'.");
          });
      }
    });

    db.schema.hasTable("votes").then((exists) => {
      if (!exists) {
        return this.db.schema
          .createTable("votes", (table) => {
            table.increments("id").primary();
            table.string("name").notNullable();
            table
              .integer("option_id")
              .unsigned()
              .references("id")
              .inTable("options");
          })
          .then(() => {
            console.log("Knex: Created table 'votes'.");
          });
      }
    });
  }

  public getKnexInstance(): Knex<any, unknown[]> {
    return this.db;
  }
}
