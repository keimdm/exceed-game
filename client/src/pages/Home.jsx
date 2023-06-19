import { loggedIn, login, logout } from '../utils/auth';
import { Button } from '@chakra-ui/react';
import { Link } from "react-router-dom";

function Home() {

    const signOut = async () => {
        logout();
    }

    return (
      <>
        <p>Home</p>
        {loggedIn() ? (
            <Button
                onClick={signOut}
            >
                Log Out
            </Button>
        ) : (
            <Link to={`/login`}>
                <Button>
                    Click here to log in
                </Button>
            </Link>
        )
        }
      </>
    )
  }
  
  export default Home;
  