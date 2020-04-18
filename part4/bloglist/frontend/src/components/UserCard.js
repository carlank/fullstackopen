import React from 'react';

const UserCard = ({loggedIn}) => (
  <div>
  	{loggedIn ? 'Logged In': 'Logged Out'}
  </div>
);

export default UserCard;