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
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import type { User } from '../types/User';
import { useUsers, useDeleteUser } from '../hooks/useUsers';

const UserList: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [sqlPreviewOpen, setSqlPreviewOpen] = useState(false);
  const [sqlPreviewContent, setSqlPreviewContent] = useState('');

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