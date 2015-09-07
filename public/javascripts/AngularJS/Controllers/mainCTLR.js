

Da.controller('mainCTLR', function($scope, $http, hotelFactory, serviceTypeFactory, userOrderFactory,analyticsFactory){


    $scope.init = function(HTL_ID, SRVC_TP_ID){
        serviceTypeFactory.getCombos(HTL_ID, SRVC_TP_ID).success(function(data){
            if(Array.isArray(data)){
                $scope.combos = (serviceUtil.structuralize(data))[SRVC_TP_ID];
            }else{
                $scope.combos = data[SRVC_TP_ID];
            }
            $scope.title=$scope.combos[0].SRVC_TP_NM;
            for (var i = 0; i < $scope.combos.length; i++ ){
                if($scope.combos[i].CMB_ID in userOrderFactory.getCart()){
                    $scope.combos[i].selected = 'T';
                    $scope.combos[i].backStyle ={'background-color':'#EEE'};
                }else{
                    $scope.combos[i].selected = 'F';
                    $scope.combos[i].backStyle = null;
                }
            }
        });
    }

    $scope.$watch('info.page',
        function(newValue, oldValue) {
            if(newValue == oldValue) return;
            $scope.action.selectAnalytics(newValue);
        },
        true
    );

    /*************      utility         ************/
    $scope.action={
        setNextPage: function(destination){
            $scope.info.nextPage = destination;
        },
        setCartPage: function(destination){
            $scope.info.cartPage = destination;
        },
        putAnalytics: function(puttee){
            analyticsFactory.putAnalytics(puttee);
        },
        setANLYTCS_PG_NM: function(page,puttee){
            if(page == 'serviceTypeList'){
                puttee.ANLYTCS_PG_NM ='serviceTypeList';
            }else if(page == 'comboList'){
                puttee.ANLYTCS_PG_NM = 'comboList'+'/:'+($scope.info.serviceTypeIDSelected==null ? 'ERR': $scope.info.serviceTypeIDSelected.toString()) ;
            }else if(page == 'comboInfo'){
                puttee.ANLYTCS_PG_NM = 'comboInfo'+'/:'+($scope.info.cmbSelected==null ? 'ERR': $scope.info.cmbSelected.CMB_ID.toString()) ;
            }else if(page == 'detail'){
                puttee.ANLYTCS_PG_NM = 'detail'
            }else{
                puttee.ANLYTCS_PG_NM = page;
            }
        },
        selectAnalytics: function(page){
            var puttee ={};
            this.setANLYTCS_PG_NM(page,puttee);
            puttee.ANLYTCS_TSTMP = dateUtil.tstmpFormat(new Date());
            puttee.ANLYTCS_EVNT = 'get in page';
            this.putAnalytics(puttee);
        },
        eventAnalytics: function(ANLYTCS_PG_NM,ANLYTCS_EVNT){
            var puttee ={};
            this.setANLYTCS_PG_NM(ANLYTCS_PG_NM,puttee);
            puttee.ANLYTCS_EVNT = ANLYTCS_EVNT;
            puttee.ANLYTCS_TSTMP = dateUtil.tstmpFormat(new Date());
            this.putAnalytics(puttee);
        }
    }
    /*************************/
    $scope.inCart={sumAmount:userOrderFactory.cartQuan()};
    $scope.combos = [];
    $scope.info ={serviceTypeIDSelected:null, cartOpen: false, cmbSelected:null, page:'ServiceTypeList'};
    hotelFactory.setHotelInfo(2);

});

