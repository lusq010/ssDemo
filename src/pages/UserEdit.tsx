import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  Paper,
  Typography,
  useTheme,
  Alert
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UserForm from '../components/UserForm';
import type { UserFormData } from '../types/User';
import { useUser, useUpdateUser } from '../hooks/useUsers';
import { Link as RouterLink } from 'react-router-dom';

const UserEdit: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // 使用React Query获取用户数据
  const { 
    data: user,
    isLoading,
    isError,
    error: queryError
  } = useUser(id || '');

  // 使用React Query更新用户
  const { 
    mutate: updateUser,
    isPending: isSubmitting
  } = useUpdateUser();

  const handleSubmit = (userData: UserFormData) => {
    if (!id) return;
    
    updateUser(
      { id, userData },
      {
        onSuccess: () => {
          navigate('/list');
        },
        onError: (error) => {
          setError(error instanceof Error ? error.message : '更新用户时出错');
        }
      }
    );
  };

  const handleCancel = () => {
    navigate('/list');
  };

  // 提取表单需要的字段
  const formData: UserFormData | undefined = user ? {
    name: user.name,
    sql_query: user.sql_query,
    injest_type: user.injest_type,
    enabled: user.enabled,
    created_timestamp: user.created_timestamp
  } : undefined;

  return (
    <Box>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link 
          component={RouterLink} 
          to="/list"
          underline="hover"
          color="inherit"
        >
          用户管理
        </Link>
        <Typography color="text.primary">编辑用户</Typography>
      </Breadcrumbs>

      <Typography 
        variant="h5" 
        sx={{ 
          color: theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
          fontWeight: 500,
          mb: 3
        }}
      >
        编辑用户
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ py: 2 }}>
            {queryError instanceof Error ? queryError.message : '加载用户数据失败'}
          </Alert>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : formData ? (
          <UserForm
            defaultValues={formData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        ) : (
          <Alert severity="error" sx={{ py: 2 }}>
            无法加载用户数据
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default UserEdit; 