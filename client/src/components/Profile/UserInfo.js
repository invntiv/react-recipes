import React from "react";

const UserInfo = ({ session }) => (
  <div>
    <h3>User Info</h3>
    <p>Username: {session.getCurrentUser.username}</p>
    <p>Email: {session.getCurrentUser.email}</p>
    <p>Join Date: {session.getCurrentUser.joinDate}</p>
    <ul>
      <h3>{session.getCurrentUser.username}'s Fav</h3>
    </ul>
  </div>
);

export default UserInfo;
