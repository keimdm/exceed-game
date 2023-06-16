import { loggedIn } from '../utils/auth';

function Home() {

    return (
      <>
        {loggedIn() ?
            (
                <p>Logged In</p>
            )
        :
            (
                <p>Logged Out</p>
            )
        }
      </>
    )
  }
  
  export default Home;
  