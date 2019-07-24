import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import { queryUser } from "@/services/authority";
import { message } from 'antd';

export default {
  namespace: 'authority',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 获取列表数据
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);

      let code = response.code;
      if (code === 200){
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error( response.msg );
      }

    },

    // *add({ payload, callback }, { call, put }) {
    //   const response = yield call(addRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
    // *remove({ payload, callback }, { call, put }) {
    //   const response = yield call(removeRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
    // *update({ payload, callback }, { call, put }) {
    //   const response = yield call(updateRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
