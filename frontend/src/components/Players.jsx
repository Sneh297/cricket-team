import React, { useEffect, useState } from 'react';

export default function Players() {
  const [data, setData] = useState([]); // State to store the API data
  const [loading, setLoading] = useState(true); // State to manage the loading state
  const [error, setError] = useState(null); // State to store any potential errors
  const [team, setTeam] = useState([]); // State to manage the selected team

  // Using useEffect to make the API call when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api'); // Make API request to the '/api' endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json(); // Parse the response as JSON
        setData(result.statsData); // Store the result in the state
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message); // Store error message in state if request fails
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to add a player to the team
  const handleAddPlayer = (player) => {
    if (!team.includes(player)) {
      setTeam([...team, player]);
    }
  };

  // Function to remove a player from the team
  const handleRemovePlayer = (player) => {
    setTeam(team.filter((p) => p.player !== player.player));
  };

  // Render loading, error, or data state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Available Players</h2>
      <ul>
        {data.map((player) => (
          <li key={player.player}>
            {player.player} - Runs: {player.runs}
            <button onClick={() => handleAddPlayer(player)}>Add</button>
          </li>
        ))}
      </ul>

      <h2>Your Team</h2>
      <ul>
        {team.map((player) => (
          <li key={player.player}>
            {player.player} - Runs: {player.runs}
            <button onClick={() => handleRemovePlayer(player)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
