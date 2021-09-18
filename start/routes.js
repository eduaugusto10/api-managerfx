"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.post("/users", "UserController.create");
Route.post("/sessions", "SessionController.create");
Route.post("/operationsave", "OperationController.store");
Route.get("/operationsave", "OperationController.index");
