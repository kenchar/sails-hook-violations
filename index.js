/**
 * @Filename index.js
 * @Description model的校验字段自定义信息
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */
const violate = require('./lib/violate');
module.exports = sails => {

  return {

    initialize: cb => {

      var eventsToWaitFor = ['hook:orm:loaded', 'hook:pubsub:loaded'];
      sails.after(eventsToWaitFor,() => {

        violate();
        return cb();

      });
    }
  }

};
