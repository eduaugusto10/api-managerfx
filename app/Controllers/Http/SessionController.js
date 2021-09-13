"use strict";

class SessionController {
  async create({ request, auth }) {
    const { email, password } = request.all();

    let auth0 = await auth.attempt(email, password);
    auth0.user =  await auth.getUser();
    return auth0;
  }
}

module.exports = SessionController;
