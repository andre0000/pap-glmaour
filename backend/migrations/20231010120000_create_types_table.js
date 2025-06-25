/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("types", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable("subTypes", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table
      .integer("typeId")
      .unsigned()
      .references("id")
      .inTable("types")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("subTypes");
  await knex.schema.dropTable("types");
};
