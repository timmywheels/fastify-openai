'use strict'

const fp = require('fastify-plugin')
const OpenAI = require('openai')

function fastifyOpenAI (fastify, options, next) {
  const { apiKey, name } = options

  if (!apiKey) {
    return next(new Error('You must provide a OpenAI API key'))
  }

  const openai = new OpenAI(options)

  if (name) {
    if (!fastify.openai) {
      fastify.decorate('openai', Object.create(null))
    } else if (Object.prototype.hasOwnProperty.call(fastify.openai, name)) {
      return next(
        new Error(
          `OpenAI instance with name '${name}' has already been registered`
        )
      )
    }

    fastify.openai[name] = openai
  } else {
    if (fastify.openai) {
      return next(new Error('fastify-openai has already been registered'))
    } else {
      fastify.decorate('openai', openai)
    }
  }

  next()
}

module.exports = fp(fastifyOpenAI, {
  fastify: '5.x',
  name: 'fastify-openai'
})

module.exports.default = fastifyOpenAI
module.exports.fastifyOpenAI = fastifyOpenAI
