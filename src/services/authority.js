import { stringify } from 'qs';
import request from '@/utils/request';

// 查询用户列表
export async function queryUser(params) {
  return request(`/authority/user/queryUser?${stringify(params)}`);
}
