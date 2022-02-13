"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Balance = use("App/Models/Balance");
const Order = use("App/Models/Order");
const Database = use("Database");

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
      "comission",
      "banca",
      "id_user",
      "percentual",
    ]);

    const balance = await Balance.create(data);
    return balance;
  }

  async balanceHome({ params, request, response, view }) {
    const limit = 1;
    const balances = await Balance.query()
      .where("id_user", params.id_user)
      .orderBy("id", "desc")
      .limit(limit)
      .fetch();
    let balance = JSON.parse(JSON.stringify(balances))[0];
    balance = JSON.parse(JSON.stringify(balance));

    const balancesCapital = await Database.raw(
      "SELECT id_user, SUM(return_profit) as sum FROM orders WHERE id_user=? AND operation_type=2 AND return_profit>0 group by id_user;",
      [params.id_user]
    );
    let balanceCapital = JSON.parse(JSON.stringify(balancesCapital))[0];
    balanceCapital = JSON.parse(JSON.stringify(balanceCapital));

    const comission = await Database.raw(
      "SELECT id_user, SUM(comission) as sum FROM balances WHERE id_user=? group by id_user;",
      [params.id_user]
    );
    let comissions = JSON.parse(JSON.stringify(comission))[0];
    comissions = JSON.parse(JSON.stringify(comissions));

    return { balanceCapital, balance, comissions };
  }

  async comissionHome({ params, request, response, view }) {
    const balancesCapital = await Balance.query()
      .where("id_user", params.id_user)
      .orderBy("id", "desc")
      .fetch();
    let balanceCapital = JSON.parse(JSON.stringify(balancesCapital));
    balanceCapital = JSON.parse(JSON.stringify(balanceCapital));

    return { balanceCapital };
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

  async close({ params, request, response, view }) {
    const limit = 20;
    const balance = await Balance.query()
      .where("id_user", params.id_user)
      .andWhere("ticket", ">", "0")
      .andWhere("lucro", "!=", "0")
      .orderBy("id", "desc")
      .paginate(params.page, limit);

    let close = [];
    let closeOrder;
    for (let i = 0; i < balance.rows.length; i++) {
      closeOrder = await Order.query()
        .where("order_id", balance.rows[i].ticket)
        .andWhere("direction", "0")
        .orderBy("id", "desc")
        .fetch();
      if (closeOrder.rows.length > 0) close.push(closeOrder.rows[0]);
    }
    return { balance, close };
  }

  async monthprofit({ params, request, response, view }) {
    const balance = await Database.raw(
      "SELECT id_user,YEAR(date_operation) as year,MONTH(date_operation) as month, SUM(lucro) as sum FROM balances WHERE id_user= ? group by id_user,year, month;",
      [params.id_user]
    );
    const deposit = await Database.raw(
      "SELECT id_user,YEAR(date) as year,MONTH(date) as month, SUM(return_profit) as sum  FROM orders WHERE operation_type=2 and id_user=? group by id_user,year, month;",
      [params.id_user]
    );
    const year = await Database.raw(
      "SELECT YEAR(date_operation) as year FROM balances WHERE id_user=? group by year;",
      [params.id_user]
    );
    const deposits = deposit[0]
    const balances = balance[0];
    const years = year[0];
    const length = balance[0].length;
    return { length, balances, deposits, years };
  }
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
