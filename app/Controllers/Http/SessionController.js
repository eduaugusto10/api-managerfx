"use strict";

class SessionController {
  async create({ request, auth }) {
    const { email, password } = request.all();

    const token = await auth.attempt(email, password);
    const user =  await auth.getUser();
    return {token,user};
  }
}

module.exports = SessionController;
