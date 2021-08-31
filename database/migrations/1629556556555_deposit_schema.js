'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DepositSchema extends Schema {
  up () {
    this.create('deposits', (table) => {
      table.increments()
      table.string('id_cliente',60)
      table.string('deposit_value',60)
      table.string('date_deposit',60)
      table.timestamps()
    })
  }

  down () {
    this.drop('deposits')
  }
}

module.exports = DepositSchema
