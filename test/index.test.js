'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const fastifyOpenAI = require('../index')
const http = require('http')

require('dotenv').config()

test('it should throw if api key not defined', async (t) => {
  t.plan(1)
  const fastify = Fastify()
  try {
    await fastify.register(fastifyOpenAI, {})
  } catch (err) {
    t.equal(err.message, 'You must provide a OpenAI API key')
  }
})

test('it should not allow an instance to override a reserved keyword', async (t) => {
  t.plan(1)

  const fastify = Fastify()

  try {
    await fastify.register(fastifyOpenAI, {
      apiKey: process.env.OPENAI_API_KEY,
      name: '_options' // reserved property name
    })
  } catch (err) {
    t.equal(err.message, 'fastify-openai \'_options\' is a reserved keyword')
  }
})

test('it should not allow multiple instances of fastify.openai with the same name', async (t) => {
  t.plan(1)
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  await fastify.register(fastifyOpenAI, {
    apiKey: process.env.OPENAI_API_KEY,
    name: 'one'
  })

  try {
    await fastify.register(fastifyOpenAI, {
      apiKey: process.env.OPENAI_API_KEY,
      name: 'one'
    })
  } catch (err) {
    t.equal(err.message, 'OpenAI instance with name \'one\' has already been registered')
  }
})

test('it should not allow multiple instances of fastify.openai with the same default name', async (t) => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  await fastify.register(fastifyOpenAI, {
    apiKey: process.env.OPENAI_API_KEY
  })

  try {
    await fastify.register(fastifyOpenAI, {
      apiKey: process.env.OPENAI_API_KEY
    })
  } catch (err) {
    t.equal(err.message, 'fastify-openai has already been registered')
  }
})

test('fastify.openai namespace should exist', async (t) => {
  t.plan(11)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  const agent = new http.Agent()
  const fetch = (url, opts) => null
  const headers = { hello: 'world' }
  const query = { fastify: true }

  await fastify.register(fastifyOpenAI, {
    apiKey: process.env.OPENAI_API_KEY,
    organization: 'org_123',
    project: 'proj_123',
    baseURL: 'https://api.openai.com/v1',
    timeout: 1028,
    httpAgent: agent,
    fetch,
    maxRetries: 7,
    defaultHeaders: headers,
    defaultQuery: query,
    dangerouslyAllowBrowser: true
  })

  await fastify.ready()

  t.ok(fastify.openai)

  t.equal(fastify.openai._options.organization, 'org_123')
  t.equal(fastify.openai._options.project, 'proj_123')
  t.equal(fastify.openai._options.baseURL, 'https://api.openai.com/v1')
  t.equal(fastify.openai._options.timeout, 1028)
  t.equal(fastify.openai._options.httpAgent, agent)
  t.equal(fastify.openai._options.fetch, fetch)
  t.equal(fastify.openai._options.maxRetries, 7)
  t.equal(fastify.openai._options.defaultHeaders, headers)
  t.equal(fastify.openai._options.defaultQuery, query)
  t.equal(fastify.openai._options.dangerouslyAllowBrowser, true)
})

test('fastify.openai.test namespace should exist', async (t) => {
  t.plan(5)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  await fastify.register(fastifyOpenAI, {
    apiKey: process.env.OPENAI_API_KEY,
    name: 'test'
  })

  await fastify.ready()

  t.ok(fastify.openai)
  t.ok(fastify.openai.test)
  t.ok(fastify.openai.test.chat)
  t.ok(fastify.openai.test.chat.completions)
  t.ok(fastify.openai.test.completions)
})

test('fastify-openai should create a chat completion with a singular OpenAI instance', async (t) => {
  t.plan(10)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  await fastify.register(fastifyOpenAI, {
    apiKey: process.env.OPENAI_API_KEY
  })

  t.ok(fastify.openai)
  t.ok(fastify.openai.chat)
  t.ok(fastify.openai.chat.completions)

  const res = await fastify.openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-4o-mini'
  })

  t.ok(res.id)
  t.ok(res.object)
  t.ok(res.created)
  t.ok(res.model)
  t.ok(res.choices)
  t.ok(res.usage)
  t.ok(res.system_fingerprint)
})
