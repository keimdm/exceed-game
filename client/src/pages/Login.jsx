import { loggedIn, login } from '../utils/auth';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { useState } from 'react';

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
        <p>Login</p>
        {loggedIn() ? (
            <>
                <p>You are already logged in!</p>
                <Link to={`/`}>
                    <Button>
                        Return to Home Page
                    </Button>
                </Link>
            </>
        ) : (
            <>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder='Email' onChange={updateEmail}/>
                    <FormLabel>Password</FormLabel>
                    <Input placeholder='Password' onChange={updatePassword}/>
                </FormControl>
                <Button
                    onClick={signIn}
                >
                    Log In
                </Button>
                <Link to={`/`}>
                    <Button>
                        Return to Home Page
                    </Button>
                </Link>
            </>
        )
        }
      </>
    )
  }
  
  export default Login;