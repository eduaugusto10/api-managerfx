"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OperationSchema extends Schema {
  up() {
    this.create("operations", (table) => {
      table.increments();
      table.integer("ticket");
      table.string("symbol", 60);
      table.string("operation_type", 60);
      table.string("comission", 60);
      table.string("swap", 60);
      table.string("tax", 60);
      table.string("return_profit", 60);
      table.integer("id_adm", 60);
      table.dateTime("date_open");
      table.timestamps();
    });
  }

  down() {
    this.drop("operations");
  }
}

module.exports = OperationSchema;
