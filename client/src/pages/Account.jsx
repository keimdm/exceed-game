import { loggedIn, getUser } from '../utils/auth';
import { Button, FormControl, FormLabel, Input, Box, Card, Heading, RadioGroup, Radio, Stack, Text } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useState, useEffect } from "react";

function Account() {

    const [loading, setLoading] = useState(true);
    const [controls, setControls] = useState("Desktop");
    const [system, setSystem] = useState("Mac");
    const [message, setMessage] = useState("")

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
                    console.log(data.opsys);
                    console.log(data.mode);
                    setSystem(data.opsys);
                    setControls(data.mode);
                    setLoading(false);
                })
            }  
        });  
    }, []);

    const updateAccount = () => {
        console.log("update");
        console.log(controls);
        console.log(system);
        const user = getUser();
        const userId = user.data._id;
        fetch("/api/users/settings/" + userId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "opsys": system,
                "mode": controls,
            }),
        }).then((response) => {
            if (response.status === 400) {
                console.log("Try again!");
                setMessage("Try again!");
            }
            else if (response.status === 500) {
                console.log("Server error - please try again later!");
                setMessage("Server error - please try again later!");
            }
            else  {
                console.log("Success!");
                setMessage("Your account has successfully been updated!");
            }  
        });  
    }

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
                            minH="70%"
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
                                        Account Settings
                                    </Heading>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <Heading
                                            variant="subheading"
                                        >
                                            Operating System:
                                        </Heading>
                                        <RadioGroup
                                            onChange={setSystem}
                                            value={system}
                                            my={3}
                                        >
                                            <Stack direction="row">
                                                <Radio value="Mac">
                                                    Mac
                                                </Radio>
                                                <Radio value="Windows">
                                                    Windows
                                                </Radio>
                                            </Stack>
                                        </RadioGroup>
                                    </Box>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        mb={10}
                                    >
                                        <Heading
                                            variant="subheading"
                                        >
                                            Control Scheme:
                                        </Heading>
                                        <RadioGroup
                                            onChange={setControls}
                                            value={controls}
                                            my={3}
                                        >
                                            <Stack direction="row">
                                                <Radio value="Desktop">
                                                    Desktop
                                                </Radio>
                                                <Radio value="Mobile">
                                                    Mobile
                                                </Radio>
                                            </Stack>
                                        </RadioGroup>
                                    </Box>
                                    <Button
                                        variant="brand"
                                        w={{base: "60%", md: "30%"}}
                                        onClick={updateAccount}
                                        my={10}
                                    >
                                        Submit Update
                                    </Button>
                                    <Text textAlign="center">{message}</Text>
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
  
export default Account;