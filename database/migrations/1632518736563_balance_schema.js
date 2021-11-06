"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BalanceSchema extends Schema {
  up() {
    this.create("balances", (table) => {
      table.increments();
      table.integer("ticket");
      table.dateTime("date_operation");
      table.string("banca");
      table.string("comission")
      table.string("lucro");
      table.string("banca_total");
      table.integer("id_user");
      table.string("percentual");
      table.timestamps();
    });
  }

  down() {
    this.drop("balances");
  }
}

module.exports = BalanceSchema;
