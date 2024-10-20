'use strict'

const fp = require('fastify-plugin')

function fastifyOpenAI (fastify, options, next) {
  const { name, ...opts } = options

  if (!opts.apiKey) {
    return next(new Error('You must provide a OpenAI API key'))
  }

  const OpenAI = require('openai')
  const openai = new OpenAI(opts)

  if (name) {
    if (openai[name]) {
      // prevent overriding of default openai properties
      return next(
        new Error(
          `fastify-openai '${name}' is a reserved keyword`
        )
      )
    }
    if (!fastify.openai) {
      // bootstrap the openai property if it doesn't exist
      fastify.decorate('openai', Object.create(null))
    } else if (Object.prototype.hasOwnProperty.call(fastify.openai, name)) {
      // prevent overriding of existing openai named instances
      return next(
        new Error(
          `OpenAI instance with name '${name}' has already been registered`
        )
      )
    }
    // assign the openai named instance
    fastify.openai[name] = openai
  } else {
    if (fastify.openai) {
      // prevent duplicate registration of fastify-openai
      return next(new Error('fastify-openai has already been registered'))
    } else {
      // assign the default openai instance
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
