import React from 'react';

const UserDetailsDrawer = ({ isOpen, onClose, onSave, userDetails, onUpdateDetails }) => {
  const handleSave = () => {
    onSave(userDetails); // Pass user details back to parent component
    onClose(); // Close the drawer
  };

  return (
    <div className={`side-drawer ${isOpen ? 'open' : ''}`}>
      <h2>User Details</h2>
      <input
        type="text"
        placeholder="Name"
        value={userDetails.name}
        onChange={(e) => onUpdateDetails('name', e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={userDetails.age}
        onChange={(e) => onUpdateDetails('age', e.target.value)}
      />
      <input
        type="number"
        placeholder="Weight"
        value={userDetails.weight}
        onChange={(e) => onUpdateDetails('weight', e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default UserDetailsDrawer;
