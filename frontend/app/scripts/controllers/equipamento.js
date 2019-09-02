'use strict';

app.controller('EquipamentoController', ['$q', '$scope', '$filter', '$location', '$routeParams',
    'EquipamentoService', 'AlertService', '$rootScope',
    function($q, $scope, $filter, $location, $routeParams,
        EquipamentoService, AlertService, $rootScope) {

        $scope.cliente = {};
        $scope.clientes = [];
        $scope.pagamentos = [];
        $scope.sexos = [];
        $scope.atendimentos = [];
        $scope.palavraChave = "";
        $scope.hoje = new Date();

        $scope.dateOpened = false;

        $scope.currentPage = 1;
        $scope.pageSize = 7;

        $scope.openData = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateOpened = !$scope.dateOpened;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 7
        };

        $scope.findAuxiliar = function() {
            $q.all([
                ClienteService.findAll(),
                ConstanteService.mylocal()
            ]).then(function(result) {
                $scope.clientes = result[0].data;
                if (!$scope.cliente.uf && result[1].regionName) {
                    $scope.cliente.uf = ConstanteService.getUf(result[1].regionName);
                }
            });
        };

        var id = $routeParams.id;
        var path = $location.$$url;

        if (path === '/cliente') {
            ValidationService.clear();
            $scope.findAuxiliar();
        }

        if (path === '/cliente/edit') {
            ValidationService.clear();
            $scope.cliente = {};
        }

        if (path === '/cliente/edit/' + id) {
            ValidationService.clear();
            $scope.findAuxiliar();
            ClienteService.get(id).then(
                function(res) {
                    $scope.cliente = res.data;

                    if (!$scope.cliente.uf && $rootScope.uf) {
                        $scope.cliente.uf = $rootScope.uf;
                    }

                    if ($scope.cliente.niver) {
                        $scope.cliente.niver = new Date($scope.cliente.niver + 'T07:00:00Z');
                    }
                },
                function(res) {

                    var data = res.data;
                    var status = res.status;
                    var message = res.message;

                    if (status === 401) {
                        AlertService.addWithTimeout('warning', message);
                    } else if (status === 412 || status === 422) {
                        ValidationService.registrarViolacoes(data);
                        AlertService.addWithTimeout('warning', 'Não foi salvo, verifique os dados');
                    } else if (status === 403) {
                        AlertService.showMessageForbiden();
                    }

                }

            );
        }

        if (path === '/cliente/imprimir/' + id) {
            ValidationService.clear();
            ClienteService.get(id).then(
                function(res) {
                    $scope.cliente = res.data;

                    if (!$scope.cliente.uf && $rootScope.uf) {
                        $scope.cliente.uf = $rootScope.uf;
                    }

                    if ($scope.cliente.niver) {
                        $scope.cliente.niver = new Date($scope.cliente.niver + 'T07:00:00Z');
                    }
                },
                function(res) {

                    var data = res.data;
                    var status = res.status;
                    var message = res.message;

                    if (status === 401) {
                        AlertService.addWithTimeout('warning', message);
                    } else if (status === 412 || status === 422) {
                        ValidationService.registrarViolacoes(data);
                        AlertService.addWithTimeout('warning', 'Não foi salvo, verifique os dados');
                    } else if (status === 403) {
                        AlertService.showMessageForbiden();
                    }
                }
            );

            AtendimentoService.searchByCliente(id).then(
                function(res) {
                    $scope.atendimentos = res.data;
                },
                function(res) {

                    var data = res.data;
                    var status = res.status;
                    var message = res.message;

                    if (status === 401) {
                        AlertService.addWithTimeout('warning', message);
                    } else if (status === 412 || status === 422) {
                        ValidationService.registrarViolacoes(data);
                        AlertService.addWithTimeout('warning', 'Não foi salvo, verifique os dados');
                    } else if (status === 403) {
                        AlertService.showMessageForbiden();
                    }
                }
            );

        }

        if (path === '/cliente/historico/' + id) {
            ValidationService.clear();
            $scope.cliente.id = id;
        }

        $scope.buscaCep = function() {
            ConstanteService.getCep($scope.cliente.cep).then(
                function(res) {

                    $scope.cliente.logradouro = res.data[0].logradouro;
                    $scope.cliente.uf = res.data[0].uf;
                    $scope.cliente.localidade = res.data[0].cidade;
                    $scope.cliente.bairro = res.data[0].bairroIni;

                }
            );
        };

        $scope.new = function() {
            $location.path('/cliente/edit');
        };

        $scope.save = function() {
            ValidationService.clear();
            ClienteService.save($scope.cliente).then(
                function(res) {
                    AlertService.addWithTimeout('success', 'Dados salvos com sucesso');
                    $location.path('/cliente');
                },
                function(res) {

                    var data = res.data;
                    var status = res.status;
                    var message = res.data[0].error;

                    if (status === 500 || status === 400) {
                        AlertService.addWithTimeout('warning', message);
                    } else if (status === 412 || status === 422) {
                        ValidationService.registrarViolacoes(data);
                        AlertService.addWithTimeout('warning', 'Não foi salvo, verifique os dados');
                    } else if (status === 403) {
                        AlertService.showMessageForbiden();
                    }

                }
            );
        };

        $scope.delete = function() {
            ClienteService.delete($scope.cliente.id).then(
                function() {
                    AlertService.addWithTimeout('success', 'Cliente removido');
                    $location.path('/cliente');
                },
                function(res) {

                    var data = res.data;
                    var status = res.status;
                    var message = res.message;

                    if (status === 500) {
                        AlertService.addWithTimeout('warning', "A remoção desse item pode prejudicar o sistema");
                    } else if (status === 401) {
                        AlertService.addWithTimeout('warning', message);
                    } else if (status === 412 || status === 422) {
                        ValidationService.registrarViolacoes(data);
                        AlertService.addWithTimeout('warning', 'Não foi salvo, verifique os dados');
                    } else if (status === 403) {
                        AlertService.showMessageForbiden();
                    }

                }
            );
        };

        $scope.edit = function(id) {
            $location.path('/cliente/edit/' + id);
        };



    }
]);
