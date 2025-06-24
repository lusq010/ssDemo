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
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { User } from '../types/User';
import { useUsers, useDeleteUser } from '../hooks/useUsers';

const UserList: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // 使用React Query获取用户列表
  const { 
    data: users = [], 
    isLoading, 
    isError, 
    error 
  } = useUsers();

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
          console.error('删除用户失败:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return theme.palette.mode === 'dark' ? '#8250df' : '#6200ea';
      case 'editor':
        return theme.palette.mode === 'dark' ? '#3fb950' : '#00c853';
      case 'viewer':
        return theme.palette.mode === 'dark' ? '#58a6ff' : '#2196f3';
      default:
        return theme.palette.mode === 'dark' ? '#aaa' : '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.mode === 'dark' ? '#3fb950' : '#00c853';
      case 'inactive':
        return theme.palette.mode === 'dark' ? '#f85149' : '#f44336';
      default:
        return theme.palette.mode === 'dark' ? '#aaa' : '#757575';
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
          用户管理
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/add" 
          startIcon={<AddIcon />}
        >
          新增用户
        </Button>
      </Box>

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
              加载用户数据失败: {error instanceof Error ? error.message : '未知错误'}
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
                    <TableCell>姓名</TableCell>
                    <TableCell>邮箱</TableCell>
                    <TableCell>角色</TableCell>
                    <TableCell>部门</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>最后登录时间</TableCell>
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
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            size="small"
                            sx={{ 
                              backgroundColor: getRoleColor(user.role),
                              color: '#fff',
                              fontWeight: 500,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status === 'active' ? '活跃' : '禁用'} 
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(user.status),
                              color: '#fff',
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : '-'}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell align="right">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          暂无用户数据
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
            您确定要删除此用户吗？此操作无法撤销。
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
    </Box>
  );
};

export default UserList; 