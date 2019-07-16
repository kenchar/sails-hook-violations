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

module.exports = (actionPath,problem) => {

  if (new RegExp(ATTR_NAME_REG_EXP).test(problem)) {
    let attrName = new RegExp(ATTR_NAME_REG_EXP).exec(problem)[1];
    let ruleName = getRuleByExceptionMessage(problem);

    //访问路径带有'/'
    actionPath = actionPath.substring(1);
    let actionObj;
    if(sails.getActions()[actionPath]){
      actionObj = sails.getActions()[actionPath].toJSON();
      return getModelViolationMessage(actionObj, attrName, ruleName);
    }
  }

  return problem;

};
