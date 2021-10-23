const Articles = require('../mongoose_sсhema/sсhema');

module.exports.articles = (req, res, next) => {
  Articles.find({}, function (err, result) {
      if (err) {
          console.log(err.stack)
          next(err);
      };
      res.status(200).json(result)
  });
};

