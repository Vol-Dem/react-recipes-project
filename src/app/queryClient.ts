import { QueryClient } from "@tanstack/react-query";

// Each provider owns its cache; never share a singleton between server requests.
export const makeQueryClient = () => new QueryClient();
