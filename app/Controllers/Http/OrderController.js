"use strict";

const Order = use("App/Models/Order");
const Balance = use("App/Models/Balance");

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
    ]);

    /*Extrai somente a última ordem salva no BD para puxar todos usuários ativos*/
    console.log("=========== Last Order ================");
    let lastOrder = await this.show();
    lastOrder = JSON.parse(JSON.stringify(lastOrder))[0];
    console.log(lastOrder);
    console.log("========================");
    console.log(
      "=============== Últimas Ordens pela mesma data ================"
    );
    let lastOrders = undefined;
    if (lastOrder !== undefined) {
      lastOrders = await Balance.query()
        .where("date_operation", new Date(lastOrder.date))
        .orderBy("id", "desc")
        .fetch();

      lastOrders = JSON.parse(JSON.stringify(lastOrders));
      console.log(lastOrders);
      console.log("Tamanho array ", lastOrders.length);
    }
    const lastOrdersLength = lastOrders.length;
    console.log("========================");
    /*Criar a nova ordem no banco de dados */
    const order = await Order.create(data);

    //Depositando dinheiro na banca
    let new_users = "";
    if (request.body.operation_type == 2) {
      //não é ordem de entrada na operação
      const limit = 1;
      const new_user = await Balance.query() //pesquisa o usuário pelo id ex.1140
        .where("id_user", request.body.id_user) //pesquisa o id
        .orderBy("id", "desc") //ordena pela id e decrescente
        .limit(limit) // somente 1 ordem
        .fetch();
      console.log("Cadastrado novo usuario");
      new_users = JSON.parse(JSON.stringify(new_user))[0];
      const new_usersWhitou = JSON.parse(JSON.stringify(new_user));
      console.log("Dados do novo usuario ", new_users);
      console.log("Array do novo usuario ", new_usersWhitou.length);
      console.log("========================");
      const datas = {
        ticket: request.body.order_id,
        date_operation: request.body.date,
        banca:
          (new_users !== undefined ? parseFloat(new_users.banca) : 0) +
          parseFloat(request.body.return_profit),
        banca_total:
          (lastOrders[0] !== undefined
            ? parseFloat(lastOrders[0].banca_total)
            : 0) + parseFloat(request.body.return_profit),
        percentual:
          ((new_users !== undefined ? parseFloat(new_users.banca) : 0) +
            parseFloat(request.body.return_profit)) /
          ((lastOrders[0] !== undefined
            ? parseFloat(lastOrders[0].banca_total)
            : 0) +
            parseFloat(request.body.return_profit)),
        id_user: request.body.id_user,
      };
      console.log("Entrada 1");
      const balance = await Balance.create(datas);

      for (let i = 0; i < lastOrdersLength; i++) {
        console.log("ID: ", lastOrders[i].id_user);
        if (request.body.id_user !== lastOrders[i].id_user) {
          const datas = {
            ticket: request.body.order_id,
            date_operation: request.body.date,
            banca:
              lastOrders[i] !== undefined ? parseFloat(lastOrders[i].banca) : 0,
            banca_total:
              (lastOrders[i] !== undefined
                ? parseFloat(lastOrders[i].banca_total)
                : 0) + parseFloat(request.body.return_profit),
            percentual:
              (lastOrders[i] !== undefined
                ? parseFloat(lastOrders[i].banca)
                : 0) /
              ((lastOrders[i] !== undefined
                ? parseFloat(lastOrders[i].banca_total)
                : 0) +
                parseFloat(request.body.return_profit)),
            id_user: lastOrders[i].id_user,
          };
          console.log("Entrada 2");
          const balance = await Balance.create(datas);
        }
      }
    }
    if (request.body.operation_type < 2) {
      let orderSearch = await Balance.query()
        .where("ticket", request.body.order_id)
        .orderBy("id", "desc")
        .fetch();

      orderSearch = JSON.parse(JSON.stringify(orderSearch));
      const orderSearchLength = orderSearch.length;
      console.log("====== Usuarios encontrados para aquela ordem ============");
      console.log(orderSearch);
      console.log("Tamanho do array: ", orderSearch.length);
      console.log("=======================");
      if (orderSearchLength < 1) {
        for (let i = 0; i < lastOrdersLength; i++) {
          const newTotalBanca =
            parseFloat(lastOrders[i].banca_total) +
            parseFloat(request.body.comission) +
            parseFloat(request.body.swap) +
            parseFloat(request.body.tax) +
            parseFloat(request.body.return_profit);
          console.log("ID: ", lastOrders[i].id_user);
          const datas = {
            ticket: request.body.order_id,
            date_operation: request.body.date,
            banca: lastOrders[i].percentual * newTotalBanca,
            banca_total: newTotalBanca,
            percentual: lastOrders[i].percentual,
            id_user: lastOrders[i].id_user,
          };
          console.log("Nova Ordem");
          const balance = await Balance.create(datas);
        }
      } else {
        for (let i = 0; i < lastOrdersLength; i++) {
          let flagFound = true;
          const newTotalBanca =
            parseFloat(lastOrders[i].banca_total) +
            parseFloat(request.body.comission) +
            parseFloat(request.body.swap) +
            parseFloat(request.body.tax) +
            parseFloat(request.body.return_profit);
          for (let j = 0; j < orderSearchLength; j++) {
            if (lastOrders[i].id_user == orderSearch[j].id_user) {
              const newValueOrder =
                parseFloat(request.body.comission) +
                parseFloat(request.body.swap) +
                parseFloat(request.body.tax) +
                parseFloat(request.body.return_profit);
              console.log("ID: ", lastOrders[i].id_user);
              const datas = {
                ticket: request.body.order_id,
                date_operation: request.body.date,
                banca:
                  orderSearch[j].percentual * newValueOrder +
                  lastOrders[i].banca,
                banca_total: newTotalBanca,
                percentual:
                  (orderSearch[j].percentual * newValueOrder +
                    lastOrders[i].banca) /
                  newTotalBanca,
                id_user: lastOrders[i].id_user,
              };
              console.log("Fechamento de Ordem com alteração");
              flagFound = false;
              const balance = await Balance.create(datas);
            }
          }
          if (flagFound === true) {
            console.log("ID: ", lastOrders[i].id_user);
            const datas = {
              ticket: 0,
              date_operation: request.body.date,
              banca: lastOrders[i].banca,
              banca_total: newTotalBanca,
              percentual: lastOrders[i].banca / newTotalBanca,
              id_user: lastOrders[i].id_user,
            };
            console.log("Fechamento de Ordem sem alteração");
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
  async update({ params, request, response }) {}

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
