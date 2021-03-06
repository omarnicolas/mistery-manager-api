'use strict'

const { userServices } = require('@mistery/services')

async function userRoutes (fastify, options) {
  fastify.addSchema({
    $id: 'publicUser',
    type: 'object',
    properties: {
      username: { type: 'string' },
      fullName: { type: 'string' }
    }
  })
  fastify.addSchema({
    $id: 'createUser',
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['username', 'password']
  })
  fastify.addSchema({
    $id: 'users',
    type: 'array',
    items: { $ref: 'publicUser#' }
  })

  fastify.get('/users', {
    preValidation: fastify.auth([fastify.validateJWT]),
    schema: {
      response: {
        200: 'users#'
      }
    }
  }, async (request, reply) => {
    const users = await userServices.listUsers()
    return users.rows
  })

  fastify.post('/users', {
    schema: {
      body: 'createUser#',
      response: {
        201: 'publicUser#'
      }
    }
  }, async (request, reply) => {
    const { username, password, fullName } = request.body
    reply.code(201)
    return userServices.createUser(username, password, fullName)
  })

  fastify.put('/users', {
    preValidation: fastify.auth([fastify.validateJWT])
  }, async (request, reply) => {
    const {user:username} = request.user
    const { oldPassword, newPassword } = request.body
    await userServices.changePassword(username, oldPassword, newPassword)
    return { status: 'in process' }
  })
}

module.exports = userRoutes
