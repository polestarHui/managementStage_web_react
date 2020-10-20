import React from 'react';
import style from './style.less';
import { Select, Button, message } from 'antd';
const { Option } = Select;

function handleChange(value) {
  // console.log(`selected ${value}`);
}
class Infromation extends React.Component {
  constructor(props) {
    super(props);
  }
  // 确认修改
  certainBtn = () => {
    message.success('密码修改成功');
  };
  render() {
    return (
      <div className={style.setWrap}>
        <div className={style.title}>设置我的资料</div>
        <div className={style.itemWrap}>
          {/* <div className={style.item}>
            <div>我的角色</div>
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="jack">超级管理员</Option>
              <Option value="lucy">管理员</Option>
            </Select>
          </div> */}
          <div className={style.item}>
            <div className={style.nameUser}>用户名称</div>
            <input></input>
          </div>
          <div className={style.item}>
            <div className={style.nameUser}>
              昵称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <input></input>
          </div>
          <div className={style.item}>
            <div className={style.nameUser}>
              手机&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <input></input>
          </div>
          <div className={style.item}>
            <div className={style.nameUser}>
              邮箱&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <input></input>
          </div>
          <div className={style.item}>
            <div className={style.nameUser}>
              备注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <textarea></textarea>
          </div>
        </div>
        <Button
          style={{ marginLeft: '7.5%', marginBottom: '10px' }}
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
export default Infromation;
