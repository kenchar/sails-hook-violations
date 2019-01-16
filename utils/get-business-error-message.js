/**
 * @Filename get-business-error-message.js
 * @Description 获取response自定义的异常信息(支持i18n)
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/16 10:16
 */
module.exports = (funcName, localMessage) => {
    /**
     * 国际化异常信息
     * 读取config/locales/{req.getLocale()}.json > businessError.funcName.message
     */
    const phrase = [
        'businessError',
        funcName,
        'message'
    ].join('.');

    let i18nMessage = sails.__(phrase);
    let i18nExist = i18nMessage !== phrase && _.isString(i18nMessage);
    if (i18nExist) return i18nMessage;

    return localMessage || '';

};