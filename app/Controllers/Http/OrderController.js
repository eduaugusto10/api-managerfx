"use strict";

const Order = use("App/Models/Order");
const Balance = use("App/Models/Balance");
const Counter = use("App/Models/Counter");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new order.
   * GET orders/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    /* Salvar nova ordem aberta */
    const data = request.only([
      "order_id",
      "symbol",
      "operation_type",
      "comission",
      "swap",
      "tax",
      "return_profit",
      "id_adm",
      "date",
      "calculated",
      "id_user",
      "direction",
    ]);

    /*Extrai somente a última ordem salva no BD para puxar todos usuários ativos*/
    let lastOrder = await this.show();
    lastOrder = JSON.parse(JSON.stringify(lastOrder))[0];
    let dayLastOrder = new Date(lastOrder.date);
    let dayActualOrder = new Date(request.body.date);

    const monthDayLastOrder = ("0" + (dayLastOrder.getMonth() + 1)).slice(-2);
    const dayDayLastOrder = ("0" + dayLastOrder.getDate()).slice(-2);
    const yearDayLastOrder = dayLastOrder.getFullYear();

    const monthdayActualOrder = ("0" + (dayActualOrder.getMonth() + 1)).slice(
      -2
    );
    const daydayActualOrder = ("0" + dayActualOrder.getDate()).slice(-2);
    const yeardayActualOrder = dayActualOrder.getFullYear();

    const actualDayOrder =
      yeardayActualOrder + "-" + monthdayActualOrder + "-" + daydayActualOrder;
    const lastDayOrder =
      yearDayLastOrder + "-" + monthDayLastOrder + "-" + dayDayLastOrder;

    if (actualDayOrder != lastDayOrder) {
      const balance = await Balance.query()
        .whereBetween("date_operation", [
          `${lastDayOrder} 00:00:00`,
          `${lastDayOrder} 23:59:59`,
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
            idNumber = j;
            flagNew = true;
          }
        }

        if (balanceJSON[idNumber].id_user != 1140 && flagNew == true) {
          const datas = {
            ticket: 0,
            date_operation: `${lastDayOrder} 23:59:59`,
            banca: (parseFloat(balanceJSON[idNumber].banca) - ganhoDia).toFixed(
              3
            ),
            banca_total: balanceJSON[idNumber].banca_total,
            percentual: (
              (parseFloat(balanceJSON[idNumber].banca) - parseFloat(ganhoDia)) /
              parseFloat(balanceJSON[idNumber].banca_total)
            ).toFixed(15),
            comission: "-" + ganhoDia,
            lucro: 0,
            id_user: balanceJSON[idNumber].id_user,
          };
          const balance = await Balance.create(datas);
          ganhoDia = 0;
          flagNew = false;
        }
      }
      let datas = [];
      for (let i = 0; i < ordensLength; i++) {
        if (balanceJSON[i].id_user == 1140) {
          datas = {
            ticket: 0,
            date_operation: `${lastDayOrder} 23:59:59`,
            banca: (
              parseFloat(balanceJSON[i].banca) + parseFloat(ganhoDiaAdm)
            ).toFixed(2),
            banca_total: balanceJSON[i].banca_total,
            percentual: (
              (parseFloat(balanceJSON[i].banca) + parseFloat(ganhoDiaAdm)) /
              parseFloat(balanceJSON[i].banca_total)
            ).toFixed(15),
            lucro: parseFloat(ganhoDiaAdm).toFixed(2),
            comission: 0,
            id_user: balanceJSON[i].id_user,
          };
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
        comission: 0,
        date: new Date(`${lastDayOrder} 23:59:59`),
        calculated: 0,
        id_user: 0,
        direction: 9,
      };

      const order = await Order.create(data);

      lastOrder = await this.show();
      lastOrder = JSON.parse(JSON.stringify(lastOrder))[0];
    }

    /* Verifica quantos usuarios aquele administrador tem
     ** necessario para nao ficar duplicando ordens na tabela Balanço */
    let limits = await Counter.query()
      .where("adm_nr", request.body.id_adm)
      .orderBy("id", "desc")
      .limit(1)
      .fetch();
    limits = JSON.parse(JSON.stringify(limits))[0];
    const newLimit = limits === undefined ? 0 : limits.qty_users;
    limits = limits === undefined ? 1 : newLimit;

    let lastOrders = undefined;
    if (lastOrder !== undefined) {
      lastOrders = await Balance.query()
        .where("date_operation", new Date(lastOrder.date))
        .orderBy("id", "desc")
        .limit(limits)
        .fetch();

      lastOrders = JSON.parse(JSON.stringify(lastOrders));
    }
    const lastOrdersLength = lastOrders.length;
    /*Criar a nova ordem no banco de dados ORDER*/
    const order = await Order.create(data);

    //Depositando dinheiro na banca
    /* Se tipo de operação estiver igual a dois, quer dizer que é sobre o balanço
     ** então poderá ser deposito, retirada, ajuste com a corretora
     */
    let new_users = "";
    if (request.body.operation_type == 2) {
      //não é ordem de entrada na operação
      const limit = 1;
      const new_user = await Balance.query() //pesquisa o usuário pelo id ex.1140
        .where("id_user", request.body.id_user) //pesquisa o id
        .orderBy("id", "desc") //ordena pela id e decrescente
        .limit(limit) // somente 1 ordem
        .fetch();
      new_users = JSON.parse(JSON.stringify(new_user))[0];
      const new_usersWhitou = JSON.parse(JSON.stringify(new_user));
      const datas = {
        ticket: request.body.order_id,
        date_operation: new Date(request.body.date),
        banca:
          (new_users !== undefined ? parseFloat(new_users.banca) : 0) +
          parseFloat(request.body.return_profit),
        banca_total:
          (lastOrders[0] !== undefined
            ? parseFloat(lastOrders[0].banca_total)
            : 0) + parseFloat(request.body.return_profit),
        percentual: (
          ((new_users !== undefined ? parseFloat(new_users.banca) : 0) +
            parseFloat(request.body.return_profit)) /
          ((lastOrders[0] !== undefined
            ? parseFloat(lastOrders[0].banca_total)
            : 0) +
            parseFloat(request.body.return_profit))
        ).toFixed(15),
        comission: 0,
        lucro: 0,
        id_user: request.body.id_user,
      };
      const balance = await Balance.create(datas);
      const dataCounter = {
        adm_nr: request.body.id_adm,
        qty_users: newLimit + 1,
      };

      /*Caso não encontrou usuario então vai contar +1 na tabela counter*/
      new_usersWhitou.length === 0 ? await Counter.create(dataCounter) : null;

      /*Bloco abaixo é só para colocar todos os usuários na mesma data*/
      for (let i = 0; i < lastOrdersLength; i++) {
        if (request.body.id_user !== lastOrders[i].id_user) {
          const datas = {
            ticket: request.body.order_id,
            date_operation: new Date(request.body.date),
            banca:
              lastOrders[i] !== undefined ? parseFloat(lastOrders[i].banca) : 0,
            banca_total:
              (lastOrders[i] !== undefined
                ? parseFloat(lastOrders[i].banca_total)
                : 0) + parseFloat(request.body.return_profit),
            percentual: (
              (lastOrders[i] !== undefined
                ? parseFloat(lastOrders[i].banca)
                : 0) /
              ((lastOrders[i] !== undefined
                ? parseFloat(lastOrders[i].banca_total)
                : 0) +
                parseFloat(request.body.return_profit))
            ).toFixed(15),
            comission: 0,
            lucro: 0,
            id_user: lastOrders[i].id_user,
          };
          const balance = await Balance.create(datas);
        }
      }
    }

    /*Operation type abaixo de 2 significa compra ou venda (abertura de ordem)*/
    if (request.body.operation_type < 2) {
      /*Verifica se a ordem existe */
      let orderSearch = await Balance.query()
        .where("ticket", request.body.order_id)
        .orderBy("id", "desc")
        .fetch();

      orderSearch = JSON.parse(JSON.stringify(orderSearch));
      const orderSearchLength = orderSearch.length;

      /**Abertura de ordem */
      if (orderSearchLength < 1) {
        for (let i = 0; i < lastOrdersLength; i++) {
          const newTotalBanca =
            parseFloat(lastOrders[i].banca_total) +
            parseFloat(request.body.return_profit);
          const datas = {
            ticket: request.body.order_id,
            date_operation: new Date(request.body.date),
            banca: (lastOrders[i].percentual * newTotalBanca).toFixed(2),
            banca_total: newTotalBanca.toFixed(2),
            percentual: parseFloat(lastOrders[i].percentual).toFixed(15),
            lucro: 0,
            comission:
              (parseFloat(request.body.comission) +
                parseFloat(request.body.swap) +
                parseFloat(request.body.tax)) *
              parseFloat(lastOrders[i].percentual).toFixed(15),
            id_user: lastOrders[i].id_user,
          };
          const balance = await Balance.create(datas);
        }
      } else {
        /** Encerramento de ordem */
        for (let i = 0; i < lastOrdersLength; i++) {
          let flagFound = true;
          const newTotalBanca =
            parseFloat(lastOrders[i].banca_total) +
            parseFloat(request.body.return_profit);
          for (let j = 0; j < orderSearchLength; j++) {
            if (lastOrders[i].id_user === orderSearch[j].id_user) {
              const datas = {
                ticket: request.body.order_id,
                date_operation: new Date(request.body.date),
                banca: (
                  parseFloat(orderSearch[j].percentual) *
                    parseFloat(request.body.return_profit) +
                  parseFloat(lastOrders[i].banca)
                ).toFixed(2),
                banca_total: newTotalBanca.toFixed(2),
                percentual: (
                  (parseFloat(orderSearch[j].percentual) *
                    parseFloat(request.body.return_profit) +
                    parseFloat(lastOrders[i].banca)) /
                  newTotalBanca
                ).toFixed(15),
                comission:
                  (parseFloat(request.body.comission) +
                    parseFloat(request.body.swap) +
                    parseFloat(request.body.tax)) *
                  (
                    (parseFloat(orderSearch[j].percentual) *
                      parseFloat(request.body.return_profit) +
                      parseFloat(lastOrders[i].banca)) /
                    newTotalBanca
                  ).toFixed(15),
                lucro: (
                  parseFloat(orderSearch[j].percentual) *
                  parseFloat(request.body.return_profit)
                ).toFixed(2),
                id_user: lastOrders[i].id_user,
              };
              flagFound = false;
              const balance = await Balance.create(datas);
            }
          }
          if (flagFound === true) {
            const datas = {
              ticket: 0,
              date_operation: new Date(request.body.date),
              banca: lastOrders[i].banca,
              banca_total: newTotalBanca,
              percentual: (
                parseFloat(lastOrders[i].banca).toFixed(15) /
                parseFloat(newTotalBanca).toFixed(15)
              ).toFixed(15),
              comission: 0,
              lucro: 0,
              id_user: lastOrders[i].id_user,
            };
            flagFound = false;
            const balance = await Balance.create(datas);
          }
        }
      }
    }

    return { order, lastOrders };
  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show() {
    const limit = 1;
    const order = await Order.query()
      .orderBy("id", "desc")
      .limit(limit)
      .fetch();
    return order;
  }

  /**
   * Render a form to update an existing order.
   * GET orders/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const order = await Order.query()
      .where("order_id", params.ticket)
      .update({ return_profit: request.body.return_profit, calculated: 1 });

    return order;
  }

  async openoperations({ params, request, response, view }) {
    let equity = 0;
    let allOrders = [];
    const operation = await Order.query()
      .where("id_adm", params.id_adm)
      .andWhere("calculated",1)
      .orderBy("id", "desc")
      .fetch();
console.log(operation.rows)
    for (let i = 0; i < operation.rows.length; i++) {
      const operations = await Balance.query()
        .where("id_user", params.id_cliente)
        .andWhere("ticket", operation.rows[i].order_id)
        .orderBy("id", "desc")
        .fetch();
        console.log(operations.rows[0])
      if (operations.rows[0] != undefined) {
        equity =
          equity +
          parseFloat(operations.rows[0].percentual) *
            operation.rows[i].return_profit;
        allOrders.push(operations.rows[0]);
      }
    }
    console.log(allOrders);
    return { equity, operation, allOrders };
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = OrderController;
