import React from 'react';
import styles from './index.less';
import { history } from 'umi';
export default () => {
  history.push('/login');
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
