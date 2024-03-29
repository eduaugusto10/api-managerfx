"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.post("/users", "UserController.create");
Route.get("/users/:id", "UserController.show");
Route.get("/userss/:id", "UserController.showss");
Route.get("/users", "UserController.shows");
Route.get("/users/:id", "UserController.queries");
Route.put("/users/:id", "UserController.update");

Route.post("/sessions", "SessionController.create");

Route.resource("operationsave", "OperationController").apiOnly();
Route.get(
  "/operation/id_cliente=:id_cliente?id_adm=:id_adm",
  "OrderController.openoperations"
);

Route.get("/deposit/", "DepositController.index");
Route.post("/deposit", "DepositController.store");

Route.get("/deposit/:id_user", "OrderController.showdeposit");
Route.get("/order", "OrderController.show");
Route.post("/order", "OrderController.store");

Route.get("/balance/:id_user?page=:page", "BalanceController.show");
Route.get("/balancehome/:id_user", "BalanceController.balanceHome");
Route.get("/comissionhome/:id_user", "BalanceController.comissionHome");

Route.get("/profitmonth", "BalanceController.profitMonth");
Route.get("/close/:id_user?page=:page", "BalanceController.close");
Route.get("/month/:id_user", "BalanceController.monthprofit");

Route.get("/counter/:adm_nr", "CounterController.show");
Route.get("/counters/:adm_nr", "CounterController.shows");
Route.post("/counter", "CounterController.store");

Route.put("/opened/:ticket", "OrderController.update");

Route.resource("date", "LastDateController").apiOnly();
