import { useState } from 'react';
import { useGetAvatarInformationQuery } from "./graphql/generated/graphql";
import './App.css';

function App() {
  const [avatarAddress, setAvatarAddress] = useState('');
  const [addressToFetch, setAddressToFetch] = useState('');

  const { loading, data } = useGetAvatarInformationQuery({
    variables: { avatarAddress: addressToFetch },
    skip: !addressToFetch
  });

  const handleFetch = () => {
    setAddressToFetch(avatarAddress);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="input-group">
          <input
            type="text"
            value={avatarAddress}
            onChange={(e) => setAvatarAddress(e.target.value)}
            placeholder="Enter avatar address"
          />
          <button onClick={handleFetch}>Fetch</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {data && data.avatar ? (
              <>
                <p>Avatar Name: {data.avatar.name}</p>
                <p>Avatar Level: {data.avatar.level}</p>
              </>
            ) : (
              <p>No data available</p>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
