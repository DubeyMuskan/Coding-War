import './App.css';
import React, { useState, useEffect } from 'react';
import Login from './Login'; // Import the Login component

function App() {
  const initialUsers = [
    { id: 1, name: "User 1", points: 0 },
    { id: 2, name: "User 2", points: 0 },
    { id: 3, name: "User 3", points: 0 },
    { id: 4, name: "User 4", points: 0 },
  ];

  const problems = [
    "Write a function to reverse a string.",
    "Create a function that checks if a number is prime.",
    "Write a function to calculate the factorial of a number.",
    "Create a function to sum all elements in an array.",
  ];

  const correctAnswers = [
    "function reverseString(str) { return str.split('').reverse().join(''); }",
    "function isPrime(num) { for (let i = 2; i < num; i++) if (num % i === 0) return false; return num > 1; }",
    "function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }",
    "function sumArray(arr) { return arr.reduce((acc, curr) => acc + curr, 0); }",
  ];

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [codingProblem, setCodingProblem] = useState("");
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userSolutions, setUserSolutions] = useState({});
  const [feedback, setFeedback] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    let timer;
    if (selectedUsers.length > 0 && timeLeft > 0 && !winner) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      resetChallenge();
    }
    return () => clearInterval(timer);
  }, [selectedUsers, timeLeft, winner]);

  const selectRandomUsers = () => {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);
    const randomProblemIndex = Math.floor(Math.random() * problems.length);
    setCodingProblem(problems[randomProblemIndex]);
    setSelectedUsers(selected);
    setWinner(null);
    setTimeLeft(60);
    setUserSolutions({});
    setFeedback("");
  };

  const handleInputChange = (userId, solution) => {
    setUserSolutions((prevSolutions) => ({
      ...prevSolutions,
      [userId]: solution,
    }));
  };

  const submitSolution = (user) => {
    if (!winner) {
      const problemIndex = problems.indexOf(codingProblem);
      const isCorrect = userSolutions[user.id] === correctAnswers[problemIndex];

      if (isCorrect) {
        setWinner(user);
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id ? { ...u, points: u.points + 1 } : u
          )
        );
        setFeedback(`Correct! ${user.name} wins!`);
      } else {
        setFeedback(`Incorrect solution from ${user.name}.`);
      }
    }
  };

  const resetChallenge = () => {
    setSelectedUsers([]);
    setCodingProblem("");
    setWinner(null);
    setTimeLeft(60);
    setUserSolutions({});
    setFeedback("");
  };

  const handleLogin = (username) => {
    setCurrentUser({ name: username, points: 0 });
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">React Coding Challenge App</h1>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
              onClick={selectRandomUsers}
            >
              Select Random Users
            </button>
            {selectedUsers.length > 0 && (
              <div className="timer text-xl font-semibold text-red-600">
                Time Left: {timeLeft}s
              </div>
            )}
            {selectedUsers.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Selected Users</h2>
                <ul>
                  {selectedUsers.map((user) => (
                    <li key={user.id} className="mt-2 p-2 rounded">
                      {user.name} (Points: {user.points})
                      <input
                        type="text"
                        className="solution-input ml-2 p-1 rounded border"
                        placeholder="Enter solution"
                        value={userSolutions[user.id] || ""}
                        onChange={(e) => handleInputChange(user.id, e.target.value)}
                        disabled={!!winner || timeLeft === 0}
                      />
                      <button
                        className="bg-green-500 text-white px-2 py-1 ml-2 rounded hover:bg-green-700"
                        onClick={() => submitSolution(user)}
                        disabled={!!winner || timeLeft === 0 || !userSolutions[user.id]}
                      >
                        Submit Solution
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {codingProblem && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Coding Problem</h2>
                <p className="mt-2">{codingProblem}</p>
              </div>
            )}
            {feedback && (
              <div className="mt-4 text-red-600 font-semibold">{feedback}</div>
            )}
            {winner && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-green-600">
                  {winner.name} solved the problem first!
                </h2>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mt-4 hover:bg-gray-700"
                  onClick={resetChallenge}
                >
                  Reset Challenge
                </button>
              </div>
            )}
            {timeLeft === 0 && !winner && (
              <div className="mt-4 text-red-600 font-semibold">
                Time's up! No one solved the problem.
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mt-4 hover:bg-gray-700"
                  onClick={resetChallenge}
                >
                  Reset Challenge
                </button>
              </div>
            )}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
              <ul>
                {users
                  .sort((a, b) => b.points - a.points)
                  .map((user) => (
                    <li key={user.id} className="leaderboard-item p-2 mb-1 rounded">
                      {user.name}: {user.points} points
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
