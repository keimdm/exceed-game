import { loggedIn } from '../utils/auth';
import { Button } from '@chakra-ui/react';
import { Link } from "react-router-dom";

function Scores() {

    return (
      <>
        {loggedIn() ? (
            <>
                <p>Scores</p>
                <Link to={`/`}>
                    <Button>
                        Home Page
                    </Button>
                </Link>
            </>
        ) : (
            <>
                <p>Sorry - you are not authorized to view this page! Please log in and try again.</p>
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
  
export default Scores;