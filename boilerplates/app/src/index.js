import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import router from './router';
import {message} from "antd";
import exampleModel from './models/example';
import './index.less';

const ERROR_MSG_DURATION = 3; // 3 秒

const app = dva({
  history: createHistory(),
  onError (error) {
     message.error(error.message)
   },
});

app.model(exampleModel);

app.router(router);

app.start('#root');

export default app._store; // eslint-disable-line
