import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Tooltip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhCN } from 'date-fns/locale';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { User } from '../types/User';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import type { UserFilters } from '../services/userService';

const UserList: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [sqlPreviewOpen, setSqlPreviewOpen] = useState(false);
  const [sqlPreviewContent, setSqlPreviewContent] = useState('');
  
  // 分离本地过滤条件状态和实际应用的过滤条件
  const [filterValues, setFilterValues] = useState<UserFilters>({
    name: '',
    injest_type: '',
    enabled: undefined,
    date_from: '',
    date_to: ''
  });
  
  // 实际用于查询的过滤条件
  const [appliedFilters, setAppliedFilters] = useState<UserFilters>({
    name: '',
    injest_type: '',
    enabled: undefined,
    date_from: '',
    date_to: ''
  });

  // 使用React Query获取用户列表 - 使用appliedFilters
  const { 
    data: users = [], 
    isLoading, 
    isError, 
    error,
    refetch
  } = useUsers(appliedFilters);

  // 使用React Query删除用户
  const { 
    mutate: deleteUser, 
    isPending: isDeleting 
  } = useDeleteUser();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        },
        onError: (error) => {
          console.error('删除失败:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSqlPreviewClick = (sql: string) => {
    setSqlPreviewContent(sql);
    setSqlPreviewOpen(true);
  };

  const handleSqlPreviewClose = () => {
    setSqlPreviewOpen(false);
  };

  // 处理过滤条件变更 - 只更新本地状态，不触发查询
  const handleFilterChange = (field: keyof UserFilters, value: string | boolean) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理日期范围变更 - 只更新本地状态，不触发查询
  const handleStartDateChange = (date: Date | null) => {
    setFilterValues(prev => ({
      ...prev,
      date_from: date ? date.toISOString().split('T')[0] : ''
    }));
  };
  
  const handleEndDateChange = (date: Date | null) => {
    setFilterValues(prev => ({
      ...prev,
      date_to: date ? date.toISOString().split('T')[0] : ''
    }));
  };

  // 处理查询按钮点击 - 应用过滤条件并触发查询
  const handleSearch = () => {
    setPage(0); // 重置到第一页
    setAppliedFilters(filterValues); // 应用过滤条件
    refetch(); // 重新获取数据
  };

  // 重置过滤条件
  const handleResetFilters = () => {
    const emptyFilters = {
      name: '',
      injest_type: '',
      enabled: undefined,
      date_from: '',
      date_to: ''
    };
    setFilterValues(emptyFilters);
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return dateString;
  };

  const getInjestTypeColor = (type: string) => {
    switch (type) {
      case 'batch':
        return theme.palette.mode === 'dark' ? '#8250df' : '#6200ea';
      case 'streaming':
        return theme.palette.mode === 'dark' ? '#3fb950' : '#00c853';
      case 'incremental':
        return theme.palette.mode === 'dark' ? '#58a6ff' : '#2196f3';
      case 'full':
        return theme.palette.mode === 'dark' ? '#f85149' : '#f44336';
      default:
        return theme.palette.mode === 'dark' ? '#aaa' : '#757575';
    }
  };

  const getInjestTypeLabel = (type: string) => {
    switch (type) {
      case 'batch': return '批量处理';
      case 'streaming': return '流式处理';
      case 'incremental': return '增量处理';
      case 'full': return '全量处理';
      default: return type;
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
            fontWeight: 500
          }}
        >
          数据任务管理
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/add" 
          startIcon={<AddIcon />}
        >
          新增任务
        </Button>
      </Box>

      {/* 过滤表单 */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)'
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: -0.5, ml: 0.5, fontWeight: 500 }}>
              过滤条件
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={2}
              divider={<Box component="span" sx={{ 
                display: { xs: 'none', md: 'block' }, 
                borderLeft: `1px solid ${theme.palette.divider}`, 
                height: 36,
                alignSelf: 'center',
                mx: 0.5
              }} />}
            >
              <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: '60%' } }}>
                <TextField
                  label="任务名称"
                  placeholder="输入名称关键字"
                  fullWidth
                  size="small"
                  value={filterValues.name || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon 
                        fontSize="small" 
                        color="action" 
                        sx={{ ml: 0.5, mr: 1 }} 
                      />
                    ),
                    endAdornment: filterValues.name ? (
                      <IconButton
                        size="small"
                        aria-label="清空"
                        onClick={() => handleFilterChange('name', '')}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ) : null
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
                      },
                    },
                  }}
                />
                
                <FormControl fullWidth size="small" sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
                    },
                  },
                }}>
                  <InputLabel id="status-filter-label">状态</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={filterValues.enabled === undefined ? '' : (filterValues.enabled ? 'true' : 'false')}
                    label="状态"
                    onChange={(e) => {
                      const value = e.target.value as string;
                      if (value === '') {
                        handleFilterChange('enabled', undefined as unknown as boolean);
                      } else {
                        handleFilterChange('enabled', value === 'true');
                      }
                    }}
                    endAdornment={filterValues.enabled !== undefined ? (
                      <IconButton
                        size="small"
                        aria-label="清空"
                        onClick={() => handleFilterChange('enabled', undefined as unknown as boolean)}
                        sx={{ mr: 3 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                  >
                    <MenuItem value="">全部</MenuItem>
                    <MenuItem value="true">已启用</MenuItem>
                    <MenuItem value="false">已禁用</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: '40%' } }}>
                <FormControl fullWidth size="small" sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
                    },
                  },
                }}>
                  <InputLabel id="injest-type-filter-label">摄取类型</InputLabel>
                  <Select
                    labelId="injest-type-filter-label"
                    value={filterValues.injest_type || ''}
                    label="摄取类型"
                    onChange={(e) => handleFilterChange('injest_type', e.target.value)}
                    endAdornment={filterValues.injest_type ? (
                      <IconButton
                        size="small"
                        aria-label="清空"
                        onClick={() => handleFilterChange('injest_type', '')}
                        sx={{ mr: 3 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                  >
                    <MenuItem value="">全部</MenuItem>
                    <MenuItem value="batch">批量处理</MenuItem>
                    <MenuItem value="streaming">流式处理</MenuItem>
                    <MenuItem value="incremental">增量处理</MenuItem>
                    <MenuItem value="full">全量处理</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Box sx={{ width: '100%', position: 'relative' }}>
                <DatePicker
                  label="开始日期"
                  value={filterValues.date_from ? new Date(filterValues.date_from) : null}
                  onChange={handleStartDateChange}
                  format="yyyy-MM-dd"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        endAdornment: filterValues.date_from ? (
                          <IconButton
                            size="small"
                            aria-label="清空"
                            onClick={() => handleStartDateChange(null)}
                            sx={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)' }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        ) : null
                      },
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
                          },
                        },
                      }
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ width: '100%', position: 'relative' }}>
                <DatePicker
                  label="结束日期"
                  value={filterValues.date_to ? new Date(filterValues.date_to) : null}
                  onChange={handleEndDateChange}
                  format="yyyy-MM-dd"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        endAdornment: filterValues.date_to ? (
                          <IconButton
                            size="small"
                            aria-label="清空"
                            onClick={() => handleEndDateChange(null)}
                            sx={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)' }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        ) : null
                      },
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
                          },
                        },
                      }
                    }
                  }}
                />
              </Box>
            </Stack>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 1.5, 
              mt: 0.5,
              borderTop: `1px solid ${theme.palette.divider}`,
              pt: 2
            }}>
              <Button 
                variant="outlined" 
                onClick={handleResetFilters}
                sx={{ 
                  minWidth: 80,
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                重置
              </Button>
              <Button 
                variant="contained" 
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{ 
                  minWidth: 100,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                查询
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Paper>

      <Paper elevation={0} sx={{ 
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: 'hidden'
      }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              加载数据失败: {error instanceof Error ? error.message : '未知错误'}
            </Alert>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.02)'
                  }}>
                    <TableCell>名称</TableCell>
                    <TableCell>SQL查询</TableCell>
                    <TableCell>摄取类型</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>创建时间</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user: User) => (
                      <TableRow key={user.id} hover>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                maxWidth: 200, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap' 
                              }}
                            >
                              {user.sql_query}
                            </Typography>
                            <Tooltip title="查看SQL">
                              <IconButton 
                                size="small" 
                                onClick={() => handleSqlPreviewClick(user.sql_query)}
                              >
                                <CodeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getInjestTypeLabel(user.injest_type)} 
                            size="small"
                            sx={{ 
                              backgroundColor: getInjestTypeColor(user.injest_type),
                              color: '#fff',
                              fontWeight: 500,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.enabled ? '已启用' : '已禁用'} 
                            size="small"
                            sx={{ 
                              backgroundColor: user.enabled 
                                ? (theme.palette.mode === 'dark' ? '#3fb950' : '#00c853')
                                : (theme.palette.mode === 'dark' ? '#f85149' : '#f44336'),
                              color: '#fff',
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.created_timestamp)}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton 
                              component={Link} 
                              to={`/edit/${user.id}`} 
                              size="small"
                              sx={{ mr: 1 }}
                              disabled={isDeleting && userToDelete === user.id}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteClick(user.id)} 
                              size="small"
                              color="error"
                              disabled={isDeleting && userToDelete === user.id}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          暂无数据
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="每页行数:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count}`}
            />
          </>
        )}
      </Paper>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={isDeleting ? undefined : handleDeleteCancel}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要删除此任务吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>取消</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            autoFocus
            disabled={isDeleting}
          >
            {isDeleting ? '删除中...' : '删除'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SQL预览对话框 */}
      <Dialog
        open={sqlPreviewOpen}
        onClose={handleSqlPreviewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>SQL查询预览</DialogTitle>
        <DialogContent>
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
              borderRadius: 1,
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto'
            }}
          >
            {sqlPreviewContent}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSqlPreviewClose}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList; 