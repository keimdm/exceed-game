import { loggedIn, getUser } from '../utils/auth';
import { Button, FormControl, FormLabel, Input, Box, Card, Heading } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useState, useEffect } from "react";

function Scores() {

    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState([]);
    const [levelOneHigh, setLevelOneHigh] = useState(0);
    const [levelOneHolder, setLevelOneHolder] = useState("-");

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
                    console.log(data.scores)
                    setScores(data.scores)
                    fetch("/api/users/", {
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
                                console.log(data);
                                for (let i = 0; i < data.length; i++) {
                                    if (data[i].scores.levelOne) {
                                        if (data[i].scores.levelOne > levelOneHigh) {
                                            setLevelOneHigh(data[i].scores.levelOne);
                                            setLevelOneHolder(data[i].username)
                                        }
                                    }
                                }
                                setLoading(false);
                            })
                        }  
                    }); 
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
                                        High Scores
                                    </Heading>
                                    <Heading
                                        variant="subheading"
                                    >
                                        Level One
                                    </Heading>
                                    <Box
                                        w="100%"
                                        display="flex"
                                        flexDirection="row"
                                        justifyContent="space-between"
                                    >
                                        <Box
                                            w="30%"
                                            display="flex"
                                            flexDirection="column"
                                            alignItems="center"
                                            textAlign="center"
                                        >
                                            <Heading
                                                variant="subheading"
                                            >
                                                Your Score:
                                            </Heading>
                                            <Heading
                                                variant="subheading"
                                            >
                                                {scores.levelOne}
                                            </Heading>
                                        </Box>
                                        <Box
                                            w="30%"
                                            display="flex"
                                            flexDirection="column"
                                            alignItems="center"
                                            textAlign="center"
                                        >
                                            <Heading
                                                variant="subheading"
                                            >
                                                Record:
                                            </Heading>
                                            <Heading
                                                variant="subheading"
                                            >
                                                {levelOneHigh}
                                            </Heading>
                                        </Box>
                                        <Box
                                            w="30%"
                                            display="flex"
                                            flexDirection="column"
                                            alignItems="center"
                                            textAlign="center"
                                        >
                                            <Heading
                                                variant="subheading"
                                            >
                                                Record Holder:
                                            </Heading>
                                            <Heading
                                                variant="subheading"
                                            >
                                                {levelOneHolder}
                                            </Heading>
                                        </Box>
                                    </Box>
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
  
export default Scores;