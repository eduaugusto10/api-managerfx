"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BalanceSchema extends Schema {
  up() {
    this.create("balances", (table) => {
      table.increments();
      table.integer("ticket");
      table.dateTime("date_operation");
      table.integer("banca");
      table.integer("nr_participants");
      table.timestamps();
    });
  }

  down() {
    this.drop("balances");
  }
}

module.exports = BalanceSchema;
