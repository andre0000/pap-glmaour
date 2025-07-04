/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_stock_on_purchase()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.bought = TRUE AND OLD.bought = FALSE THEN
        UPDATE products
        SET stock = stock - NEW.quantity
        WHERE id = NEW.product_id;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_update_stock_on_purchase
    AFTER UPDATE ON cart
    FOR EACH ROW
    WHEN (OLD.bought IS DISTINCT FROM NEW.bought)
    EXECUTE FUNCTION update_stock_on_purchase();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
    DROP TRIGGER IF EXISTS trg_update_stock_on_purchase ON cart;
    DROP FUNCTION IF EXISTS update_stock_on_purchase();
  `);
};
