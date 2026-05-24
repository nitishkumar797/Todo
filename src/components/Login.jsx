import { useState } from "react";

export default function Login({ onLogin, authenticate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = authenticate(username.trim(), password);
    if (!user) {
      setError("Invalid username or password.");
      return;
    }

    setError("");
    onLogin(user);
  };

  return (
    <div className="login-card">
      <h1>Sign in</h1>
      <p>Use admin or user credentials to access task records.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin or user1"
            aria-label="Username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="admin123 or user123"
            aria-label="Password"
          />
        </label>

        {error && <div className="login-error">{error}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
