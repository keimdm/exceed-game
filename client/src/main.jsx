import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//import SampleApi from './components/SampleApi.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Levels from './pages/Levels.jsx'
import Scores from './pages/Scores.jsx'
import Account from './pages/Account.jsx'
import SignUp from './pages/SignUp.jsx'
import LevelOne from './pages/LevelOne.jsx'
import LevelOneWindows from './pages/LevelOneWindows.jsx'
import LevelOneMobile from './pages/LevelOneMobile.jsx'
import Instructions from './pages/Instructions.jsx'

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
	{
		path: "/levels",
		element: <Levels />,
	},
	{
		path: "/scores",
		element: <Scores />,
	},
	{
		path: "/account",
		element: <Account />,
	},
	{
		path: "/signup",
		element: <SignUp />,
	},
	{
		path: "/level-one",
		element: <LevelOne />,
	},
	{
		path: "/level-one-w",
		element: <LevelOneWindows />,
	},
	{
		path: "/level-one-m",
		element: <LevelOneMobile />,
	},
	{
		path: "/instructions",
		element: <Instructions />,
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
