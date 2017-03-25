angular.module('son', ['ui.router', 'oc.lazyLoad', 'ngStorage', 'ngCookies', 'ui.bootstrap', 'ui.utils.masks', 'ngAnimate',
    'angular-loading-bar','toaster','ngTouch','angularMoment','ngSanitize', 'ngCsv'])
    .run(['$rootScope', '$state', '$stateParams', '$window', '$location', '$uibModal', 'AuthService','APP_MENUS',
        function ($rootScope, $state, $stateParams, $window, $location, $modal, AuthService,APP_MENUS) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$storage = $window.localStorage;
           


            
            $rootScope.app = {
                name: 'SalesON',
                description: 'CRM completo para Vendas',
                year: ((new Date()).getFullYear()),
                layout: {
                    isFixed: true,
                    isCollapsed: false,
                    isBoxed: false,
                    isRTL: false
                },
                viewAnimation: 'ng-fadeInUp'
            };


            $rootScope.warn = function (message, title, sucessCallback) {
                var modalInstance = $modal.open({
                    template: ' <div class="modal-header"><h3>{{title}}</h3></div><div class="modal-body">{{message}}</div><div class="modal-footer"><button class="btn btn-danger" ng-click="ok()">OK</button></div>',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = message;
                        $scope.title = title || "Erro";
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };
                    }
                });
                modalInstance.result.then(sucessCallback);
            };

            $rootScope.alert = function (message, title, sucessCallback) {
                var modalInstance = $modal.open({
                    template: ' <div class="modal-header"><h3>{{title}}</h3></div><div class="modal-body">{{message}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button></div>',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = message;
                        $scope.title = title || "Alerta";
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };
                    }
                });

                modalInstance.result.then(sucessCallback);
            };

            $rootScope.confirm = function (message, positiveCallback, negativeCallback, title) {
                $modal.open({
                    template: ' <div class="modal-header" ng-style="{\'z-index\': 99000}"><h3>{{title}}</h3></div><div class="modal-body">{{message}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="sim()">Sim</button><button class="btn btn-danger" ng-click="nao()">Não</button></div>',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = message;
                        $scope.title = title || "Confirmação";
                        $scope.sim = function () {
                            $uibModalInstance.result.then(positiveCallback);
                            $uibModalInstance.close();
                        };
                        $scope.nao = function () {
                            $uibModalInstance.result.then(negativeCallback);
                            $uibModalInstance.close();
                        };
                    }
                });
            };

            $rootScope.alertTemplateItem = function (itemRecebido, positiveCallback) {
                var modalInstance = $modal.open({
                    templateUrl: 'modalItens.html',
                    controller: function ($scope, $uibModalInstance,RelatorioService) {
                        $scope.itemRecebidoModal=itemRecebido;
                        $scope.title = 'Adicionando' || "Alerta";
                        $scope.item={};
                        $scope.item.tipo=$scope.itemRecebidoModal.tipo;

                        //console.log('Item enviado para o popup : '+JSON.stringify(item));
                        var resposta = RelatorioService.getPosicaoItemId(itemRecebido._id);
                        resposta.then(function (resp) {
                            var resultado = resp.data;
                            if (resultado.type == true) {
                                var item=resultado.data[0];
                                $scope.itemRecebidoModal.qtdEstoque=item.qtd;
                                $scope.itemRecebidoModal.qtdEstoqueAtualizado=item.qtd;
                               //console.log('Buscou item '+JSON.stringify($scope.itemRecebidoModal));

                            }
                        }, function (error) {
                            $log.error('Eror ' + error);
                        });



                        $scope.atualizaTXConversao = function (id) {
                           
                            if(typeof(id) != "undefined" && id != null) {
                                var unidadeFiltro = $scope.itemRecebidoModal.unidades.filter(function (unidade) {
                                    return unidade._id == id;
                                });
                                //console.log('qtd ' + JSON.stringify($scope.itemRecebidoModal));
                                $scope.itemRecebidoModal.convert = $scope.itemRecebidoModal.qtd / unidadeFiltro[0].tx;
                                $scope.itemRecebidoModal.qtdEstoqueAtualizado = $scope.itemRecebidoModal.qtdEstoque / unidadeFiltro[0].tx;
                            }
                        };
                        
                        $scope.addItem = function (itemForm) {
                            var filtroUnidades=$scope.itemRecebidoModal.unidades.filter(function (unidade) {
                                return unidade._id == itemForm.unidadeId;
                            });
                            ////console.log('unidades : '+JSON.stringify(filtroUnidades));
                            var itemMovimento={
                                item: $scope.itemRecebidoModal,
                                qtd: itemForm.qtd,
                                dta_critica: itemForm.dta_critica,
                                unidade: filtroUnidades[0]
                            };


                            ////console.log('clicou ok item : '+JSON.stringify(itemMovimento));
                            $uibModalInstance.result.then(positiveCallback);
                            $uibModalInstance.close(itemMovimento);
                        };
                    }
                });
            };

/*
            $rootScope.alertTemplateItem = function (item, positiveCallback) {
                var modalInstance = $modal.open({
                    template: ' <div class="modal-header" ng-style="{\'z-index\': 99000}"><h3>{{title}}</h3></div><div class="modal-body">' +
                    '{{item.nome}}' +
                    '</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">Sim</button></div>',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.item=item;
                        $scope.title = 'Adicionando' || "Alerta";
                        $scope.ok = function () {
                            $uibModalInstance.result.then(positiveCallback);
                            $uibModalInstance.close(item);
                        };
                    }
                });
            };
*/


        }
    ]);