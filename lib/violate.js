/**
 * @Filename violate.js
 * @Description
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */
const validate = require('./methods/validate');
const create = require('./methods/create');
const createEach = require('./methods/create-each');
const findOrCreate = require('./methods/find-or-create');
const update = require('./methods/update');
const updateOne = require('./methods/updateOne');

const ViolationError = require('./error');
const getBusinessErrorMessage = require('../utils/get-business-error-message');
const util = require('util');

module.exports = () => {


    _.forEach(sails.models, model => {
        validate(model);
        create(model);
        createEach(model);
        findOrCreate(model);
        update(model);
        updateOne(model);
    });

    //动态生成自定义的异常类
    let dynamicErrorFunc = (businessError) => {
        if (businessError instanceof Error) return businessError;
        if (!_.isObject(businessError)) throw new Error('businessError must be a object.');

        let BusinessError = function (msg, code) {
            new BusinessError.super_(this.message, this.code);
            this.message = msg || getBusinessErrorMessage(businessError.funcName, businessError.message);
            this.code = code || businessError.code;
        };
        util.inherits(BusinessError, ViolationError);
        return BusinessError;
    };

    _.forEach(sails.config.http.businessErrors, (businessError, key) => {
        businessError.funcName = key;
        global[key] = dynamicErrorFunc(businessError);
    });


};
