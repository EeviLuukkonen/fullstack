import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ApolloProvider } from "@apollo/client/react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000', fetch }),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
