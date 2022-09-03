import * as campusService from '../services/campus';
export default {

  namespace: 'campus',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      
    },
  },

  effects: {
    * login({ payload: options, onResult }, { call, put }) {
      const result = yield call(campusService.login, options);

      // debugger;

      if (result && result.success) {
        onResult && onResult(null, result);
      } else {

        // 返回格式
        // code: "200"
        // data: "16620233956221"
        // msg: "请求成功"
        // requestId: "3a85f704f0c14aa09b8722065f529e11"
        // success: true

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
