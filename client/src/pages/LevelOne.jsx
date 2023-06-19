import { Button } from '@chakra-ui/react';
import { Link } from "react-router-dom";

function LevelOne() {

    return (
        <>
            <p>Level One</p>
            <Link to={`/levels`}>
                <Button>
                    Level Select
                </Button>
            </Link>
        </>
    )
}
  
export default LevelOne;