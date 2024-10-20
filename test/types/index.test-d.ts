import { config } from "dotenv";
import Fastify from "fastify";
import OpenAI from "openai";
import { expectAssignable, expectType } from "tsd";
import fastifyOpenAI, {
  FastifyOpenAI,
  FastifyOpenAINamedInstance,
} from "../../index";

const { parsed: env } = config();

if (!env) {
  throw new Error("No environment variables defined");
}

const appOne = Fastify();
await appOne.register(fastifyOpenAI, {
  apiKey: env.OPENAI_API_KEY,
});

appOne.ready(() => {
  expectAssignable<OpenAI>(appOne.openai);
  expectType<OpenAI.Chat>(appOne.openai.chat);
  appOne.close();
});

const appTwo = Fastify();
await appTwo.register(fastifyOpenAI, {
  apiKey: env.OPENAI_API_KEY,
  name: "two",
});

appTwo.ready(() => {
  expectAssignable<FastifyOpenAINamedInstance>(appTwo.openai);
  expectType<OpenAI>(appTwo.openai.two);
  expectType<OpenAI.Chat>(appTwo.openai["two"].chat);
  appTwo.close();
});
