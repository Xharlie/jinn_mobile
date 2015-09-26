/**
 * Created by charlie on 4/2/15.
 */

Da.controller('comboListCTLR', function($scope, $location, serviceTypeFactory, userOrderFactory,comboInfoFactory){

    /*------------------------------ page control --------------------------------*/
    //$scope.addCombo =function(cmb){
    //    userOrderFactory.pushCart(cmb);
    //    cmb.selected = 'T';
    //    $scope.$parent.inCart.sumAmount = userOrderFactory.cartQuan();
    //}
    //
    //$scope.removeCombo =function(cmb){
    //    userOrderFactory.pullCart(cmb);
    //    cmb.selected = 'F';
    //    $scope.$parent.inCart.sumAmount = userOrderFactory.cartQuan();
    //}

    $scope.toComboInfo = function(cmb){
        if(cmb.CMB_STL_CLSS == 'card-disabled') return;
        $scope.$parent.info.cmbSelected = cmb;
        comboInfoFactory.pushSelectedCombo(cmb);
        $scope.$parent.info.page = 'comboInfo';
        $location.path('/combo/:'+cmb.CMB_ID.toString());
    }
    /*------------------------------- init function -------------------------------*/



    /* -------------- init variable------------------- */
    $scope.animationStyle = 'slide';
    var pathArray = window.location.href.split("/:");
    var SRVC_TP_ID = pathArray[1];
    $scope.$parent.init(1,SRVC_TP_ID);
    $scope.$parent.info.serviceTypeIDSelected = SRVC_TP_ID;
    $scope.$parent.info.page = 'comboList';
});

