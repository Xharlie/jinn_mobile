/**
 * Created by charlie on 5/7/15.
 */

Da.controller('cartCTLR', function($scope, $http, $location, comboInfoFactory, userOrderFactory,orderDetailFactory,$timeout,$route) {

    /********************************************     validation     ***************************************************/
    $scope.hasError = function(btnPass){
        if(eval("$scope."+btnPass)==null) eval("$scope."+btnPass+"=0");
        eval("$scope."+btnPass+"++");
    }
    $scope.noError = function(btnPass){
        eval("$scope."+btnPass+"--");
    }
    /******************************-------------- logic control------------------- *************************************/

    $scope.Limit = function(num){
        return Number(parseFloat(num).toFixed(2));
    }

    $scope.selectPayMethod = function(pre,paymethod){
        pre.buttonClass = "btn-disabled";
        $scope.orderInfo.paymethodSelected = paymethod;
        $scope.orderInfo.paymethodSelected = paymethod;
    }

    $scope.calculatePay = function(obj){
        var pay = 0;
        for( var key in obj) {
            var amountValid = parseInt(obj[key].AMNT);
            if (isNaN(amountValid) || amountValid == null || amountValid <= 0 || amountValid > 100) {
                continue;
            }
            pay = pay + amountValid * Number(obj[key].CMB_PRC);
        }
        return pay;
    }

    $scope.updatePayInDue = function(){
        $scope.orderInfo.payInDue = $scope.calculatePay($scope.cart);
        $scope.transFeeEstimate();
    }

    $scope.cleanup = function(){
        userOrderFactory.cleanCookies();
    }

    $scope.cancelOrder = function(){
        var CMB_ID = $scope.cmb.CMB_ID;
        $scope.$parent.info.cmbSelected = null;
        $scope.cleanup();
        $location.path('/combo/:'+CMB_ID.toString());
    }

    $scope.submit = function(){
        if(($scope.orderInfo.RM_ID == null || $scope.orderInfo.RM_ID == '')){
            alert('请填写房间号');
            return;
        }
        var allCMB = [];

        for(var key in $scope.cart){
            if($scope.cart[key].SRVC_TP_ID != '3'){
                allCMB.push([
                    $scope.cart[key].CMB_ID, //CMB_ID
                    $scope.cart[key].AMNT, //AMNT
                    dateUtil.dateFormat($scope.cart[key].serviceTime) + ' ' + dateUtil.timeFormat($scope.cart[key].serviceTime), //ORDR_TSTMP,
                    $scope.cart[key].RMRK, //RMRK,
                    null, //RCVR_NM,
                    null, //RCVR_PHN,
                    null, //RCVR_ADDRSS,
                    '2', // HTL_ID
                    $scope.orderInfo.RM_ID, // RM_ID,
                    $scope.cart[key].TKT_ID, //TKT_ID
                    '已下单', // STATUS
                    null // ORDR_TAKEN_TSTMP
                ]);
            }else if($scope.cart[key].SRVC_TP_ID == '3'){
                allCMB.push([
                    $scope.cart[key].CMB_ID, //CMB_ID
                    $scope.cart[key].AMNT, //AMNT
                    null, //ORDR_TSTMP,
                    null, //RMRK,
                    $scope.receiver.RCVR_NM, //RCVR_NM,
                    $scope.receiver.RCVR_PHN, //RCVR_PHN,
                    $scope.receiver.province + $scope.receiver.city + $scope.receiver.area + $scope.receiver.blockAddress, //RCVR_ADDRSS,
                    '2', // HTL_ID
                    $scope.orderInfo.RM_ID, // RM_ID
                    $scope.cart[key].TKT_ID, //TKT_ID
                    '已下单', // STATUS
                    null // ORDR_TAKEN_TSTMP
                ]);
            }
        }
        var tran = {
            HTL_ID: '2',
            TSTMP: dateUtil.tstmpFormat(new Date()),
            CUS_PHN: null,
            CUS_NM: null,
            PYMNT_TTL:$scope.orderInfo.payInDue+$scope.orderInfo.transFee,
            STATUS: '已下单',
            RM_ID: $scope.orderInfo.RM_ID,
            PYMNT_MTHD: $scope.orderInfo.paymethodSelected.PAY_MTHD_NM
        };
        userOrderFactory.checkOTCart(tran,allCMB).success(function(data){
            $scope.success = true;
            $timeout(function(){
                $scope.cleanup();
                $scope.orderInfo.tran_id =data[0].TRN_ID;
                $scope.orderInfo.payInTotal = $scope.orderInfo.payInDue+$scope.orderInfo.transFee;
                //append Order Id
                appendOrderId(data,$scope.cart);
                $scope.pageChange('cartConfirm');
            }, 0);
        });
    }

    function appendOrderId(order,cart){
        for(var i =0 ; i < order.length; i++){
            cart[order[i].TKT_ID].ORDR_ID = order[i].ORDR_ID;
        }
    }

    $scope.pageChange = function(nextPage){
        $scope.cartStage = nextPage;
        $scope.action.putAnalytics({
            ANLYTCS_TSTMP:dateUtil.tstmpFormat(new Date()),
            ANLYTCS_PG_NM:nextPage,
            ANLYTCS_EVNT:'get in page'
        });
    }

    $scope.$watch('orderInfo.paymethodSelected',
        function(newValue, oldValue) {
            if(newValue == oldValue) return;
            paymethodsClass($scope.paymethods);
        },
        true
    );

    function paymethodsClass(paymethods){
        for(var i =0; i < paymethods.length; i++){
            if($scope.orderInfo.paymethodSelected.PAY_MTHD_ID == paymethods[i].PAY_MTHD_ID ){
                paymethods[i].buttonClass = 'btn-primary';
            }else{
                paymethods[i].buttonClass = 'btn-disabled';
            }
        }
    }

    $scope.transFeeEstimate = function(){
        $scope.orderInfo.transFee = 0;
        for(var key in $scope.cart){
            $scope.orderInfo.transFee = $scope.orderInfo.transFee +
            parseFloat($scope.cart[key].CMB_TRANS_PRC)*$scope.cart[key].AMNT;
        }
    }

    /*********************** -------------- page control------------------- ***********************/

    $scope.toComboInfo = function (cmb){
        $scope.$parent.info.cmbSelected = null;
        comboInfoFactory.pushSelectedCombo(null);
        $route.reload();
        $location.path('/combo/:'+cmb.CMB_ID.toString());
    }
    /******************************-------------- init  function------------------- *************************************/
    function getPaymentMethods(HTL_ID){
        orderDetailFactory.getAllPayMethods(HTL_ID).success(function(data){
            if(data.length ==0) return;
            $scope.paymethods = data;
            $scope.orderInfo.paymethodSelected = $scope.paymethods[0];
            paymethodsClass($scope.paymethods);
        });
    }

    function getCart(){
        $scope.cart = basicUtil.objDecode(userOrderFactory.getCart());
        for(var key in $scope.cart){
            $scope.cmb = $scope.cart[key];
            break;
        }
        $scope.updatePayInDue();
    }
    /***************************** -------------- init variable------------------- *******************/
    $scope.paymethods = [];
    $scope.success = false;
    $scope.cartStage = 'cartOrderInfo';
    $scope.receiver = orderDetailFactory.getReceiverInfo();
    $scope.orderInfo = {
        tran_id:"",
        paymethodSelected:"",
        RM_ID:"",
        transFee:0,
        payInDue: basicUtil.Limit($scope.calculatePay($scope.cart)),
        payInTotal: 0
    }
    getPaymentMethods(2);
    getCart();
})


