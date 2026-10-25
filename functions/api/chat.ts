import { handleChat, type ChatEnv } from "../../lib/portfolio-ai/handler";
/** All methods enter the same validator, including explicit 405 responses. */
export const onRequest = ({
  request,
  env,
}: {
  request: Request;
  env: ChatEnv;
}) => handleChat(request, env);
