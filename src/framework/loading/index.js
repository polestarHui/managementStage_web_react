import React from 'react';
import style from './style.less';

export default function loadComponent(props) {
  if (props && props.error) {
    console.error(props.error);
  }

  return (
    <div className={style.loading}>
      <div className={style.inner}>
        <div className={style.pic} />
      </div>
    </div>
  );
}
