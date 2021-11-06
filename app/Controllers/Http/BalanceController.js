"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Balance = use("App/Models/Balance");
const Order = use("App/Models/Order");

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

  async fetching(todays) {
    console.log("Chegou ate aqui!");
    let today = new Date(todays);
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + dayLastOrder.getDate()).slice(-2);
    const year = today.getFullYear();
    /*const month = ("0" + 9).slice(-2);
    const day = 23;
    const year = 2020;*/

    today = year + "-" + month + "-" + day;

    const balance = await Balance.query()
      .whereBetween("date_operation", [
        `${today} 00:00:00`,
        `${today} 23:59:59`,
      ])
      .orderBy("id", "asc")
      .fetch();

    const balanceJSON = JSON.parse(JSON.stringify(balance));
    const ordensLength = balanceJSON.length;
    let ganhoDia = 0;

    let listaID = [];
    for (let i = 0; i < ordensLength; i++) {
      listaID[i] = balanceJSON[i].id_user;
    }
    let listaIDs = [...new Set(listaID)];
    console.log(listaIDs.sort());
    let ganhoDiaAdm = 0;
    for (let i = 0; i < listaIDs.length; i++) {
      let idNumber = 0;
      let flagNew = false;
      for (let j = 0; j < ordensLength; j++) {
        if (
          listaIDs[i] === balanceJSON[j].id_user &&
          balanceJSON[j].id_user != 1140
        ) {
          ganhoDia = ganhoDia + parseFloat(balanceJSON[j].lucro) * 0.25;
          ganhoDiaAdm = ganhoDiaAdm + parseFloat(balanceJSON[j].lucro) * 0.25;
          console.log("Lucro: ", parseFloat(balanceJSON[j].lucro));
          idNumber = j;
          flagNew = true;
        }
      }

      if (balanceJSON[idNumber].id_user != 1140 && flagNew == true) {
        console.log(
          "ID: ",
          balanceJSON[idNumber].id_user + " Ganho:" + ganhoDia
        );
        const datas = {
          ticket: 0,
          date_operation: `${today} 23:59:59`,
          banca: (parseFloat(balanceJSON[idNumber].banca) - ganhoDia).toFixed(
            3
          ),
          comission: 0,
          banca_total: balanceJSON[idNumber].banca_total,
          percentual: (
            (parseFloat(balanceJSON[idNumber].banca) - parseFloat(ganhoDia)) /
            parseFloat(balanceJSON[idNumber].banca_total)
          ).toFixed(5),
          lucro: 0,
          id_user: balanceJSON[idNumber].id_user,
        };
        console.log("Balanço Final do Dia");
        console.log(datas);
        const balance = await Balance.create(datas);
        ganhoDia = 0;
        flagNew = false;
      }
    }
    let datas = [];
    for (let i = 0; i < ordensLength; i++) {
      if (balanceJSON[i].id_user == 1140) {
        console.log("ID: ", balanceJSON[i].id_user);
        datas = {
          ticket: 0,
          date_operation: `${today} 23:59:59`,
          banca: (
            parseFloat(balanceJSON[i].banca) + parseFloat(ganhoDiaAdm)
          ).toFixed(3),
          comission: 0,
          banca_total: balanceJSON[i].banca_total,
          percentual: (
            (parseFloat(balanceJSON[i].banca) + parseFloat(ganhoDiaAdm)) /
            parseFloat(balanceJSON[i].banca_total)
          ).toFixed(5),
          lucro: 0,
          id_user: balanceJSON[i].id_user,
        };
        console.log("Balanço Final do Dia");
        console.log(datas);
        ganhoDia = 0;
      }
    }
    await Balance.create(datas);
    const data = {
      order_id: 0,
      symbol: 0,
      operation_type: 0,
      comission: 0,
      swap: 0,
      tax: 0,
      return_profit: 0,
      id_adm: 0,
      date: new Date(`${today} 23:59:59`),
      calculated: 0,
      id_user: 0,
    };

    const order = await Order.create(data);

    return { ordensLength, balanceJSON };
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
    const balancesCapital = await Order.query()
      .where("id_user", params.id_user)
      .andWhere("operation_type", "2")
      .orderBy("id", "desc")
      .fetch();
    let balanceCapital = JSON.parse(JSON.stringify(balancesCapital));
    balanceCapital = JSON.parse(JSON.stringify(balanceCapital));
    console.log(balanceCapital[0]);
    return { balanceCapital, balance };
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
