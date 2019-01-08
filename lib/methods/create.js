/**
 * @Filename create.js
 * @Description 扩展原生的create,支持model内自定义校验信息
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */

const getModelViolationMessage = require('../../utils/get-model-violation-message');
const getRuleByExceptionMessage = require('../../utils/get-rule-by-exception-message');

const ViolateError = require('../error');

const parley = require('parley');
const getQueryModifierMethods = require('waterline/lib/waterline/utils/query/get-query-modifier-methods');

const DEFERRED_METHODS = getQueryModifierMethods('create');

const ATTR_NAME_REG_EXP = /\`(.+?)\`/ig;

/**
 * @param model
 * @error
 */
module.exports = model => {

  let sailsCreate = model.create;

  let sailsCreateCall = (newRecord, explicitCbMaybe, metaContainer) => {

    sailsCreate
      .call(model, newRecord, (err, result) => {
        if (err) {
          switch (err.code) {
          /**
           *  @property {String} code
           *    E_INVALID_VALUES_TO_SET
           *  @property {String} details
           *    e.g
           *     Could not use specified `generalCaseField`.  Violated one or more validation rules:\n  • Value (\'test value\') was not in the configured whitelist (male, female)\n
           */
            case 'E_INVALID_NEW_RECORD':
              let detailMessage = err.details;
              //异常信息未直接给出异常的属性名称，通过正则匹配异常信息体里的属性名称（`属性名称`）
              if (new RegExp(ATTR_NAME_REG_EXP).test(detailMessage)) {
                let attrName = new RegExp(ATTR_NAME_REG_EXP).exec(detailMessage)[1];
                /**
                 * 异常信息内未给出具体的异常类型，通过反向查找对应的rule名称
                 * 具体规则输出message见node_modules\anchor\lib\rules.js
                 */
                let ruleName = getRuleByExceptionMessage(detailMessage);
                err = new ViolateError(getModelViolationMessage(model, attrName, ruleName), err.code);
                err.detail = detailMessage;
              }
              break;
          }
          return explicitCbMaybe(err);
        }
        return explicitCbMaybe(undefined, result);
      }, metaContainer);
  };

  let create = (newRecord, explicitCbMaybe, metaContainer) => {

    let WLModel = model;
    let modelIdentity = model.identity;

    return new parley(function (done) {
      sailsCreateCall(this._wlQueryInfo.newRecord, done, this._wlQueryInfo.meta);
    }, explicitCbMaybe, _.extend(DEFERRED_METHODS, {
      _WLModel: WLModel,
      _wlQueryInfo: {
        method: 'create',
        using: modelIdentity,
        newRecord: newRecord,
        meta: metaContainer
      }
    }))
  };

  model.create = create;

};
