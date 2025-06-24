import * as yup from 'yup';

export const userFormSchema = yup.object({
  name: yup.string().required('用户名是必填项').min(2, '用户名至少需要2个字符'),
  email: yup.string().required('邮箱是必填项').email('请输入有效的邮箱地址'),
  role: yup.string().required('角色是必填项').oneOf(['admin', 'editor', 'viewer'], '请选择有效的角色'),
  department: yup.string().required('部门是必填项'),
  status: yup.string().required('状态是必填项').oneOf(['active', 'inactive'], '请选择有效的状态'),
}); 