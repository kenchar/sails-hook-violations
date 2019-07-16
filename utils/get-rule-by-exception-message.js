/**
 * @Filename get-rule-by-exception-message.js
 * @Description 根据异常信息匹配对应的属性规则名称
 *  @link 完整的异常信息参考node_modules\anchor\lib\rules.js
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */

const rules = {
    required: /Missing value for required attribute \`(.+?)\`/ig,
    required: /\"(.+?)\" is required, but it was not defined./ig,
    isBoolean: /Value \((.+?)\) was not a boolean./ig,
    isNotEmptyString: /Value \((.+?)\) was an empty string./ig,
    isInteger: /Value \((.+?)\) was not an integer./ig,
    isNumber: /Value \((.+?)\) was not a number./ig,
    isString: /Value \((.+?)\) was not a string./ig,
    max: /Value \((.+?)\) was greater than the configured maximum \((.+?)\)/ig,
    min: /Value \((.+?)\) was less than the configured minimum \((.+?)\)/ig,
    isAfter: /Value \((.+?)\) was before the configured time \((.+?)\)/ig,
    isBefore: /Value \((.+?)\) was after the configured time \((.+?)\)/ig,
    isCreditCard: /Value was not a valid credit card./ig,
    isEmail: /Value \((.+?)\) was not a valid email address./ig,
    isHexColor: /Value \((.+?)\) was not a valid hex color./ig,
    isIn: /Value \((.+?)\) was not in the configured whitelist \((.+?)\)/ig,
    isIP: /Value \((.+?)\) was not a valid IP address./ig,
    isNotIn: /Value \((.+?)\) was in the configured blacklist \((.+?)\)/ig,
    isURL: /Value \((.+?)\) was not a valid URL./ig,
    isUUID: /Value \((.+?)\) was not a valid UUID./ig,
    minLength: /Value \((.+?)\) was shorter than the configured minimum length \((.+?)\)/ig,
    maxLength: /Value was \((.+?)\) character\((.+?)\) longer than the configured maximum length \((.+?)\)/ig,
    regex: /Value \((.+?)\) did not match the configured regular expression \((.+?)\)/ig,
    custom: /Value \((.+?)\) failed custom validation./ig
};

module.exports = (exceptionMessage) => {

    let ruleName;
    _.forEach(rules, (value, key) => {
        ruleName = key;
        return !new RegExp(value).test(exceptionMessage);
    });

    return ruleName;

};
