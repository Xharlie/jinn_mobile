/**
 * Created by charlie on 4/28/15.
 */

Da.factory('hotelFactory', function($http,$cookies){
    var hotelInfo = null;
    return {
        setHotelInfo: function(HTL_ID){
            return $http({
                method: 'GET',
                heasders: {'content-Type':'application/json'},
                url: 'controllers/hotel/getHotelInfo/'+HTL_ID.toString()
            }).success(function(data){
                if(Array.isArray(data)){
                    hotelInfo = data;
                    $cookies.putObject('hotel',data);
                }else{
                    hotelInfo = null;
                }
            });
        },
        getHotelInfo: function(HTL_ID){
            if(hotelInfo != null){
                return serviceUtil.getter(hotelInfo);
            }else if($cookies.getObject('hotel')!=null){
                hotelInfo = $cookies.getObject('hotel');
                return serviceUtil.getter(hotelInfo);
            }
            else {
                return this.setHotelInfo(HTL_ID);
            }
        }
    }
});

Da.factory('serviceTypeFactory', function($http){
    var combos = null;
    return {
        getAllCombos: function(HTL_ID){
            if(combos != null){
                return serviceUtil.getter(combos);
            }else{
                return $http({
                    method: 'GET',
                    heasders: {'content-Type':'application/json'},
                    url: 'controllers/ServiceType/getAllCombos/'+HTL_ID.toString()
                }).success(function(data){
                    combos = serviceUtil.structuralize(data);
                });
            }
        },
        getCombos: function(HTL_ID, SRVC_TP_ID){
            if(combos != null){
                var comboInSrv = {};
                comboInSrv[SRVC_TP_ID] = combos[SRVC_TP_ID]
                return serviceUtil.getter(comboInSrv);
            }else{
                return $http({
                    method: 'GET',
                    heasders: {'content-Type':'application/json'},
                    url: 'controllers/ServiceType/getAllCombos/'+HTL_ID.toString()
                }).success(function(data){
                    combos = serviceUtil.structuralize(data);
                });
            }
        }
    }
});

Da.factory('comboInfoFactory', function($http,$cookies){
    return {
        getMerchantInfoByCmb: function(CMB_ID){
            return $http({
                method: 'GET',
                heasders: {'content-Type':'application/json'},
                url: 'controllers/comboInfo/getMerchantInfoByCmb/'+CMB_ID.toString()
            });
        },
        getTagsOfCmb: function(TagString){
            return $http({
                method: 'GET',
                heasders: {'content-Type':'application/json'},
                url: 'controllers/comboInfo/getTagsOfCmb/'+TagString
            });
        },
        pushSelectedCombo: function(cmb){
            $cookies.putObject('cmbSelected',cmb);
        },
        getSelectedCombo: function(CMB_ID){
            if($cookies.getObject('cmbSelected') != null){
                return serviceUtil.getter($cookies.getObject('cmbSelected'));
            }else{
                return $http({
                    method: 'GET',
                    heasders: {'content-Type':'application/json'},
                    url: 'controllers/comboInfo/getComboByID/'+CMB_ID.toString()
                });
            }
        }
    }
});

Da.factory('userOrderFactory', function($http,$cookies){
    var itemIdPattern  = /[0-9]{2}:[0-9]{2}:[0-9]{2}/;
    return{
        inCart: function(CMB_ID){
            return ($cookies.getObject(CMB_ID) != null)
        },
        replaceCart: function(CMB_ID,cmb){
            $cookies.putObject(CMB_ID,cmb);
        },
        pushCart: function(cmb){
            $cookies.putObject(cmb.TKT_ID,cmb);
        },
        pullCart: function(cmb){
            if(cmb.TKT_ID in $cookies.getAll()) {
                $cookies.remove(cmb.TKT_ID);
            }else{
                show('cookie产生错误');
            }
        },
        cartQuan: function(){
            var quan=0;
            for(var key in $cookies.getAll()){
                if(!itemIdPattern.test(key)) continue;
                quan = quan + parseInt($cookies.getObject(key).AMNT);
            }
            return quan;
        },
        getCart: function(){
            var cmbs = basicUtil.deepCopy($cookies.getAll());
            /******* could be improved by a utility function ****/
            for(var key in cmbs){
                if(!itemIdPattern.test(key)){
                    delete cmbs[key];
                }
            }
            return cmbs;
        },
        checkOTCart: function(tran,allCMB){
            return $http({
                method: 'POST',
                heasders: {'content-Type':'application/json'},
                url: 'controllers/UserOrder/checkOTCart',
                data: {tran:tran, allCMB:allCMB}
            })
        },
        cleanCookies: function(){
            for(var key in $cookies.getAll()){
                if(key!='receiver')$cookies.remove(key);
            }
        }
    }
});

Da.factory('orderDetailFactory',function($http,$cookies) {
    var payMethods = null;
    var HTL_ID_PRE = null;
    var provinceNcity = null;
    return{
        getAllPayMethods: function(HTL_ID){
            if(payMethods != null && HTL_ID_PRE == HTL_ID ){
                return serviceUtil.getter(payMethods);
            }else{
                return $http({
                    method: 'POST',
                    heasders: {'content-Type':'application/json'},
                    url: 'controllers/UserOrder/getAllPayMethods',
                    data: {HTL_ID:HTL_ID}
                }).success(function(data){
                    payMethods = data;
                    HTL_ID_PRE = HTL_ID;
                });
            }
        },
        getProvinceNcity: function(){
            if(provinceNcity != null){
                return serviceUtil.getter(provinceNcity);
            }else{
                return $http({
                    method: 'GET',
                    heasders: {'content-Type':'application/json'},
                    url: 'controllers/UserOrder/getProvinceNcity'
                }).success(function(data){
                    provinceNcity = data;
                });
            }
        },
        getReceiverInfo: function(){
            if($cookies.getObject('receiver')!=null){
                return $cookies.getObject('receiver');
            }else{
                return {
                    name:"",
                    phone:"",
                    province:"",
                    city:"",
                    area:"",
                    provinceIndex:"",
                    cityIndex:"",
                    areaIndex:"",
                    blockAddress:"",
                    fullAddress:""
                }
            }
        },
        pushReceiverInfo: function(info){
            $cookies.putObject('receiver',info);
        }
    }
});

Da.factory('analyticsFactory', function($http) {
    return{
        putAnalytics: function(puttee){
            return $http({
                method: 'POST',
                heasders: {'content-Type':'application/json'},
                url: 'controllers/analyticsFactory/putAnalytics',
                data: {puttee:puttee}
            })
        }
    }
});
