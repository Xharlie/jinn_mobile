/**
 * Created by charlie on 4/23/15.
 */
Da.controller('serviceTypeListCTRL', function($scope, $location, $rootScope,serviceTypeFactory){
    /*  -------------- utility ----------------------- */
    $scope.selectServiceType = function(ID){
        $scope.$parent.info.serviceTypeIDSelected = ID;
        $location.path('/comboList/:'+ID);
    }

    /* -------------- init function------------------- */


    function init(){
        serviceTypeFactory.getAllCombos(2).success(function(data){
            if(Array.isArray(data)){
                $scope.serviceTypes = serviceUtil.structuralize(data);
            }else{
                $scope.serviceTypes = data;
            }
        });
    }

    /* -------------- init variable------------------- */

    $scope.animationStyle = 'basement';
    $scope.$parent.info.page = 'serviceTypeList';
    $scope.serviceTypes={};
    init();
});
