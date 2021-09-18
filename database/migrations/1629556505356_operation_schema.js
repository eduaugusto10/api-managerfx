"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OperationSchema extends Schema {
  up() {
    this.create("operations", (table) => {
      table.increments();
      table.string("symbol", 60);
      table.string("operation_type", 60);
      table.string("price_open", 60);
      table.string("comission", 60);
      table.string("swap", 60);
      table.string("lot", 60);
      table.string("takeprofit", 60);
      table.string("stoploss", 60);
      table.string("tax", 60);
      table.string("return_profit", 60);
      table.string("id_adm", 60);
      table.integer("direction");
      table.dateTime("date_operation");
      table.timestamps();
    });
  }

  down() {
    this.drop("operations");
  }
}

module.exports = OperationSchema;
