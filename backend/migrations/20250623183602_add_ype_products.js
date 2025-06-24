/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("products", function (table) {
    table.string("type").notNullable().defaultTo("");
    table.string("sub_type").notNullable().defaultTo("");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("products", function (table) {
    table.dropColumn("type");
    table.dropColumn("sub_type");
  });
};
