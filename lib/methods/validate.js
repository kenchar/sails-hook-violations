/**
 * @Filename validate.js
 * @Description 扩展原生的validate,支持model内自定义校验信息
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */

const getModelViolationMessage = require('../../utils/get-model-violation-message');

const ViolateError = require('../error');

/**
 * @param model
 * @error
 */
module.exports = model => {

    if (!model.globalId) return;

    let sailsValidate = model.validate;

    let validate = (attrName, value) => {
        try {
            sailsValidate
                .call(model, attrName, value);
        } catch (err) {
            switch (err.code) {
            /**
             *  @property {String} code
             *    E_VIOLATES_RULES
             *  @property {Array} ruleViolations
             *    e.g
             *      [{
       *        rule: 'isIn',
       *        message: 'Value ('test') was not in the configured whitelist (boy, girl)',
       *      }]
             */
                case 'E_VIOLATES_RULES':
                    let ruleViolations = err.ruleViolations;
                    _.forEach(ruleViolations, function (ruleViolation) {
                        ruleViolation.detailMessage = ruleViolation.message;
                        ruleViolation.message = getModelViolationMessage(model, attrName, ruleViolation.rule);
                    });
                    err = new ViolateError(ruleViolations[0].message, err.code);
                    err.detail = ruleViolations;
                    break;
            }
            throw err;
        }
    };

    model.validate = validate;

};
