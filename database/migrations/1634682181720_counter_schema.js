"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CounterSchema extends Schema {
  up() {
    this.create("counters", (table) => {
      table.increments();
      table.integer("qty_users");
      table.integer("adm_nr");
      table.timestamps();
    });
  }

  down() {
    this.drop("counters");
  }
}

module.exports = CounterSchema;
