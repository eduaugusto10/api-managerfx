"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class DepositSchema extends Schema {
  up() {
    this.create("deposits", (table) => {
      table.increments();
      table.integer("id_cliente");
      table.string("deposit_value", 60);
      table.dateTime("deposit_date");
      table.integer("type_operation"); //0 Deposit, 1 Platform, 2 Withdraw
      table.timestamps();
    });
  }

  down() {
    this.drop("deposits");
  }
}

module.exports = DepositSchema;
