'use strict'

const fp = require('fastify-plugin')
const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')

function fastifyOpenAI (fastify, options, next) {
  const { apiKey, name, ...openAIOptions } = options

  if (!apiKey) {
    return next(new Error('You must provide a OpenAI API key'))
  }

  const config = Object.assign(
    {
      appInfo: {
        name: 'fastify-openai',
        url: 'https://github.com/timmywheels/fastify-openai',
        version: JSON.parse(
          fs.readFileSync(path.join(__dirname, 'package.json'))
        ).version
      }
    },
    openAIOptions
  )

  const openai = new OpenAI(config)

  if (name) {
    if (openai[name]) {
      return next(new Error(`fastify-openai '${name}' is a reserved keyword`))
    } else if (!fastify.openai) {
      fastify.decorate('openai', Object.create(null))
    } else if (Object.prototype.hasOwnProperty.call(fastify.openai, name)) {
      return next(
        new Error(`OpenAI '${name}' instance name has already been registered`)
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
  fastify: '>=2.11.0',
  name: 'fastify-openai'
})
