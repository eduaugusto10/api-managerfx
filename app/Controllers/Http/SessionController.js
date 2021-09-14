"use strict";
const User = use('App/Models/User')

class SessionController {
  async create({ request, auth }) {
    const { email, password } = request.all();

    let token = await auth.attempt(email, password)

    let user = await User.query().where('email', email).fetch()
    return {token,user};
  }
}

module.exports = SessionController;
