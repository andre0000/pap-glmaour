import React, { useState } from 'react';
import './styles.css';

const RegisterModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }

      // Armazenar token e dados do user
      localStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));

      setSuccess('Conta criada com sucesso!');
      if (onLoginSuccess) onLoginSuccess(data.user);

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>
          ×
        </button>
        <h2>Criar Conta</h2>

        {error && <div className='modal-error'>{error}</div>}
        {success && <div className='modal-success'>{success}</div>}

        <form onSubmit={handleRegister} className='modal-form'>
          <label>Nome:</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Seu nome'
          />

          <label>Email:</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='email@exemplo.com'
          />

          <label>Senha:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='••••••••'
          />

          <button type='submit' className='modal-button' disabled={loading}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
