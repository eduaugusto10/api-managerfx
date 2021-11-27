"use strict";

const User = use("App/Models/User");

class UserController {
  async create({ request }) {
    const data = request.only([
      "first_name",
      "second_name",
      "id_metatrader",
      "question",
      "answer",
      "id_adm",
      "email",
      "password",
    ]);

    const user = await User.create(data);

    return user;
  }

  async show() {
    const user = await User.query()
      .where("id_adm","1140")
      .orderBy("id", "desc")
      .fetch();
    return user;
  }
}

module.exports = UserController;
