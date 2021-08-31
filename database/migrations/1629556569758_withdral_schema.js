'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WithdralSchema extends Schema {
  up () {
    this.create('withdrals', (table) => {
      table.increments()
      table.string('id_cliente',60)
      table.string('withdrawal_value',60)
      table.string('date_withdrawal',60)
      table.timestamps()
    })
  }

  down () {
    this.drop('withdrals')
  }
}

module.exports = WithdralSchema
