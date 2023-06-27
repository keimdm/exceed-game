import { loggedIn, login } from '../utils/auth';
import { Button, FormControl, FormLabel, Input, Box, Card, Heading } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { useState } from 'react';
import Header from "../components/Header.jsx";

function Login() {

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    
    const signIn = async () => {
        // use test4@test.com, password as test login
        console.log("sign in attempt");
        console.log(emailInput);
        console.log(passwordInput);
        const response = await fetch("/api/users/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": emailInput,
                "password": passwordInput
            }),
        });
        if (response.status === 400) {
            console.log("Try again!");
        }
        else if (response.status === 500) {
            console.log("Server error - please try again later!");
        }
        else  {
            const data = await response.json();
            if (data) {
                login(data.token);
            }
        }  
    }

    const updateEmail = async (event) => {
        setEmailInput(event.currentTarget.value);
    }

    const updatePassword = async (event) => {
        setPasswordInput(event.currentTarget.value);
    }

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
                        textAlign="center"
                    >
                        <Heading
                            variant="subheading"
                        >
                            You are already logged in!
                        </Heading>
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
                    >
                        <Heading
                            variant="blue"
                        >
                            Log In
                        </Heading>
                        <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input placeholder='Email' onChange={updateEmail} mb={3}/>
                        <FormLabel>Password</FormLabel>
                        <Input placeholder='Password' onChange={updatePassword} mb={3}/>
                        </FormControl>
                        <Button
                            onClick={signIn}
                            variant="brand"
                            w="20%"
                        >
                            Log In
                        </Button>
                    </Card>
                </>
            )
            }
        </Box>
        
      </>
    )
  }
  
  export default Login;