'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('first_name', 80).notNullable()
      table.string('second_name', 80).notNullable()
      table.string('id_metatrader',60)
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('id_adm', 60)
      table.string('question', 60).notNullable()
      table.string('answer', 60).notNullable()
      table.dateTime('date_start')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
