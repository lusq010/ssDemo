import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Link,
  Paper,
  Typography,
  useTheme,
  Alert
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UserForm from '../components/UserForm';
import type { UserFormData } from '../types/User';
import { useCreateUser } from '../hooks/useUsers';
import { Link as RouterLink } from 'react-router-dom';

const UserAdd: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  // 使用React Query创建用户
  const { 
    mutate: createUser, 
    isPending: isSubmitting 
  } = useCreateUser();

  const handleSubmit = (userData: UserFormData) => {
    createUser(userData, {
      onSuccess: () => {
        navigate('/list');
      },
      onError: (error) => {
        setError(error instanceof Error ? error.message : '创建用户时出错');
      }
    });
  };

  const handleCancel = () => {
    navigate('/list');
  };

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
        <Typography color="text.primary">新增用户</Typography>
      </Breadcrumbs>

      <Typography 
        variant="h5" 
        sx={{ 
          color: theme.palette.mode === 'dark' ? 'primary.light' : '#1a237e',
          fontWeight: 500,
          mb: 3
        }}
      >
        新增用户
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <UserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Paper>
    </Box>
  );
};

export default UserAdd; 