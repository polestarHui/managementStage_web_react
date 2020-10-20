import React from 'react';
import style from './style.less';
import Rolegl from './rolegl/index.js';
import Recoursegl from './recoursegl/index.js';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

class Role extends React.Component {
  constructor(props) {
    super(props);
  }

  callback = key => {
    // console.log(key);
  };

  render() {
    return (
      <div className={style.recouseMain}>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="角色管理" key="1">
            <Rolegl appId={this.props.projectId} />
          </TabPane>
          <TabPane tab="资源管理" key="2">
            <Recoursegl appId={this.props.projectId} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default Role;
