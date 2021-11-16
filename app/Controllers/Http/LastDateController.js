"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const LastDate = use("App/Models/LastDate");

/**
 * Resourceful controller for interacting with lastdates
 */
class LastDateController {
  /**
   * Show a list of all lastdates.
   * GET lastdates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const lastdate = await LastDate.all();

    return lastdate;
  }

  /**
   * Render a form to be used for creating a new lastdate.
   * GET lastdates/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new lastdate.
   * POST lastdates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single lastdate.
   * GET lastdates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const lastdate = await LastDate.findOrFail(params.id);

    return lastdate;
  }

  /**
   * Render a form to update an existing lastdate.
   * GET lastdates/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update lastdate details.
   * PUT or PATCH lastdates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const lastdate = await LastDate
    .query()
    .where('id', params.id)
    .update({ last_date: request.body.last_date })

    return lastdate;
  }

  /**
   * Delete a lastdate with id.
   * DELETE lastdates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = LastDateController;
