import React from 'react';
import style from './style.less';
import account from '../../../assets/login/account.png';
import pas from '../../../assets/login/pas2.png';
import yan from '../../../assets/login/yan.png';
import $ from 'jquery';
import { history } from 'umi';
import { message } from 'antd';
import * as ajax from '../../framework/tools/ajax/index.js';
import { hex_md5 } from '../../framework/tools/md5.js';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      pwd: '',
      yzm: '',
      yamUrl: '/api/image/code/get?' + Math.random(),
    };
  }

  // 登录
  goLogin = () => {
    let { userName, pwd, yzm } = this.state;
    if (userName === '') {
      message.error('请输入用户名！');
      return false;
    }
    if (pwd === '') {
      message.error('请输入用户名！');
      return false;
    }
    if (yzm === '') {
      message.error('请输入验证码！');
      return false;
    }
    ajax.post(
      '/api/account/login',
      {
        username: userName,
        password: hex_md5(pwd),
        remember: true,
        code: yzm,
      },
      res => {
        if (res.status === 0) {
          // 顶部列表
          ajax.get(
            '/mod/account/rest/access/resource/get/resource',
            {
              appId: 1,
            },
            res => {
              if (res.data.data.length == 0) {
                history.push({
                  pathname: '/superContent/content',
                  state: { topNum: 10, projectId: 1 },
                  query: { status: Math.random() },
                });
              } else {
                history.push({
                  pathname: '/superContent/content',
                  state: { topNum: 1, projectId: 1 },
                  query: { status: Math.random() },
                });
              }
              // console.log('顶部的信息', res);
            },
          );
        } else {
          message.error(res.message);
        }
      },
    );
  };
  userChange = e => {
    this.setState({
      userName: e.target.value,
    });
  };
  userPwd = e => {
    this.setState({
      pwd: e.target.value,
    });
  };
  yzmChange = e => {
    this.setState({
      yzm: e.target.value,
    });
  };

  //点击获取验证码
  getYanImg = e => {
    this.setState({
      yamUrl: '/api/image/code/get?' + Math.random(),
    });
  };

  render() {
    let { userName, pwd, yzm, yamUrl } = this.state;
    return (
      <div className={style.loginWrap}>
        <div className={style.leftPart}>
          <div>水木联合后台管理系统</div>
        </div>
        <div className={style.rightPart}>
          <div className={style.rightBox}>
            <div className={style.item}>
              <img src={account} />
              <input
                id="account"
                value={userName}
                onChange={this.userChange}
                placeholder="请输入您的账号"
              ></input>
            </div>
            <div className={style.item}>
              <img src={pas} />
              <input
                value={pwd}
                onChange={this.userPwd}
                type="password"
                placeholder="请输入您的密码"
              ></input>
            </div>
            <div className={style.item}>
              <img src={yan} />
              <input
                value={yzm}
                onChange={this.yzmChange}
                placeholder="请输入验证码"
              ></input>
              <span>
                <img
                  style={{ width: '90px' }}
                  onClick={this.getYanImg}
                  src={yamUrl}
                  alt="验证码"
                />
              </span>
            </div>
            <div className={style.loginBtn} onClick={this.goLogin}>
              登录
            </div>
            <a href="http://www.tangmix.com/" target="_blank">
              北京水木联合科技有限公司@tangmix.com
            </a>
          </div>
        </div>
      </div>
    );
  }
}
