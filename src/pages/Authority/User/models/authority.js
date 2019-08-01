import { queryUser, removeUser, submitUser } from "@/services/authority";
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

    *submit({ payload, callback }, { call, put }) {
      const response = yield call(submitUser, payload);

      if (callback && typeof callback === 'function') callback(response);
    },

    // 删除
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);

      if (callback && typeof callback === 'function') callback(response);
    },
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
        data: { ...action.payload},
      };
    },
  },
};
