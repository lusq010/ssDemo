import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box, Paper, useTheme } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import PeopleIcon from '@mui/icons-material/People'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import useThemeStore from './store/themeStore'
import Login from './Login'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from './assets/react.svg'
import UserList from './pages/UserList'
import UserAdd from './pages/UserAdd'
import UserEdit from './pages/UserEdit'

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
          <Toolbar sx={{ minHeight: 50, height: 50, py: 0 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              disableRipple
              disableFocusRipple
              disableTouchRipple
              sx={{
                mr: 2,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&:active': {
                  backgroundColor: 'transparent',
                },
                '&:focus': {
                  backgroundColor: 'transparent',
                  outline: 'none',
                },
                '&.Mui-focusVisible': {
                  outline: 'none',
                  backgroundColor: 'transparent',
                }
              }}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <MenuOpenIcon />}
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <img src={logo} alt="logo" style={{ width: 32, height: 32, marginRight: 12 }} />
              <span style={{ display: 'inline-block', height: 24, borderLeft: '2px solid #fff', marginRight: 16 }} />
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
      <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
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
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#132f4c' : '#2f749a',
                color: '#fff',
                transition: 'width 0.2s',
                overflowX: 'hidden',
              },
            }}
          >
            <Toolbar sx={{ minHeight: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', background: 'transparent', px: 2 }}>
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
                    to="/list"
                    selected={['/list', '/add', '/edit'].some(path => location.pathname.startsWith(path))}
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
                      color: ['/list', '/add', '/edit'].some(path => location.pathname.startsWith(path)) ? '#2f749a' : undefined,
                    }}
                  >
                    <PeopleIcon sx={{ 
                      minWidth: 0, 
                      mr: drawerOpen ? 3 : 0, 
                      mx: drawerOpen ? 0 : 'auto', 
                      transition: 'margin 0.2s', 
                      fontSize: 24, 
                      color: ['/list', '/add', '/edit'].some(path => location.pathname.startsWith(path)) ? '#2f749a' : '#fff'
                    }} />
                    <ListItemText primary="用户管理" sx={{ opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap', ml: drawerOpen ? 1 : 0 }} />
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
        <Box component="main" sx={{ flexGrow: 1, p: !isLoginPage ? 3 : 0, mt: !isLoginPage ? 6 : 0, ml: 0, transition: 'margin-left 0.2s', overflowX: 'hidden' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="/about" element={
              <RequireAuth>
                <div>关于页面</div>
              </RequireAuth>
            } />
            <Route path="/list" element={
              <RequireAuth>
                <UserList />
              </RequireAuth>
            } />
            <Route path="/add" element={
              <RequireAuth>
                <UserAdd />
              </RequireAuth>
            } />
            <Route path="/edit/:id" element={
              <RequireAuth>
                <UserEdit />
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

function Dashboard() {
  const theme = useTheme();
  
  // 示例数据
  const pageLoadData = [
    { name: '00:00', value: 2.1 },
    { name: '04:00', value: 1.8 },
    { name: '08:00', value: 2.3 },
    { name: '12:00', value: 2.8 },
    { name: '16:00', value: 3.2 },
    { name: '20:00', value: 2.5 },
    { name: '24:00', value: 2.0 },
  ];

  const apiResponseData = [
    { name: 'GET /users', value: 120 },
    { name: 'POST /auth', value: 180 },
    { name: 'GET /products', value: 150 },
    { name: 'PUT /orders', value: 200 },
    { name: 'GET /stats', value: 100 },
  ];

  const resourceUsageData = [
    { name: '00:00', cpu: 45, memory: 60, disk: 30 },
    { name: '04:00', cpu: 50, memory: 65, disk: 30 },
    { name: '08:00', cpu: 75, memory: 80, disk: 32 },
    { name: '12:00', cpu: 85, memory: 85, disk: 35 },
    { name: '16:00', cpu: 70, memory: 75, disk: 35 },
    { name: '20:00', cpu: 55, memory: 70, disk: 33 },
    { name: '24:00', cpu: 45, memory: 65, disk: 32 },
  ];

  const errorRateData = [
    { name: 'Mon', '4xx': 25, '5xx': 12 },
    { name: 'Tue', '4xx': 15, '5xx': 8 },
    { name: 'Wed', '4xx': 20, '5xx': 15 },
    { name: 'Thu', '4xx': 18, '5xx': 10 },
    { name: 'Fri', '4xx': 22, '5xx': 14 },
    { name: 'Sat', '4xx': 12, '5xx': 6 },
    { name: 'Sun', '4xx': 10, '5xx': 5 },
  ];

  const browserData = [
    { name: 'Chrome', value: 68 },
    { name: 'Firefox', value: 12 },
    { name: 'Safari', value: 10 },
    { name: 'Edge', value: 7 },
    { name: 'Other', value: 3 },
  ];

  return (
    <Box sx={{ 
      display: 'grid', 
      gap: 2.5,
      gridTemplateColumns: 'repeat(12, 1fr)',
      p: 3,
      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : '#f8f9fa'
    }}>
      {/* Page Title */}
      <Box sx={{ gridColumn: 'span 12', mb: 1 }}>
        <Typography variant="h5" sx={{ 
          color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
          fontWeight: 500,
          mb: 1
        }}>
          System Performance Monitor
        </Typography>
        <Typography variant="body2" sx={{ 
          color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#546e7a'
        }}>
          Real-time monitoring of key system metrics to ensure business stability
        </Typography>
      </Box>

      {/* Top Statistics Cards */}
      <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: (theme) => theme.palette.mode === 'dark' 
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.08)'
            }
          }}
        >
          <div>
            <Typography variant="subtitle2" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#37474f',
              fontWeight: 500,
              fontSize: '0.875rem',
              mb: 1
            }}>
              Average Page Load Time
            </Typography>
            <Typography variant="h4" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
              fontWeight: 600,
              fontSize: '1.75rem',
              mb: 0.5
            }}>
              2.3s
            </Typography>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <Typography variant="caption" sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'success.light' : '#2e7d32',
                fontWeight: 500
              }}>
                ↓ 12%
              </Typography>
              <Typography variant="caption" sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#78909c'
              }}>
                vs last week
              </Typography>
            </Box>
          </div>
        </Paper>
      </Box>

      <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: (theme) => theme.palette.mode === 'dark' 
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.08)'
            }
          }}
        >
          <div>
            <Typography variant="subtitle2" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#37474f',
              fontWeight: 500,
              fontSize: '0.875rem',
              mb: 1
            }}>
              API Response Time
            </Typography>
            <Typography variant="h4" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
              fontWeight: 600,
              fontSize: '1.75rem',
              mb: 0.5
            }}>
              150ms
            </Typography>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <Typography variant="caption" sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'success.light' : '#2e7d32',
                fontWeight: 500
              }}>
                ↓ 8%
              </Typography>
              <Typography variant="caption" sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#78909c'
              }}>
                vs last week
              </Typography>
            </Box>
          </div>
        </Paper>
      </Box>

      <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: (theme) => theme.palette.mode === 'dark' 
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.08)'
            }
          }}
        >
          <div>
            <Typography variant="subtitle2" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#37474f',
              fontWeight: 500,
              fontSize: '0.875rem',
              mb: 1
            }}>
              Server CPU Usage
            </Typography>
            <Typography variant="h4" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
              fontWeight: 600,
              fontSize: '1.75rem',
              mb: 0.5
            }}>
              75%
            </Typography>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <Typography variant="caption" sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'error.light' : '#d32f2f',
                fontWeight: 500
              }}>
                ↑ 5%
              </Typography>
              <Typography variant="caption" sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#78909c'
              }}>
                vs last week
              </Typography>
            </Box>
          </div>
        </Paper>
      </Box>

      <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: (theme) => theme.palette.mode === 'dark' 
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.08)'
            }
          }}
        >
          <div>
            <Typography variant="subtitle2" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#37474f',
              fontWeight: 500,
              fontSize: '0.875rem',
              mb: 1
            }}>
              System Error Rate
            </Typography>
            <Typography variant="h4" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
              fontWeight: 600,
              fontSize: '1.75rem',
              mb: 0.5
            }}>
              0.8%
            </Typography>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <Typography variant="caption" sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'error.light' : '#d32f2f',
                fontWeight: 500
              }}>
                ↑ 0.2%
              </Typography>
              <Typography variant="caption" sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#78909c'
              }}>
                vs last week
              </Typography>
            </Box>
          </div>
        </Paper>
      </Box>

      {/* Page Load Time Trend */}
      <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: 400,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="subtitle1" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
            fontWeight: 500,
            mb: 0.5
          }}>
            Page Load Time Trend
          </Typography>
          <Typography variant="caption" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#78909c',
            display: 'block',
            mb: 3
          }}>
            Monitoring page load performance over 24 hours
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={pageLoadData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#f5f5f5'}
              />
              <XAxis 
                dataKey="name" 
                stroke={theme.palette.mode === 'dark' ? '#aaa' : '#9e9e9e'}
                tick={{ fill: theme.palette.mode === 'dark' ? '#aaa' : '#616161' }}
              />
              <YAxis 
                unit="s"
                stroke={theme.palette.mode === 'dark' ? '#aaa' : '#9e9e9e'}
                tick={{ fill: theme.palette.mode === 'dark' ? '#aaa' : '#616161' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.palette.mode === 'dark' ? '#90caf9' : '#1a237e'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* API Response Time */}
      <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: 400,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="subtitle1" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
            fontWeight: 500,
            mb: 0.5
          }}>
            API Response Time Distribution
          </Typography>
          <Typography variant="caption" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#78909c',
            display: 'block',
            mb: 3
          }}>
            Average response time statistics for each endpoint
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={apiResponseData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis 
                type="number" 
                unit="ms"
                stroke={theme.palette.mode === 'dark' ? '#aaa' : '#9e9e9e'}
                tick={{ 
                  fill: theme.palette.mode === 'dark' ? '#aaa' : '#616161'
                }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                stroke={theme.palette.mode === 'dark' ? '#aaa' : '#9e9e9e'}
                tick={{ 
                  fill: theme.palette.mode === 'dark' ? '#aaa' : '#616161'
                }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
                }}
              />
              <Bar 
                dataKey="value" 
                fill={theme.palette.mode === 'dark' ? '#90caf9' : '#1a237e'}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Server Resource Usage */}
      <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: 400,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="subtitle1" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
            fontWeight: 500,
            mb: 0.5
          }}>
            Server Resource Usage
          </Typography>
          <Typography variant="caption" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#78909c',
            display: 'block',
            mb: 3
          }}>
            Monitoring server CPU, memory, and disk usage
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={resourceUsageData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#f5f5f5'}
              />
              <XAxis 
                dataKey="name"
                stroke={theme.palette.mode === 'dark' ? '#aaa' : '#9e9e9e'}
                tick={{ fill: theme.palette.mode === 'dark' ? '#aaa' : '#616161' }}
              />
              <YAxis 
                unit="%"
                stroke={theme.palette.mode === 'dark' ? '#aaa' : '#9e9e9e'}
                tick={{ fill: theme.palette.mode === 'dark' ? '#aaa' : '#616161' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU"
                stroke={theme.palette.mode === 'dark' ? '#90caf9' : '#1a237e'}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="memory"
                name="Memory"
                stroke={theme.palette.mode === 'dark' ? '#64b5f6' : '#0d47a1'}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="disk"
                name="Disk"
                stroke={theme.palette.mode === 'dark' ? '#42a5f5' : '#1565c0'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Browser Distribution */}
      <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: 400,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="subtitle1" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
            fontWeight: 500,
            mb: 0.5
          }}>
            Client Distribution
          </Typography>
          <Typography variant="caption" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#78909c',
            display: 'block',
            mb: 3
          }}>
            Analysis of user browser type distribution
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={browserData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {browserData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={[
                      '#90caf9',
                      '#64b5f6',
                      '#42a5f5',
                      '#2196f3',
                      '#1e88e5'
                    ][index % 5]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Error Rate Statistics */}
      <Box sx={{ gridColumn: 'span 12' }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: 400,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="subtitle1" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
            fontWeight: 500,
            mb: 0.5
          }}>
            System Error Distribution
          </Typography>
          <Typography variant="caption" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#78909c',
            display: 'block',
            mb: 3
          }}>
            Daily statistics of client and server errors
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={errorRateData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#f5f5f5'}
              />
              <XAxis 
                dataKey="name"
                stroke={theme.palette.mode === 'dark' ? '#aaa' : '#9e9e9e'}
                tick={{ fill: theme.palette.mode === 'dark' ? '#aaa' : '#616161' }}
              />
              <YAxis 
                stroke={theme.palette.mode === 'dark' ? '#aaa' : '#9e9e9e'}
                tick={{ fill: theme.palette.mode === 'dark' ? '#aaa' : '#616161' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
                }}
              />
              <Legend />
              <Bar 
                dataKey="4xx" 
                name="Client Errors" 
                fill={theme.palette.mode === 'dark' ? '#90caf9' : '#1a237e'}
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="5xx" 
                name="Server Errors" 
                fill={theme.palette.mode === 'dark' ? '#f48fb1' : '#d32f2f'}
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}

export default App
