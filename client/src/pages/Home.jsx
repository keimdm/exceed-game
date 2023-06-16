import { loggedIn, login, logout } from '../utils/auth';
import { Button } from '@chakra-ui/react';

function Home() {

    const signIn = async () => {
        // use test4@test.com, password as test login
        console.log("sign in attempt");
        const response = await fetch("/api/users/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": "test4@test.com",
                "password": "password"
            }),
        });
        const data = await response.json();
        login(data.token);
    }

    const signOut = async () => {
        logout();
    }

    return (
      <>
        {loggedIn() ? (
            <Button
                onClick={signOut}
            >
                Log Out
            </Button>
        ) : (
            <Button
                onClick={signIn}
            >
                Log In
            </Button>
        )
        }
      </>
    )
  }
  
  export default Home;
  