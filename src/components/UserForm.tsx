import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
  Switch,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhCN } from 'date-fns/locale';
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
  sql_query: '',
  injest_type: 'batch',
  enabled: true,
  created_timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
};

const UserForm: React.FC<UserFormProps> = ({
  defaultValues = defaultFormValues,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(userFormSchema)
  });

  const handleFormSubmit: SubmitHandler<Record<string, unknown>> = (data) => {
    onSubmit(data as UserFormData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
      <Box 
        component="form" 
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <Stack spacing={3}>
          {/* 名称字段 - Input */}
          <Box>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="名称"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                  autoFocus
                />
              )}
            />
          </Box>
          
          {/* SQL查询字段 - Textarea */}
          <Box>
            <Controller
              name="sql_query"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="SQL查询"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.sql_query}
                  helperText={errors.sql_query?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
          
          <Stack direction="row" spacing={3}>
            {/* 摄取类型字段 - Select */}
            <Box sx={{ width: '50%' }}>
              <Controller
                name="injest_type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.injest_type}>
                    <InputLabel id="injest-type-label">摄取类型</InputLabel>
                    <Select
                      {...field}
                      labelId="injest-type-label"
                      label="摄取类型"
                      disabled={isSubmitting}
                    >
                      <MenuItem value="batch">批量处理</MenuItem>
                      <MenuItem value="streaming">流式处理</MenuItem>
                      <MenuItem value="incremental">增量处理</MenuItem>
                      <MenuItem value="full">全量处理</MenuItem>
                    </Select>
                    {errors.injest_type && (
                      <FormHelperText>{errors.injest_type.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
            
            {/* 创建时间字段 - DateTimePicker */}
            <Box sx={{ width: '50%' }}>
              <Controller
                name="created_timestamp"
                control={control}
                render={({ field }) => {
                  // 处理日期值
                  let dateValue = null;
                  if (field.value) {
                    try {
                      // 尝试将字符串转换为日期对象
                      const [datePart, timePart] = field.value.split(' ');
                      const [year, month, day] = datePart.split('-').map(Number);
                      const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
                      
                      // 创建本地日期（月份需要减1，因为JavaScript中月份从0开始）
                      dateValue = new Date(year, month - 1, day, hours, minutes, seconds);
                    } catch (e) {
                      console.error('日期解析错误:', e);
                      dateValue = null;
                    }
                  }
                  
                  return (
                    <DateTimePicker
                      label="创建时间"
                      value={dateValue}
                      onChange={(date: Date | null) => {
                        if (date) {
                          // 使用本地日期时间
                          const localDate = new Date(date);
                          const year = localDate.getFullYear();
                          const month = String(localDate.getMonth() + 1).padStart(2, '0');
                          const day = String(localDate.getDate()).padStart(2, '0');
                          const hours = String(localDate.getHours()).padStart(2, '0');
                          const minutes = String(localDate.getMinutes()).padStart(2, '0');
                          const seconds = String(localDate.getSeconds()).padStart(2, '0');
                          
                          const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                          field.onChange(formattedDate);
                        } else {
                          field.onChange('');
                        }
                      }}
                      ampm={false}
                      format="yyyy-MM-dd HH:mm:ss"
                      views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                      minutesStep={1}
                      timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.created_timestamp,
                          helperText: errors.created_timestamp?.message,
                          disabled: isSubmitting
                        },
                        actionBar: {
                          actions: ['clear', 'today', 'accept']
                        }
                      }}
                    />
                  );
                }}
              />
            </Box>
          </Stack>
          
          {/* 是否启用字段 - Switch */}
          <Box>
            <Controller
              name="enabled"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormControl error={!!errors.enabled}>
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        disabled={isSubmitting}
                      />
                    }
                    label="启用"
                  />
                  {errors.enabled && (
                    <FormHelperText>{errors.enabled.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>
          
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
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
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default UserForm; 