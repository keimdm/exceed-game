import { Box, Heading, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { loggedIn, login, logout } from '../utils/auth';

function Header() {

    const signOut = async () => {
        logout();
    }

	return (
		<>
			<Box
				w="100%"
				h="50px"
				bgColor="brand.dark-blue"
				display="flex"
				flexDirection="row"
				justifyContent="space-between"
                alignItems="center"
				px={5}
                color="white"
			>
				<Heading>Exceed</Heading>
                {loggedIn() ? (
                <Box
                    display="flex"
                    flexDirection="row"
                >
                    <Link to="/">
                        <Text
                            mx={3}
                        >
                            Home
                        </Text>
                    </Link>
                    <Link to="/account">
                        <Text
                            mx={3}
                        >
                            Settings
                        </Text>
                    </Link>
                    <Text
                        onClick={signOut}
                        mx={3}
                        as="Button"
                    >
                        Log Out
                    </Text>
                </Box>
                ) : (
                    <Box
                    display="flex"
                    flexDirection="row"
                >
                    <Link to="/">
                        <Text
                            mx={3}
                        >
                            Home
                        </Text>
                    </Link>
                    <Link to="/login">
                        <Text
                            mx={3}
                        >
                            Login
                        </Text>
                    </Link>
                    <Link to="/signup">
                        <Text
                            mx={3}
                        >
                            Sign Up
                        </Text>
                    </Link>
                </Box>
                )}
			</Box>
		</>
	);
}

export default Header;
