/**
 * @Filename get-model-violation-message.js
 * @Description 获取model自定义的异常信息(支持i18n)
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */
/**
 * @param model
 * @param attrName
 * @param rule
 */
module.exports = (model, attrName, rule) => {
    /**
     * 国际化异常信息
     * 读取config/locales/{req.getLocale()}.json > modelId.attribute.rule
     */
    const phrase = [
        model.globalId.toLowerCase(),
        attrName,
        rule
    ].join('.');

    let i18nMessage = sails.__(phrase);
    let i18nExist = i18nMessage !== phrase && _.isString(i18nMessage);
    if (i18nExist) return i18nMessage;

    if (!model.violationMessages
        || !model.violationMessages[attrName]) return;

    //未指定具体异常，返回整个属性的自定义异常
    if (!rule) return model.violationMessages[attrName];

    //返回指定异常类型的异常信息
    return model.violationMessages[attrName][rule];

};

