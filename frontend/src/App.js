import React from 'react';
import './App.css';
import UsersList from './components/UsersList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>User Management</h1>
      </header>
      <main>
        <UsersList />
      </main>
    </div>
  );
}

export default App;