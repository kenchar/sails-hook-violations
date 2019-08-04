/**
 * @Filename index.js
 * @Description model的校验字段自定义信息
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */
const violate = require('./lib/violate');
const path = require('path');
module.exports = sails => {

    return {

        initialize: cb => {

            var eventsToWaitFor = ['hook:orm:loaded', 'hook:pubsub:loaded'];
            sails.after(eventsToWaitFor, () => {
                violate();
                return cb();

            });
        },

        loadModules: function (cb) {
            let responsePath = path.resolve(__dirname, './api/responses');
            sails.modules.loadResponses(function loadedRuntimeErrorModules(err, responseDefs) {
                if (err) {
                    return cb(err);
                }

                _.extend(sails.hooks.responses.middleware, {
                    badRequest: require(path.resolve(responsePath, 'badRequest'))
                });
                _.defaults(responseDefs, sails.hooks.responses.middleware);
                sails.hooks.responses.middleware = responseDefs;
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
                    return next();
                }
            }
        }
    }

};
