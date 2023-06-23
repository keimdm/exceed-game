import { loggedIn, login } from '../utils/auth';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { useState } from 'react';

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
        <p>Sign Up</p>
        <>
            <FormControl>
                <FormLabel>Username</FormLabel>
                <Input placeholder='Username' onChange={updateUsername}/>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Email' onChange={updateEmail}/>
                <FormLabel>Password</FormLabel>
                <Input placeholder='Password' onChange={updatePassword}/>
                <FormLabel>Confirm Password</FormLabel>
                <Input placeholder='Confirm Password' onChange={updateConfirm}/>
            </FormControl>
            <Button
                onClick={signIn}
            >
                Submit
            </Button>
            <Link to={`/`}>
                <Button>
                    Home Page
                </Button>
            </Link>
        </>
      </>
    )
  }
  
  export default SignUp;