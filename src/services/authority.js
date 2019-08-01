import { stringify } from 'qs';
import request from '@/utils/request';

// 查询用户列表
export async function queryUser(params) {
  return request(`/authority/user/queryUser?${stringify(params)}`);
}

// 删除选中的用户列表
export async function removeUser(params) {
  return request(`/authority/user/removeUser`,{
    method: 'DELETE',
    body: { ...params},
  });
}

// 提交用户（添加和更新）
export async function submitUser(params) {
  return request(`/authority/user/submitUser`, {
    method: 'POST',
    body: { ...params},
  });
}
