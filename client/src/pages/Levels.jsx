import { loggedIn, getUser } from '../utils/auth';
import { Button, FormControl, FormLabel, Input, Box, Card, Heading } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useState, useEffect } from "react";

function Levels() {

    const [loading, setLoading] = useState(true);
    const [levelOneLink, setLevelOneLink] = useState('/level-one');

    useEffect(() => {
        console.log("use effect");
        const user = getUser();
        const userId = user.data._id;
        fetch("/api/users/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 400) {
                console.log("Try again!");
            }
            else if (response.status === 500) {
                console.log("Server error - please try again later!");
            }
            else  {
                response.json().then((data) => {
                    if (data.mode === "Mobile") {
                        setLevelOneLink('/level-one-m');
                    }
                    else if (data.opsys === "Windows") {
                        setLevelOneLink('/level-one-w');
                    }
                    setLoading(false);
                })
            }  
        });  
    }, []);

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
                            {loading ? (
                                <>
                                    <Heading
                                        variant="subheading"
                                    >
                                        Loading...
                                    </Heading>
                                </>
                            ) : (
                                <>
                                    <Heading
                                        variant="blue"
                                    >
                                        Select a Level:
                                    </Heading>
                                    <Link to={levelOneLink}>
                                        <Button
                                            variant="brand"
                                        >
                                            Level 1
                                        </Button>
                                    </Link>
                                </>
                            )}
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