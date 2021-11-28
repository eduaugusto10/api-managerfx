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
      .where("id_adm", "1140")
      .orderBy("id", "desc")
      .fetch();
    return user;
  }

  async queries({ params }) {
    const user = await User.findOrFail(params.id);

    return user;
  }

  async update({ params, request, response, session }) {
    const user = await User.findOrFail(params.id);

    user.first_name = request.body.first_name;
    user.id_metatrader = request.body.id_metatrader;
    user.email = request.body.email;
    user.ativated = request.body.ativated;

    await user.save();

    return "Usuário atualizado com sucesso!";
  }
}

module.exports = UserController;
