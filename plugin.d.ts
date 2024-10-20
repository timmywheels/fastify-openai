import { FastifyPluginCallback } from "fastify";
import OpenAI, { ClientOptions } from "openai";

/**
 * @docs https://github.com/timmywheels/fastify-openai/tree/types#options
 */
export interface FastifyOpenAIOptions extends Partial<ClientOptions> {
  /**
   * OpenAI API Key
   *
   * @docs https://platform.openai.com/docs/api-reference/authentication
   */
  apiKey: string;

  /**
   * fastify-openai instance name
   */
  name?: string;

  /**
   * Organization ID
   *
   * @docs https://platform.openai.com/docs/api-reference/organizations-and-projects-optional
   */
  organization?: string | null | undefined;

  /**
   * Project ID
   *
   * @docs https://platform.openai.com/docs/api-reference/organizations-and-projects-optional
   */
  project?: string | null | undefined;

  /**
   * Base URL
   *
   * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
   *
   * Defaults to process.env['OPENAI_BASE_URL'].
   */
  baseURL?: string | null | undefined;

  /**
   * Timeout
   *
   * The maximum amount of time (in milliseconds) that the client should wait for a response
   * from the server before timing out a single request.
   *
   * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
   * much longer than this timeout before the promise succeeds or fails.
   */
  timeout?: number;

  /**
   * HTTP Agent
   *
   * An HTTP agent used to manage HTTP(S) connections.
   *
   * If not provided, an agent will be constructed by default in the Node.js environment,
   * otherwise no agent is used.
   */
  httpAgent?: ClientOptions["httpAgent"];

  /**
   * Max Retries
   *
   * The maximum number of times that the client will retry a request in case of a
   * temporary failure, like a network error or a 5XX error from the server.
   *
   * @default 2
   */
  maxRetries?: number;
}

export interface FastifyOpenAINamedInstance {
  [name: string]: OpenAI;
}

export type FastifyOpenAI = FastifyOpenAINamedInstance & OpenAI;

declare module "fastify" {
  interface FastifyInstance {
    openai: FastifyOpenAI;
  }
}

export const FastifyOpenAIPlugin: FastifyPluginCallback<FastifyOpenAIOptions>;
export default FastifyOpenAIPlugin;
