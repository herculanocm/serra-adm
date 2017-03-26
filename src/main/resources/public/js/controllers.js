angular.module('son')
    .controller('AppController',
        ['$rootScope', '$scope', '$state', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'cfpLoadingBar', 'AuthService',
            function ($rootScope, $scope, $state, $window, $localStorage, $timeout, toggle, colors, cfpLoadingBar, AuthService) {
                "use strict";
                //console.log('carregando appcontroller');

                $scope.isNavCollapsed = true;
                $scope.isCollapsed = true;
                $scope.isCollapsedHorizontal = false;
                //$scope.user = AuthService.getUserSessionStorage();

                /*

                 if (!$scope.user || $scope.user == null || $scope.user == undefined) {
                 $state.go('page.login', '', {notify: false}).then(function () {
                 $rootScope.$broadcast('$stateChangeSuccess');
                 });
                 } else if (AuthService.isAlterPass()) {
                 event.preventDefault();
                 $state.go('page.recover', '', {notify: false}).then(function () {
                 $rootScope.$broadcast('$stateChangeSuccess');
                 });
                 }
                 */

                var thBar;
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    //console.log('Alterando status Status Atual:' + fromState.name + '        Status Final:' + toState.name);

                    if ($('.wrapper > section').length) {
                        thBar = $timeout(function () {

                            cfpLoadingBar.start();
                        }, 0); // sets a latency Threshold
                    }

                    /*
                     if (!AuthService.isAuth()) {

                     //console.log('Usuario não esta logado');
                     //$location.path('/page/login');
                     event.preventDefault();

                     $state.go('page.login', toParams, {notify: false}).then(function () {
                     $rootScope.$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
                     });

                     } else if (AuthService.isAlterPass()) {
                     event.preventDefault();
                     $state.go('page.recover', toParams, {notify: false}).then(function () {
                     $rootScope.$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
                     });
                     } else if (!AuthService.isMenuState(toState.name) && AuthService.isEstadosPadroes(toState.name)) {
                     event.preventDefault();
                     $state.go('app.nroute', toParams, {notify: false}).then(function () {
                     $rootScope.$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
                     });

                     } else {
                     return;
                     }
                     */
                });

                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

                    event.targetScope.$watch("$viewContentLoaded", function () {

                        $timeout.cancel(thBar);
                        cfpLoadingBar.complete();
                    });

                });


                // Hook not found
                $rootScope.$on('$stateNotFound',
                    function (event, unfoundState, fromState, fromParams) {
                        //console.log(unfoundState.to); // "lazy.state"
                        //console.log(unfoundState.toParams); // {a:1, b:2}
                        //console.log(unfoundState.options); // {inherit:false} + default options
                    });

                // Hook success
                $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        // display new view from top
                        $window.scrollTo(0, 0);
                        // Save the route title
                        $rootScope.currTitle = $state.current.title;
                    });

                $rootScope.currTitle = $state.current.title;
                $rootScope.pageTitle = function () {
                    return $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
                };

                // iPad may presents ghost click issues
                // if( ! browser.ipad )
                // FastClick.attach(document.body);

                // Close submenu when sidebar change from collapsed to normal
                $rootScope.$watch('app.layout.isCollapsed', function (newValue, oldValue) {
                    if (newValue === false)
                        $rootScope.$broadcast('closeSidebarMenu');
                });

                // Restore layout settings
                if (angular.isDefined($localStorage.layout))
                    $scope.app.layout = $localStorage.layout;
                else
                    $localStorage.layout = $scope.app.layout;

                $rootScope.$watch("app.layout", function () {
                    $localStorage.layout = $scope.app.layout;
                }, true);


                // Allows to use branding color with interpolation
                // {{ colorByName('primary') }}
                $scope.colorByName = colors.byName;

                // Hides/show user avatar on sidebar

                $scope.toggleUserBlock = function () {
                    ////console.log('passou no toggleUserBlock');
                    $scope.$broadcast('toggleUserBlock');
                    $scope.isCollapsed = !$scope.isCollapsed;

                    ////console.log('Colapse esta : '+$scope.isCollapsed);
                };

                // Internationalization
                // ----------------------


                // Restore application classes state
                toggle.restoreState($(document.body));


            }])
    .controller('DashController', ['$scope', '$rootScope','$log','$http',
        function ($scope, $rootScope,$log, $http) {

            $scope.chartVendedores = {};
            $scope.chartVendedores.type = 'BarChart';
            $scope.chartVendedores.showRowNumber = true;
            $scope.chartVendedores.showValue = true;

            $scope.produto = {
                title: "POST COM ANGULAR",
                description: "ANGULAR POST WEBSTORM COM SPRING BOOT",
                pages: 29,
                precos: [
                    {
                        value: 9,
                        bookType: "EBOOK"
                    }
                ]
            };
            
            var respostaUni = $http.get('http://localhost:8080/produtos/list');
            respostaUni.then(function (resp) {
                var resultado = resp.data;

                    console.log('resposta lista ' + JSON.stringify(resp));

            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });
            

            $scope.enviarDados = function(){
            	console.log('Salvando produto : '+JSON.stringify($scope.produto));
                var respostaUni = $http.post('http://localhost:8080/produtos/save',$scope.produto);
                respostaUni.then(function (resp) {
                    var resultado = resp.data;

                        console.log('resposta ' + JSON.stringify(resp));

                }, function (error) {
                    $log.error('Eror ' + JSON.stringify(error));
                    $rootScope.warn('ERRO ', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                });
            };


        }])
    .controller('LoginController', ['$scope', 'AuthService', '$window', '$rootScope', '$log', '$state', '$localStorage',
        function ($scope, AuthService, $window, $rootScope, $log, $state, $localStorage) {
            //console.log('iniciou o controler login');

            AuthService.logout();


            /*
             Metodo de Login
             */
            $scope.findUser = function (login) {
                ////console.log('usuario e senha digitados '+JSON.stringify(login));


                var resposta = AuthService.login(login);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    ////console.log('usuario e senha digitados '+JSON.stringify(resultado));
                    if (resultado.type) {
                        var user = resultado.data;

                        if (user.perfil.acessos == null) {
                            user.perfil.acessos = [];
                        }

                        AuthService.setUserSessionStorage(user);
                        $state.go('app.wellcome');
                        //console.log('login '+JSON.stringify( resultado.data));
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }

                }, function (error) {
                    $rootScope.warn('Erro ao realizar o login, favor contate o administrador do sistema.', 'ATENÇÃO', function () {
                        ////console.log('mensagem enviadoa');
                    });

                    $log.error('Eror ' + error);
                });

            };

        }])
    .controller('SidebarController', ['$rootScope', '$scope', '$state', '$location', '$http', '$timeout', 'APP_MEDIAQUERY', 'AuthService', 'APP_MENUS',
        function ($rootScope, $scope, $state, $location, $http, $timeout, mq, AuthService, APP_MENUS) {
            //console.log('carregando sidebar');
            var currentState = $rootScope.$state.current.name;

            var $win = $(window);
            var $html = $('html');
            var $body = $('body');


            $scope.menuItensSidebar = AuthService.menusAcessos();


            // Adjustment on route changes
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                currentState = toState.name;
                // Hide sidebar automatically on mobile
                $('body.aside-toggled').removeClass('aside-toggled');

                $rootScope.$broadcast('closeSidebarMenu');


            });


            // Normalize state on resize to avoid multiple checks
            $win.on('resize', function () {
                if (isMobile())
                    $body.removeClass('aside-collapsed');
                else
                    $body.removeClass('aside-toggled');
            });

            // Check item and children active state
            var isActive = function (item) {

                if (!item) return;

                if (!item.sref || item.sref == '#') {
                    var foundActive = false;
                    angular.forEach(item.submenu, function (value, key) {
                        if (isActive(value)) foundActive = true;
                    });
                    return foundActive;
                }
                else
                    return $state.is(item.sref);
            };

            // Load menu from json file
            // -----------------------------------

            $scope.getMenuItemPropClasses = function (item) {
                return (item.heading ? 'nav-heading' : '') +
                    (isActive(item) ? ' active' : '');
            };


            // Handle sidebar collapse items
            // -----------------------------------
            var collapseList = [];
            var collapseListItem = [];


            $scope.alterCollapseItem = function ($index) {
                $event.stopPropagation();
                collapseList[$index] = !collapseList[$index];
            };

            $scope.addCollapse = function ($index, item) {
                collapseList[$index] = !isActive(item);
            };
            $scope.addCollapseItem = function ($index, item) {
                // //console.log('Item +'+JSON.stringify(item)+' posicao '+$index);
                collapseListItem[$index] = !isActive(item);
                ////console.log(JSON.stringify(collapseListItem));
            };


            $scope.isCollapse = function ($index) {
                return (collapseList[$index]);
            };
            $scope.isCollapseItem = function ($index) {
                ////console.log('item '+$index+' '+JSON.stringify(collapseListItem[$index]));
                return (collapseListItem[$index]);
            };

            $scope.toggleCollapse = function ($index) {
                //console.log('entrou');
                // collapsed sidebar doesn't toggle drodopwn
                if (isSidebarCollapsed() && !isMobile()) return true;
                // make sure the item index exists
                if (typeof collapseList[$index] === undefined) return true;

                closeAllBut($index);
                collapseList[$index] = !collapseList[$index];

                return true;

                function closeAllBut($index) {
                    angular.forEach(collapseList, function (v, i) {
                        if ($index !== i)
                            collapseList[i] = true;
                    });
                }
            };
            $scope.toggleCollapseItem = function ($index) {
                // //console.log('entrou');
                // collapsed sidebar doesn't toggle drodopwn
                if (isSidebarCollapsed() && !isMobile()) {
                    ////console.log('primeiro if');
                    return true;
                }
                // make sure the item index exists
                if (typeof collapseListItem[$index] === undefined) {
                    ////console.log('segundo if');
                    return true;
                }

                closeAllBut($index);
                collapseListItem[$index] = !collapseListItem[$index];
                ////console.log('INDEX' + $index + ' collapse ' + collapseListItem[$index]);
                return true;

                function closeAllBut($index) {
                    ////console.log('entrou no for');
                    angular.forEach(collapseListItem, function (v, i) {
                        if ($index !== i)
                            collapseListItem[i] = true;
                    });
                }
            };

            // Helper checks
            // -----------------------------------

            function isMobile() {
                return $win.width() < mq.tablet;
            }

            function isTouch() {
                return $html.hasClass('touch');
            }

            function isSidebarCollapsed() {
                return $body.hasClass('aside-collapsed');
            }

            function isSidebarToggled() {
                return $body.hasClass('aside-toggled');
            }


        }])
    .controller('UserBlockController', ['$scope', function ($scope) {
        ////console.log('passou no UserBlockController');
        $scope.userBlockVisible = true;

        $scope.$on('toggleUserBlock', function (event, args) {

            $scope.userBlockVisible = !$scope.userBlockVisible;

        });

    }])
    .controller('ProfileController', ['$scope', 'AuthService', '$window', '$rootScope', '$log', '$state', 'APP_END_POINT',
        function ($scope, AuthService, $window, $rootScope, $log, $state, APP_END_POINT) {
            //console.log('iniciou o controler de profile');
            var usuarioRoot = AuthService.getUserSessionStorage();
            $scope.usuarioProfile = usuarioRoot;

            //$scope.usuarioProfile.desSenha1=usuarioRoot.desSenha;
            //$scope.usuarioProfile.desSenha2=usuarioRoot.desSenha;
            $scope.usuarioProfile.nome2 = usuarioRoot.nome;
            $scope.usuarioProfile.desEmail2 = usuarioRoot.desEmail;

            $scope.addUsuarioProfile = function (usuarioProfile) {
                var resposta = AuthService.setUsuarioProfile(usuarioProfile);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    var user = resultado.data;
                    ////console.log(JSON.stringify(resultado));

                    if (resultado.type) {

                        AuthService.setUserSessionStorage(user);


                        $rootScope.alert('' + resultado.des, 'OK', function () {
                            //console.log('mensagem enviadoa');
                        });

                    } else {
                        //AuthService.setUserLocalStorage(null);
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }

                }, function (error) {
                    $log.error('Eror ' + error);
                });

            };


        }])
    .controller('WellcomeController', ['$scope', 'toaster', 'PessoaService', '$log', '$http', function ($scope, toaster, PessoaService, $log, $http) {

        $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        };


        $scope.gridOptions = {
            enableFiltering: true,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            },
            columnDefs: [
                {field: 'name'},
                {field: 'gender', visible: false},
                {field: 'company'}
            ],
            data: [
                {name: 'Herculano', gender: 'Macho', company: 'Algar tech'},
                {name: 'Jeferson', gender: 'Macho', company: 'Algar tech'}
            ],
            enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'myFile.csv',
            exporterPdfDefaultStyle: {fontSize: 9},
            exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
            exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
            exporterPdfHeader: {text: "My Header", style: 'headerStyle'},
            exporterPdfFooter: function (currentPage, pageCount) {
                return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
            },
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
                docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

/////////////////////////////////////////////////////////////////// autocomplete ////////////////////////////


        $scope.getPessoas = function (val) {
            return PessoaService.getPessoasURLAsync(val);
        };


    }])
    .controller('NullController', ['$scope', function ($scope) {
    }])
    .controller('CreateUserController', ['$scope', 'toaster', 'AuthService', '$rootScope', '$state',
        function ($scope, toaster, AuthService, $rootScope, $state) {
            $scope.perfils = [];

            var respostaPerfil = AuthService.getPerfils();
            respostaPerfil.then(function (resp) {
                var resultado = resp.data;

                if (resultado.type) {
                    $scope.perfils = resultado.data;
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        // //console.log('mensagem enviadoa');
                    });
                }
            }, function (err) {
                $rootScope.warn('Problema ao buscar os perfis, favor contactar ao administrador.', 'ATENÇÃO', function () {
                    // //console.log('mensagem enviadoa');
                });
            });

            $scope.addUsuario = function (usuario) {
                var resposta = AuthService.setUsuario(usuario);
                resposta.then(function (resp) {

                    var resultado = resp.data;

                    if (resultado.type) {
                        $rootScope.alert('' + resultado.des, 'OK', function () {
                            // //console.log('mensagem enviadoa');
                        });
                        $state.go('app.alteruser');
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //  //console.log('mensagem enviadoa');
                        });
                    }


                }, function (error) {
                    $rootScope.warn('Problema ao criar o usuário, favor contactar ao administrador.', 'ATENÇÃO', function () {
                        //  //console.log('mensagem enviadoa');
                    });
                });
            };

        }])
    .controller('CriarPerfilController', ['$scope', 'toaster', 'AuthService', '$rootScope', '$state', '$log',
        function ($scope, toaster, AuthService, $rootScope, $state, $log) {
            //console.log('entrou no criar perfil');

            $scope.addPerfil = function (perfil) {
                //console.log('adicionando perfil : ' + perfil);
                var perfilEnvio = {nome: perfil.toUpperCase()};
                var respostaPerfil = AuthService.setPerfilApp(perfilEnvio);
                respostaPerfil.then(function (resp) {
                    var resultado = resp.data;


                    if (resultado.type) {
                        var data = resultado.data;
                        //console.log(JSON.stringify(data));
                        toaster.pop('sucess', 'Perfil', 'Perfil incluido com sucesso!');
                        $state.go('app.alterperfil');
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }
                }, function (error) {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                    $log.error('Eror ' + error);
                });

            };

        }])
    .controller('AlterPerfilController', ['$scope', 'toaster', 'AuthService', '$rootScope', '$state', 'APP_MENUS',
        function ($scope, toaster, AuthService, $rootScope, $state, APP_MENUS) {
            $scope.perfilSelect = null;
            $scope.menuItemsPerfil = [];
            var menus = AuthService.menusVisiveis();
            /*
             Busca de Acessos Cadastrados
             */

            $scope.perfils = [];
            var resposta = AuthService.getPerfils();
            resposta.then(function (resp) {
                var resultado = resp.data;


                if (resultado.type) {


                    $scope.perfils = resultado.data;

                    for (var i = 0; i < $scope.perfils.length; i++) {
                        if ($scope.perfils[i].acessos == null) {
                            $scope.perfils[i].acessos = [];
                        }
                    }


                    //console.log(JSON.stringify($scope.perfils));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
            });


            $scope.changePerfil = function (id) {

                var filtro = $scope.perfils.filter(function (perfil) {
                    return perfil._id == id;
                });

                var perfilFiltrado = filtro[0];

                if (perfilFiltrado.nome == 'ADMIN') {
                    $scope.menuItemsPerfil = [];
                    id = null;
                    $scope.perfilSelect = null;
                    $rootScope.warn('Perfil ADMIN não pode ser alterado!', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                } else {
                    var perfilFil = $scope.perfils.filter(function (perfil) {
                        return perfil._id == id;
                    });

                    ////console.log('perfil ' + JSON.stringify(perfilFil));
                    $scope.menuItemsPerfil = AuthService.modeloMenuPerfil(menus, perfilFil);
                    ////console.log('menus ' + JSON.stringify(AuthService.getMenuPerfilSessionStorage()));

                }


            };


            $scope.changeRotaPerfil = function (idRota, modelo) {
                var liberacao = '';
                if (modelo == true) {
                    liberacao = 'liberado';
                } else {
                    liberacao = 'negado';
                }
                //alert('id: '+idRota+' modelo : '+modelo);

                var alter = {idRota: idRota, modelo: modelo, idPerfil: $scope.perfilSelect};

                var respostaAlteraPerfil = AuthService.putPerfil(alter);
                respostaAlteraPerfil.then(function (resp) {
                    var resultado = resp.data;


                    if (resultado.type) {

                        toaster.pop('sucess', 'Acesso', '' + resultado.des);
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }
                }, function (error) {
                    $rootScope.warn('Falha ao buscar as rotas, contate o Administrador', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                    $log.error('Eror ' + error);
                });

            };

        }])
    .controller('RecoverController', ['$scope', 'AuthService', '$window', '$rootScope', '$log', '$state', '$stateParams',
        function ($scope, AuthService, $window, $rootScope, $log, $state, $stateParams) {
            $scope.usuarioRecover = AuthService.getUserSessionStorage();
            //console.log('iniciou o controler de alteração de recovery');


            if (!$scope.usuarioRecover) {
                $state.go('page.login');
            }


            $scope.resetSenha = function (userSenha) {
                $scope.usuarioRecover.desSenha = userSenha.senha2;
                var resposta = AuthService.setResetSenha($scope.usuarioRecover);
                resposta.then(function (resp) {
                    var resultado = resp.data;

                    if (resultado.type) {

                        AuthService.alterPass(userSenha);
                        $state.go('app.wellcome');
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }

                }, function (error) {

                });
            };


        }])
    .controller('BuscarPessoaController', ['$scope', '$log', '$state', 'PessoaService', 'toaster', '$rootScope',
        function ($scope, $log, $state, PessoaService, toaster, $rootScope) {
            $scope.pessoas = [];
            $scope.pessoa = {};
            $scope.urlRemotaBuscaPessoas = PessoaService.getURLRemota();
            $scope.limparBusca = function () {
                $scope.pessoa.cgc = "";
                $scope.pessoa = {};
                $scope.pessoas = [];
            };


            $scope.findPessoa = function (pessoa) {

                var respostaPessoas = PessoaService.getPessoas(pessoa);
                respostaPessoas.then(function (resp) {
                    var resultado = resp.data;

                    if (resultado.type == true) {
                        ////console.log('resultado  : ' + JSON.stringify(resultado));
                        $scope.pessoas = resultado.data;
                        toaster.pop('sucess', 'BUSCA', 'Encontrado ' + $scope.pessoas.length + ' pessoa(s)');
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }
                }, function (err) {
                    $log.error('Eror ' + error);
                    $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                });

            };

            $scope.editarPessoa = function (id) {
                var pessoaFiltrada = $scope.pessoas.filter(function (p) {
                    return p._id == id;
                });
                $state.go('app.createpessoa', {pessoa: pessoaFiltrada[0]});
                ////console.log('pessoa  : ' + JSON.stringify(pessoa));
            };

        }])
    .controller('CreatePessoaController', ['$scope', '$log', '$state', 'PessoaService', 'toaster', '$rootScope', '$stateParams', 'AuthService',
        function ($scope, $log, $state, PessoaService, toaster, $rootScope, $stateParams, AuthService) {
            //console.log('iniciou o controler CreatePessoaController');
            $scope.cgcValido = false;
            $scope.pessoa = {};
            $scope.dtaCriacaoPessoa = new Date().toLocaleDateString();
            $scope.flgAlteracao = 0;

            $scope.listaTipoPessoa = [
                {id: 0, descricao: 'Cliente', selecionado: false},
                {id: 1, descricao: 'Fornecedor', selecionado: false},
                {id: 2, descricao: 'Funcionario', selecionado: false}
            ];

            $scope.listaTipoFuncionaro = [
                {id: 0, descricao: 'Motorista', selecionado: false},
                {id: 1, descricao: 'Conferente', selecionado: false}
            ];

            $scope.btnGravarAlterar = 'Criar Pessoa';

            var pessoaAlter = $stateParams.pessoa;

            //console.log('pessoa alter'+JSON.stringify(pessoaAlter));

            $scope.enderecoPrincipal = {
                cep: null,
                logradouro: null,
                complemento: null,
                bairro: null,
                localidade: null,
                uf: null,
                unidade: null,
                ibge: null,
                gia: null,
                status: false,
                complementoStatus: false
            };


            var ativarTipoPessoa = function (pessoaAlter) {
                if (pessoaAlter.flgCliente == 'S') {
                    $scope.listaTipoPessoa[0].selecionado = true;
                }

                if (pessoaAlter.flgFornecedor == 'S') {
                    $scope.listaTipoPessoa[1].selecionado = true;
                }

                if (pessoaAlter.flgFuncionario == 'S') {
                    $scope.listaTipoPessoa[2].selecionado = true;
                }

                if (pessoaAlter.flgMotorista == 'S') {
                    $scope.listaTipoFuncionaro[0].selecionado = true;
                }


                if (pessoaAlter.flgConferente == 'S') {
                    $scope.listaTipoFuncionaro[1].selecionado = true;
                }
            };


            if (pessoaAlter != null) {
                ////console.log('Setando a pessoa para alterar '+JSON.stringify(pessoaAlter));
                $scope.flgAlteracao = 1;
                $scope.cgcValido = true;
                $scope.pessoa = pessoaAlter;

                if (!pessoaAlter.endereco || typeof(pessoaAlter.endereco) == "undefined" || pessoaAlter.endereco == null) {
                    $scope.enderecoPrincipal = {
                        cep: null,
                        logradouro: null,
                        complemento: null,
                        bairro: null,
                        localidade: null,
                        uf: null,
                        unidade: null,
                        ibge: null,
                        gia: null,
                        status: false,
                        complementoStatus: false
                    };
                } else {
                    $scope.enderecoPrincipal = pessoaAlter.endereco;
                }

                ativarTipoPessoa(pessoaAlter);
                $scope.btnGravarAlterar = 'Alterar Pessoa';
                $scope.dtaCriacaoPessoa = new Date($scope.pessoa.dtaInclusao).toLocaleDateString();


            } else {
                $scope.pessoa.usuarioInclusao = AuthService.getUserSessionStorage().nomUsuario;
                $scope.pessoa.status = 'A';
            }


            ////console.log('PESSOA RECEBIDA '+JSON.stringify(pessoaAlter));


            var resetPessoaInclusao = function () {
                $scope.cgcValido = false;
                pessoa = {};
                $scope.pessoa = {};
                $scope.enderecoPrincipal = {
                    cep: null,
                    logradouro: null,
                    complemento: null,
                    bairro: null,
                    localidade: null,
                    uf: null,
                    unidade: null,
                    ibge: null,
                    gia: null,
                    status: false,
                    complementoStatus: false
                };

                for (var i = 0; i < $scope.listaTipoPessoa.length; i++) {
                    $scope.listaTipoPessoa[i].selecionado = false;
                }

            };

            $scope.deletarPessoa = function (id) {
                $rootScope.confirm('Deseja realmente excluir esta pessoa', function () {
                    ////console.log('positivo');
                    var resposta = PessoaService.deletePessoa(id);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type == true) {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                            $state.go('app.buscarpessoa');
                            //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });


                }, function () {
                    ////console.log('negativo');
                }, 'Excluir');
            };

            $scope.isCheckBoxValido = function () {
                var resul = $scope.listaTipoPessoa.filter(function (lista) {
                    return lista.selecionado == true;
                });
                if (resul.length > 0) {
                    ////console.log('checkbox valido');
                    return true;
                } else {
                    ////console.log('checkbox invalido');
                    return false;
                }
            };

            $scope.isCheckBoxValidoFuncionario = function () {
                var resul = $scope.listaTipoFuncionaro.filter(function (lista) {
                    return lista.selecionado == true;
                });

                if (resul.length > 0) {
                    ////console.log('checkbox valido');
                    return true;
                } else {
                    ////console.log('checkbox invalido');
                    return false;
                }
            };

            $scope.isClienteSelecionado = function () {
                var resul = $scope.listaTipoPessoa.filter(function (lista) {
                    return lista.selecionado == true && lista.descricao == "Cliente";
                });

                if (resul.length > 0) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.validarCGCClick = function (cgc) {

                var respostaValidaCGC = PessoaService.validaCGC(cgc);
                respostaValidaCGC.then(function (resp) {
                    var resultado = resp.data;

                    if (resultado.type == true) {
                        $scope.cgcValido = true;
                        toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }
                }, function (error) {
                    $log.error('Eror ' + error);
                    $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                });
            };


            $scope.selecionandoTipo = function (tipo) {

            };

            function tipoPessoa(pessoa) {
                if ($scope.listaTipoPessoa[0].selecionado == true) {
                    pessoa.flgCliente = 'S';
                } else {
                    pessoa.flgCliente = 'N';
                }

                if ($scope.listaTipoPessoa[1].selecionado == true) {
                    pessoa.flgFornecedor = 'S';
                } else {
                    pessoa.flgFornecedor = 'N';
                }

                if ($scope.listaTipoPessoa[2].selecionado == true) {
                    pessoa.flgFuncionario = 'S';
                } else {
                    pessoa.flgFuncionario = 'N';
                }

                return pessoa;
            };

            function tipoFuncionario(pessoa) {
                if ($scope.listaTipoFuncionaro[0].selecionado == true) {
                    pessoa.flgMotorista = 'S';
                } else {
                    pessoa.flgMotorista = 'N';
                }


                if ($scope.listaTipoFuncionaro[1].selecionado == true) {
                    pessoa.flgConferente = 'S';
                } else {
                    pessoa.flgConferente = 'N';
                }

                return pessoa;

            };

            $scope.addPessoa = function (pessoa, form) {
                pessoa.endereco = $scope.enderecoPrincipal;
                pessoa = tipoPessoa(pessoa);
                pessoa = tipoFuncionario(pessoa);

                //console.log('pessoa ' + JSON.stringify(pessoa));
                if ($scope.cgcValido == false) {
                    $rootScope.warn('Clique em validar primeiro', 'ATENÇÃO', function () {
                    });
                } else if (form.$invalid == true) {
                    $rootScope.warn('Favor atentar-se aos campos obrigatorios', 'ATENÇÃO', function () {
                    });
                } else {

                    var respostaPessoa = PessoaService.postPessoa(pessoa);
                    respostaPessoa.then(function (resp) {
                        var resultado = resp.data;

                        if (resultado.type == true) {
                            //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                            $rootScope.alert('' + resultado.des, 'OK', function () {
                                //console.log('mensagem enviadoa');
                            });
                            resetPessoaInclusao();
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                                //console.log('mensagem enviadoa');
                            });
                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });
                }
            };


            $scope.buscaCEP = function (cep) {
                if (cep == null || cep.length == 0 || typeof(cep) == "undefined") {
                    $rootScope.warn('O numero do CEP esta incorreto!.', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });

                    $scope.enderecoPrincipal = {
                        cep: null,
                        logradouro: null,
                        complemento: null,
                        bairro: null,
                        localidade: null,
                        uf: null,
                        unidade: null,
                        ibge: null,
                        gia: null,
                        status: false,
                        complementoStatus: false
                    };
                } else {
                    //console.log('cep :' + cep);
                    var respostaBuscaCep = PessoaService.buscaCEPNet(cep);
                    respostaBuscaCep.then(function (resp) {
                        var resultado = resp.data;
                        //console.log(JSON.stringify(resp.data));
                        if (typeof(resultado.erro) == 'undefined') {
                            $scope.enderecoPrincipal = resultado;
                            $scope.enderecoPrincipal.status = false;
                            //console.log('endereco ' + JSON.stringify($scope.enderecoPrincipal));
                            if ($scope.enderecoPrincipal.complemento == null || $scope.enderecoPrincipal.complemento == '' || $scope.enderecoPrincipal.complemento == undefined) {
                                $scope.enderecoPrincipal.complementoStatus = true;
                            }

                            toaster.pop('sucess', 'BUSCA', 'CEP encontrado!');
                        } else {
                            $scope.enderecoPrincipal = {
                                cep: null,
                                logradouro: null,
                                complemento: null,
                                bairro: null,
                                localidade: null,
                                uf: null,
                                unidade: null,
                                ibge: null,
                                gia: null,
                                status: true,
                                complementoStatus: true
                            };
                            toaster.pop('error', 'BUSCA', 'CEP não encontrado, digite o endereço!');
                        }
                    }, function (err) {
                        $scope.enderecoPrincipal = {
                            cep: null,
                            logradouro: null,
                            complemento: null,
                            bairro: null,
                            localidade: null,
                            uf: null,
                            unidade: null,
                            ibge: null,
                            gia: null,
                            status: true,
                            complementoStatus: true
                        };
                        $log.error('Eror ' + err);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });
                }
            };

        }])
    .controller('404Controller', ['$scope', 'AuthService', '$window', '$rootScope', '$log', '$state',
        function ($scope, AuthService, $window, $rootScope, $log, $state) {
            //console.log('iniciou o controler 404');


        }])
    .controller('NRouteController', ['$scope', 'AuthService', '$window', '$rootScope', '$log', '$state',
        function ($scope, AuthService, $window, $rootScope, $log, $state) {
            //console.log('iniciou o controler de n route');


        }])
    .controller('AlterUserController', ['$scope', 'AuthService', '$window', '$rootScope', '$log', '$state', '$filter',
        function ($scope, AuthService, $window, $rootScope, $log, $state, $filter) {
            //console.log('iniciou o controler de alteração de usuario');
            $scope.userValido = 0;
            $scope.usuario = {};
            /*
             Busca de Usuarios
             */
            $scope.usuarios = [];
            var resposta = AuthService.getUsuarios();
            resposta.then(function (resp) {
                var resultado = resp.data;
                // //console.log(JSON.stringify(usuarios));

                if (resultado.type) {
                    $scope.usuarios = resultado.data;
                    //console.log(JSON.stringify($scope.usuarios));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
            });


            $scope.perfils = [];

            var respostaPerfil = AuthService.getPerfils();
            respostaPerfil.then(function (resp) {
                var resultado = resp.data;

                if (resultado.type) {
                    $scope.perfils = resultado.data;
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (err) {
                $rootScope.warn('Problema ao buscar os perfis, favor contactar ao administrador.', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });

            $scope.changeUser = function (id) {
                //alert('alterou id: ' + id);
                var filtro = $scope.usuarios.filter(function (usuario) {
                    return usuario._id == id;
                });

                var userProvisorio = filtro[0];

                //console.log('usuario '+JSON.stringify(userProvisorio));

                if (userProvisorio.nomUsuario == 'admin') {
                    $scope.userValido = 0;
                    $rootScope.warn('Usuário Admin não pode ser alterado.', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                } else {
                    $scope.userValido = 1;
                    var usuarios = $filter('filter')($scope.usuarios, {_id: id}, true);
                    $scope.usuario = usuarios[0];
                    ////console.log('objeto' + JSON.stringify($scope.usuario));
                }
            };

            $scope.alterUsuario = function (userAlter) {
                ////console.log('objeto' + JSON.stringify(userAlter));
                var resposta = AuthService.putUsuario(userAlter);
                resposta.then(function (resp) {
                    var resultado = resp.data;

                    if (resultado.type) {
                        $rootScope.alert('' + resultado.des, 'OK', function () {
                            //console.log('mensagem enviadoa');
                        });
                        $state.go('app.wellcome');
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }
                }, function (error) {
                    $log.error('Eror ' + error);
                });
            };


        }])
    .controller('LockController', ['$scope', 'AuthService', '$window', '$rootScope', '$log', '$state', function ($scope, AuthService, $window, $rootScope, $log, $state) {

        AuthService.block();

        $scope.desbloquear = function (senha) {
            if (AuthService.unBlock(senha)) {
                $state.go('app.wellcome');
            } else {
                $rootScope.warn('Senha incorreta!', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            }
        };

    }])
    .controller('FileUploadController', ['$scope', function ($scope) {
        'use strict';


        angular.element(document).ready(function () {

            var progressbar = $('#progressbar'),
                bar = progressbar.find('.progress-bar'),
                settings = {

                    action: 'server/upload.php', // upload url

                    allow: '*.(jpg|jpeg|gif|png)', // allow only images

                    param: 'upfile',

                    loadstart: function () {
                        bar.css('width', '0%').text('0%');
                        progressbar.removeClass('hidden');
                    },

                    progress: function (percent) {
                        percent = Math.ceil(percent);
                        bar.css('width', percent + '%').text(percent + '%');
                    },

                    allcomplete: function (response) {

                        bar.css('width', '100%').text('100%');

                        setTimeout(function () {
                            progressbar.addClass('hidden');
                        }, 250);

                        // Upload Completed
                        alert(response);
                    }
                };

            var select = new $.upload.select($('#upload-select'), settings),
                drop = new $.upload.drop($('#upload-drop'), settings);
        });

    }])
    .controller('UnidadeController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'ItemService',
        function ($scope, $log, $state, toaster, $rootScope, ItemService) {
            $scope.unidades = [];
            $scope.unidade = {};
            $scope.codUnidade = null;
            var unidadeAntiga = {};

            var respostaUni = ItemService.getUnidades();
            respostaUni.then(function (resp) {
                var resultado = resp.data;
                if (resultado.type == true) {
                    //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    $scope.unidades = resultado.data;
                    //console.log('unidades ' + JSON.stringify($scope.unidades));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ao buscar as unidades.', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });


            $scope.alteraUnidade = function (unidade) {
                //alert('unidade : '+ JSON.stringify(unidade));
                var result = $scope.unidades.filter(function (uni) {
                    return uni._id == unidade;
                });

                unidadeAntiga = result[0];
                $scope.unidade = unidadeAntiga;
            };

            $scope.limparUnidade = function () {
                $scope.unidade = {};
            };

            $scope.deletarUnidade = function (id) {
                $rootScope.confirm("Deseja realmente excluir a unidade?", function () {
                    var resposta = ItemService.delUnidade(id);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type == true) {
                            toaster.pop('sucess', 'Deletado com sucesso!', '' + resultado.des);
                            $scope.unidades = resultado.data;
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                                //console.log('mensagem enviadoa');
                            });

                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });
                }, function () {

                }, 'Excluir');

            };


            $scope.addUnidade = function (unidade) {
                //alert('unidade : '+ JSON.stringify(unidade));
                // alert('unidades : '+ JSON.stringify($scope.unidades));
                if (unidade.tx == 1) {
                    $rootScope.warn('A taxa de conversão deve ser maior do que 1, somente o agrupamento UNIDADE tem a taxa de conversão como 1, e ela não pode ser alterada.', 'ATENÇÃO', function () {
                        //console.log(JSON.stringify($scope.unidades));
                    });
                } else {

                    var resposta = ItemService.setUnidade(unidade);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type == true) {
                            toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                            $scope.unidades = resultado.data;
                            $scope.unidade = {};
                            $scope.codUnidade = null;
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                                //console.log(JSON.stringify($scope.unidades));
                            });
                            $scope.unidades = resultado.data;
                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });
                }
            };

        }])
    .controller('CreateItemController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'ItemService', 'AuthService',
        function ($scope, $log, $state, toaster, $rootScope, ItemService, AuthService) {
            $scope.item = {};
            $scope.itens = [];
            $scope.unidades = [];
            $scope.unidadeEscolhida = {_id: null};
            $scope.usuarios = [];
            $scope.desUsuario = {_id: null, descMax: null};
            $scope.ruas = [];
            $scope.panelValor = true;
            $scope.panelUnidade = true;
            $scope.panelValorItem = true;
            $scope.valorUnit = {_id: null, valor: null, desc_max: null, dta_inclusao: null};
            $scope.flgItemPesquisado = 0;
            $scope.flgPesquisado = 0;

            $scope.limparItem = function () {
                inicializaItemZerado();
                $scope.flgItemPesquisado = 0;
            };
            $scope.codValorEspecifico = null;
            $scope.listaTipoValores = [
                {_id: 1, nome: 'Vendedor'}
            ];


            $scope.alteraUnidade = function (codUnidade) {
                // $scope.codUnidade=codUnidade;
                //   alert('unidade ' + codUnidade + ' cod unidade ' + $scope.codUni+' objeto unidade '+JSON.stringify($scope.unidadeEscolhida));

            };

            if ($scope.flgPesquisado == 0) {

                inicializaItemZerado();
            }


            function inicializaItemZerado() {
                //console.log('zerando itens');
                $scope.item = {};
                $scope.item.unidades = [];
                $scope.item.valorUser = [];
                $scope.item.valores = [];
                $scope.item.status = 'A';
                $scope.flgItemPesquisado = 0;

            };


            var respostaUni = ItemService.getRuas();
            respostaUni.then(function (resp) {
                var resultado = resp.data;
                if (resultado.type == true) {
                    //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    $scope.ruas = resultado.data;
                    //console.log('unidades ' + JSON.stringify($scope.unidades));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ao buscar as ruas.', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });


            $scope.addValorUnit = function () {
                if ($scope.valorUnit.valor == null || $scope.valorUnit.desc_max == null) {
                    $rootScope.warn('Para adicionar é necessário um valor e um percentual de desconto!.', 'ATENÇÃO', function () {
                    });
                } else {
                    var tamanho = $scope.item.valores.length;
                    var valor = {
                        _id: proximoId($scope.item.valores),
                        valor: $scope.valorUnit.valor,
                        desc_max: $scope.valorUnit.desc_max
                    };
                    $scope.item.valores.push(valor);
                    $scope.valorUnit = {};

                    /*
                     $scope.item.valores.sort(function (a, b) {
                     if(a._id > b._id){
                     return -1;
                     }
                     if(a._id < b._id){
                     return 1;
                     }
                     return 0;
                     });
                     */
                }
            };


            $scope.deletarItem = function (id) {
                $rootScope.confirm('Deseja realmente excluir este item!', function () {
                    ////console.log('positivo');
                    var resposta = ItemService.delItem(id);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type == true) {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                            inicializaItemZerado();
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });


                }, function () {
                    ////console.log('negativo');
                }, 'Excluir');
            };

            $scope.deletarValorUnit = function (id) {
                for (var i = 0; i < $scope.item.valores.length; i++) {
                    if (id == $scope.item.valores[i]._id) {
                        $scope.item.valores.splice(i, 1);
                    }
                }
            };

            $scope.deletarUnidade = function (id) {
                //console.log('retirando unidade');
                for (var i = 0; i < $scope.item.unidades.length; i++) {
                    if (id == $scope.item.unidades[i]._id) {
                        $scope.item.unidades.splice(i, 1);
                    }
                }
            };

            function verificaItem(item) {
                var retorno = {tipo: false, des: '', item: null};
                if ($scope.item.unidades.length == 0) {
                    retorno.des = 'Não foi incluido nenhuma unidade, inclua pelo menos uma!';
                    return retorno;
                } else if ($scope.item.valores.length == 0) {
                    retorno.des = 'Não foi incluido nenhum valor, inclua pelo menos um!';
                    return retorno;
                } else {
                    retorno.tipo = true;
                    retorno.des = 'Incluido com sucesso!';
                    retorno.item = item;
                    return retorno;
                }
            };

            function proximoId(arrayProximo) {
                var proximo = -1;
                if (arrayProximo.length == 0) {
                    proximo = 1;
                    return proximo;
                } else {
                    for (var i = 0; i < arrayProximo.length; i++) {

                        proximo = arrayProximo[i]._id + 1;
                    }
                    return proximo;
                }
            }

            $scope.pesquisarItem = function () {
                var resposta = ItemService.getItens($scope.item);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type) {
                        $scope.flgPesquisado = 1;
                        $scope.itens = resultado.data;
                        ////console.log('data'+JSON.stringify(resultado.data));
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }
                }, function (error) {
                    $rootScope.warn('Erro na busca contate o Administrador.', 'ATENÇÃO', function () {
                    });
                    $log.error('Eror ' + error);
                });
            };

            $scope.voltarBusca = function () {
                $scope.flgPesquisado = 0;
                $scope.itens = [];
            };

            $scope.visualizarItem = function (id) {
                var filtro = $scope.itens.filter(function (iten) {
                    return iten._id == id;
                });
                $scope.item = filtro[0];
                $scope.flgPesquisado = 0;
                $scope.flgItemPesquisado = 1;

                //console.log('item '+JSON.stringify($scope.item));
            };

            $scope.addItem = function (item) {
                //alert('item '+JSON.stringify(item));
                var retorno = verificaItem($scope.item);

                if (retorno.tipo == false) {
                    $rootScope.warn('' + retorno.des, 'ATENÇÃO', function () {
                    });
                } else {
                    //toaster.pop('sucess', 'Cadastro', '' + retorno.des);
                    //alert('item '+JSON.stringify(retorno.item));
                    var resposta = ItemService.setItem(retorno.item, $scope.flgItemPesquisado);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type) {
                            toaster.pop('sucess', 'OK', '' + resultado.des);
                            $scope.panelUnidade = true;
                            $scope.panelValor = true;
                            $scope.panelValorItem = true;

                            inicializaItemZerado();

                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('Contate o administrador : ' + error, 'ATENÇÃO', function () {
                        });
                    });
                }

            };

            $scope.addValorUser = function () {
                //console.log('des usuario ' + JSON.stringify($scope.desUsuario));
                if ($scope.desUsuario._id == null || $scope.desUsuario._id == "" || $scope.desUsuario.descMax == null || typeof($scope.desUsuario.descMax) == "undefined") {
                    $rootScope.warn('Selecione um usuário e adicione um valor de desconto minimo.', 'ATENÇÃO', function () {
                    });
                } else {
                    ////console.log('valor USER : '+JSON.stringify($scope.item.valorUser));
                    var filtroResul = $scope.item.valorUser.filter(function (vlr) {
                        return vlr._id == $scope.desUsuario._id;
                    });

                    if (filtroResul != null && filtroResul.length > 0) {
                        $rootScope.warn('Já foi adicionado o desconto para o usuário, exclua-o e adicione novamente.', 'ATENÇÃO', function () {
                        });
                    } else {

                        var users = $scope.usuarios.filter(function (user) {
                            return user._id == $scope.desUsuario._id;
                        });
                        var nome = users[0].nome;
                        var valorUser = {_id: $scope.desUsuario._id, nome: nome, descMax: $scope.desUsuario.descMax};
                        $scope.item.valorUser.push(valorUser);
                        $scope.desUsuario = {};
                    }
                }
            };

            $scope.deletaValorUser = function (id) {
                for (var i = 0; i < $scope.item.valorUser.length; i++) {
                    if ($scope.item.valorUser[i]._id == id) {
                        $scope.item.valorUser.splice(i, 1);
                    }
                }
            };

            var resposta = AuthService.getUsuarios();
            resposta.then(function (resp) {
                var resultado = resp.data;
                // //console.log(JSON.stringify(usuarios));

                if (resultado.type) {
                    $scope.usuarios = resultado.data;
                    ////console.log(JSON.stringify($scope.usuarios));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
            });

            $scope.addUnidade = function () {
                if ($scope.unidadeEscolhida._id == null) {
                    $rootScope.warn('Selecione uma unidade primeiro.', 'ATENÇÃO', function () {
                    });
                } else {
                    var filtro = $scope.item.unidades.filter(function (unidade) {
                        return unidade._id == $scope.unidadeEscolhida._id;
                    });
                    if (filtro != null && filtro.length > 0) {
                        $rootScope.warn('Unidade já adicionada', 'ATENÇÃO', function () {
                        });
                    } else {
                        var unidadeFiltro = $scope.unidades.filter(function (unidade) {
                            return unidade._id == $scope.unidadeEscolhida._id;
                        });
                        $scope.item.unidades.push(unidadeFiltro[0]);
                        $scope.unidadeEscolhida._id = null;
                    }
                }
            };
            var respostaUni = ItemService.getUnidades();
            respostaUni.then(function (resp) {
                var resultado = resp.data;
                if (resultado.type == true) {
                    //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    $scope.unidades = resultado.data;
                    ////console.log('unidades '+JSON.stringify($scope.unidades));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ao buscar as unidades.', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });

        }])
    .controller('VeiculoController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'VeiculoService',
        function ($scope, $log, $state, toaster, $rootScope, VeiculoService) {
            $scope.flgItemPesquisado = 0;
            $scope.flgPesquisado = 0;
            $scope.veiculo = {};
            $scope.veiculos = [];

            if ($scope.flgPesquisado == 0) {
                inicializaItemZerado();
            }

            function inicializaItemZerado() {
                $scope.veiculo = {};
                $scope.veiculo.status = "A";
                $scope.flgItemPesquisado = 0;
                $scope.flgPesquisado = 0;
            };

            $scope.addVeiculo = function (veiculo) {
////console.log('veiculo '+JSON.stringify(veiculo));
                var respVeiculo = VeiculoService.setVeiculo(veiculo, $scope.flgItemPesquisado);
                respVeiculo.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type == true) {
                        toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                        inicializaItemZerado();
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }
                }, function (error) {
                    $log.error('Eror ' + error);
                    $rootScope.warn('ERRO ao atualizar o veiculo.', 'ATENÇÃO', function () {
                    });
                });
            };

            $scope.voltarBusca = function () {
                $scope.flgPesquisado = 0;
                $scope.veiculos = [];
            };

            $scope.pesquisarVeiculo = function () {
                //console.log('pesquisando veiculo ' + JSON.stringify($scope.veiculo));
                var resposta = VeiculoService.findVeiculos($scope.veiculo);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type) {
                        $scope.flgPesquisado = 1;
                        $scope.veiculos = resultado.data;
                        ////console.log('data'+JSON.stringify(resultado.data));
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }
                }, function (error) {
                    $rootScope.warn('Erro na busca contate o Administrador.', 'ATENÇÃO', function () {
                    });
                    $log.error('Eror ' + error);
                });
            };

            $scope.limparVeiculo = function () {
                inicializaItemZerado();
            };

            $scope.visualizarVeiculo = function (id) {
                var filtro = $scope.veiculos.filter(function (veiculo) {
                    return veiculo._id == id;
                });

                $scope.veiculo = filtro[0];
                $scope.flgPesquisado = 0;
                $scope.flgItemPesquisado = 1;
            };

            $scope.deletarVeiculo = function (id) {
                $rootScope.confirm('Deseja realmente excluir este veiculo?', function () {
                    var resposta = VeiculoService.delVeiculo(id);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type == true) {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                            inicializaItemZerado();
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });


                }, function () {
                }, 'Excluir');
            };

        }])
    .controller('MovimentacaoController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'MovimentoService', 'VeiculoService', 'PessoaService', 'AuthService', '$stateParams', 'moment',
        function ($scope, $log, $state, toaster, $rootScope, MovimentoService, VeiculoService, PessoaService, AuthService, $stateParams, moment) {
            $scope.flgItemPesquisado = 0;

            $scope.flgMovOcupado = 0;

            $scope.movimento = {};
            $scope.movimentos = [];

            $scope.veiculoSelecionado = {};
            $scope.motoristaSelecionado = {};
            $scope.conferenteSelecionado = {};
            $scope.itemSelecionado = {};
            $scope.pessoaSelecionada = {};

            $scope.nomeVeiculoBusca = '';
            $scope.nomeMotoristaBusca = '';
            $scope.nomeConferenteBusca = '';
            $scope.nomeItensBusca = '';
            $scope.nomePessoaBusca = '';

            $scope.panelItens = false;

            $scope.subTipos = [
                {tipo: "E", id: 1, valor: "ENTRADA POR INVENTARIO", descricao: "ENTRADA POR INVENTÁRIO"},
                {tipo: "E", id: 2, valor: "ENTRADA DE FORNECEDOR", descricao: "ENTRADA DE FORNECEDOR"},
                {tipo: "E", id: 3, valor: "ENTRADA POR INVERSAO", descricao: "ENTRADA POR INVERSÃO"},
                {tipo: "E", id: 4, valor: "ENTRADA POR TRANSFERENCIA", descricao: "ENTRADA POR TRANSFERÊNCIA"},
                {
                    tipo: "E",
                    id: 5,
                    valor: "ENTRADA DE PRODUTOS RECUPERADOS",
                    descricao: "ENTRADA DE PRODUTOS RECUPERADOS"
                },
                {tipo: "E", id: 6, valor: "REPOSICAO DE PRODUTOS", descricao: "REPOSIÇÃO DE PRODUTOS"},
                {tipo: "E", id: 7, valor: "ENTRADA DE VASILHAME", descricao: "ENTRADA DE VASILHAME"},

                {tipo: "S", id: 8, valor: "SAIDA POR INVENTARIO", descricao: "SAÍDA POR INVENTÁRIO"},
                {tipo: "S", id: 9, valor: "SAIDA POR INVERSAO", descricao: "SAÍDA POR INVERSÃO"},
                {tipo: "S", id: 10, valor: "SAIDA POR AVARIA", descricao: "SAÍDA POR AVARIA"},
                {tipo: "S", id: 11, valor: "SAIDA POR TRANSFERENCIA", descricao: "SAÍDA POR TRANSFERÊNCIA"},
                {tipo: "S", id: 12, valor: "PERCA NÃO IDENTIFICADA", descricao: "PERCA NÃO IDENTIFICADA"},
                {tipo: "S", id: 13, valor: "SAIDA DE VASILHAME", descricao: "SAÍDA DE VASILHAME"},
                {tipo: "S", id: 14, valor: "SAIDA POR VENDA", descricao: "SAÍDA POR VENDA"}
            ];

            $scope.subTipoFinal = [];


            //$scope.movimento = $stateParams.movimento;


            $scope.alterandoTipo = function (tipoFil) {

                var resultFilter = $scope.subTipos.filter(function (tipo) {
                    return tipo.tipo == tipoFil;
                });

                $scope.subTipoFinal = resultFilter;

            };

            $scope.listaTipo = [
                {_id: 0, nome: 'Entrada', slg: 'E'},
                {_id: 1, nome: 'Saida', slg: 'S'}
            ];

            /////////////////////////////////

            function inicializaItemZerado() {
                $scope.movimento = {};
                $scope.movimento.itens = [];
                $scope.movimento.status = 'A';
                $scope.flgItemPesquisado = 0;
                $scope.flgPesquisado = 0;
                $scope.veiculoSelecionado = {};
                $scope.motoristaSelecionado = {};
                $scope.conferenteSelecionado = {};
                $scope.pessoaSelecionada = {};
            };


            inicializaItemZerado();


            if (typeof($stateParams.movimento) != "undefined" && $stateParams.movimento != null) {
                $scope.flgItemPesquisado = 1;
                var movAlter = $stateParams.movimento;
                $scope.alterandoTipo(movAlter.tipo);
                //console.log("Mov recebido "+JSON.stringify(movAlter));


                $scope.movimento = {
                    _id: movAlter._id,
                    usuario_inclusao: movAlter.usuario_inclusao,
                    dta_inclusao: movAlter.dta_inclusao,
                    tipo: movAlter.tipo,
                    numnf: movAlter.numnf,
                    dtanf: new Date(movAlter.dtanf),
                    subTipo: movAlter.sub_tipo,
                    descricao: movAlter.descricao,
                    status: movAlter.status,
                    itens: movAlter.itens,
                    veiculo: movAlter.veiculo._id,
                    motorista: movAlter.motorista._id,
                    conferente: movAlter.conferente._id,
                    pessoa: movAlter.pessoa._id,
                    historico: movAlter.historico,

                    veiculoComp: movAlter.veiculo,
                    motoristaComp: movAlter.motorista,
                    conferenteComp: movAlter.conferente,
                    pessoaComp: movAlter.pessoa

                };


                $scope.veiculoSelecionado = movAlter.veiculo;
                $scope.motoristaSelecionado = movAlter.motorista;
                $scope.conferenteSelecionado = movAlter.conferente;
                $scope.pessoaSelecionada = movAlter.pessoa;

                //console.log('mov ' + JSON.stringify($stateParams.movimento));
            }

            ///////////////////////////////////

            $scope.deletarVeiculo = function () {
                $scope.movimento.veiculo = null;
                $scope.veiculoSelecionado = {};
                $scope.nomeVeiculoBusca = '';
                $scope.noResults = false;
            };

            $scope.deletarMotorista = function () {
                $scope.movimento.motorista = null;
                $scope.motoristaSelecionado = {};
                $scope.nomeMotoristaBusca = '';
            };

            $scope.deletarConferente = function () {
                $scope.movimento.conferente = null;
                $scope.conferenteSelecionado = {};
                $scope.nomeConferenteBusca = '';
            };

            $scope.deletarPessoa = function () {
                $scope.movimento.pessoa = null;
                $scope.pessoaSelecionada = {};
                $scope.nomePessoaBusca = '';
            };


            $scope.getVeiculosURLAsync = function (des) {
                ////console.log('Executando o metodo');
                return MovimentoService.getVeiculosURLAsyncService(des);
            };
            $scope.getMotoristasURLAsync = function (des) {
                return MovimentoService.getMotoristasURLAsyncService(des);
            };
            $scope.getConferenteURLAsync = function (des) {
                return MovimentoService.getConferentesURLAsyncService(des);
            };
            $scope.getItemURLAsync = function (des) {
                return MovimentoService.getItensURLAsyncService(des);
            };
            $scope.getPessoaURLAsync = function (des) {
                if ($scope.movimento.tipo == 'E') {
                    return MovimentoService.getPessoaForcedorURLAsyncService(des);
                } else if ($scope.movimento.tipo == 'S') {
                    return MovimentoService.getPessoaClienteURLAsyncService(des);
                } else {
                    return null;
                }

            };

            $scope.veiculoSelecionadoF = function (model) {
                $scope.movimento.veiculo = model._id;
                $scope.movimento.veiculoComp = model;
                $scope.veiculoSelecionado = model;
            };
            $scope.motoristaSelecionadoF = function (model) {
                $scope.movimento.motorista = model._id;
                $scope.movimento.motoristaComp = model;
                $scope.motoristaSelecionado = model;
            };
            $scope.conferenteSelecionadoF = function (model) {
                $scope.movimento.conferente = model._id;
                $scope.movimento.conferenteComp = model;
                $scope.conferenteSelecionado = model;
            };
            $scope.pessoaSelecionadoF = function (model) {
                //console.log('pessoa '+JSON.stringify(model));
                $scope.movimento.pessoa = model._id;
                $scope.movimento.pessoaComp = model;
                $scope.pessoaSelecionada = model;
            };
            $scope.itemSelecionadoF = function (model) {
                //console.log('item '+JSON.stringify(model));

                if (typeof($scope.movimento.tipo) == "undefined" || $scope.movimento.tipo == null || $scope.movimento.tipo.length == 0) {
                    $rootScope.warn('Selecione primeiro o tipo do movimento, se entrada ou saída.', 'ATENÇÃO', function () {
                    })
                } else {

                    model.tipo = $scope.movimento.tipo;
                    $rootScope.alertTemplateItem(model, function (item) {
                        // console.log('item ' + JSON.stringify(item));
                        /*
                         item: $scope.itemRecebidoModal,
                         qtd: itemForm.qtd,
                         unidade: filtroUnidades[0]
                         */

                        var existe = false;

                        for (var i = 0; i < $scope.movimento.itens.length; i++) {
                            var unidade = $scope.movimento.itens[i].unidade;
                            if ($scope.movimento.itens[i].item._id == item.item._id && $scope.movimento.itens[i].unidade._id == item.unidade._id) {
                                existe = true;
                            }
                        }

                        if (existe == true) {
                            $rootScope.warn('Este item com essa unidade já foi adicionado, edite o que já foi adicionado, adicione outra unidade ou outro item!', 'ATENÇÃO', function () {
                            });
                        } else if (item.qty <= 0) {
                            $rootScope.warn('Valor menor ou igual a 0 não é permitido!', 'ATENÇÃO', function () {
                            })
                        } else {
                            $scope.movimento.itens.push(item);
                            ////console.log('array  ' + JSON.stringify(model));
                        }

                    });
                }
            };


            $scope.deletarItemMovimento = function (idItem, idUnidade) {
                for (var i = 0; i < $scope.movimento.itens.length; i++) {
                    if ($scope.movimento.itens[i].item._id == idItem && $scope.movimento.itens[i].unidade._id == idUnidade) {
                        $scope.movimento.itens.splice(i, 1);
                    }
                }
            };


            $scope.addMovimento = function (movimento) {
                //console.log('movimento anterior  ' + JSON.stringify(movimento));

                if (typeof(movimento.pessoa) == "undefined" || movimento.pessoa == null) {
                    $rootScope.warn('É necessário adicionar uma pessoa cliente/fornecedor.', 'ATENÇÃO', function () {
                    });
                } else if (typeof(movimento.veiculo) == "undefined" || movimento.veiculo == null) {
                    $rootScope.warn('É necessário adicionar o veiculo.', 'ATENÇÃO', function () {
                    });
                } else if (typeof(movimento.motorista) == "undefined" || movimento.motorista == null) {
                    $rootScope.warn('É necessário adicionar o motorista.', 'ATENÇÃO', function () {
                    });
                } else if (typeof(movimento.conferente) == "undefined" || movimento.conferente == null) {
                    $rootScope.warn('É necessário adicionar o conferente.', 'ATENÇÃO', function () {
                    });
                } else if (typeof(movimento.itens) == "undefined" || movimento.itens == null || movimento.itens.length == 0) {
                    $rootScope.warn('É necessário adicionar pelo menos um item.', 'ATENÇÃO', function () {
                    });
                } else if ($scope.flgMovOcupado != 0) {
                    $rootScope.warn('O sistema esta ocupado enviando sua requisição, aguarde um instante.', 'ATENÇÃO', function () {
                    });
                } else {
                    $scope.flgMovOcupado = 1;
                    movimento.usuario_inclusao = AuthService.getUserSessionStorage().nomUsuario;
                    //console.log('movimento  ' + JSON.stringify(movimento));
                    var respVeiculo = MovimentoService.setMovimento(movimento, $scope.flgItemPesquisado);
                    respVeiculo.then(function (resp) {
                        $scope.flgMovOcupado = 0;
                        var resultado = resp.data;
                        if (resultado.type == true) {
                            toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                            inicializaItemZerado();

                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                        }
                    }, function (error) {
                        $scope.flgMovOcupado = 0;
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao atualizar o movimento.', 'ATENÇÃO', function () {
                        });
                    });
                }
            };

            $scope.voltarBusca = function () {
                $scope.flgPesquisado = 0;
                $scope.movimentos = [];
            };

            $scope.pesquisarMovimento = function () {
                // //console.log('pesquisando veiculo ' + JSON.stringify($scope.veiculo));
                var resposta = MovimentoService.getMovimentos($scope.movimento);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type) {
                        $scope.flgPesquisado = 1;
                        $scope.movimentos = resultado.data;
                        ////console.log('data'+JSON.stringify(resultado.data));
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }
                }, function (error) {
                    $rootScope.warn('Erro na busca contate o Administrador.', 'ATENÇÃO', function () {
                    });
                    $log.error('Eror ' + error);
                });
            };

            $scope.limparMovimento = function () {
                inicializaItemZerado();
            };

            $scope.visualizarVeiculo = function (id) {
                var filtro = $scope.veiculos.filter(function (veiculo) {
                    return veiculo._id == id;
                });

                $scope.veiculo = filtro[0];
                $scope.flgPesquisado = 0;
                $scope.flgItemPesquisado = 1;
            };

            $scope.deletarMovimento = function (id) {
                $rootScope.confirm('Deseja realmente excluir este veiculo?', function () {
                    var resposta = VeiculoService.delVeiculo(id);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type == true) {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                            inicializaItemZerado();
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });


                }, function () {
                }, 'Excluir');
            };


            ////teste

            $scope.today = function () {
                $scope.movimento.dta_inclusao = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.movimento.dta_inclusao = null;
            };

            $scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };

            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yyyy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            // Disable weekend selection
            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            $scope.toggleMin = function () {
                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
            };

            $scope.toggleMin();

            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.open2 = function () {
                $scope.popup2.opened = true;
            };

            $scope.setDate = function (year, month, day) {
                $scope.dt = new Date(year, month, day);
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'dd/MM/yyyy', 'shortDate'];
            $scope.format = $scope.formats[3];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popup1 = {
                opened: false
            };

            $scope.popup2 = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

            function getDayClass(data) {
                var date = data.date,
                    mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            }

            ///fim teste

        }])

    .controller('MotoristaController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'MotoristaService',
        function ($scope, $log, $state, toaster, $rootScope, MotoristaService) {
            $scope.flgItemPesquisado = 0;
            $scope.flgPesquisado = 0;
            $scope.motorista = {};
            $scope.motoristas = [];

            if ($scope.flgPesquisado == 0) {
                inicializaItemZerado();
            }

            function inicializaItemZerado() {
                $scope.motorista = {};
                $scope.motorista.status = "A";
                $scope.flgItemPesquisado = 0;
                $scope.flgPesquisado = 0;
            };

            $scope.addMotorista = function (motorista) {
////console.log('motorista '+JSON.stringify(motorista));
                var respVeiculo = MotoristaService.setMotorista(motorista, $scope.flgItemPesquisado);
                respVeiculo.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type == true) {
                        toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                        inicializaItemZerado();
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }
                }, function (error) {
                    $log.error('Eror ' + error);
                    $rootScope.warn('ERRO ao atualizar o motorista.', 'ATENÇÃO', function () {
                    });
                });
            };

            $scope.voltarBusca = function () {
                $scope.flgPesquisado = 0;
                $scope.motoristas = [];
            };

            $scope.pesquisarMotorista = function () {
                //console.log('pesquisando motorista ' + JSON.stringify($scope.motorista));
                var resposta = MotoristaService.findMotoristas($scope.motorista);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type) {
                        $scope.flgPesquisado = 1;
                        $scope.motoristas = resultado.data;
                        ////console.log('data'+JSON.stringify(resultado.data));
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }
                }, function (error) {
                    $rootScope.warn('Erro na busca contate o Administrador.', 'ATENÇÃO', function () {
                    });
                    $log.error('Eror ' + error);
                });
            };

            $scope.limparMotorista = function () {
                inicializaItemZerado();
            };

            $scope.visualizarMotorista = function (id) {
                var filtro = $scope.motoristas.filter(function (motorista) {
                    return motorista._id == id;
                });

                $scope.motorista = filtro[0];
                $scope.flgPesquisado = 0;
                $scope.flgItemPesquisado = 1;
            };

            $scope.deletarMotorista = function (id) {
                $rootScope.confirm('Deseja realmente excluir este motorista?', function () {
                    var resposta = MotoristaService.delMotorista(id);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type == true) {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                            inicializaItemZerado();
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });


                }, function () {
                }, 'Excluir');
            };


        }])
    .controller('ListaMovController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'MovimentoService', 'VeiculoService', 'PessoaService', '$timeout', '$stateParams', 'AuthService',
        function ($scope, $log, $state, toaster, $rootScope, MovimentoService, VeiculoService, PessoaService, $timeout, $stateParams, AuthService) {
            $scope.flgItemPesquisado = 0;
            $scope.flgPesquisado = 0;

            $scope.movimento = {};
            $scope.movimentos = [];
            $scope.usuarioLogado = AuthService.getUserSessionStorage().nomUsuario;

            $scope.filenameInventario = "mov_" + AuthService.getUserSessionStorage().nomUsuario + "_" + moment(new Date()).format('DD_MM_YYYY_HH_mm_ss') + ".csv";
            //$scope.filenameInventario="mov.csv";
            console.log('filename ' + $scope.filenameInventario);

            $scope.veiculoSelecionado = {};
            $scope.motoristaSelecionado = {};
            $scope.conferenteSelecionado = {};
            $scope.itemSelecionado = {};
            $scope.pessoaSelecionada = {};

            $scope.nomeVeiculoBusca = '';
            $scope.nomeMotoristaBusca = '';
            $scope.nomeConferenteBusca = '';
            $scope.nomeItensBusca = '';
            $scope.nomePessoaBusca = '';

            $scope.panelItens = false;
            $scope.panelUnidade = true;

            $scope.exportCSVFormatado = [];
            $scope.exportHeader = [
                "ID_MOVIMENTO",
                "DTA_INCLUSAO",
                "USUARIO_INCLUSAO",
                "TIPO",
                "SUB_TIPO",
                "NUMNF",
                "DTANF",
                "STATUS",
                "DESCRICAO",
                'PESSOA_ID',
                'PESSOA_NOME',
                'PESSOA_CGC',
                'PESSOA_FANTASIA',
                'VEICULO_ID',
                'VEICULO_NOME',
                'VEICULO_PLACA',
                'MOTORISTA_ID',
                'MOTORISTA_NOME',
                'CONFERENTE_ID',
                'CONFERENTE_NOME',
                'ITEM_ID',
                'ITEM_NOME',
                'ITEM_UNIDADE',
                'ITEM_QTD',
                'ITEM_CONVERSAO_ORIGINAL',
                'ITEM_QTD_TOTAL'];

            $scope.getTimeImpresao = function () {
                return moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
            };

            $scope.imprimeMovimento = function (divName) {


                var printContents = document.getElementById(divName).innerHTML;
                var popupWin = window.open('', '_blank', 'width=1200,height=600');
                popupWin.document.open();
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" media="print" href="css/print.css">' +
                    '</head><body onload="window.print()">' + printContents + '</body></html>');
                popupWin.document.close();
            };


            $scope.listaTipo = [
                {_id: 0, nome: 'Entrada', slg: 'E'},
                {_id: 1, nome: 'Saida', slg: 'S'}
            ];


            if ($scope.flgPesquisado == 0) {
                inicializaItemZerado();
            }

            function formataCSV(arrCSV) {
                var novoArr = [];
                for (var i = 0; i < arrCSV.length; i++) {
                    for (var j = 0; j < arrCSV[i].itens.length; j++) {
                        var obj = {};
                        obj.ID_MOVIMENTO = arrCSV[i]._id;
                        obj.DTA_INCLUSAO = arrCSV[i].dta_inclusao;
                        obj.USUARIO_INCLUSAO = arrCSV[i].usuario_inclusao;
                        obj.TIPO = arrCSV[i].tipo;
                        obj.SUB_TIPO = arrCSV[i].sub_tipo;
                        obj.NUMNF = arrCSV[i].numnf;
                        obj.DTANF = arrCSV[i].dtanff;
                        obj.STATUS = arrCSV[i].status;
                        obj.DESCRICAO = arrCSV[i].descricao;
                        obj.PESSOA_ID = arrCSV[i].pessoa._id;
                        obj.PESSOA_NOME = arrCSV[i].pessoa.nome;
                        obj.PESSOA_CGC = arrCSV[i].pessoa.cgc;
                        obj.PESSOA_FANTASIA = arrCSV[i].pessoa.fantasia;
                        obj.VEICULO_ID = arrCSV[i].veiculo._id;
                        obj.VEICULO_NOME = arrCSV[i].veiculo.nome;
                        obj.VEICULO_PLACA = arrCSV[i].veiculo.placa;
                        obj.MOTORISTA_ID = arrCSV[i].motorista._id;
                        obj.MOTORISTA_NOME = arrCSV[i].motorista.nome;
                        obj.CONFERENTE_ID = arrCSV[i].conferente._id;
                        obj.CONFERENTE_NOME = arrCSV[i].conferente.nome;
                        obj.ITEM_ID = arrCSV[i].itens[j].item._id;
                        obj.ITEM_NOME = arrCSV[i].itens[j].item.nome;
                        obj.ITEM_UNIDADE = arrCSV[i].itens[j].unidade.nome;
                        obj.ITEM_QTD = arrCSV[i].itens[j].qtd;
                        obj.ITEM_CONVERSAO_ORIGINAL = arrCSV[i].itens[j].tx_cv_og;
                        obj.ITEM_QTD_TOTAL = arrCSV[i].itens[j].qtd_total;
                        //console.log('obj '+JSON.stringify(obj));
                        novoArr.push(obj);
                    }
                }
                return novoArr;
            };

            function inicializaItemZerado() {
                $scope.movimento = {};
                $scope.movimento.status = 'A';
                $scope.movimentos = [];
                $scope.flgItemPesquisado = 0;
                $scope.flgPesquisado = 0;
                $scope.veiculoSelecionado = {};
                $scope.motoristaSelecionado = {};
                $scope.itemSelecionado = {};
                $scope.pessoaSelecionada = {};

                $scope.exportCSVFormatado = [];

            };

            $scope.editaMovimento = function () {
                //console.log('MOV ' +JSON.stringify($scope.movimento));
                $state.go('app.movimentacao', {movimento: $scope.movimento});
            };


            $scope.visualizarMovimento = function (id) {
                $scope.flgPesquisado = 2;
                var filtro = $scope.movimentos.filter(function (mov) {
                    return mov._id == id;
                });
                $scope.movimento = filtro[0];
                //console.log('MOV ' +JSON.stringify(filtro[0]));
            };


            $scope.anteriorSeta = function () {
                for (var i = 0; i < $scope.movimentos.length; i++) {
                    if ($scope.movimento._id == $scope.movimentos[i]._id) {
                        if ((i - 1) >= 0) {
                            $scope.movimento = $scope.movimentos[i - 1];
                            i = $scope.movimentos.length + 1;
                        }
                    }
                }
            };

            $scope.proximaSeta = function () {
                for (var j = 0; j < $scope.movimentos.length; j++) {
                    if ($scope.movimento._id == $scope.movimentos[j]._id) {
                        if ((j + 1) < $scope.movimentos.length) {
                            $scope.movimento = $scope.movimentos[j + 1];
                            j = $scope.movimentos.length + 1;
                        }

                    }
                }
            };


            $scope.deletarVeiculo = function () {
                $scope.movimento.veiculo = null;
                $scope.veiculoSelecionado = {};
                $scope.nomeVeiculoBusca = '';
                $scope.noResults = false;
            };

            $scope.deletarMotorista = function () {
                $scope.movimento.motorista = null;
                $scope.motoristaSelecionado = {};
                $scope.nomeMotoristaBusca = '';
            };

            $scope.deletarConferente = function () {
                $scope.movimento.conferente = null;
                $scope.conferenteSelecionado = {};
                $scope.nomeConferenteBusca = '';
            };

            $scope.deletarItem = function () {
                $scope.movimento.item = null;
                $scope.itemSelecionado = {};
                $scope.nomeItensBusca = '';
            };

            $scope.deletarPessoa = function () {
                $scope.movimento.pessoa = null;
                $scope.pessoaSelecionada = {};
                $scope.nomePessoaBusca = '';

            };


            $scope.getVeiculosURLAsync = function (des) {
                ////console.log('Executando o metodo');
                return MovimentoService.getVeiculosURLAsyncService(des);
            };
            $scope.getMotoristasURLAsync = function (des) {
                return MovimentoService.getMotoristasURLAsyncService(des);
            };
            $scope.getConferenteURLAsync = function (des) {
                return MovimentoService.getConferentesURLAsyncService(des);
            };
            $scope.getItemURLAsync = function (des) {
                return MovimentoService.getItensURLAsyncService(des);
            };
            $scope.getPessoaURLAsync = function (des) {
                if ($scope.movimento.tipo == 'E') {
                    return MovimentoService.getPessoaForcedorURLAsyncService(des);
                } else if ($scope.movimento.tipo == 'S') {
                    return MovimentoService.getPessoaClienteURLAsyncService(des);
                } else {
                    return null;
                }

            };


            $scope.veiculoSelecionadoF = function (model) {
                //console.log('veiculoSelecionadoF ' + JSON.stringify(model));
                $scope.movimento.veiculo = model._id;
                $scope.veiculoSelecionado = model;
            };
            $scope.motoristaSelecionadoF = function (model) {
                $scope.movimento.motorista = model._id;
                $scope.motoristaSelecionado = model;
            };
            $scope.conferenteSelecionadoF = function (model) {
                $scope.movimento.conferente = model._id;
                $scope.conferenteSelecionado = model;
            };
            $scope.itemSelecionadoF = function (model) {
                $scope.movimento.item = model._id;
                $scope.itemSelecionado = model;
            };
            $scope.pessoaSelecionadoF = function (model) {
                $scope.movimento.pessoa = model._id;
                $scope.pessoaSelecionada = model;
            };


            $scope.voltarBusca = function () {
                inicializaItemZerado();
            };

            $scope.pesquisarMovimento = function () {
                //console.log('pesquisando movimento ' + JSON.stringify($scope.movimento));

                var resposta = MovimentoService.getMovimentos($scope.movimento);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type) {
                        $scope.flgPesquisado = 1;
                        $scope.movimentos = resultado.data;
                        $scope.exportCSVFormatado = formataCSV($scope.movimentos);
                        // console.log('data' + JSON.stringify(resultado.data));
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }
                }, function (error) {
                    $rootScope.warn('Erro na busca contate o Administrador.', 'ATENÇÃO', function () {
                    });
                    $log.error('Eror ' + error);
                });

            };

            $scope.limparMovimento = function () {
                inicializaItemZerado();
            };

            $scope.visualizarVeiculo = function (id) {
                var filtro = $scope.veiculos.filter(function (veiculo) {
                    return veiculo._id == id;
                });

                $scope.veiculo = filtro[0];
                $scope.flgPesquisado = 0;
                $scope.flgItemPesquisado = 1;
            };


            ////teste

            $scope.today = function () {
                $scope.movimento.dta_inclusao = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.movimento.dta_inclusao = null;
            };

            $scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };

            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yyyy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            // Disable weekend selection
            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            $scope.toggleMin = function () {
                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
            };

            $scope.toggleMin();

            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.open2 = function () {
                $scope.popup2.opened = true;
            };

            $scope.setDate = function (year, month, day) {
                $scope.dt = new Date(year, month, day);
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'dd/MM/yyyy', 'shortDate'];
            $scope.format = $scope.formats[3];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popup1 = {
                opened: false
            };

            $scope.popup2 = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

            function getDayClass(data) {
                var date = data.date,
                    mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            }

            ///fim teste

        }])
    .controller('RelPosicaoItemController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'RelatorioService', 'ItemService', 'ConferenciaService',
        function ($scope, $log, $state, toaster, $rootScope, RelatorioService, ItemService, ConferenciaService) {
            $scope.itens = [];
            $scope.item = {};
            $scope.findItem = {};
            $scope.unidades = [];
            $scope.itemSelecionado = {};

            var dtnow = new Date();
            //$scope.dataArquivo=dtnow.getDay()+''+dtnow.getMonth()+''+dtnow.getYear()+''+dtnow.getHours+''+dtnow.getMinutes+''+dtnow.getSeconds();


            var respostaUni = ItemService.getUnidades();
            respostaUni.then(function (resp) {
                var resultado = resp.data;
                if (resultado.type == true) {
                    //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    $scope.unidades = resultado.data;
                    //console.log('unidades ' + JSON.stringify($scope.unidades));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ao buscar as unidades.', 'ATENÇÃO', function () {

                    //console.log('mensagem enviadoa');
                });
            });


            $scope.limparItens = function () {
                $scope.itens = [];
                $scope.item = {};
                $scope.findItem = {};
                $scope.itemSelecionado = {};
            };

            $scope.deletarItem = function () {
                $scope.itemSelecionado = {};
                $scope.findItem.idItem = -1;
            };


            $scope.getItemURLAsync = function (des) {
                return ConferenciaService.getItemAsync(des);
            };

            $scope.itemSelecionadoF = function (item) {
                $scope.itemSelecionado = item;
                $scope.findItem.idItem = item._id;
            };

            $scope.buscarItens = function (findItem) {

                console.log(' Item Buscado ' + JSON.stringify(findItem));

                var resposta = RelatorioService.getPosicaoItemUnidadeId(findItem);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type) {
                        $scope.itens = resultado.data;
                        //$scope.gridOptions.data = resultado.data;
                        //console.log(' resutlado data '+JSON.stringify(resultado.data));


                        if (typeof(findItem.idUnidade) != "undefined" && findItem.idUnidade > -1 && (typeof (findItem.idItem) == "undefined" || findItem.idItem == -1)) {
                            for (var i = 0; i < $scope.itens.length; i++) {
                                var results = $scope.itens[i].unidades.filter(function (unidade) {
                                    return unidade._id == findItem.idUnidade;
                                });
                                $scope.itens[i].tx = results[0].tx;
                            }
                        } else {
                            for (var i = 0; i < $scope.itens.length; i++) {
                                var results = $scope.itens[i].unidades.filter(function (unidade) {
                                    return unidade.tx != 1;
                                });

                                if (results.length > 0) {
                                    $scope.itens[i].tx = results[0].tx;
                                } else {
                                    $scope.itens[i].tx = 1;
                                }


                            }
                        }

                        for (var i = 0; i < $scope.itens.length; i++) {
                            var results = $scope.itens[i].unidades.filter(function (unidade) {
                                return unidade.tx != 1;
                            });


                            if (results.length > 0) {
                                console.log('Primeiro if');
                                var conv = $scope.itens[i].qtd / results[0].tx;
                                var deci = conv % 1;

                                console.log('Conversao:' + conv + "  decimal:" + deci);

                                if (deci > 0) {
                                    console.log('Segundo if');
                                    var unidade = results[0].tx * deci;
                                    $scope.itens[i].estoqueUnidade = unidade;
                                } else {
                                    console.log('Else do Segundo if');
                                    $scope.itens[i].estoqueUnidade = 0;
                                }
                            } else {
                                console.log('else do Primeiro if');
                                $scope.itens[i].estoqueUnidade = 0;
                            }
                        }


                        toaster.pop('sucess', 'OK', '' + resultado.des);
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }
                }, function (error) {
                    $rootScope.warn('Erro na busca contate o Administrador.', 'ATENÇÃO', function () {
                    });
                    $log.error('Eror ' + error);
                });
            };


            $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };


            $scope.gridOptions = {
                enableFiltering: true,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                },
                columnDefs: [
                    {field: '_id'},
                    {field: 'nome'},
                    {field: 'qtd'}
                ],
                data: [],
                enableGridMenu: true,
                enableSelectAll: true,
                exporterCsvFilename: 'relatorioPosicaoItem.csv',
                exporterPdfDefaultStyle: {fontSize: 9},
                exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
                exporterPdfHeader: {text: "Relátorio de posição de itens", style: 'headerStyle'},
                exporterPdfFooter: function (currentPage, pageCount) {
                    return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
                },
                exporterPdfCustomFormatter: function (docDefinition) {
                    docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
                    docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
                    return docDefinition;
                },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                }
            };


        }])
    .controller('ConferenciaController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'ConferenciaService', 'RelatorioService', 'ItemService', 'AuthService',
        function ($scope, $log, $state, toaster, $rootScope, ConferenciaService, RelatorioService, ItemService, AuthService) {
//AuthService.getUserSessionStorage()
            $scope.itens = [];
            //$scope.itensExib = [];
            $scope.panelItens = false;

            $scope.ruaId = -2;

            $scope.ruas = [];

            $scope.flgConferido = 0;

            $scope.comentario = '';

            $scope.filterConf = {};

            $scope.filenameConferencia = "conferencia_" + AuthService.getUserSessionStorage().nomUsuario + "_" + moment(new Date()).format('DD_MM_YYYY_HH_mm_ss') + ".csv";

            //$scope.cabecalhoCSV = ['Rua', 'Id', 'Nome', 'Unidade1', 'verificacao1', 'Estoque1', 'Status1', 'Unidade2', 'verificacao2', 'Estoque2', 'Status2', 'Unidade3', 'verificacao3', 'Estoque3', 'Status3'];
            $scope.cabecalhoCSV = ['Rua', 'Id', 'Nome', 'Unidade', 'verificacao', 'Estoque', 'Status'];

            var respostaUni = ItemService.getRuas();
            respostaUni.then(function (resp) {
                var resultado = resp.data;
                if (resultado.type == true) {
                    //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    $scope.ruas = resultado.data;
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ao buscar ruas, Favor contatar Administrador.', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });

            /*
             $scope.reportConferenciaCSV = function () {
             var itensCSV = [];


             for (var i = 0; i < $scope.itens.length; i++) {
             var item = {
             rua: $scope.itens[i].nome_rua,
             id: $scope.itens[i]._id,
             nome: $scope.itens[i].nome
             };


             for (var j = 0; j < $scope.itens[i].unidades.length; j++) {

             item["unidade" + j] = $scope.itens[i].unidades[j].nome;
             item["estoque" + j] = $scope.itens[i].qtd / $scope.itens[i].unidades[j].tx;

             if ($scope.itens[i].unidades[j].tx == $scope.itens[i].tx) {
             item["verificacao" + j] = $scope.itens[i].verif / $scope.itens[i].unidades[j].tx;
             item["status" + j] = ($scope.itens[i].qtd / $scope.itens[i].unidades[j].tx) - $scope.itens[i].verif;
             } else {
             item["verificacao" + j] = ($scope.itens[i].verif * $scope.itens[i].tx) / $scope.itens[i].unidades[j].tx;
             item["status" + j] = ($scope.itens[i].qtd / $scope.itens[i].unidades[j].tx) - ($scope.itens[i].verif * $scope.itens[i].tx);
             }

             }

             itensCSV.push(item);
             }


             return itensCSV;
             };
             */


            $scope.reportConferenciaCSV = function () {
                var itensCSV = [];


                for (var i = 0; i < $scope.itens.length; i++) {
                    var item = {
                        rua: $scope.itens[i].nome_rua,
                        id: $scope.itens[i]._id,
                        nome: $scope.itens[i].nome,
                        unidade: $scope.itens[i].unidadeEscolhida.nome,
                        verificacao: $scope.itens[i].verif,
                        estoque: $scope.itens[i].qtd / $scope.itens[i].unidadeEscolhida.tx,
                        status: ((($scope.itens[i].verif) - ($scope.itens[i].qtd / $scope.itens[i].unidadeEscolhida.tx)))
                    };


                    itensCSV.push(item);
                }


                return itensCSV;
            };
            $scope.filtrarItensConf = function () {

                if (typeof($scope.filterConf.item) != "undefined" && $scope.filterConf.item != null && $scope.filterConf.item._id > -1) {
                    for (var i = 0; i < $scope.itens.length; i++) {
                        if ($scope.itens[i]._id == $scope.filterConf.item._id) {
                            $scope.itens[i].visivel = true;
                        } else {
                            $scope.itens[i].visivel = false;
                        }
                    }
                } else if (typeof($scope.filterConf.rua) != "undefined" && $scope.filterConf.rua != null && $scope.filterConf.rua > -1) {
                    for (var i = 0; i < $scope.itens.length; i++) {
                        if ($scope.itens[i].rua == $scope.filterConf.rua) {
                            $scope.itens[i].visivel = true;
                        } else {
                            $scope.itens[i].visivel = false;
                        }
                    }
                } else {
                    $rootScope.warn('Adicione algum campo para filtrar', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }

            };

            function todosVisiveis() {
                for (var i = 0; i < $scope.itens.length; i++) {
                    $scope.itens[i].visivel = true;
                }
            }

            $scope.limparPesquisaConferencia = function () {
                $scope.filterConf = {};
                $scope.nomeItensBusca = "";
                todosVisiveis();
            };

            function organizaItens(itens) {
                for (var i = 0; i < itens.length; i++) {
                    itens[i].verif = 0;

                    var existeUn = 0;
                    var existeOutro = -1;

                    for (var j = 0; j < itens[i].unidades.length; j++) {
                        if (itens[i].unidades[j].tx == 1 && itens[i].unidades[j].nome == 'UNIDADE') {
                            existeUn = 1;
                        } else {
                            existeOutro = j;
                        }
                    }


                    if (existeOutro > -1) {
                        itens[i].unidadeEscolhida = itens[i].unidades[existeOutro];
                    } else {
                        itens[i].unidadeEscolhida = itens[i].unidades[0];
                    }

                }
                return itens;
            };


            var respostaUni = ConferenciaService.getItens();
            respostaUni.then(function (resp) {
                var resultado = resp.data;
                if (resultado.type == true) {
                    //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    $scope.itens = organizaItens(resultado.data);
                    //console.log('itens ' + JSON.stringify($scope.itens));
                    todosVisiveis();

                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ao buscar os itens.', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });


            $scope.getItemURLAsync = function (des) {
                return $scope.itens;
            };

            $scope.itemSelecionado = function (item) {
                item.unidadeEscolhida = item.unidades[0];
                $scope.itens.push(item);
                //console.log('items'+JSON.stringify($scope.itens));
            };

            function salvaConferenciaFinal(itens) {

                var respostaUni = ConferenciaService.postConferencia(itens);
                respostaUni.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type == true) {

                        toaster.pop('sucess', 'OK', '' + resultado.des);
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        });
                    }
                }, function (error) {
                    $log.error('Eror ' + error);
                    $rootScope.warn('ERRO ao buscar os itens.', 'ATENÇÃO', function () {
                    });
                });

            };

            $scope.getItemURLAsync = function (des) {
                return ConferenciaService.getItemAsync(des);
            };

            $scope.itemSelecionadoF = function (item) {
                $scope.filterConf.item = item;
            };

            $scope.salvarConferencia = function () {


                var itensArray = [];

                for (var i = 0; i < $scope.itens.length; i++) {
                    itensArray.push({
                        _id: $scope.itens[i]._id,
                        nome: $scope.itens[i].nome,
                        tx: $scope.itens[i].unidadeEscolhida.tx,
                        qtd: $scope.itens[i].qtd,
                        verif: $scope.itens[i].verif,
                        unidadeEscolhida: $scope.itens[i].unidadeEscolhida
                    });
                }

                var itemSalvar = {
                    comentario: ' ' + $scope.comentario,
                    idUsuario: AuthService.getUserSessionStorage()._id,
                    nomeUsuario: AuthService.getUserSessionStorage().nomUsuario,
                    itens: itensArray
                };

                //console.log('controle '+JSON.stringify(itemSalvar));

// itens: {itens: $scope.itens},
                if ($scope.flgConferido == 0) {
                    $rootScope.warn('Realize a conferência primeiro!', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                } else {
                    //console.log('Conferido '+JSON.stringify($scope.itens));
                    var zerado = 0;

                    for (var i = 0; i < $scope.itens.length; i++) {
                        if (typeof($scope.itens[i].verif) == "undefined" || $scope.itens[i].verif == 0) {
                            var zerado = 1;
                        }
                    }

                    if (zerado == 1) {
                        $rootScope.confirm("Existem itens com valores zerados, deseja salvar mesmo assim ?", function () {
                            //console.log('Conferido '+JSON.stringify(itemSalvar));
                            salvaConferenciaFinal(itemSalvar);
                        }, function () {

                        }, "Atenção");
                    } else {
                        salvaConferenciaFinal(itemSalvar);
                    }
                }

            };

            $scope.validarConferencia = function () {

                if ($scope.itens.length > 0) {

                    var ids = '(';

                    for (var i = 0; i < $scope.itens.length; i++) {
                        if (i == ($scope.itens.length - 1)) {
                            ids += $scope.itens[i]._id;
                        } else {
                            ids += $scope.itens[i]._id + ' , ';
                        }
                    }
                    ids += ')';

                    //console.log('itens ' + ids);

                    var resposta = RelatorioService.getPosicaoItemIds(ids);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type) {
                            resultado.data;

                            for (var i = 0; i < $scope.itens.length; i++) {
                                var filtroResult = resultado.data.filter(function (item) {
                                    return item._id == $scope.itens[i]._id;
                                });
                                $scope.itens[i].qtd = filtroResult[0].qtd;
                            }

                            //console.log(' resutlado data '+JSON.stringify($scope.itens));
                            toaster.pop('sucess', 'OK', '' + resultado.des);
                            $scope.itensExib = $scope.itens;
                            $scope.flgConferido = 1;
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                            $scope.flgConferido = 0;
                        }
                    }, function (error) {
                        $rootScope.warn('Erro na busca contate o Administrador.', 'ATENÇÃO', function () {
                        });
                        $log.error('Eror ' + error);
                        $scope.flgConferido = 0;
                    });
                } else {
                    $rootScope.warn('Adicione pelo menos um item.', 'ATENÇÃO', function () {
                    });
                }
            };

            $scope.deletarItemConferencia = function (id) {

                for (var i = 0; i < $scope.itens.length; i++) {
                    if ($scope.itens[i]._id == id) {
                        $scope.itens.splice(i, 1);
                    }
                }

            };

        }])
    .controller('RuasController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'ItemService',
        function ($scope, $log, $state, toaster, $rootScope, ItemService) {
            $scope.ruas = [];
            $scope.rua = {};
            $scope.codRua = null;

            var respostaUni = ItemService.getRuas();
            respostaUni.then(function (resp) {
                var resultado = resp.data;
                if (resultado.type == true) {
                    //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    $scope.ruas = resultado.data;
                    //console.log('unidades ' + JSON.stringify($scope.unidades));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ao buscar as ruas.', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });


            $scope.alteraRua = function (rua) {
                alert('unidade : ' + JSON.stringify(unidade));
                var result = $scope.ruas.filter(function (uni) {
                    return uni._id == rua;
                });

                $scope.rua = result[0];
            };

            $scope.limparRua = function () {
                $scope.rua = {};
                $scope.codRua = null;
            };

            $scope.deletarRua = function (id) {
                $rootScope.confirm("Deseja realmente excluir a rua ?", function () {
                    var resposta = ItemService.delRua(id);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type == true) {
                            toaster.pop('sucess', 'Deletado com sucesso!', '' + resultado.des);
                            $scope.ruas = resultado.data;
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                                //console.log('mensagem enviadoa');
                            });

                        }
                    }, function (error) {
                        $log.error('Eror ' + error);
                        $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    });
                }, function () {

                }, 'Excluir');

            };


            $scope.addRua = function (rua) {
                //alert('unidade : '+ JSON.stringify(unidade));
                // alert('unidades : '+ JSON.stringify($scope.unidades));
                var resposta = ItemService.setRua(rua);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type == true) {
                        toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                        $scope.ruas = resultado.data;
                        $scope.rua = {};
                        $scope.codRua = null;
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log(JSON.stringify($scope.unidades));
                        });
                        $scope.ruas = resultado.data;
                    }
                }, function (error) {
                    $log.error('Eror ' + error);
                    $rootScope.warn('ERRO ao realizar requisição.', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                });
            };


        }])
    .controller('ListaconfController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'AuthService', 'ConferenciaService',
        function ($scope, $log, $state, toaster, $rootScope, AuthService, ConferenciaService) {
            $scope.flgPesquisado = 0;
            $scope.usuarios = [];
            $scope.conferencias = [];
            $scope.conferenciaBusca = {};
            $scope.conferencia = {};

            var resposta = AuthService.getUsuarios();
            resposta.then(function (resp) {
                var resultado = resp.data;
                // //console.log(JSON.stringify(usuarios));

                if (resultado.type) {
                    $scope.usuarios = resultado.data;
                    //console.log(JSON.stringify($scope.usuarios));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
            });

            $scope.pesquisarConferencia = function (conferencia) {
                //console.log(JSON.stringify(conferencia));

                var resposta = ConferenciaService.getConferencias(conferencia);
                resposta.then(function (resp) {
                    var resultado = resp.data;
                    // //console.log(JSON.stringify(usuarios));

                    if (resultado.type) {
                        $scope.conferencias = resultado.data;
                        $scope.flgPesquisado = 1;
                        //console.log('data '+JSON.stringify(resultado.data));
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }
                }, function (error) {
                    $log.error('Eror ' + error);
                });
            };

            $scope.visualizarConferencia = function (_id) {
                var resultado = $scope.conferencias.filter(function (conf) {
                    return conf._id == _id;
                });

                $scope.conferencia = resultado[0];
                $scope.flgPesquisado = 2;

            };
            $scope.voltarBusca = function () {

                $scope.limparConferencia();
            };

            $scope.limparConferencia = function () {
                $scope.conferenciaBusca = {};
                $scope.flgPesquisado = 0;
                $scope.conferencias = [];
                $scope.conferencia = {};
            };


            ////////
            $scope.today = function () {
                $scope.conferenciaBusca.dta_inicio = new Date();
                $scope.conferenciaBusca.dta_fim = new Date();
            };


            $scope.clear = function () {
                $scope.conferenciaBusca.dta_inicio = null;
            };

            $scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };

            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yyyy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            // Disable weekend selection
            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            $scope.toggleMin = function () {
                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
            };

            $scope.toggleMin();

            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.open2 = function () {
                $scope.popup2.opened = true;
            };

            $scope.setDate = function (year, month, day) {
                $scope.dt = new Date(year, month, day);
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'dd/MM/yyyy', 'shortDate'];
            $scope.format = $scope.formats[3];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popup1 = {
                opened: false
            };

            $scope.popup2 = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

            function getDayClass(data) {
                var date = data.date,
                    mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            }


        }])
    .controller('RelAuditoriaItemController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'ConferenciaService', 'RelatorioService', 'AuthService',
        function ($scope, $log, $state, toaster, $rootScope, ConferenciaService, RelatorioService, AuthService) {


            $scope.headerAuditoria = ['ID_MOV', 'DATA', 'TIPO', 'SUB_TIPO', 'QTD', 'TX_CV', 'QTD_TOTAL', 'ESTOQUE', 'USUARIO_INCLUSAO'];
            $scope.exportAuditoria = [];
            $scope.filenameAuditoria = "auditoria_" + AuthService.getUserSessionStorage().nomUsuario + "_" + moment(new Date()).format('DD_MM_YYYY_HH_mm_ss') + ".csv";

            $scope.itemSelecionado = {};
            $scope.auditorias = [];


            $scope.limparItens = function () {
                $scope.itemSelecionado = {};
                $scope.auditorias = [];
            };


            $scope.getItemURLAsync = function (des) {
                return ConferenciaService.getItemAsync(des);
            };

            $scope.itemSelecionadoF = function (item) {
                $scope.itemSelecionado = item;
            };


            $scope.formataArrayAuditorias = function (auditorias) {
                for (var i = 0; i < auditorias.length; i++) {
                    console.log('auditois ' + JSON.stringify(auditorias[i]));
                    var obj = {
                        ID_MOV: null,
                        DATA: null,
                        TIPO: null,
                        SUB_TIPO: null,
                        QTD: null,
                        TX_CV: null,
                        QTD_TOTAL: null,
                        ESTOQUE: null,
                        USUARIO_INCLUSAO: null
                    };

                    obj.ID_MOV = auditorias[i].cod_movimento;
                    obj.DATA = auditorias[i].dta_inclusao;
                    obj.TIPO = auditorias[i].tipo;
                    obj.SUB_TIPO = auditorias[i].sub_tipo;
                    obj.QTD = auditorias[i].qtd;
                    obj.TX_CV = auditorias[i].tx_cv_og;
                    obj.QTD_TOTAL = auditorias[i].qtd_total;
                    obj.ESTOQUE = auditorias[i].estoque;
                    obj.USUARIO_INCLUSAO = auditorias[i].usuario_inclusao;

                    $scope.exportAuditoria.push(obj);
                }
            };

            $scope.buscarItens = function () {

                if (typeof($scope.itemSelecionado._id) == "undefined" || $scope.itemSelecionado == null) {
                    $rootScope.warn('Adicione um item para buscar primeiro!.', 'ATENÇÃO', function () {
                    });
                } else {
                    var resposta = RelatorioService.getAuditoriaItemId($scope.itemSelecionado._id);
                    resposta.then(function (resp) {
                        var resultado = resp.data;
                        if (resultado.type) {
                            $scope.auditorias = resultado.data;
                            $scope.formataArrayAuditorias($scope.auditorias);
                            toaster.pop('sucess', 'OK', '' + resultado.des);
                        } else {
                            $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            });
                        }
                    }, function (error) {
                        $rootScope.warn('Erro na busca contate o Administrador.', 'ATENÇÃO', function () {
                        });
                        $log.error('Eror ' + error);
                    });
                }
            };


        }])
    .controller('VasilhameController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'ItemService', 'AuthService',
        function ($scope, $log, $state, toaster, $rootScope, ItemService, AuthService) {

            $scope.unidades = [];
            $scope.unidade = {};
            $scope.vasilhame = {};
            $scope.vasilhames = [];

            $scope.listaTipo = [
                {_id: 0, nome: 'Entrada', slg: 'E'},
                {_id: 1, nome: 'Saida', slg: 'S'}
            ];

            var respostaUni = ItemService.getUnidadesVasilhames();
            respostaUni.then(function (resp) {
                var resultado = resp.data;
                if (resultado.type == true) {
                    //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    $scope.unidades = resultado.data;
                    //console.log('unidades ' + JSON.stringify($scope.unidades));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ao buscar as unidades.', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });


            $scope.removerVasilhame = function (id) {
                for (var i = 0; i < $scope.vasilhames.length; i++) {
                    if ($scope.vasilhames[i].unidade._id == id) {
                        $scope.vasilhames.splice(i, 1);
                        i = $scope.vasilhames.length + 2;
                    }
                }
            };

            $scope.gravarVasilhame = function () {

                var gravaVasilhames = ItemService.postVasilhames($scope.vasilhames);
                gravaVasilhames.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type == true) {
                        toaster.pop('sucess', 'Cadastro', '' + resultado.des);

                        $scope.vasilhames = [];
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }
                }, function (error) {
                    $log.error('Eror ' + error);
                    $rootScope.warn('ERRO ao buscar as unidades.', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                });
            };

            $scope.addVasilhame = function (formVasilhame) {
                //console.log('formVasilhame ' + JSON.stringify(formVasilhame));

                var busca = $scope.vasilhames.filter(function (va) {
                    return va.unidade._id == formVasilhame.unidade._id
                });

                if (busca.length > 0) {
                    $rootScope.warn('Vasilhame para essa unidade já foi adicionado abaixo.', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                } else {
                    formVasilhame.usuario_inclusao = AuthService.getUserSessionStorage().nomUsuario;
                    formVasilhame.qtd = parseInt(formVasilhame.qtd);
                    formVasilhame.qtd_disponivel = parseInt(formVasilhame.qtd_disponivel);

                    if (formVasilhame.tipo == 'E') {
                        formVasilhame.total = formVasilhame.qtd + formVasilhame.qtd_disponivel;
                    } else {
                        formVasilhame.total = formVasilhame.qtd_disponivel - formVasilhame.qtd;
                    }


                    $scope.vasilhames.push(formVasilhame);
                    formVasilhame = null;
                    $scope.vasilhame = {};
                }


            };

            $scope.alteraUnidade = function (uni) {

                $scope.vasilhame.qtd_disponivel = 'Buscando...';

                var alteraUni = ItemService.getQtdVasilhameCodUnidade(uni._id);
                alteraUni.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type == true) {

                        var qtd_tab_vasilhame = resultado.data[0].qtd_tab_vasilhame;
                        var qtd_movimento = resultado.data[0].qtd_movimento;
                        /*
                         console.log('qtd_tab_vasilhame '+qtd_tab_vasilhame+" qtd_movimento "+ qtd_movimento);

                         if(isNaN(qtd_tab_vasilhame) == true){
                         qtd_tab_vasilhame=0;
                         }

                         if(isNaN(qtd_movimento) == true){
                         qtd_movimento=0;
                         }

                         console.log('qtd_tab_vasilhame '+qtd_tab_vasilhame+" qtd_movimento "+ qtd_movimento);
                         */
                        $scope.vasilhame.qtd_disponivel = qtd_tab_vasilhame - qtd_movimento;


                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                        $scope.vasilhame.qtd_disponivel = 'erro';
                    }
                }, function (error) {
                    $scope.vasilhame.qtd_disponivel = 'erro';
                    $log.error('Eror ' + error);
                });

            };

        }])
    .controller('RelPosVasilhameController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'ItemService',
        function ($scope, $log, $state, toaster, $rootScope, ItemService) {

            $scope.listUnidadesPosicao = [];

            var respostaUni = ItemService.getPosicaoVasilhames();
            respostaUni.then(function (resp) {
                var resultado = resp.data;
                if (resultado.type == true) {
                    //toaster.pop('sucess', 'Cadastro', '' + resultado.des);
                    $scope.listUnidadesPosicao = resultado.data;
                    //console.log('unidades ' + JSON.stringify($scope.unidades));
                } else {
                    $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                }
            }, function (error) {
                $log.error('Eror ' + error);
                $rootScope.warn('ERRO ao buscar as unidades.', 'ATENÇÃO', function () {
                    //console.log('mensagem enviadoa');
                });
            });


        }])
    .controller('InventarioController', ['$scope', '$log', '$state', 'toaster', '$rootScope', 'RelatorioService', 'AuthService',
        function ($scope, $log, $state, toaster, $rootScope, RelatorioService, AuthService) {

            $scope.filenameInventario = "inv_" + AuthService.getUserSessionStorage().nomUsuario + "_" + moment(new Date()).format('DD_MM_YYYY_HH_mm_ss') + ".csv";
            console.log('filename ' + $scope.filenameInventario);

            $scope.inventario = {
                dtInventario: null
            };
            $scope.inventarios = [];
            $scope.inventarioTratado = [];
            $scope.inventarioHeader = ['DATA', 'ID', 'NOME', 'QTD_ANTERIOR', 'QTD_DIA', 'QTD_POSTERIOR',
                'UNIDADE_1_NOME', 'UNIDADE_1_TX', 'UNIDADE_1_CONV_ANTERIOR', 'UNIDADE_1_CONV_DIA', 'UNIDADE_1_CONV_POSTERIOR',
                'UNIDADE_2_NOME', 'UNIDADE_2_TX', 'UNIDADE_2_CONV_ANTERIOR', 'UNIDADE_2_CONV_DIA', 'UNIDADE_2_CONV_POSTERIOR',
                'UNIDADE_3_NOME', 'UNIDADE_3_TX', 'UNIDADE_3_CONV_ANTERIOR', 'UNIDADE_3_CONV_DIA', 'UNIDADE_3_CONV_POSTERIOR',
                'UNIDADE_4_NOME', 'UNIDADE_4_TX', 'UNIDADE_4_CONV_ANTERIOR', 'UNIDADE_4_CONV_DIA', 'UNIDADE_4_CONV_POSTERIOR'
            ];


            $scope.reportConferenciaCSV = function () {
                $scope.inventarioTratado = [];
                for (var i = 0; i < $scope.inventarios.length; i++) {
                    var obj = {
                        DATA: moment($scope.inventario.dtInventario).format('DD/MM/YYYY'),
                        ID: $scope.inventarios[i]._id,
                        NOME: $scope.inventarios[i].nome,
                        QTD_ANTERIOR: $scope.inventarios[i].qtd_anterior,
                        QTD_ATUAL: $scope.inventarios[i].qtd_atual,
                        QTD_POSTERIOR: $scope.inventarios[i].qtd_posterior
                    };
                    for (var j = 0; j < $scope.inventarios[i].unidades.length; j++) {
                        obj['UNIDADE_' + (j + 1) + '_NOME'] = $scope.inventarios[i].unidades[j].nome;
                        obj['UNIDADE_' + (j + 1) + '_TX'] = $scope.inventarios[i].unidades[j].tx;
                        obj['UNIDADE_' + (j + 1) + '_CONV_ANTERIOR'] = ($scope.inventarios[i].qtd_anterior / $scope.inventarios[i].unidades[j].tx);
                        obj['UNIDADE_' + (j + 1) + '_CONV_ATUAL'] = ($scope.inventarios[i].qtd_atual / $scope.inventarios[i].unidades[j].tx);
                        obj['UNIDADE_' + (j + 1) + '_CONV_POSTERIOR'] = ($scope.inventarios[i].qtd_posterior / $scope.inventarios[i].unidades[j].tx);
                    }
                    $scope.inventarioTratado.push(obj);
                }
            };

            $scope.findInventario = function (invet) {
                var respostaInv = RelatorioService.getInventario(invet);
                respostaInv.then(function (resp) {
                    var resultado = resp.data;
                    if (resultado.type == true) {
                        //console.log(' data '+JSON.stringify(resultado.data));
                        $scope.inventarios = resultado.data;
                        $scope.reportConferenciaCSV();
                    } else {
                        $rootScope.warn('' + resultado.des, 'ATENÇÃO', function () {
                            //console.log('mensagem enviadoa');
                        });
                    }
                }, function (error) {
                    $log.error('Eror ' + error);
                    $rootScope.warn('ERRO ao buscar os itens.', 'ATENÇÃO', function () {
                        //console.log('mensagem enviadoa');
                    });
                });
            };


            $scope.today = function () {
                $scope.inventario.dtInventario = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.inventario.dtInventario = null;
            };

            $scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };

            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yyyy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            // Disable weekend selection
            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            $scope.toggleMin = function () {
                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
            };

            $scope.toggleMin();

            $scope.open = function () {
                $scope.popup.opened = true;
            };


            $scope.setDate = function (year, month, day) {
                $scope.dt = new Date(year, month, day);
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'dd/MM/yyyy', 'shortDate'];
            $scope.format = $scope.formats[3];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popup = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

            function getDayClass(data) {
                var date = data.date,
                    mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            }


        }])
    .controller('RelMovimentoController', ['$scope', '$log', '$state', 'toaster', '$rootScope',
        function ($scope, $log, $state, toaster, $rootScope) {


        }])
