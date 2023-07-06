import { loggedIn, login, logout } from '../utils/auth';
import { Button, Card, Box, Text, Heading } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

function Home() {

    return (
      <>
        <Box
            minH={{base: window.innerHeight, md: '100vh'}}
            w={{base: "100%", md: '100%'}}
            bgColor="brand.gray"
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Header />
            {loggedIn() ? (
                <>
                    <Card
                        my={12}
                        display="flex"
                        flexDirection={{base: "column", md: "row"}}
                        alignItems="center"
                        minH="50%"
                        maxW="90%"
                        pb={10}
                    >
                        <Box
                            w="50%"
                            h="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            py={10}
                            px={{base: 5, md: 10}}
                        >
                            <Heading
                                variant="blue"
                            >
                                Welcome to Exceed!
                            </Heading>
                        </Box>
                        <Box
                            w="50%"
                            h="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-around"
                            alignItems="center"
                            textAlign="center"
                        >
                            <Heading
                                variant="subheading"
                            >
                                Click below to get started:
                            </Heading>
                            <Box
                                display="flex"
                                flexDirection="column"
                            >
                                <Link to={`/levels`}>
                                    <Button
                                        variant="brand"
                                        my={3}
                                    >
                                        Select a Level
                                    </Button>
                                </Link>
                                <Link to={`/scores`}>
                                    <Button variant="brand">
                                        View High Scores
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </Card>
                </>
            ) : (
                <>
                    <Card
                        my={12}
                        display="flex"
                        flexDirection={{base: "column", md: "row"}}
                        alignItems="center"
                        minH="50%"
                        maxW="90%"
                        pb={10}
                    >
                        <Box
                            w="50%"
                            h="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            py={10}
                            px={{base: 5, md: 10}}
                        >
                            <Heading
                                variant="blue"
                            >
                                Welcome to Exceed!
                            </Heading>
                        </Box>
                        <Box
                            w={{base: "90%", md: "50%"}}
                            h="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-around"
                            alignItems="center"
                            textAlign="center"
                            px={{base: 5, md: 10}}
                            my={10}
                        >
                            <Heading
                                variant="subheading"
                                my={3}
                            >
                                Exceed is a spreadsheet training tool that uses a game to teach users how to navigate a spreadsheet efficiently.
                            </Heading>
                            <Box
                                display="flex"
                                flexDirection="column"
                            >
                                <Link to={`/login`}>
                                    <Button
                                        variant="brand"
                                        my={3}
                                    >
                                        Log In
                                    </Button>
                                </Link>
                                <Link to={`/signup`}>
                                    <Button variant="brand">
                                        Sign Up
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </Card>
                </>
            )
            }
        </Box>
      </>
    )
  }
  
  export default Home;
  