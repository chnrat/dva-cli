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
        if (window.location.pathname === '/app/campus/fieldManager') {
            this.setState({
                currentMenuKey: '1'
            })
        } else if (window.location.pathname === '/app/campus/fileManager') {
            this.setState({
                currentMenuKey: '2'
            })
        } else if (window.location.pathname === '/app/campus/testManager') {
            this.setState({
                currentMenuKey: '3'
            })
        } else if (window.location.pathname === '/app/campus/homeworkManager') {
            this.setState({
                currentMenuKey: '4'
            })
        }
    }

    onClickMenuItem = (e) => {
        this.setState({
            currentMenuKey: e.key,
        }, () => {
            if (e.key === '1') {
                this.props.history.push({
                    pathname: '/app/campus/fieldManager',
                });
            } else if (e.key === '2') {
                this.props.history.push({
                    pathname: '/app/campus/fileManager',
                });
            } else if (e.key === '3') {
                this.props.history.push({
                    pathname: '/app/campus/testManager',
                });
            } else if (e.key === '4') {
                this.props.history.push({
                    pathname: '/app/campus/homeworkManager',
                });
            }

        })
    }

    render() {
        let {children, dispatch, app, loading, location} = this.props;

        if (window.location.pathname === '/app/campus/login') {
            return (
                <div>
                    <Layout className={styles.layout}>
                        <Content className={styles.loginContent}>
                            {children}
                        </Content>
                    </Layout>
                </div>
            )
        } else {
            return (
                <div>
                    <Layout className={styles.layout}>
                        <Header className={styles.header}>Header</Header>
                        <Layout>
                            <Sider className={styles.leftSider}>
                                <Menu
                                    selectedKeys={this.state.currentMenuKey}
                                >
                                    <Menu.Item
                                        key={'1'}
                                        onClick={this.onClickMenuItem}
                                    >菜单项一</Menu.Item>
                                    <Menu.Item
                                        key={'2'}
                                        onClick={this.onClickMenuItem}
                                    >菜单项二</Menu.Item>
                                    <Menu.Item
                                        key={'3'}
                                        onClick={this.onClickMenuItem}
                                    >菜单项三</Menu.Item>
                                    <Menu.Item
                                        key={'4'}
                                        onClick={this.onClickMenuItem}
                                    >菜单项四</Menu.Item>
                                </Menu>
                            </Sider>
                            <Content>
                                {children}
                            </Content>
                        </Layout>
                    </Layout>
                </div>
            )
        }

    }
}

// const App = ({children, dispatch, app, loading, location}) => {
//
//     return (
//         <div>
//             <Layout className={styles.layout}>
//                 <Content className={styles.content}>
//                     {children}
//                 </Content>
//             </Layout>
//         </div>
//     )
// }

App.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
    loading: PropTypes.object,
}

export default withRouter(connect(({app, loading}) => ({app, loading}))(App))
