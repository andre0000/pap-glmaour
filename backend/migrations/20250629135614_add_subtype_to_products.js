/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('products', (table) => {
    table
      .uuid('sub_type_id')
      .references('id')
      .inTable('sub_types')
      .onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('sub_type_id');
  });
};
