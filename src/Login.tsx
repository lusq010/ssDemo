import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, IconButton, Paper, TextField, Toolbar, Typography, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useThemeStore from './store/themeStore';
import logo from './assets/react.svg';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeStore();
  const theme = useTheme();

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 导航栏 */}
      <AppBar position="static" sx={{ boxShadow: 'none', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ minHeight: 50, height: 50, py: 0 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="logo" style={{ width: 32, height: 32, marginRight: 12 }} />
            <span style={{ display: 'inline-block', height: 24, borderLeft: '2px solid #fff', marginRight: 16 }} />
            管理后台
          </Typography>
          <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleMode}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 登录表单 */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f8f9fa',
        py: 4
      }}>
        <Paper elevation={3} sx={{ 
          p: 4, 
          width: 400,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1
        }}>
          <img src={logo} alt="logo" style={{ display: 'block', width: '100%', maxWidth: '100%', margin: '0 auto 16px auto', height: 56, objectFit: 'contain' }} />
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e' }}>
            登录
          </Typography>
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
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              登录
            </Button>
          </form>
        </Paper>
      </Box>

      {/* 页脚 */}
      <Box component="footer" sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#fff',
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} State Street Corporation. All Rights Reserved.
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%',
          mt: 2,
          pt: 2,
          px: { xs: 2, sm: 4, md: 6 },
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography 
            variant="body2" 
            component="a" 
            href="#" 
            sx={{ 
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { 
                color: 'primary.main',
                textDecoration: 'underline' 
              }
            }}
          >
            隐私政策
          </Typography>
          <Typography 
            variant="body2" 
            component="a" 
            href="#" 
            sx={{ 
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { 
                color: 'primary.main',
                textDecoration: 'underline' 
              }
            }}
          >
            使用条款
          </Typography>
          <Typography 
            variant="body2" 
            component="a" 
            href="#" 
            sx={{ 
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { 
                color: 'primary.main',
                textDecoration: 'underline' 
              }
            }}
          >
            安全声明
          </Typography>
          <Typography 
            variant="body2" 
            component="a" 
            href="#" 
            sx={{ 
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { 
                color: 'primary.main',
                textDecoration: 'underline' 
              }
            }}
          >
            联系我们
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login; 