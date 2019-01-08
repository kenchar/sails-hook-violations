/**
 * @Filename violate.js
 * @Description
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/1/5
 */
const validate = require('./methods/validate');
const create = require('./methods/create');
const createEach = require('./methods/create-each');
const findOrCreate = require('./methods/find-or-create');
const update = require('./methods/update');
const updateOne = require('./methods/updateOne');
module.exports = () => {

  _.forEach(sails.models, model => {
    validate(model);
    create(model);
    createEach(model);
    findOrCreate(model);
    update(model);
    updateOne(model);
  });

}
