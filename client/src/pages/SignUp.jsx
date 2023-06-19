import { Button } from '@chakra-ui/react';
import { Link } from "react-router-dom";

function SignUp() {

    return (
        <>
            <p>Sign Up</p>
            <Link to={`/`}>
                <Button>
                    Home Page
                </Button>
            </Link>
        </>
    )
}
  
export default SignUp;