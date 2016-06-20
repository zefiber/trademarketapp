/**
 * Created by wangz on 6/18/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    userid:Schema.Types.ObjectId,
    username:String,
    password:String,
    lastname:String,
    firstname:String,
    address:String,
    email:String,
    publickey:String,
    privtekey:String
});

module.exports = mongoose.model('Client', ClientSchema);