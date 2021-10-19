"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Balance = use("App/Models/Balance");

/**
 * Resourceful controller for interacting with balances
 */
class BalanceController {
  /**
   * Show a list of all balances.
   * GET balances
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new balance.
   * GET balances/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new balance.
   * POST balances
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only([
      "ticket",
      "date_operation",
      "banca_total",
      "banca",
      "id_user",
      "percentual",
    ]);

    const balance = await Balance.create(data);
    return balance;
  }

  /**
   * Display a single balance.
   * GET balances/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const limit = 10;
    const balance = await Balance.query()
      .where("id_user", params.id_user)
      .paginate(params.page, limit);

    return balance;
  }

  /**
   * Render a form to update an existing balance.
   * GET balances/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update balance details.
   * PUT or PATCH balances/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a balance with id.
   * DELETE balances/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = BalanceController;
