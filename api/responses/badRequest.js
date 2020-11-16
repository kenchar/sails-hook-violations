const actionProblem = require('../../lib/methods/action-problem');

const ViolateError = require('../../lib/error');

module.exports = function (optionalData) {

  let req = this.req;
  let res = this.res;

  let message;
  const statusCodeToSet = 400;

  if (optionalData === undefined) {
    sails.log.info('Ran custom response: res.badRequest()');
    return res.sendStatus(statusCodeToSet);
  } else if (_.isError(optionalData)) {
    // action控制器inputs参数不合规
    if (optionalData.code
        && optionalData.code === 'E_MISSING_OR_INVALID_PARAMS'
        && _.isArray(optionalData.problems)) {
      _.each(optionalData.problems, (problem) => {
        message = actionProblem(req.path, problem) || message;
      });
      return res.serverError(new ViolateError(message));
    }

    if (!_.isFunction(optionalData.toJSON)) {
      if (process.env.NODE_ENV === 'production') {
        return res.sendStatus(statusCodeToSet);
      }
    }

  }
  return res.status(statusCodeToSet).send(optionalData);

};
