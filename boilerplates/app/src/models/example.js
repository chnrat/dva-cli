import * as exampleService from '../services/example';
export default {

  namespace: 'example',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line

    },
  },

  effects: {
    * login({ payload: options, onResult }, { call, put }) {
      const result = yield call(exampleService.login, options);
      if (result && result.success) {
        onResult && onResult(null, result);
      } else {
        onResult && onResult(result && result.msg ? result.msg : '服务异常,请稍后尝试', null)
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
