/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.boolean('is_admin').notNullable().defaultTo(false);
      table.string('reset_token');
      table.timestamp('reset_token_expires');
      table.boolean('is_deleted').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('suppliers', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.string('email');
      table.string('phone');
      table.text('address');
      table.boolean('is_deleted').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('sub_types', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.timestamps(true, true);
      table.boolean('is_deleted').defaultTo(false);
    })
    .createTable('types', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table
        .uuid('sub_type_id')
        .references('id')
        .inTable('sub_types')
        .onDelete('SET NULL');
      table.timestamps(true, true);
      table.boolean('is_deleted').defaultTo(false);
    })
    .createTable('products', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.text('description');
      table.decimal('price', 10, 2).notNullable();
      table.integer('stock').notNullable().defaultTo(0);
      table
        .uuid('supplier_id')
        .references('id')
        .inTable('suppliers')
        .onDelete('SET NULL');
      table
        .uuid('type_id')
        .references('id')
        .inTable('types')
        .onDelete('SET NULL');
      table.boolean('is_deleted').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('cart', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('product_id')
        .references('id')
        .inTable('products')
        .onDelete('CASCADE');
      table.integer('quantity').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.boolean('is_deleted').defaultTo(false);
    })
    .createTable('sales', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.decimal('total', 10, 2).notNullable();
      table.decimal('discount', 10, 2).defaultTo(0.0);
      table.decimal('final_total', 10, 2).defaultTo(0.0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.boolean('is_active').defaultTo(true);
      table.uuid('product_id').references('id').inTable('products');
    })
    .createTable('sale_items', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table
        .uuid('product_id')
        .references('id')
        .inTable('products')
        .onDelete('SET NULL');
      table.integer('quantity').notNullable();
      table.decimal('unit_price', 10, 2).notNullable();
      table.decimal('total_price', 10, 2).notNullable();
      table.boolean('is_deleted').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('products', (table) => {
      table.dropColumn('type_id');
    })
    .dropTableIfExists('types')
    .dropTableIfExists('sub_types')
    .dropTableIfExists('sale_items')
    .dropTableIfExists('sales')
    .dropTableIfExists('cart')
    .dropTableIfExists('products')
    .dropTableIfExists('suppliers')
    .dropTableIfExists('users');
};
