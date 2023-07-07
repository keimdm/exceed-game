import { loggedIn, getUser } from '../utils/auth';
import { Button, FormControl, FormLabel, Input, Box, Card, Heading, Text } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useState, useEffect } from "react";

function Instructions() {

    const [loading, setLoading] = useState(true);
    const [controlType, setControlType] = useState('Mac');

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
                        setControlType("Mobile");
                    }
                    else if (data.opsys === "Windows") {
                        setControlType("Windows");
                    }
                    setLoading(false);
                })
            }  
        });  
    }, []);

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
                            w={{base: "90%", md: "60%"}}
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
                                        textAlign="center"
                                    >
                                        Loading...
                                    </Heading>
                                </>
                            ) : (
                                <>
                                    <Heading
                                        variant="blue"
                                        textAlign="center"
                                        mb={10}
                                    >
                                        Instructions
                                    </Heading>
                                    <Text
                                        mb={3}
                                    >
                                        Welcome to Exceed!
                                    </Text>
                                    <Text
                                        mb={3}
                                    >
                                        Before playing, please take a moment to finish setting up your account by clicking on "Settings" in the header and selecting your OS and desired control scheme. Once submitted, navigate back to Home and choose your desired level.
                                    </Text>
                                    <Text
                                        mb={6}  
                                    >
                                        The object of the game is to stop the data in your spreadsheet from being overwritten by the errors that spread over the course of the game. You can do this by highlighting and deleting the errors, but be careful to not delete any of your data accidentally! Highlighted cells are shaded blue, and errors are shaded red.
                                    </Text>
                                    <Heading
                                        variant="subheading"
                                        mb={3}
                                    >
                                        Controls:
                                    </Heading>
                                    {
                                        controlType === "Mobile" ? (
                                            <Box>
                                                <Text mb={3}>Select Cell: Tap the cell you wish to select</Text>
                                                <Text mb={3}>Delete Cell Contents: Tap the delete button</Text>
                                            </Box>
                                        ) : (
                                            controlType === "Windows" ? (
                                                <Box>
                                                    <Text mb={3}>Move: Arrow Keys</Text>
                                                    <Text mb={3}>Jump: Ctrl + Arrow Keys</Text>
                                                    <Text mb={3}>Select Multiple: Shift + Arrow Keys</Text>
                                                    <Text mb={3}>Select Multiple and Jump: Ctrl + Shift + Arrow Keys</Text>
                                                    <Text mb={3}>Delete Cell Contents: Backspace</Text>
                                                </Box>
                                            ) : (
                                                <Box>
                                                    <Text mb={3}>Move: Arrow Keys</Text>
                                                    <Text mb={3}>Jump: Command + Arrow Keys</Text>
                                                    <Text mb={3}>Select Multiple: Shift + Arrow Keys</Text>
                                                    <Text mb={3}>Select Multiple and Jump: Command + Shift + Arrow Keys</Text>
                                                    <Text mb={3}>Delete Cell Contents: Backspace</Text>
                                                </Box>
                                            )
                                        )
                                    }
                                </>
                            )}
                        </Card>
                    </>
                ) : (
                    <>
                        <Card
                            w={{base: "90%", md: "60%"}}
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
                                textAlign="center"
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
  
export default Instructions;