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
            sails.after(eventsToWaitFor, () => {
                violate();
                return cb();

            });
        },

        routes: {
            before: {
                'all /*': (req, res, next) => {
                    //如配置不允许入参为null,删除入参值为null的属性
                    if (_.has(sails.config.http, 'params.allowNull')
                        && !sails.config.http.params.allowNull) {
                        _.each(req.allParams(), (value, key) => {
                            if (_.isNull(value)) {
                                if (_.has(req.params, key)) return delete req.params[key];
                                if (_.has(req.body, key)) return delete req.body[key];
                                if (_.has(req.query, key)) return delete req.query[key];
                            }
                        });
                    }
                    res.badRequest = require('./api/responses/badRequest')(req, res);
                    return next();
                }
            }
        }
    }

};
