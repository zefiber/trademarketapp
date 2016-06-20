/**
 * Created by wangz on 6/18/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    accountid:Schema.Types.ObjectId,
    client:[{type:Schema.Types.ObjectId, ref:'Client'}],
    balancecash:Number,
    listSecurity:Array,
    currencytype:String
});

module.exports = mongoose.model('Account', AccountSchema);