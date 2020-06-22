'use strict'

const db = require('@mistery/db')

module.exports = {
  async createUser (username, password, fullName = '') {
    return db.User.create({
      username,
      password,
      fullName
    })
  },

  listUsers () {
    return db.User.findAndCountAll()
  }
}
