import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({ name: parsedUser.name, email: parsedUser.email });
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/update-profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        setIsEditing(false);
      } else {
        alert(data.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) return null;

  return (
    <div className='profile-container'>
      <h2>Perfil do Usuário</h2>

      <div className='profile-field'>
        <label>Nome:</label>
        {isEditing ? (
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
        ) : (
          <p>{user.name}</p>
        )}
      </div>

      <div className='profile-field'>
        <label>Email:</label>
        {isEditing ? (
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
        ) : (
          <p>{user.email}</p>
        )}
      </div>

      <div className='profile-actions'>
        {isEditing ? (
          <button className='save-btn' onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className='edit-btn' onClick={handleEdit}>
            Edit
          </button>
        )}
        <button className='logout-btn' onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
