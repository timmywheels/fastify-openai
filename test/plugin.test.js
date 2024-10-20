'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const fastifyOpenAI = require('../plugin')
const http = require('http')

require('dotenv').config()

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
