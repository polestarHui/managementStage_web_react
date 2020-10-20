import './array';

let events = {};

export let trigger = function(name, params) {
  let array = events[name];
  if (!array) {
    return;
  }
  array.forEach(function(callback) {
    try {
      if (typeof callback === 'function') callback(params);
    } catch (e) {
      //console.log(e);
    }
  });
};

export let bind = function(name, callback) {
  let array = events[name];
  if (!array) {
    events[name] = [];
    array = events[name];
  }
  array.push(callback);
};

export let unbind = function(name, callback) {
  if (typeof callback === 'function') {
    let array = events[name];
    if (!array) return;
    array.remove(callback);
    events[name] = array;
  } else {
    events[name] = [];
  }
};
