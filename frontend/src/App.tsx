import { useEffect, useState } from "react";
import { checkBackendHealth } from "./services/api";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    checkBackendHealth()
      .then(() => {
        setBackendStatus("Connected");
      })
      .catch(() => {
        setBackendStatus("Disconnected");
      });
  }, []);

  return (
    <main>
      <h1>FlashMind</h1>
      <p>Learn. Swipe. Repeat.yay</p>
      <p>Backend: {backendStatus}</p>
    </main>
  );
}

export default App;