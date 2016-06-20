/**
 * Created by wangz on 6/18/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientTestSchema = new Schema({
    username:String,
    password:String,
});

module.exports = mongoose.model('ClientTest', ClientTestSchema);