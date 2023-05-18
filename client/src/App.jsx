import { useState, useEffect } from 'react'

function App() {

  const [message, setMessage] = useState("");

  async function getServerMessage() {
    const response = await fetch("/api/test/", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    setMessage(data.message);
  }

  useEffect(() => {getServerMessage()}, []);

  return (
    <>
      <p>
        Hello
      </p>
      <p>
        {message}
      </p>
    </>
  )
}

export default App
