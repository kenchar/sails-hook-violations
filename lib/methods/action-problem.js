/**
 * @Filename action-problem.js
 * @Description 支持inputs内参数自定义校验信息
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/07/15
 */
const getModelViolationMessage = require('../../utils/get-model-violation-message');
const getRuleByExceptionMessage = require('../../utils/get-rule-by-exception-message');

const ViolateError = require('../error');

const ATTR_NAME_REG_EXP = /\"(.+?)\"/ig;

module.exports = (req,problem) => {

  if (new RegExp(ATTR_NAME_REG_EXP).test(problem)) {
    let attrName = new RegExp(ATTR_NAME_REG_EXP).exec(problem)[1];
    let ruleName = getRuleByExceptionMessage(problem);

    actionPath = req.options.action;
    let actionObj;
    if(sails.getActions()[actionPath]){
      actionObj = sails.getActions()[actionPath].toJSON();
      actionObj.globalId = actionPath;
      return getModelViolationMessage(actionObj, attrName, ruleName);
    }
  }

  return problem;

};
