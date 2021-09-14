"use strict";

const User = use("App/Models/User");

class UserController {
  async create({ request }) {
    const data = request.only(["first_name","second_name","id_metatrader","question","answer", "email", "password"]);

    const user = await User.create(data);

    return user;
  }
}

module.exports = UserController;
