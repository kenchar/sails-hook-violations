/**
 * @Filename find-or-create.js
 * @Description 扩展原生的findOrCreate,支持model内自定义校验信息
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */

const getModelViolationMessage = require('../../utils/get-model-violation-message');
const getRuleByExceptionMessage = require('../../utils/get-rule-by-exception-message');

const ViolateError = require('../error');

const parley = require('parley');
const getQueryModifierMethods = require('waterline/lib/waterline/utils/query/get-query-modifier-methods');

const DEFERRED_METHODS = getQueryModifierMethods('findOrCreate');

const ATTR_NAME_REG_EXP = /\`(.+?)\`/ig;

/**
 * @param model
 * @error
 */
module.exports = model => {

    let sailsFindOrCreate = model.findOrCreate;

    let sailsFindOrCreateCall = (criteria, newRecord, explicitCbMaybe, metaContainer) => {

        sailsFindOrCreate
            .call(model, criteria, newRecord, (err, result) => {
                let detailMessage;
                let message;
                if (err) {
                    switch (err.code) {
                    /**
                     *  @property {String} code
                     *    E_INVALID_NEW_RECORDS
                     *  @property {String} details
                     *    e.g
                     *     Could not use specified `generalCaseField`.  Violated one or more validation rules:\n  • Value (\'test value\') was not in the configured whitelist (boy, girl)\n
                     */
                        case 'E_INVALID_NEW_RECORD':
                            detailMessage = err.details;
                            //异常信息未直接给出异常的属性名称，通过正则匹配异常信息体里的属性名称（`属性名称`）
                            if (new RegExp(ATTR_NAME_REG_EXP).test(detailMessage)) {
                                let attrName = new RegExp(ATTR_NAME_REG_EXP).exec(detailMessage)[1];
                                /**
                                 * 异常信息内未给出具体的异常类型，通过反向查找对应的rule名称
                                 * 具体规则输出message见node_modules\anchor\lib\rules.js
                                 */
                                let ruleName = getRuleByExceptionMessage(detailMessage);
                                message = getModelViolationMessage(model, attrName, ruleName);
                                err = new ViolateError(message || detailMessage, err.code);
                                err.detail = detailMessage;
                            }
                            break;
                    /**
                     *  @property {String} code
                     *    E_UNIQUE
                     *  @property {String} message
                     *    Would violate uniqueness constraint-- a record already exists with conflicting value(s).
                     *  @property {String} modelIdentity
                     *  @property {Array} attrNames
                     *    ["generalCaseField"]
                     */
                        case 'E_UNIQUE':
                            detailMessage = err.message;
                            message = getModelViolationMessage(model, err.attrNames[0], 'unique');
                            err = new ViolateError(message || detailMessage, err.code);
                            err.detail = detailMessage;
                            break;
                    }
                    return explicitCbMaybe(err);
                }
                return explicitCbMaybe(undefined, result);
            }, metaContainer);
    };

    let findOrCreate = (criteria, newRecord, explicitCbMaybe, metaContainer) => {

        let WLModel = model;
        let modelIdentity = model.identity;

        return new parley(function (done) {
            sailsFindOrCreateCall(this._wlQueryInfo ? this._wlQueryInfo.criteria : criteria,
                this._wlQueryInfo ? this._wlQueryInfo.newRecord : newRecord,
                done,
                this._wlQueryInfo ? this._wlQueryInfo.meta : metaContainer);
        }, explicitCbMaybe, _.extend(DEFERRED_METHODS, {
            _WLModel: WLModel,
            _wlQueryInfo: {
                method: 'findOrCreate',
                using: modelIdentity,
                criteria: criteria,
                newRecord: newRecord,
                meta: metaContainer
            }
        }))
    };

    model.findOrCreate = findOrCreate;

};
