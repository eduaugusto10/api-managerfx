"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OrderSchema extends Schema {
  up() {
    this.create("orders", (table) => {
      table.increments();
      table.integer("order_id");
      table.string("symbol", 60);
      table.integer("operation_type", 60);
      table.string("comission", 60);
      table.string("swap", 60);
      table.string("tax", 60);
      table.string("return_profit", 60);
      table.integer("id_adm", 60);
      table.dateTime("date");
      table.integer("calculated");
      table.integer("id_user");
      table.timestamps();
    });
  }

  down() {
    this.drop("orders");
  }
}

module.exports = OrderSchema;
