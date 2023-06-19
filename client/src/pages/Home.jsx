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
            <>
                <Link to={`/levels`}>
                    <Button>
                        Select a Level
                    </Button>
                </Link>
                <Link to={`/scores`}>
                    <Button>
                        View High Scores
                    </Button>
                </Link>
                <Link to={`/account`}>
                    <Button>
                        View Account Details
                    </Button>
                </Link>
                <Button
                    onClick={signOut}
                >
                    Log Out
                </Button>
            </>
        ) : (
            <>
                <Link to={`/login`}>
                    <Button>
                    Log In
                    </Button>
                </Link>
                <Link to={`/signup`}>
                    <Button>
                        Sign Up
                    </Button>
                </Link>
            </>
        )
        }
      </>
    )
  }
  
  export default Home;
  