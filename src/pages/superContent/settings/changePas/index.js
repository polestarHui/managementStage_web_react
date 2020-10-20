import React from 'react';
import style from './style.less';
import { Button, message } from 'antd';

class Password extends React.Component {
  constructor(props) {
    super(props);
  }

  // 确认修改
  certainBtn = () => {
    message.success('密码修改成功');
  };

  render() {
    return (
      <div className={style.pasWrap}>
        <div className={style.title}>修改密码</div>
        <div className={style.itemWrap}>
          <div className={style.item}>
            <div>当前密码&nbsp;&nbsp;&nbsp;</div>
            <input></input>
          </div>
          <div className={style.item}>
            <div>新密码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <input></input>
          </div>
          <div className={style.item}>
            <div>确认新密码</div>
            <input></input>
          </div>
        </div>
        <Button
          style={{ marginLeft: '7.5%' }}
          type="primary"
          size={'large'}
          onClick={this.certainBtn}
        >
          确认修改
        </Button>
      </div>
    );
  }
}
export default Password;
