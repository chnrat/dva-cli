import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Layout, Menu} from 'antd';
import {withRouter} from 'dva/router'
import styles from './app.less';

const {Header, Content, Footer, Sider} = Layout;

class App extends Component {

  state = {
    currentMenuKey: '1'
  }

  componentDidMount() {
  }

  render() {
    let {children, dispatch, app, loading, location} = this.props;

    return (<div>
        <Layout className={styles.layout}>
          <Content>
            {children}
          </Content>
        </Layout>
      </div>)
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default withRouter(connect(({app, loading}) => ({app, loading}))(App))
