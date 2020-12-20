import { createClient, defaultExchanges } from "urql";
import { devtoolsExchange } from "@urql/devtools";

export const client = createClient({
  url: "https://od-backend-test.herokuapp.com/graphql",
  exchanges: [devtoolsExchange, ...defaultExchanges],
  fetchOptions: {
    credentials: "include",
  },
});
