/**
 * Created by charlie on 5/11/15.
 */
var dateUtil = {
    tstmpFormat: function (date) {
        var YYYY = (date.getFullYear()).toString();
        var MM = (date.getMonth() + 1).toString();
        var DD = date.getDate().toString();
        var hh = (date.getHours()).toString();
        var mm = (date.getMinutes()).toString();
        var ss = (date.getSeconds()).toString();
        return (YYYY + "-" + (MM[1] ? MM : "0" + MM[0]) + "-" + (DD[1] ? DD : "0" + DD[0]) + " " + (hh[1] ? hh : "0" + hh[0]) + ":" + (mm[1] ? mm : "0" + mm[0]) + ":" + (ss[1] ? ss : "0" + ss[0]));
    },
    dateFormat: function (date) {
        var YYYY = (date.getFullYear()).toString();
        var MM = (date.getMonth() + 1).toString();
        var DD = date.getDate().toString();
        return (YYYY + "-" + (MM[1] ? MM : "0" + MM[0]) + "-" + (DD[1] ? DD : "0" + DD[0]) );
    },
    timeFormat: function (date) {
        var hh = (date.getHours()).toString();
        var mm = (date.getMinutes()).toString();
        var ss = (date.getSeconds()).toString();
        return ((hh[1] ? hh : "0" + hh[0]) + ":" + (mm[1] ? mm : "0" + mm[0]) + ":" + (ss[1] ? ss : "0" + ss[0]));
    },
    dateChineseFormat: function (date) {
        var YYYY = (date.getFullYear()).toString();
        var MM = (date.getMonth() + 1).toString();
        var DD = date.getDate().toString();
        return (YYYY + "年" + (MM[1] ? MM : "0" + MM[0]) + "月" + (DD[1] ? DD : "0" + DD[0]) + '日' );
    },
    timeChineseFormat: function (date) {
        var section = '上午';
        var hh = (date.getHours());
        var mm = (date.getMinutes()).toString();
        hh = (hh%12).toString();
        if(hh >=12 ){
            section ='下午';
        }
        return (section + (hh[1] ? hh : "0" + hh[0]) + ":" + (mm[1] ? mm : "0" + mm[0]) );
    }
}