import { createClient, defaultExchanges } from "urql";
import { devtoolsExchange } from "@urql/devtools";

export const client = createClient({
  url: "builder.open-decision.org",
  exchanges: [devtoolsExchange, ...defaultExchanges],
  fetchOptions: {
    credentials: "include",
  },
});
