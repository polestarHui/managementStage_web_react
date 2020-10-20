import { message } from 'antd';

export let result = function(data, callback) {
  let { code, msg } = data;
  if (typeof msg === 'undefined') msg = data.message;
  if (typeof code === 'undefined') code = data.status;
  if (!msg) return;
  if (code === 0) {
    message.success(msg);
    if (typeof callback === 'function') {
      try {
        callback(data);
      } catch (e) {
        // console.log(e);
      }
    }
  } else {
    message.warning(msg);
  }
};
