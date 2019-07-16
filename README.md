sails-hook-violations
=====================

[![Build Status](https://travis-ci.org/lykmapipo/sails-hook-validation.svg?branch=master)](https://travis-ci.org/lykmapipo/sails-hook-validation)

+ Custom validation error messages for sails v1.0+ model with i18n support.
+ Custom Business error object for response with i18n support.  

## Installation
```sh
$ npm install --save sails-hook-violations
```

## Usage

### Use without i18n

Add `violationMessages` static property in your sails model
```js
module.exports = {
    attributes: {
        sex: {
            type: 'string',
            isIn: ['male', 'female'],
        }
    },
    violationMessages : {
        sex: {
            isIn: 'The sex\'s value must be male or female!'
        }
    }
};
```

Add `violationMessages` static property in your sails action
```js
module.exports = {
    friendlyName: 'Update',
    inputs: {
        sex: {
            type: 'string',
            isIn: ['male','female']
        }
    },
    violationMessages : {
        sex: {
            isIn: 'The sex\'s value must be male or female!'
        }
    }
};
```

Add business error object in config/http.js and use like ```new SessionError()```;
```js
module.exports.http = {
    ...
    businessErrors: {
        SessionError: {
            code: 'E_VALIDATION_SESSION',
            message: 'You are not permitted to perform this action.'
        }
    }
}
```

### Use with i18n

Add `modelId.attribute.rule`.
```javascript
//in config/locale/en.json
{
    'user.sex.isIn': 'The sex\'s value must be male or female!'
}
```

Add `actionId.attribute.rule`.
```javascript
//in config/locale/en.json
{
    'user/create.js.sex.isIn': 'The sex\'s value must be male or female!'
}
```

Add `businessError.funcName.message`.
```javascript
//in config/locale/en.json
{
    'businessError.SessionError.message': 'You are not permitted to perform this action.'
}
```

## Licence

The MIT License (MIT)

Copyright (c) 2019 追疯

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 