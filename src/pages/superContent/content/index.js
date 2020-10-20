import React from 'react';
import style from './style.less';
import Personel from './personel';
import Role from './role';
import Resources from './resources';
import StageMana from './stageMana';
import { history } from 'umi';
export default class extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { topNum, projectId } = this.props.location.state;
    if (topNum === 1 || topNum === 0) {
      return <Personel projectId={projectId}></Personel>;
    } else if (topNum === 2) {
      return <Resources projectId={projectId}></Resources>;
    } else if (topNum === 4) {
      return <Role projectId={projectId}></Role>;
    } else if (topNum === 5) {
      return <StageMana projectId={projectId}></StageMana>;
    } else {
      return <div></div>;
    }
  }
}
