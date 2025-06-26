/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("cart", (table) => {
    table.string("size", 5).nullable();
    table.boolean("bought").defaultTo(false).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("cart", (table) => {
    table.dropColumn("size");
    table.dropColumn("bought");
  });
};
