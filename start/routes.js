"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.post("/users", "UserController.create");
Route.post("/sessions", "SessionController.create");

Route.resource("operationsave", "OperationController").apiOnly();
//Route.resource("deposit", "DepositController").apiOnly();
Route.get("/deposit/:id_cliente?page=:page", "DepositController.show");
Route.get("/deposit/", "DepositController.index");
Route.post("/deposit", "DepositController.store");

Route.get("/order", "OrderController.show");
Route.post("/order", "OrderController.store");


Route.get("/balance/:id_user?page=:page", "BalanceController.show");
