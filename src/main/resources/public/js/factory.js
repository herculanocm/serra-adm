angular.module('son')
    .factory('colors', ['APP_COLORS', function (colors) {

        return {
            byName: function (name) {
                return (colors[name] || '#fff');
            }
        };

    }])
    .factory('AuthService', ['APP_END_POINT', '$http', '$localStorage', '$sessionStorage', '$location', '$rootScope', '$state', 'APP_MENUS',
        function (APP_END_POINT, $http, $localStorage, $sessionStorage, $location, $rootScope, $state, APP_MENUS) {

            var authService = {};
            
            /*

             Metodos de transmissao

             */

            authService.login = function (credentials) {
                return $http.post(APP_END_POINT + '/authenticate', credentials);
            };

            authService.getUsuarios = function () {
                return $http.get(APP_END_POINT + '/usuarios');
            };

            authService.getRotasUser = function (id) {
                return $http.get(APP_END_POINT + '/rotasUser/' + id);
            };

            authService.getRotas = function () {
                return $http.get(APP_END_POINT + '/rotas');
            };

            authService.getPerfils = function () {
                return $http.get(APP_END_POINT + '/perfils');
            };

            authService.setUsuario = function (usuario) {
                return $http.post(APP_END_POINT + '/usuario', usuario);
            };

            authService.setPerfilApp = function (perfil) {
                return $http.post(APP_END_POINT + '/add/perfil', perfil);
            };

            authService.setResetSenha = function (user) {
                return $http.post(APP_END_POINT + '/usuarioResetSenha', user);
            };

            authService.setUsuarioProfile = function (usuario) {
                return $http.post(APP_END_POINT + '/usuarioProfile', usuario);
            };


            authService.putUsuario = function (usuario) {
                return $http.put(APP_END_POINT + '/usuarioAlter', usuario);
            };

            authService.putPerfil = function (alter) {
                return $http.put(APP_END_POINT + '/perfilAlter', alter);
            };


            /*
             Metodos de controles
             */

            authService.menusVisiveis = function () {
                var menus = APP_MENUS.filter(function (menu) {
                    return menu.menu == true;
                });
                return menus;
            };

            authService.menusAcessos = function () {
                var usuarioLogadoSidebar = authService.getUserSessionStorage();
                var menus = authService.menusVisiveis();
                return menus;
/*
                if (usuarioLogadoSidebar.perfil.nome == 'ADMIN') {
                    return menus;
                } else {
                    var acessos = usuarioLogadoSidebar.perfil.acessos;
                    //menu superior
                    var menusFiltrados = menus.filter(function (menu) {
                        for (var i = 0; i < acessos.length; i++) {
                            if (menu._id == acessos[i]._id && acessos[i].modelo == true) {
                                return true;
                            }
                        }
                        return false;
                    });
                    //menu inferior
                    var estadosPermitidos = [];
                    for (var i = 0; i < menusFiltrados.length; i++) {
                        estadosPermitidos.push({_id: menusFiltrados[i]._id, sref: menusFiltrados[i].sref});

                        if (typeof(menusFiltrados[i].submenu) != "undefined") {
                            menusFiltrados[i].submenu = menusFiltrados[i].submenu.filter(function (submenu) {
                                for (var i = 0; i < acessos.length; i++) {
                                    if (submenu._id == acessos[i]._id && acessos[i].modelo == true) {
                                        estadosPermitidos.push({_id: submenu._id, sref: submenu.sref});
                                        return true;
                                    }
                                }
                                return false;
                            });
                        }
                    }
                    ////console.log('Estados permitidos' + JSON.stringify(estadosPermitidos));
                    authService.setEstadosPermitidoSessionStorage(estadosPermitidos);
                    return menusFiltrados;
                }
                */
            };

            authService.setUserSessionStorage = function (user) {
                user.block = false;
                $sessionStorage.user = user;
            };

            authService.setPerfilSessionStorage = function (perfil) {


                var acessos = perfil.acessos;
                var menus = APP_MENUS;

                for (var i = 0; i < menus.length; i++) {

                    var result = acessos.filter(function (acesso) {
                        return acesso._id == menus[i]._id;
                    });

                    if (result == null || result.length == 0 || result[0].modelo == undefined || result[0].modelo == null || !result[0].modelo) {
                        menus[i].modelo = false;
                    } else {
                        menus[i].modelo = true;
                    }

                    for (var j = 0; j < menus[i].submenu.length; j++) {

                        var result2 = acessos.filter(function (acesso) {
                            return acesso._id == menus[i].submenu[j]._id;
                        });

                        if (result2 == null || result2.length == 0 || result2[0].modelo == undefined || result2[0].modelo == null || !result2[0].modelo) {
                            menus[i].submenu[j].modelo = false;
                        } else {
                            menus[i].submenu[j].modelo = true;
                        }
                    }


                }

                // //console.log('Menus : '+JSON.stringify(menus));

                $sessionStorage.perfil = perfil;
                $sessionStorage.menus = menus;
            };

            authService.modeloMenuPerfil = function (menus, perfil) {

                var acessos = perfil[0].acessos;

                //console.log('acessos fact ' + JSON.stringify(acessos));

                for (var i = 0; i < menus.length; i++) {

                    var result = acessos.filter(function (acesso) {
                        return acesso._id == menus[i]._id;
                    });

                    if (result == null || result.length == 0 || result[0].modelo == undefined || result[0].modelo == null || !result[0].modelo) {
                        menus[i].modelo = false;
                    } else {
                        menus[i].modelo = true;
                    }

                    for (var j = 0; j < menus[i].submenu.length; j++) {

                        var result2 = acessos.filter(function (acesso) {
                            return acesso._id == menus[i].submenu[j]._id;
                        });

                        if (result2 == null || result2.length == 0 || result2[0].modelo == undefined || result2[0].modelo == null || !result2[0].modelo) {
                            menus[i].submenu[j].modelo = false;
                        } else {
                            menus[i].submenu[j].modelo = true;
                        }
                    }


                }

                return menus;
            };

            authService.getPerfilSessionStorage = function () {
                return $sessionStorage.perfil;
            };


            authService.getUserSessionStorage = function () {
                return $sessionStorage.user;
            };


            authService.getEstadosPermitidoSessionStorage = function () {
                return $sessionStorage.estadosPermitidos;
            };

            authService.setEstadosPermitidoSessionStorage = function (estadosPermitidos) {
                $sessionStorage.estadosPermitidos = estadosPermitidos;
            };

            authService.isEstadosPadroes = function (state) {
                if (state != 'page.login' && state != 'app.profile' && state != 'app.wellcome') {
                    return true;
                } else {
                    return false;
                }
            };

            authService.isMenuState = function (state) {
                var estadosPermitidos = authService.getEstadosPermitidoSessionStorage();
                var user = authService.getUserSessionStorage();
                if (user.perfil.nome == 'ADMIN') {
                    return true;
                } else {
                    var estadosFiltrados = estadosPermitidos.filter(function (estado) {
                        return estado.sref == state;
                    });

                    if (estadosFiltrados.length >= 1) {
                        return true;
                    } else {
                        return false;
                    }
                }

            };


            authService.isAuth = function () {
                if ($sessionStorage.user != undefined && $sessionStorage.user != null && $sessionStorage.user != NaN && $sessionStorage.user._id != undefined && $sessionStorage.user._id != null) {
                    return true;
                } else {
                    return false;
                }
            };

            authService.isAlterPass = function () {
                if ($sessionStorage.user.indAlteraSenha == 'S') {
                    return true;
                } else {
                    return false;
                }
            };

            authService.alterPass = function (senha) {
                $sessionStorage.user.desSenha = senha;
                $sessionStorage.user.indAlteraSenha = 'N';
            };


            authService.block = function () {
                //console.log('Bloqueando Usuario');
                $sessionStorage.user.block = true;
            };

            authService.unBlock = function (pass) {
                var passUser = $sessionStorage.user.desSenha;
                if (passUser == pass) {
                    $sessionStorage.user.block = false;
                    //console.log('Usuario desbloqueado!');
                    return true;
                } else {
                    return false;
                }
            };

            authService.isBlock = function () {
                if ($sessionStorage.user.block == false) {
                    return false;
                } else {
                    return true;
                }
            };

            authService.logout = function () {
                delete $sessionStorage.user;
                delete $sessionStorage.menuItems;
            };


            /*
             Metodos de controles
             */


            function getUserFromToken() {
                var token = $localStorage.token;
                var user = {};
                if (typeof token !== 'undefined') {
                    var encoded = token.split('.')[1];
                    user = JSON.parse(urlBase64Decode(encoded));
                }
                return user;
            };


            function changeUser(user) {
                angular.extend(currentUser, user);
            };

            function urlBase64Decode(str) {
                var output = str.replace('-', '+').replace('_', '/');
                switch (output.length % 4) {
                    case 0:
                        break;
                    case 2:
                        output += '==';
                        break;
                    case 3:
                        output += '=';
                        break;
                    default:
                        throw 'Cadeia de caracteres base64url inválida!';
                }
                return window.atob(output);
            };


            return authService;

        }])
    .factory('PessoaService', ['APP_END_POINT', '$http', 'APP_CEP_END_POINT',
        function (APP_END_POINT, $http, APP_CEP_END_POINT) {

            var pessoaService = {};

            pessoaService.validaCGC = function (cgc) {
                ////console.log('entrou no valida cgc');
                return $http.get(APP_END_POINT + '/pessoa/validacgc/' + cgc);
            };

            pessoaService.buscaCEPNet = function (cep) {
                ////console.log('entrou no valida cgc');
                return $http.get(APP_CEP_END_POINT + cep + '/json/');
            };

            pessoaService.deletePessoa = function (id) {
              return $http.delete(APP_END_POINT + '/pessoa/'+id);
            };

            pessoaService.postPessoa = function (pessoa) {
                if (pessoa._id > 0) {
                    return $http.put(APP_END_POINT + '/pessoa', pessoa);
                } else {
                    return $http.post(APP_END_POINT + '/pessoa', pessoa);
                }
            };

            pessoaService.getPessoas = function (pessoa) {
                return $http.post(APP_END_POINT + '/pessoas', pessoa);
            };

            pessoaService.getURLRemota = function () {
                return APP_END_POINT + '/pessoas/autocomplete/'
            };

            pessoaService.getPessoasURLAsync=function (des) {

                return $http.get(APP_END_POINT+'/pessoas/urlasync/'+des).then(function(response) {
                    return response.data.data.map(function (pessoa) {
                        return pessoa.nome;
                    });
                });


            };

            return pessoaService;

        }])
    .factory('ItemService', ['APP_END_POINT', '$http',
        function (APP_END_POINT, $http) {

            var ItemService = {};

            ItemService.setUnidade = function (unidade) {
                if(unidade._id > -1){
                    return $http.put(APP_END_POINT + '/unidade', unidade);
                }else {
                    return $http.post(APP_END_POINT + '/unidade', unidade);
                }
            };

            ItemService.getUnidades = function () {
                return $http.get(APP_END_POINT + '/unidades');
            };

            ItemService.getUnidadesVasilhames = function () {
                return $http.get(APP_END_POINT + '/unidades/vasilhame');
            };

            ItemService.delUnidade = function (id) {
              return $http.delete(APP_END_POINT + '/unidade/'+id)
            };

            ItemService.getQtdVasilhameCodUnidade = function (codUnidade) {
              return $http.get(APP_END_POINT + '/unidade/vasilhame/'+codUnidade);
            };

            ItemService.postVasilhames = function (v) {
                return $http.post(APP_END_POINT + '/unidade/vasilhames', {vasilhames: v});
            };

            ItemService.getPosicaoVasilhames = function (v) {
                return $http.get(APP_END_POINT + '/unidades/vasilhames');
            };

            /////////////

            ItemService.setRua = function (rua) {
                if(rua._id > -1){
                    return $http.put(APP_END_POINT + '/rua', rua);
                }else {
                    return $http.post(APP_END_POINT + '/rua', rua);
                }
            };

            ItemService.getRuas = function () {
                return $http.get(APP_END_POINT + '/ruas');
            };

            ItemService.delRua = function (id) {
                return $http.delete(APP_END_POINT + '/rua/'+id)
            };


            ////////////

            ItemService.setItem=function (item,flgItemPesquisado) {
              if(flgItemPesquisado != 0){
                  return $http.put(APP_END_POINT + '/item',item);
              }else{
                  return $http.post(APP_END_POINT + '/item',item);
              }
            };

            ItemService.getItens= function (item) {
              return $http.post(APP_END_POINT + '/itens',item);
            };

            ItemService.delItem = function (id) {
              return $http.delete(APP_END_POINT+'/item/'+id);
            };

            return ItemService;

        }])
    .factory('VeiculoService', ['APP_END_POINT', '$http',
        function (APP_END_POINT, $http) {

            var veiculoService = {};

            veiculoService.setVeiculo = function (veiculo,flgItemPesquisado) {
                if(flgItemPesquisado != 0){
                    //console.log('foi no put');
                    return $http.put(APP_END_POINT + '/veiculo', veiculo);
                }else {
                    //console.log('foi no post');
                    return $http.post(APP_END_POINT + '/veiculo', veiculo);
                }
            };

            veiculoService.delVeiculo = function (id) {
                return $http.delete(APP_END_POINT + '/veiculo/'+id);
            };

            veiculoService.getVeiculoID = function (id) {
              return $http.get(APP_END_POINT + '/veiculo/id/'+id);
            };

            veiculoService.findVeiculos = function (veiculo) {
                //console.log('factory veiculo ' + JSON.stringify(veiculo));
                return $http.post(APP_END_POINT + '/veiculos',veiculo);
            };

            return veiculoService;

        }])
    .factory('MovimentoService', ['APP_END_POINT', '$http',
        function (APP_END_POINT, $http) {

            var movimentoService = {};

            movimentoService.getVeiculosURLAsyncService=function (des) {
               // //console.log('executando o metodo');
                return $http.get(APP_END_POINT+'/veiculos/urlasync/'+des).then(function(response) {
                    var resposta = response.data;
                    if(resposta.type == true){
                        return response.data.data;
                    }else{
                        return null;
                    }

                });


            };

            movimentoService.getMotoristasURLAsyncService=function (des) {
                // //console.log('executando o metodo');
                return $http.get(APP_END_POINT+'/pessoas/funcionarios/motoristas/urlasync/'+des).then(function(response) {
                    var resposta = response.data;
                    if(resposta.type == true){
                        return response.data.data;
                    }else{
                        return null;
                    }

                });
            };

            movimentoService.getConferentesURLAsyncService=function (des) {
                // //console.log('executando o metodo');
                return $http.get(APP_END_POINT+'/pessoas/funcionarios/conferentes/urlasync/'+des).then(function(response) {
                    var resposta = response.data;
                    if(resposta.type == true){
                        return response.data.data;
                    }else{
                        return null;
                    }

                });
            };

            movimentoService.getPessoaClienteURLAsyncService=function (des) {
                return $http.get(APP_END_POINT+'/pessoas/clientes/urlasync/'+des).then(function(response) {
                    var resposta = response.data;
                    if(resposta.type == true){
                        return response.data.data;
                    }else{
                        return null;
                    }

                });
            };
            movimentoService.getPessoaForcedorURLAsyncService=function (des) {
                return $http.get(APP_END_POINT+'/pessoas/fornecedores/urlasync/'+des).then(function(response) {
                    var resposta = response.data;
                    if(resposta.type == true){
                        return response.data.data;
                    }else{
                        return null;
                    }

                });
            };
            movimentoService.getItensURLAsyncService=function (des) {
                // //console.log('executando o metodo');
                return $http.get(APP_END_POINT+'/itens/urlasync/'+des).then(function(response) {
                    var resposta = response.data;
                    if(resposta.type == true){
                        return response.data.data;
                    }else{
                        return null;
                    }

                });


            };

            movimentoService.setMovimento= function (movimento, flgItemPesquisado) {
                if(flgItemPesquisado != 0){
                    console.log('foi no put'+JSON.stringify(movimento));
                    return $http.put(APP_END_POINT + '/movimento', movimento);
                }else {
                    //console.log('foi no post'+JSON.stringify(movimento));
                    return $http.post(APP_END_POINT + '/movimento', movimento);
                }
            };

            movimentoService.getMovimentos = function (movimento) {
              return   $http.post(APP_END_POINT + '/movimentos', movimento);
            };


            return movimentoService;

        }])
    .factory('MotoristaService', ['APP_END_POINT', '$http',
        function (APP_END_POINT, $http) {


            var motoristaService = {};

            motoristaService.setMotorista = function (motorista,flgItemPesquisado) {
                if(flgItemPesquisado != 0){
                    //console.log('foi no put');
                    return $http.put(APP_END_POINT + '/motorista', motorista);
                }else {
                    //console.log('foi no post');
                    return $http.post(APP_END_POINT + '/motorista', motorista);
                }
            };

            motoristaService.delMotorista = function (id) {
                return $http.delete(APP_END_POINT + '/motorista/'+id);
            };



            motoristaService.findMotoristas = function (motorista) {
                //console.log('factory veiculo ' + JSON.stringify(motorista));
                return $http.post(APP_END_POINT + '/motoristas',motorista);
            };

            return motoristaService;
        }])
    .factory('RelatorioService', ['APP_END_POINT', '$http',
        function (APP_END_POINT, $http) {


            var relatorioService = {};



            relatorioService.getPosicaoItem = function () {
                return $http.get(APP_END_POINT + '/relatorio/posicao/item');
            };

            relatorioService.getPosicaoItemUnidadeId = function (findItem) {
                return $http.post(APP_END_POINT + '/relatorio/posicao/item/unidade',findItem);
            };

            relatorioService.getPosicaoItemIds = function (ids) {
                return $http.post(APP_END_POINT + '/relatorio/posicao/item/ids',{ids: ids});
            };

            relatorioService.getPosicaoItemId = function (id) {
                return $http.get(APP_END_POINT + '/relatorio/posicao/item/'+id);
            };

            relatorioService.getAuditoriaItemId = function (id) {
                return $http.get(APP_END_POINT + '/relatorio/auditoria/item/'+id);
            };

            relatorioService.getInventario = function (inventario) {
                return $http.post(APP_END_POINT + '/relatorio/inventario/all',inventario);
            };

            return relatorioService;
        }])
    .factory('timesInterceptor',[
        function(){

            return {

                request: function(config){
                    /*
                    var url = config.url;

                    if(url.indexOf(".html") > -1) return config;

                    var timestamp= new Date().getTime();
                    config.url =  url +"?timestamp="+timestamp;
                    */
                    return config;
                }
            }
        }])
    .factory('ConferenciaService', ['APP_END_POINT', '$http',
        function (APP_END_POINT, $http) {


            var conferenciaService = {};



            conferenciaService.getItens = function () {
                return $http.get(APP_END_POINT+'/itens/urlasync/all');
            };

            conferenciaService.getItemAsync = function (des) {
                return $http.get(APP_END_POINT+'/itens/urlasync/'+des).then(function(response) {
                    var resposta = response.data;
                    if(resposta.type == true){
                        return response.data.data;
                    }else{
                        return null;
                    }

                });
            };

            conferenciaService.postConferencia = function (itensFuncao) {
                console.log(' post itens '+JSON.stringify(itensFuncao));

                return $http.post(APP_END_POINT+'/itens/conferencia',itensFuncao);
            };

            conferenciaService.getConferencias = function (conferenciaBusca) {
              return $http.post(APP_END_POINT+'/conferencias',conferenciaBusca);
            };

            return conferenciaService;
        }])
;
