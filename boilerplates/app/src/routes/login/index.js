import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, message, Modal, Radio, Tabs } from "antd";
import styles from './index.less';
import IF from '../../components/IF';
import loginBg from '../../assets/loginBg.png';
import md5 from 'md5';

const { TabPane } = Tabs;

class Page extends Component {

  state = {
    credential: '',
    password: '',

    loading: false,
    buttonText: '登录',

    tabIndex: '1',

    mobile: '',
    code: '',
    disableGetCode: true,
    getCodeCoolDown: false,

    accountList: [],
    showModal: false,
    userIdString: '',
    ticket: '',
    count: 0,
  }

  componentDidMount() {

  }

  componentWillMount() {

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

  onMobileChange = (e) => {
    this.setState({
      mobile: e.target.value.trim(),
    }, () => {
      let mobileReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (mobileReg.test(this.state.mobile)) {
        this.setState({
          disableGetCode: false,
        })
      } else {
        this.setState({
          disableGetCode: true,
        })
      }
    })
  }

  onCodeChange = (e) => {
    this.setState({
      code: e.target.value.trim(),
    })
  }

  commit = () => {

    if (this.state.tabIndex === '1') {
      if (this.state.credential === '') {
        message.destroy();
        message.warning('账号不能为空');
        return;
      }

      if (this.state.passwordx === '') {
        message.destroy();
        message.warning('密码不能为空');
        return;
      }
    } else {
      if (this.state.mobile === '') {
        message.destroy();
        message.warning('手机号不能为空');
        return;
      }

      if (this.state.code === '') {
        message.destroy();
        message.warning('验证码不能为空');
        return;
      }
    }

    this.setState({
      loading: true,
      buttonText: '登录中',
    }, () => {

      if (this.state.tabIndex === '1') {
        // const { md5 } = window;
        const options = {};
        options.credential = this.state.credential;
        options.passwordx = md5(this.state.password);

        this.props.dispatch({
          type: 'cloud/login',
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

  onTabIndexChange = (key) => {
    this.setState({
      tabIndex: key,
    });
  }

  onGetVerificationCodeByMobile = () => {

    if (this.isGettingCode === true) {
      return;
    }

    this.isGettingCode = true;
    setTimeout(() => {
      this.isGettingCode = false;
    }, 3000);

    this.props.dispatch({
      type: 'cloud/getVerificationCodeByMobile',
      payload: {
        mobile: this.state.mobile,
        purpose: '100'
      },
      onResult: (error, result) => {
        if (error) {
          message.destroy();
          message.error(error);
          return;
        }

        this.setState({
          getCodeCoolDown: true,
          count: 0,
        }, () => {
          this.loopCoolDown();
        })

        message.destroy();
        message.success('验证码已发送至手机，请查收');
      }
    });
  }

  loopCoolDown = () => {
    if (this.loopId) {
      clearTimeout(this.loopId);
    }
    this.loopId = setTimeout(() => {
      this.setState({
        count: this.state.count + 1,
        getCodeCoolDown: (this.state.count + 1) >= 60 ? false : true,
      }, () => {
        console.log(this.state.count);
        if (this.state.count >= 60) {
          clearTimeout(this.loopId);
        } else {
          this.loopCoolDown();
        }
      })
    }, 1000)
  }


  onModalOK = () => {
    this.setState({
      showModal: false,
    }, () => {
      this.props.dispatch({
        type: 'cloud/loginQuickStart',
        payload: {
          ticket: this.state.ticket,
          userId: this.state.userIdString,
        },
        onResult: (loginErr, loginResult) => {
          if (loginErr) {
            message.destroy();
            message.error(loginErr);
            return;
          } else {

          }
        }
      });
    })
  }

  onModalCancel = () => {
    this.setState({
      showModal: false,
    })
  }

  onClickNickName = (userIdString) => {
    this.setState({
      userIdString,
    })
  }

  render() {
    return <div className={styles.page}>
      <Modal
        destroyOnClose={true}
        wrapClassName={styles.accountListModal}
        width={600}
        // bodyStyle={{ minHeight: 440 }}
        title={'检测到多个关联账号，请选择需要登录的账号'}
        visible={this.state.showModal}
        maskClosable={false}
        onOk={this.onModalOK}
        onCancel={this.onModalCancel}
      >
        <div className={styles.listHeader}>
          <div className={styles.name}>昵称</div>
          <div className={styles.type}>机构</div>
          <div className={styles.email}>关联邮箱</div>
        </div>
        <div className={styles.listBox}>
          {
            this.state.accountList.map((item, index) => {
              return <div className={styles.listItem} key={index}>
                <div className={styles.name}>
                  <Radio
                    checked={this.state.userIdString === item.userIdString}
                    onClick={() => { this.onClickNickName(item.userIdString) }}>{item.nickName}</Radio>
                </div>
                <div className={styles.type}>{item.tenantName}</div>
                <div className={styles.email}>{item.email}</div>
              </div>
            })
          }
        </div>
      </Modal>
      <div className={styles.leftPart}></div>
      <div className={styles.rightPart}>
        <div className={styles.imgBox}>
          <img src={loginBg} />
        </div>
        <div className={styles.grading}></div>
        <div className={styles.contentBox}>
          <div className={styles.loginBox}>
            <div className={styles.title}>管控台</div>
            <div className={styles.subTitle}></div>
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
    </div>
  }
}


const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(Page);
