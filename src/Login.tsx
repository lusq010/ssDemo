import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Paper, Typography } from '@mui/material';
import logo from './assets/react.svg'

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'abc' && password === '123') {
      localStorage.setItem('auth', 'true');
      navigate('/');
    } else {
      setError('账号或密码错误');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Paper elevation={3} style={{ padding: 32, width: 400 }}>
        <img src={logo} alt="logo" style={{ display: 'block', width: '100%', maxWidth: '100%', margin: '0 auto 16px auto', height: 56, objectFit: 'contain' }} />
        <Typography variant="h5" gutterBottom>登录</Typography>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            label="账号"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            label="密码"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 16 }}>
            登录
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Login; 