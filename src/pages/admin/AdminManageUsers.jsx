import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../../services/authService";
import "./AdminManageUsers.css";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("carocart_token");
      const res = await getAllUsers(token);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditedUser({});
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("carocart_token");
      await updateUserByAdmin(id, editedUser, token);
      setEditUserId(null);
      setEditedUser({});
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("carocart_token");
        await deleteUserByAdmin(id, token);
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user", err);
      }
    }
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-users-container">
      <h2 className="admin-title">Manage Users</h2>
      <table className="admin-users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className="action-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editUserId === user.id ? (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <input
                    name="firstName"
                    value={editedUser.firstName}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    name="lastName"
                    value={editedUser.lastName}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <select
                    name="role"
                    value={editedUser.role}
                    onChange={handleChange}
                  >
                    <option value="USER">USER</option>
                    <option value="VENDOR">VENDOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="action-col">
                  <button className="btn save" onClick={() => handleSave(user.id)}>Save</button>
                  <button className="btn cancel" onClick={handleCancel}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="action-col">
                  <button className="btn edit" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="btn delete" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManageUsers;
