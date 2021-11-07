"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.post("/users", "UserController.create");
Route.post("/sessions", "SessionController.create");

Route.resource("operationsave", "OperationController").apiOnly();
Route.get(
  "/operation/id_cliente=:id_cliente?id_adm=:id_adm",
  "OperationController.openoperations"
);

//Route.resource("deposit", "DepositController").apiOnly();
Route.get("/deposit/:id_cliente?page=:page", "DepositController.show");
Route.get("/deposit/", "DepositController.index");
Route.post("/deposit", "DepositController.store");

Route.get("/order", "OrderController.show");
Route.post("/order", "OrderController.store");

Route.get("/balance/:id_user?page=:page", "BalanceController.show");
Route.get("/balancehome/:id_user", "BalanceController.balanceHome");
Route.get("/comissionhome/:id_user", "BalanceController.comissionHome");
Route.get("/fetching", "BalanceController.fetching");
Route.get("/profitmonth", "BalanceController.profitMonth");
Route.get("/close/:id_user", "BalanceController.close");
Route.get("/month", "BalanceController.monthprofit");

Route.get("/counter/:adm_nr", "CounterController.show");
Route.get("/counters/:adm_nr", "CounterController.shows");
Route.post("/counter", "CounterController.store");
