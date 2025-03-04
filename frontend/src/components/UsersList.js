import React, { useState, useEffect } from 'react';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(filterText.toLowerCase()) || 
                   user.email.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  useEffect(() => {
    fetch('/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        setLoading(false);
      });
  }, []);


  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    
    // TODO: Fetch user details
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading === true) {
    return <div>Loading...</div>;
  }

  if (error !== null) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filter users..."
          value={filterText}
          onChange={handleFilterChange}
          style={{ padding: '8px', width: '300px' }}
        />
      </div>
      
      <table className="users-table">
        <thead>
          <tr>
            <th onClick={() => handleSortChange('name')}>
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSortChange('email')}>
              Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSortChange('role')}>
              Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index} className={selectedUserId === user.id ? 'selected' : ''}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button 
                  onClick={() => {
                    handleUserSelect(user.id);
                    console.log(`User ${user.id} selected at ${new Date().toISOString()}`);
                  }}
                  disabled={selectedUserId === user.id}
                >
                  {selectedUserId === user.id ? 'Selected' : 'Select'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedUserId && !selectedUser && (
        <div className="user-detail-placeholder">
          <p>Select a user to see details</p>
          <p><i>Note: This functionality is not yet implemented</i></p>
        </div>
      )}
      
      {selectedUser && (
        <div className="user-details">
          <h2>User Details</h2>
          <p>ID: {selectedUser.id}</p>
          <p>Name: {selectedUser.name}</p>
          <p>Email: {selectedUser.email}</p>
          <p>Role: {selectedUser.role}</p>
        </div>
      )}
    </div>
  );
}

export default UsersList;