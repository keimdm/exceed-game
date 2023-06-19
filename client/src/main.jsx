import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, theme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//import SampleApi from './components/SampleApi.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'

// Creates the router for the app
const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		{/* Chakra provider for all theme extensions and use of Chakra components */}
		<ChakraProvider theme={theme}>
			{/* Router provider for use of React Router Dom */}
			<RouterProvider router={router} />
		</ChakraProvider>
	</React.StrictMode>
);
