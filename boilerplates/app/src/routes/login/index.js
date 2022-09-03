import React, {Component} from 'react';
import { connect } from 'dva';
import { Button, Input, message, Modal, Radio, Tabs } from "antd";
import IF from '../../components/IF';
import styles from './index.less';
import loginBg from '../../assets/loginBg.png';
import md5 from 'md5';
const { TabPane } = Tabs;
class Page extends Component{

    state = {
        tabIndex:'1',
        getCodeCoolDown:false,

        credential: '',
        password: '',

        loading:false,
    }

    onTabIndexChange = (value)=>{
        this.setState({
            tabIndex:value,
        })
    }
    onCredentialChange = (e) => {
        this.setState({
            credential: e.target.value.trim(),
        })
    }

    onPasswordChange = (e) => {
        this.setState({
            password: e.target.value.trim(),
        })
    }

    commit = () => {

        // if (this.state.tabIndex === '1') {
        //     if (this.state.credential === '') {
        //         message.destroy();
        //         message.warning('账号不能为空');
        //         return;
        //     }
        //
        //     if (this.state.passwordx === '') {
        //         message.destroy();
        //         message.warning('密码不能为空');
        //         return;
        //     }
        // } else {
        //     if (this.state.mobile === '') {
        //         message.destroy();
        //         message.warning('手机号不能为空');
        //         return;
        //     }
        //
        //     if (this.state.code === '') {
        //         message.destroy();
        //         message.warning('验证码不能为空');
        //         return;
        //     }
        // }

        this.setState({
            loading: true,
            buttonText: '登录中',
        }, () => {

            if (this.state.tabIndex === '1') {
                // const { md5 } = window;
                const options = {};
                // options.userName = this.state.credential;
                // options.password = md5(this.state.password);
                options.userName = 'hema-test';
                options.password = '12345678';

                this.props.dispatch({
                    type: 'campus/login',
                    payload: options,
                    onResult: (error, result) => {
                        if (error) {
                            message.destroy();
                            message.error(error);
                            return;
                        } else {

                        }
                    }
                });
            } else if (this.state.tabIndex === '2') {
                const options = {};
                options.mobile = this.state.mobile;
                options.code = this.state.code;

                this.props.dispatch({
                    type: 'cloud/loginByMobile',
                    payload: options,
                    onResult: (error, result) => {
                        if (error) {
                            message.destroy();
                            message.error(error);
                            return;
                        }

                        this.props.dispatch({
                            type: 'cloud/getAccountListByTicket',
                            payload: {
                                ticket: result.data.ticket,
                            },
                            onResult: (err, rst) => {
                                if (err) {
                                    message.destroy();
                                    message.error(err);
                                    return;
                                }

                                // 只有一个账号，直接进入系统
                                if (rst.data.length === 1) {
                                    this.props.dispatch({
                                        type: 'cloud/loginQuickStart',
                                        payload: {
                                            ticket: result.data.ticket,
                                            userId: rst.data[0].userIdString,
                                        },
                                        onResult: (loginErr, loginResult) => {
                                            if (loginErr) {
                                                message.destroy();
                                                message.error(loginErr);
                                                return;
                                            } else {
                                                localStorage.removeItem('caseId');
                                                localStorage.removeItem('caseName');

                                                if (sessionStorage.redirectUrl) {
                                                    // 有记录 跳转回上次页面
                                                    window.location.href = sessionStorage.redirectUrl;
                                                } else {
                                                    // 无记录 跳到默认有权限的第一个页面
                                                    this.props.dispatch({
                                                        type: 'cloud/getMenuListByRole',
                                                        payload: {},
                                                        onResult: (error, result) => {
                                                            if (error) {
                                                                message.destroy();
                                                                message.error(error);
                                                                return;
                                                            }
                                                            // 转跳页面触发app.js页面中获取权限功能
                                                            if (result.data.length > 0) {
                                                                // 跳到有权限的第一个页面
                                                                let pageUrl = this.getLeafMenuKey(result.data[0]);
                                                                window.location.href = '/app/cloud' + pageUrl;
                                                            } else {
                                                                // 无可用页面，跳到无权限页面
                                                                window.location.href = '/app/cloud/help/noAccess';
                                                            }
                                                        }
                                                    });
                                                }
                                                this.props.dispatch({
                                                    type: 'cloud/getUserInfo',
                                                    payload: {},
                                                    onResult: (infoError, infoResult) => {

                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                                else {
                                    this.setState({
                                        ticket: result.data.ticket,
                                        accountList: rst.data,
                                        showModal: true,
                                    })
                                }

                            }
                        })

                    }
                });
            }

        });
    }



    render(){
        return <div className={styles.page}>

            <div className={styles.contentBox}>
                <div className={styles.leftPart}>
                    <img src={loginBg} />
                </div>
                <div className={styles.rightPart}>
                    <div className={styles.title}>智慧校园</div>
                    <div className={styles.subTitle}>让运动被看到</div>
                    <Tabs
                        onChange={this.onTabIndexChange}
                        activeKey={this.state.tabIndex}
                    >
                        <TabPane tab="账号登录" key="1">
                        </TabPane>
                        <TabPane tab="手机验证码登录" key="2">
                        </TabPane>
                    </Tabs>
                    <IF if={this.state.tabIndex === '1'}>
                        <div className={styles.inputBox}>
                            <Input bordered={false}
                                   value={this.state.credential}
                                   onChange={this.onCredentialChange}
                                   placeholder={'账号'}
                                   style={{
                                       height: 48,
                                       fontSize: 18,
                                       marginLeft: -11,
                                   }} />
                        </div>
                        <div className={styles.inputBox}>
                            <Input.Password bordered={false}
                                            value={this.state.password}
                                            onChange={this.onPasswordChange}
                                            placeholder={'密码'}
                                            style={{
                                                height: 48,
                                                fontSize: 24,
                                                marginLeft: -11,
                                            }} />
                        </div>
                    </IF>
                    <IF if={this.state.tabIndex === '2'}>
                        <div className={styles.inputBox}>
                            <IF if={this.state.getCodeCoolDown === false}>
                                <Button type={'text'}
                                        onClick={this.onGetVerificationCodeByMobile}
                                        disabled={this.state.disableGetCode}
                                        className={styles.getCodeBtn}>获取验证码</Button>
                            </IF>

                            <IF if={this.state.getCodeCoolDown === true}>
                                <div
                                    className={styles.codeAlreadyDelivered}>已发送({(60 - this.state.count) > 1 ? (60 - this.state.count) : 1}S)
                                </div>
                            </IF>
                            <Input bordered={false}
                                   value={this.state.mobile}
                                   onChange={this.onMobileChange}
                                   placeholder={'请输入手机号'}
                                   style={{
                                       height: 48,
                                       fontSize: 18,
                                       marginLeft: -11,
                                   }} />
                        </div>
                        <div className={styles.inputBox}>
                            <Input bordered={false}
                                   value={this.state.code}
                                   onChange={this.onCodeChange}
                                   placeholder={'请输入验证码'}
                                   style={{
                                       height: 48,
                                       fontSize: 18,
                                       marginLeft: -11,
                                   }} />
                        </div>
                    </IF>
                    <Button block type='primary' size='large' className={styles.commitButton}
                            onClick={this.commit}>登录</Button>
                </div>
            </div>

        </div>
    }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(Page);
