"use strict";

const Operation = use("App/Models/Operation");
const Balance = use("App/Models/Balance");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with operations
 */
class OperationController {
  /**
   * Show a list of all operations.
   * GET operations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index() {
    const operation = await Operation.all();

    return operation;
  }

  async openoperations({ params, request, response, view }) {
    let equity = 0;
    let allOrders = [];
    const operation = await Operation.query()
      .where("id_adm", params.id_adm)
      .orderBy("id", "desc")
      .fetch();

    for (let i = 0; i < operation.rows.length; i++) {
      const operations = await Balance.query()
        .where("id_user", params.id_cliente)
        .andWhere("ticket", operation.rows[i].ticket)
        .orderBy("id", "desc")
        .fetch();
      equity =
        equity +
        parseFloat(operations.rows[0].percentual) *
          operation.rows[i].return_profit;
      allOrders.push(operations.rows[0]);
    }
    console.log(allOrders);
    return { equity, operation, allOrders };
  }
  /**
   * Render a form to be used for creating a new operation.
   * GET operations/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new operation.
   * POST operations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only([
      "symbol",
      "operation_type",
      "comission",
      "swap",
      "tax",
      "return_profit",
      "id_adm",
      "date_open",
      "ticket",
    ]);
    const operation = await Operation.create(data);

    return operation;
  }

  /**
   * Display a single operation.
   * GET operations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing operation.
   * GET operations/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update operation details.
   * PUT or PATCH operations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a operation with id.
   * DELETE operations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = OperationController;
