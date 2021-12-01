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
      "ativated",
      "password",
      "accountname",
      "phone",
      "validate_assign",
      "assign_plan",
      "admin",
    ]);

    const user = await User.create(data);

    return user;
  }

  async show({params}) {
    const user = await User.query()
      .where("id_adm", params.id)
      .orderBy("id", "desc")
      .fetch();
    return user;
  }

  async shows() {
    const user = await User.query()
      .where("admin", 1)
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
    user.password = request.body.password;
    user.accountname = request.body.accountname;
    user.phone = request.body.phone;
    user.validate_assign = request.body.validate_assign;
    user.assign_plan = request.body.assign_plan;

    await user.save();

    return "Usuário atualizado com sucesso!";
  }
}

module.exports = UserController;
