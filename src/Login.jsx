import React, { useState } from 'react';

// Example users list with username and password
const usersList = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' },
  { username: 'user3', password: 'pass3' },
];

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = usersList.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      onLogin(username);
      setError(''); // Reset error if the login is successful
    } else {
      setError('Invalid username or password'); // Show error if credentials are incorrect
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        {/* Login Instructions */}
        <div className="mb-4 text-center">
          <p className="mb-2">Please use the following credentials to log in:</p>
          <p><strong>Username:</strong> user1, user2, user3</p>
          <p><strong>Password:</strong> pass1, pass2, pass3</p>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center">Login</h2>

        {/* Error message display */}
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Username input field with placeholder */}
          <input
            type="text"
            placeholder="Username (e.g., user1)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded p-2 mb-4"
            required
          />

          {/* Password input field with placeholder */}
          <input
            type="password"
            placeholder="Password (e.g., pass1)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 mb-4"
            required
          />

          {/* Submit button */}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