;


/*
 .controller('RelMovimentoController', ['$scope', '$log', '$state', 'toaster', '$rootScope',
 function ($scope, $log, $state, toaster, $rootScope) {


 }])
 */


/*
 calendario


 $scope.today = function () {
 $scope.movimento.dta_inclusao = new Date();
 };
 $scope.today();

 $scope.clear = function () {
 $scope.movimento.dta_inclusao = null;
 };

 $scope.inlineOptions = {
 customClass: getDayClass,
 minDate: new Date(),
 showWeeks: true
 };

 $scope.dateOptions = {
 dateDisabled: disabled,
 formatYear: 'yyyy',
 maxDate: new Date(2020, 5, 22),
 minDate: new Date(),
 startingDay: 1
 };

 // Disable weekend selection
 function disabled(data) {
 var date = data.date,
 mode = data.mode;
 return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
 }

 $scope.toggleMin = function () {
 $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
 $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
 };

 $scope.toggleMin();

 $scope.open1 = function () {
 $scope.popup1.opened = true;
 };

 $scope.open2 = function () {
 $scope.popup2.opened = true;
 };

 $scope.setDate = function (year, month, day) {
 $scope.dt = new Date(year, month, day);
 };

 $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'dd/MM/yyyy', 'shortDate'];
 $scope.format = $scope.formats[3];
 $scope.altInputFormats = ['M!/d!/yyyy'];

 $scope.popup1 = {
 opened: false
 };

 $scope.popup2 = {
 opened: false
 };

 var tomorrow = new Date();
 tomorrow.setDate(tomorrow.getDate() + 1);
 var afterTomorrow = new Date();
 afterTomorrow.setDate(tomorrow.getDate() + 1);
 $scope.events = [
 {
 date: tomorrow,
 status: 'full'
 },
 {
 date: afterTomorrow,
 status: 'partially'
 }
 ];

 function getDayClass(data) {
 var date = data.date,
 mode = data.mode;
 if (mode === 'day') {
 var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

 for (var i = 0; i < $scope.events.length; i++) {
 var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

 if (dayToCheck === currentDay) {
 return $scope.events[i].status;
 }
 }
 }

 return '';
 }


 */