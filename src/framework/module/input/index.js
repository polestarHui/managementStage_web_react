import React from 'react';
import style from './style.less';
import classnames from 'classnames';

export class ClimberInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onClickIcon() {
    let { value } = this.state;
    let { onSearch } = this.props;
    if (typeof onSearch === 'function') {
      onSearch(value);
    }
  }

  onInput(evt) {
    let { onChange } = this.props;
    let { value } = evt.target;
    this.setState(
      {
        value,
      },
      () => (typeof onChange === 'function' ? onChange(value) : ''),
    );
  }

  componentDidMount() {
    let _this = this;
    let { onSearch } = this.props;
    this.inputDom.addEventListener('keypress', function(evt) {
      if (evt.keyCode === 13) {
        let { value } = _this.state;
        if (typeof onSearch === 'function') {
          onSearch(value);
        }
      }
    });
  }

  render() {
    let { value } = this.state;

    let { className: customClass, placeholder, icon, type } = this.props;

    return (
      <div className={classnames(style.input, customClass ? customClass : '')}>
        {icon ? <a onClick={::this.onClickIcon}>{icon}</a> : ''}
        <input
          ref={e => (this.inputDom = e)}
          value={value}
          type={type || 'text'}
          placeholder={placeholder || '请输入'}
          onChange={::this.onInput}
        />
      </div>
    );
  }
}
