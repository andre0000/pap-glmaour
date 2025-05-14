import React, { useState } from 'react';
import './styles.css';

const LoginModal = ({ onClose, onLoginSuccess, onOpenRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));

      if (onLoginSuccess) onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className='modal-content form' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>
          ×
        </button>

        {error && <div className='modal-error'>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className='flex-column'>
            <label>Email</label>
          </div>
          <div className='inputForm'>
            {/* ícone */}
            <svg height='20' viewBox='0 0 32 32' width='20'>
              <path d='...' />
            </svg>
            <input
              type='email'
              className='input'
              placeholder='Enter your Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='flex-column'>
            <label>Password</label>
          </div>
          <div className='inputForm'>
            {/* ícone */}
            <svg height='20' viewBox='-64 0 512 512' width='20'>
              <path d='...' />
            </svg>
            <input
              type='password'
              className='input'
              placeholder='Enter your Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* ícone olho */}
            <svg viewBox='0 0 576 512' height='1em'>
              <path d='...' />
            </svg>
          </div>

          <div className='flex-row'>
            <div>
              <input type='checkbox' />
              <label>Remember me</label>
            </div>
            <span className='span'>Forgot password?</span>
          </div>

          <button className='button-submit' type='submit' disabled={loading}>
            {loading ? 'Entrando...' : 'Sign In'}
          </button>

          <p className='p'>
            Don't have an account?{' '}
            <span
              className='span'
              onClick={onOpenRegister}
              style={{ cursor: 'pointer' }}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
