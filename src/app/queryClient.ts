import { QueryClient } from "@tanstack/react-query";

/** Creates an isolated cache for a provider or server request; never share it across users on the server. */
export const makeQueryClient = () => new QueryClient();
