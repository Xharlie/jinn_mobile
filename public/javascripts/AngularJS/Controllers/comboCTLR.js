/**
 * Created by charlie on 8/2/15.
 */

Da.controller('comboCTLR', function($scope, $location, $rootScope, hotelFactory, comboInfoFactory, userOrderFactory,$route){

    /*------------------------------ page control --------------------------------*/
    $scope.pageChange = function(destination){
        $scope.comboPage = destination;
    }

    $scope.confirmCombo = function(){
        userOrderFactory.pushCart($scope.cmb);
        $location.path('/cart/cart');
    }

    /*------------------------------- init function -------------------------------*/
    function init(cmb){
        comboInfoFactory.getMerchantInfoByCmb(cmb.CMB_ID).success(function(data){
            $scope.Merchant =data[0];
        });
        comboInfoFactory.getTagsOfCmb('('+cmb.CMB_TAGS+')').success(function(data){
            $scope.Tags =data;
        });
        hotelFactory.getHotelInfo(2).success(function(data){
            $scope.hotel = data[0];
        });
        if(cmb.AMNT == null){
            cmb.AMNT = 1;
        }
        cmb.TKT_ID = cmb.CMB_ID.toString() + dateUtil.tstmpFormat(new Date());
    };
    /* -------------- init variable------------------- */
    if($scope.$parent.info.cmbSelected != null){
        $scope.cmb = $scope.$parent.info.cmbSelected;
        init($scope.cmb);
    }else{
        var pathArray = window.location.href.split("/:");
        var CMB_ID = pathArray[1];
        comboInfoFactory.getSelectedCombo(CMB_ID).success(function(data){
            if(Array.isArray(data)){
                $scope.cmb = data[0];
            }else{
                $scope.cmb = data;
            }
            $scope.$parent.info.cmbSelected = $scope.cmb ;
            init($scope.cmb);
        });
    }
    $scope.limitArray = basicUtil.getTuple(1,51);
    $scope.$parent.info.page = 'comboInfo';  // to tell outer nav bar to dispatch
});

