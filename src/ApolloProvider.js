import React from "react";
import App from "./App";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";

const setAuthorizationLink = setContext((request, previousContext) => {
	const token = localStorage.getItem("jwtToken");
	return {
		headers: { Authorization: token ? `Bearer ${token}` : "" },
	};
});

const httpLink = createHttpLink({
	uri: "http://localhost:5000",
});

const client = new ApolloClient({
	link: setAuthorizationLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default (
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>
);
