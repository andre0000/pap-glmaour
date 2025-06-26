// migrations/20250519_add_gender_to_products.js

/**
 * Adiciona a coluna 'gender' na tabela 'products'.
 * Tipo: string/varchar, pode ser 'Men', 'Women', 'Unisex', etc.
 * Permite valores nulos para não quebrar dados existentes.
 */

exports.up = function (knex) {
  return knex.schema.table('products', (table) => {
    table.string('gender').nullable().defaultTo('Unisex'); // default como exemplo
  });
};

exports.down = function (knex) {
  return knex.schema.table('products', (table) => {
    table.dropColumn('gender');
  });
};
