import React from 'react';
import style from './style.less';
import Password from './changePas';
import Infromation from './baseInfo';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Password></Password>
        <Infromation></Infromation>
      </div>
    );
  }
}
