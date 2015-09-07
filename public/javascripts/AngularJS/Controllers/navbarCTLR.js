/**
 * Created by charlie on 4/12/15.
 */
Da.controller('navbarCTLR', function($scope){
    $scope.cartUp = function() {
        $scope.$parent.info.cartOpen= true;
    }
    $scope.$watch('inCart.sumAmount',
        function(newValue, oldValue) {
            if(newValue>0){
                $scope.cartButtonClass = 'btn-primary';

            }else{
                $scope.cartButtonClass = 'btn-disabled';
            }
        },
        true
    );
    /****************************** init*****************************/
    $scope.cartButtonClass = 'btn-disabled';
});