Da.controller('serviceDetailCTLR', function($scope,orderDetailFactory,userOrderFactory) {
    //$scope.confirmCombo = function(buyAtWill){
    //    $scope.$parent.cmb.datePartChineseString = dateUtil.dateChineseFormat($scope.$parent.cmb.serviceDate);
    //    $scope.$parent.cmb.timePartChineseString = dateUtil.timeChineseFormat($scope.$parent.cmb.serviceTime);
    //}

    $scope.$parent.cmb.serviceDate = new Date(); //dateUtil.dateFormat(new Date());
    $scope.$parent.cmb.serviceTime = new Date(); //dateUtil.timeFormat(new Date());
});

Da.controller('shipDetailCTLR', function($scope,orderDetailFactory,userOrderFactory){
    /********************************************     validation     ***************************************************/
    $scope.hasError = function(btnPass){
        if(eval("$scope."+btnPass)==null) eval("$scope."+btnPass+"=0");
        eval("$scope."+btnPass+"++");
    }
    $scope.noError = function(btnPass){
        eval("$scope."+btnPass+"--");
    }

    /****************************** ------------------- utility ------------------- *************************************/

    $scope.confirmCombo = function(buyAtWill){
        if($scope.receiverError == 0 || $scope.receiverError == null ){
            orderDetailFactory.pushReceiverInfo($scope.receiver);
            if(buyAtWill){
                $scope.$parent.confirmCombo();
            }else{
                $scope.$parent.pageChange('comboInfo');
                $scope.$parent.info.page = 'comboInfo';
            }
        }
    }

    $scope.updateProvince = function(updater){
        $scope.receiver.province =updater.name;
        $scope.receiver.provinceIndex =$scope.provinceNcity.province.indexOf(updater);
        $scope.check.city = updater.city[0];
        $scope.updateCity($scope.check.city);
    }

    $scope.updateCity = function(updater){
        $scope.receiver.city =updater.name;
        $scope.receiver.cityIndex = $scope.check.province.city.indexOf(updater);
        $scope.check.area = updater.area[0];
        $scope.updateArea($scope.check.area);
    }

    $scope.updateArea = function(updater){
        $scope.receiver.area = updater.name;
        $scope.receiver.areaIndex = $scope.check.city.area.indexOf(updater);
    }

    /******************************-------------- init  function------------------- *************************************/

    function getProvinceNcity(){
        orderDetailFactory.getProvinceNcity().success(function(data){
            $scope.provinceNcity = data;
            $scope.receiver = orderDetailFactory.getReceiverInfo();
            if($scope.receiver.province =='' || $scope.receiver.province == null){
                $scope.check.province = $scope.provinceNcity.province[0];
                $scope.check.city = $scope.check.province.city[0];
                $scope.check.area = $scope.check.city.area[0];
            }else{
                $scope.check.province = $scope.provinceNcity.province[$scope.receiver.provinceIndex];
                $scope.check.city = $scope.check.province.city[$scope.receiver.cityIndex];
                $scope.check.area = $scope.check.city.area[$scope.receiver.areaIndex];
            }
        });
    }
    /******************************-------------- init  variables------------------- *************************************/
    $scope.provinceNcity = null;

    $scope.check ={
        province:null,
        city:null,
        area:null
    }
    getProvinceNcity();
});