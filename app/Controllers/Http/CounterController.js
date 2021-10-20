"use strict";

const Counter = use("App/Models/Counter");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with counters
 */
class CounterController {
  /**
   * Show a list of all counters.
   * GET counters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new counter.
   * GET counters/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new counter.
   * POST counters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    let resp = await this.show(request.body.adm_nr);
    resp = JSON.parse(JSON.stringify(resp))[0];
    const respQtyUsers = resp.qty_users + 1;
    const data = {
      qty_users: respQtyUsers,
      adm_nr: parseInt(request.body.adm_nr),
    };
    const counter = await Counter.create(data);

    return counter;
  }

  /**
   * Display a single counter.
   * GET counters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show(params) {
    const limit = 1;
    const counter = await Counter.query()
      .where("adm_nr", params)
      .limit(limit) // somente 1 ordem
      .orderBy("id", "desc") //ordena pela id e decrescente
      .fetch();
    return counter;
  }
  async shows({ params }) {
    const limit = 1;
    const counter = await Counter.query()
      .where("adm_nr", params.adm_nr)
      .limit(limit) // somente 1 ordem
      .orderBy("id", "desc") //ordena pela id e decrescente
      .fetch();
    return counter;
  }

  /**
   * Render a form to update an existing counter.
   * GET counters/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update counter details.
   * PUT or PATCH counters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a counter with id.
   * DELETE counters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = CounterController;
