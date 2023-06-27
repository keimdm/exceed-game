import { loggedIn } from '../utils/auth';
import { Button, FormControl, FormLabel, Input, Box, Card, Heading } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

function Levels() {

    return (
        <>
            <Box
                w="100%"
                h="100vh"
                bgColor="brand.gray"
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <Header />
                {loggedIn() ? (
                    <>
                        <Card
                            w="60%"
                            h="50%"
                            my={12}
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-around"
                            alignItems="center"
                            p={10}
                        >   
                            <Heading
                                variant="blue"
                            >
                                Select a Level:
                            </Heading>
                            <Link to={`/level-one`}>
                                <Button
                                    variant="brand"
                                >
                                    Level 1
                                </Button>
                            </Link>
                        </Card>
                    </>
                ) : (
                    <>
                        <Card
                            w="60%"
                            h="50%"
                            my={12}
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-around"
                            alignItems="center"
                            p={10}
                            textAlign="center"
                        >
                            <Heading
                                variant="subheading"
                            >
                                Sorry - you are not authorized to view this page! Please log in and try again.
                            </Heading>
                        </Card>
                    </>
                )
                }
            </Box>
        </>
    )
}
  
export default Levels;