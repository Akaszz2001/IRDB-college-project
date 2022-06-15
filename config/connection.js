require("dotenv").config();
const mongoClient = require("mongodb").MongoClient;
const state = {
  db: null,
};
module.exports.connect = function (done) {
  const url = process.env.MONGODB_URI;
  const dbname = "shopping";

  mongoClient.connect(url, (err, data) => {
    if (err) return done(err);
    else state.db = data.db(dbname);
    done();
  });
};
module.exports.get = function () {
  return state.db;
};
