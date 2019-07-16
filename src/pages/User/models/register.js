import { fakeRegister } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import router from 'umi/router';
import { message } from 'antd';

export default {
  namespace: 'register',

  state: {

  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });

      if (response.code === 1){
        // 页面跳转成功页
        router.push({
          pathname: '/user/login',
        });
        message.info("注册成功,请登录！");
      } else {
        message.error(response);
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        // code: payload.code,
        // msg: payload.msg,
      };
    },
  },
};
