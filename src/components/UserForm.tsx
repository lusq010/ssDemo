import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@mui/material';
import type { UserFormData } from '../types/User';
import { userFormSchema } from '../validations/userValidation';

interface UserFormProps {
  defaultValues?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const defaultFormValues: UserFormData = {
  name: '',
  email: '',
  role: 'viewer',
  department: '',
  status: 'active'
};

const UserForm: React.FC<UserFormProps> = ({
  defaultValues = defaultFormValues,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    defaultValues,
    resolver: yupResolver(userFormSchema)
  });

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="姓名"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
                autoFocus
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="邮箱"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="部门"
                fullWidth
                error={!!errors.department}
                helperText={errors.department?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel id="role-label">角色</InputLabel>
                <Select
                  {...field}
                  labelId="role-label"
                  label="角色"
                  disabled={isSubmitting}
                >
                  <MenuItem value="admin">管理员</MenuItem>
                  <MenuItem value="editor">编辑者</MenuItem>
                  <MenuItem value="viewer">浏览者</MenuItem>
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset" error={!!errors.status}>
                <FormLabel component="legend">状态</FormLabel>
                <RadioGroup
                  {...field}
                  row
                >
                  <FormControlLabel 
                    value="active" 
                    control={<Radio />} 
                    label="活跃" 
                    disabled={isSubmitting}
                  />
                  <FormControlLabel 
                    value="inactive" 
                    control={<Radio />} 
                    label="禁用" 
                    disabled={isSubmitting}
                  />
                </RadioGroup>
                {errors.status && (
                  <FormHelperText>{errors.status.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              保存
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm; 