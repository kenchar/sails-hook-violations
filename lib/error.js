/**
 * @Filename error.js
 * @Description 返回给业务端的校验异常包装类
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */
class ViolateError extends Error {
    constructor(msg, code) {
        super(msg);
        this._code = code || 'E_VIOLATE_ERROR';
    }

    toJSON() {
        return {
            code: this._code,
            success: false,
            message: this.message,
            detail: this._detail
        }
    }

    toPOJO() {
        return this.toJSON();
    }

    get code() {
        return this._code;
    }

    set code(value) {
        this._code = value;
    }

    get detail() {
        return this._detail
    }

    set detail(value) {
        this._detail = value;
    }
}

module.exports = ViolateError;
