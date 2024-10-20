# fastify-openai

[![NPM version](https://img.shields.io/npm/v/fastify-openai.svg?style=flat)](https://www.npmjs.com/package/fastify-openai)
[![GitHub CI](https://github.com/timmywheels/fastify-openai/workflows/GitHub%20CI/badge.svg)](https://github.com/timmywheels/fastify-openai/actions?workflow=GitHub+CI)
[![Coverage Status](https://coveralls.io/repos/github/timmywheels/fastify-openai/badge.svg?branch=main)](https://coveralls.io/github/timmywheels/fastify-openai?branch=main)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

[OpenAI Node.js Library](https://github.com/openai/openai-node) instance initialization and encapsulation for the [Fastify](https://github.com/fastify/fastify) framework.

## Install

Install the package:

```sh
# npm
npm i fastify-openai openai

# yarn
yarn add fastify-openai openai

# pnpm
pnpm add fastify-openai openai

# bun
bun add fastify-openai openai
```

## Usage

The package needs to be added to your project with `register` and you must at least configure your account's secret key wich is available in your [OpenAI Dashboard](https://platform.openai.com/docs/api-reference/api-keys) then call the [OpenAI](https://github.com/openai/openai-node) API and you are done.

#### Importing the package
```js
// ESM
import fastifyOpenAI from 'fastify-openai';

// CJS
const fastifyOpenAI = require('fastify-openai');
```

#### JavaScript + CJS

```js
const fastify = require("fastify")({ logger: true });

fastify.register(require("fastify-openai"), {
  apiKey: "sk-TacO...",
});

fastify.post("/chat", async (request, reply) => {
  try {
    // create a chat completion using the OpenAI API
    const chatCompletions = await fastify.openai.chat.completions.create({
      messages: [{ role: "user", content: "Hello, Fastify!" }],
      model: "gpt-4o-mini",
    });

    reply.code(201);
    return {
      status: "ok",
      data: chatCompletions,
    };
  } catch (err) {
    reply.code(500);
    return err;
  }
});

fastify.listen(3000, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
```

#### TypeScript + ESM
```ts
import Fastify from "fastify";
import fastifyOpenAI from "fastify-openai";

const fastify = Fastify({ logger: true });

fastify.register(fastifyOpenAI, {
  apiKey: "sk-TacO...",
});

fastify.post("/chat", async (request, reply) => {
  try {
    // create a chat completion using the OpenAI API
    const chatCompletions = await fastify.openai.chat.completions.create({
      messages: [{ role: "user", content: "Hello, Fastify!" }],
      model: "gpt-4o-mini",
    });

    reply.code(201);
    return {
      status: "ok",
      data: chatCompletions,
    };
  } catch (err) {
    reply.code(500);
    return err;
  }
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

// declaration merging
declare module "fastify" {
  interface FastifyInstance {
    openai: FastifyOpenAI;
  }
}

```

### Options

- `apiKey` **[ required ]**: Your account's secret key wich is available in your [OpenAI Dashboard](https://platform.openai.com/api-keys)

- `name` **[ optional ]**: Through this option `fastify-openai` lets you define multiple OpenAI instances, with different configurations.

- `organization` **[ optional ]**: The organization ID to use for this request. If not provided, the request will be made with the default organization.

- `project` **[ optional ]**: The project ID to use for this request. If not provided, the request will be made with the default project.

- `baseURL` **[ optional ]**: The base URL for the API. Defaults to `https://api.openai.com/v1`.

- `timeout` **[ optional ]**: The request timeout in milliseconds.

- `httpAgent` **[ optional ]**: An HTTP agent used to manage HTTP(S) connections.

- `maxRetries` **[ optional ]**: The maximum number of retries for a request.

### Multiple plugin instances
When using multiple plugin instances, the `name` property is required for each instance.

```js
const fastify = require('fastify')({ logger: true })

fastify
  .register(require('fastify-openai'), {
    apiKey: 'sk-Te5t...',
    name: 'test',
    timeout: 28000 // in ms (this is 28 seconds)
  })
  .register(require('fastify-openai'), {
    apiKey: 'sk-Pr0d...',
    name: 'prod'
  })


fastify.post("/test/chat", function (request, reply) {
  // create a chat completion using the OpenAI API 'test' instance
  fastify.openai.test.chat.completions
    .create({
      messages: [{ role: "user", content: "Hello, Test!" }],
      model: "gpt-4o-mini",
    })
    .then((chatCompletions) => {
      reply.code(201).send({
        status: "ok",
        data: chatCompletions,
      });
    })
    .catch((err) => {
      reply.code(500).send(err);
    });
});


fastify.post("/prod/chat", function (request, reply) {
  // create a chat completion using the OpenAI API 'prod' instance
  fastify.openai.prod.chat.completions
    .create({
      messages: [{ role: "user", content: "Hello, Production!" }],
      model: "gpt-4o-mini",
    })
    .then((chatCompletions) => {
      reply.code(201).send({
        status: "ok",
        data: chatCompletions,
      });
    })
    .catch((err) => {
      reply.code(500).send(err);
    });
});

fastify.listen({ port: 3000 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
```

## Documentation

See the [Node OpenAI API docs](https://platform.openai.com/docs/api-reference/introduction).

## Acknowledgements

This project is kindly sponsored by [@timmywheels](https://www.timwheeler.com).

## License

Licensed under [MIT](https://github.com/timmywheels/fastify-openai/blob/main/LICENSE)
