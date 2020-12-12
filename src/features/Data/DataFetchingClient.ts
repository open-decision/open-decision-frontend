import { createClient, defaultExchanges } from "urql";
import { devtoolsExchange } from "@urql/devtools";

export const client = createClient({
  url: "https://builder.open-decision.org/graphql",
  exchanges: [devtoolsExchange, ...defaultExchanges],
  fetchOptions: {
    credentials: "include",
  },
});
