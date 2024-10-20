import { config } from "dotenv";
import Fastify from "fastify";
import OpenAI from "openai";
import { expectAssignable, expectType } from "tsd";
import fastifyOpenAI, { FastifyOpenAINamedInstance } from "../../plugin";
import { ChatCompletion } from "openai/src/resources/index.js";

const { parsed: env } = config();

if (!env) {
  throw new Error("No environment variables defined");
}

const app = Fastify();
app.register(fastifyOpenAI, {
  apiKey: env.OPENAI_API_KEY,
});

app.ready(() => {
  expectAssignable<OpenAI>(app.openai);
  expectType<OpenAI.Chat>(app.openai.chat);
  app.close();
});

const appOne = Fastify();
await appOne.register(fastifyOpenAI, {
  apiKey: env.OPENAI_API_KEY,
  name: "one",
});

appOne.ready(() => {
  expectAssignable<FastifyOpenAINamedInstance>(appOne.openai);
  expectType<OpenAI>(appOne.openai.one);
  expectType<OpenAI>(appOne.openai.one);
  appOne.close();
});
