import { loggedIn, login } from '../utils/auth';
import { Button, FormControl, FormLabel, Input, Box, Card, Heading } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { useState } from 'react';
import Header from "../components/Header.jsx";

function SignUp() {

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [confirmInput, setConfirmInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    
    const signIn = async () => {
        // use test4@test.com, password as test login
        console.log("sign in attempt");
        console.log(usernameInput);
        console.log(emailInput);
        console.log(passwordInput);
        console.log(confirmInput);
        const response = await fetch("/api/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": usernameInput,
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
            console.log("Account successfully created!");
        }  
    }

    const updateEmail = async (event) => {
        setEmailInput(event.currentTarget.value);
    }

    const updatePassword = async (event) => {
        setPasswordInput(event.currentTarget.value);
    }

    const updateConfirm = async (event) => {
        setConfirmInput(event.currentTarget.value);
    }

    const updateUsername = async (event) => {
        setUsernameInput(event.currentTarget.value);
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
            <Card
                w={{base: "90%", md: "60%"}}
                h="80%"
                my={12}
                display="flex"
                flexDirection="column"
                justifyContent="space-around"
                alignItems="center"
                p={10}
            >
                <Heading
                    variant="blue"
                    textAlign="center"
                    mb={10}
                >
                    Sign Up
                </Heading>
                <FormControl>
                <FormLabel>Username</FormLabel>
                <Input placeholder='Username' onChange={updateUsername} mb={3}/>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Email' onChange={updateEmail} mb={3}/>
                <FormLabel>Password</FormLabel>
                <Input placeholder='Password' onChange={updatePassword} mb={3}/>
                <FormLabel>Confirm Password</FormLabel>
                <Input placeholder='Confirm Password' onChange={updateConfirm} mb={3}/>
                </FormControl>
                <Button
                    onClick={signIn}
                    variant="brand"
                    w={{base: "30%", md: "20%"}}
                    mt={10}
                >
                    Submit
                </Button>
            </Card>
        </Box>
      </>
    )
  }
  
  export default SignUp;