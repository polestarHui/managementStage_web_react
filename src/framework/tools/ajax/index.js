import $ from 'jquery';
import * as event from '../event';
import React from 'react';
import loadComponent from '../../loading';
import { history } from 'umi';
let ajaxSize = 0;

export class Loading extends React.Component {
  componentDidMount() {
    let _this = this;
    let { loadingdom } = this;
    this.loading = $(loadingdom);

    this.startEvent = function() {
      _this.show();
    };
    this.stopEvent = function() {
      _this.hide();
    };
    event.bind('ajax.start', this.startEvent);
    event.bind('ajax.stop', this.stopEvent);

    this.loading.appendTo('body');
    this.loading.stop().fadeOut('fast');
  }

  show() {
    try {
      let { loading } = this;
      if (loading && typeof loading.stop === 'function') {
        loading.stop().fadeIn('fast');
      }
    } catch (e) {
      console.error(e);
    }
  }

  hide() {
    let { loading } = this;
    if (ajaxSize < 0) ajaxSize = 0;
    if (ajaxSize === 0) loading.stop().fadeOut('fast');
  }

  componentWillUnmount() {
    this.loading.remove();
    this.size = 0;
    event.unbind('ajax.start', this.startEvent);
    event.unbind('ajax.stop', this.stopEvent);
  }

  render() {
    let loadingStyle = {
      position: 'fixed',
      zIndex: 9999999999,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'block',
    };

    return (
      <div style={loadingStyle} ref={e => (this.loadingdom = e)}>
        {loadComponent()}
      </div>
    );
  }
}

let filters = [];

export let filter = function(callback) {
  filters.push(callback);
};

export let removeFilter = function(callback) {
  filters.remove(callback);
};

let callFilter = (index, xhr, status, setting) => {
  if (index + 1 > filters.length) {
    return true;
  }
  let callback = filters[index];
  let next = true;
  if (typeof callback === 'function') {
    try {
      next = callback(xhr, status, setting);
      if (typeof next !== 'boolean') next = true;
    } catch (e) {
      // console.log(e);
    }
  }
  //执行下一个
  if (next) {
    index++;
    return callFilter(index, xhr, status, setting);
  } else {
    return next;
  }
};

export let post = function(url, data, callback) {
  if (data instanceof FormData) {
    return request({
      url: url,
      data: data,
      type: 'post',
      contentType: false,
      processData: false,
      success: callback,
    });
  } else {
    return request({
      url: url,
      data: data,
      type: 'post',
      success: callback,
    });
  }
};

export let get = function(url, data, callback) {
  return request({
    url: url,
    data: data,
    type: 'get',
    success: callback,
  });
};

export let del = function(url, data, callback) {
  return request({
    url,
    data,
    type: 'delete',
    success: callback,
  });
};

export let request = function(setting) {
  ajaxSize++;
  event.trigger('ajax.start');
  let config = {
    dataType: 'json',
    traditional: true,
  };
  $.extend(config, setting);
  config.success = null;
  config.error = null;
  config.complete = function(xhr, status) {
    ajaxSize--;
    let goon = callFilter(0, xhr, status, config);
    if (!goon) {
      event.trigger('ajax.stop');
      return false;
    }
    if (typeof setting.success === 'function' && xhr.status === 200) {
      try {
        let data = xhr.responseText;
        if (config.dataType === 'json') data = xhr['responseJSON'];
        setting.success(data);
      } catch (e) {}
    }
    if (xhr.status === 401) {
      history.push('/login');
      event.trigger('ajax.stop');
    }
    if (typeof setting.complete === 'function') {
      try {
        setting.complete(xhr, status);
      } catch (e) {
        // console.log(e);
      }
    }
    setTimeout(() => {
      event.trigger('ajax.stop');
    }, 400);
  };
  let ajax = $.ajax(config);
  return ajax;
};
