"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LastDateSchema extends Schema {
  up() {
    this.create("last_dates", (table) => {
      table.increments();
      table.integer("id_adm");
      table.dateTime("last_date");
      table.timestamps();
    });
  }

  down() {
    this.drop("last_dates");
  }
}

module.exports = LastDateSchema;
