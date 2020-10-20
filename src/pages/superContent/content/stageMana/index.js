import React from 'react';
import style from './style.less';
import AddStage from './addStage';
import StagePower from './stagePower';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

function callback(key) {
  // console.log(key);
}
class StageMana extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="平台管理" key="1">
            <AddStage></AddStage>
          </TabPane>
          <TabPane tab="平台授权" key="2">
            <StagePower></StagePower>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default StageMana;
