import * as yup from 'yup';

export const userFormSchema = yup.object({
  name: yup.string().required('名称是必填项').min(2, '名称至少需要2个字符'),
  sql_query: yup.string().required('SQL查询是必填项'),
  injest_type: yup.string().required('摄取类型是必填项').oneOf(['batch', 'streaming', 'incremental', 'full'], '请选择有效的摄取类型'),
  enabled: yup.boolean().required('是否启用是必填项'),
  created_timestamp: yup.string().required('创建时间是必填项')
}); 