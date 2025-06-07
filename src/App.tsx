import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import useThemeStore from './store/themeStore'
import Login from './Login'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function App() {
  const { mode, toggleMode } = useThemeStore()
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const handleDrawerToggle = () => setDrawerOpen(open => !open);

  useEffect(() => {
    const isAuth = localStorage.getItem('auth') === 'true';
    if (!isAuth && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login', { replace: true });
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, ml: drawerOpen ? '200px' : '56px', width: `calc(100% - ${drawerOpen ? 200 : 56}px)`, transition: 'margin-left 0.2s, width 0.2s' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              管理后台
            </Typography>
            <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleMode}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton sx={{ ml: 1 }} color="inherit" onClick={handleLogout} title="退出登录">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      <Box sx={{ display: 'flex' }}>
        {!isLoginPage && (
          <Drawer
            variant="permanent"
            open={drawerOpen}
            sx={{
              width: drawerOpen ? 200 : 56,
              flexShrink: 0,
              transition: 'width 0.2s',
              [`& .MuiDrawer-paper`]: {
                width: drawerOpen ? 200 : 56,
                boxSizing: 'border-box',
                backgroundColor: '#2f749a',
                color: '#fff',
                transition: 'width 0.2s',
                overflowX: 'hidden',
              },
            }}
          >
            <Toolbar sx={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', background: 'transparent', px: 2 }}>
              {drawerOpen && (
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                  系统名称
                </Typography>
              )}
            </Toolbar>
            <Box sx={{ overflow: 'auto' }}>
              <List>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to="/"
                    selected={location.pathname === '/'}
                    sx={{
                      minHeight: 48,
                      height: 48,
                      alignItems: 'center',
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      px: 2.5,
                      '&.Mui-selected, &.Mui-selected:hover': {
                        backgroundColor: '#092e5d',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: 0,
                      },
                      color: location.pathname === '/' ? '#2f749a' : undefined,
                    }}
                  >
                    <HomeIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 0, mx: drawerOpen ? 0 : 'auto', transition: 'margin 0.2s', fontSize: 24, color: location.pathname === '/' ? '#2f749a' : '#fff' }} />
                    <ListItemText primary="首页" sx={{ opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap', ml: drawerOpen ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to="/about"
                    selected={location.pathname === '/about'}
                    sx={{
                      minHeight: 48,
                      height: 48,
                      alignItems: 'center',
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      px: 2.5,
                      '&.Mui-selected, &.Mui-selected:hover': {
                        backgroundColor: '#092e5d',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: 0,
                      },
                      color: location.pathname === '/about' ? '#2f749a' : undefined,
                    }}
                  >
                    <InfoIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 0, mx: drawerOpen ? 0 : 'auto', transition: 'margin 0.2s', fontSize: 24, color: location.pathname === '/about' ? '#2f749a' : '#fff' }} />
                    <ListItemText primary="关于" sx={{ opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap', ml: drawerOpen ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        )}
        <Box component="main" sx={{ flexGrow: 1, p: !isLoginPage ? 3 : 0, mt: !isLoginPage ? 8 : 0, ml: 0, transition: 'margin-left 0.2s' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <RequireAuth>
                <div>首页内容</div>
              </RequireAuth>
            } />
            <Route path="/about" element={
              <RequireAuth>
                <div>关于页面</div>
              </RequireAuth>
            } />
          </Routes>
        </Box>
      </Box>
    </>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const isAuth = localStorage.getItem('auth') === 'true';
    if (!isAuth && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);
  return <>{children}</>;
}

export default App
