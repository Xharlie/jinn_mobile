/**
 * Created by charlie on 9/28/15.
 */
/**
 * Created by charlie on 8/27/15.
 */


var stringUtil = {
    objStringify: function (obj) {
        var newObj = {};
        for(key in obj){
            if(obj[key] != null){
                newObj[key] = obj[key].toString();
            }else{
                newObj[key] = '';
            }
        }
        return newObj;
    }
}

module.exports.objStringify = stringUtil.objStringify;