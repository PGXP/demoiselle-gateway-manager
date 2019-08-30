'use strict';

app.controller('EquipamentoController', ['$q', '$scope', '$filter', '$location', '$routeParams', 'EquipamentoService', 'TemaService', 'ProdutoService', 'AlertService', '$rootScope',
    function($q, $scope, $filter, $location, $routeParams, EquipamentoService, TemaService, ProdutoService, AlertService, $rootScope) {

    var orderBy = $filter('orderBy');
    $scope.equipamento = {};
    $scope.equipamento.id = $routeParams.id;
    $rootScope.equipamento = $scope.equipamento;
    $scope.resultadoProdutos = [];
    $scope.produtosSelecionados = [];
    $scope.tema = "";
    $scope.palavraChave = "";
    $scope.resultadoPesquisaProduto = [];
    
    if ($scope.equipamento.id !== undefined && $scope.equipamento.id !== "") {
        carregarProdutosRelacionados();
    }
    
    TemaService.findAll().then(function(temas){
        $scope.temas = temas;
        $scope.orderTemas = function (predicate, reverse) {
            $scope.temas = orderBy($scope.temas, predicate, reverse);
        };
        $scope.orderTemas('nome', false);
    });
    
    $scope.carregarProdutos = function() {
        ProdutoService.listarProdutosPorTema($scope.tema.id).then(function (produtos) {
            $scope.resultadoProdutos = produtos;
        });
    };

    function carregarProdutosRelacionados(){
        EquipamentoService.carregarProdutosRelacionados($scope.equipamento.id).then(function(produtos){
            $scope.produtos = produtos;
            $rootScope.$broadcast('produtoAdicionadoEquipamento', produtos);
        });
    }

    $scope.count = function() {
        EquipamentoService.count().then(
            function(data) {
                $scope.totalServerItems = data;
            },
            function(error) {
                var data = error[0];
                var status = error[1];

                if (status === 401) {
                    AlertService.addWithTimeout('warning', data.message);
                }
            }
        );
    };

    var id = $routeParams.id;
    var path = $location.$$url;

    if (path === '/equipamento') {
        $scope.count();
    };

    if (path === '/equipamento/edit') {
        $scope.equipamento = {};
        
    };

    if (path === '/equipamento/edit/' + id) {
        EquipamentoService.get(id).then(
            function(data) {
                $scope.equipamento = data;
                $scope.produtosSelecionados = $scope.equipamento.equipamentoproduto;
            },
            function(error) {
                var data = error[0];
                var status = error[1];

                if (status === 401) {
                    AlertService.addWithTimeout('warning', data.message);
                }
            }
        );
    };

    $scope.pageChanged = function() {
        $scope.equipamentos = [];
        var num = (($scope.currentPage - 1) * $scope.itemsPerPage);
        EquipamentoService.list(num, $scope.itemsPerPage).then(
            function(data) {
                $scope.equipamentos = data;
            },
            function(error) {
                var data = error[0];
                var status = error[1];

                if (status === 401) {
                    AlertService.addWithTimeout('warning', data.message);
                }
            }
        );
    };

    $scope.new = function() {
        $location.path('/equipamento/edit');
    };

    $scope.save = function() {

        $("[id$='-message']").text("");
        
        $scope.equipamento.equipamentoproduto = $scope.produtosSelecionados;
        
        EquipamentoService.save($scope.equipamento).then(
            function(data) {
                AlertService.addWithTimeout('success', 'Equipamento salvo com sucesso');
                $location.path('/equipamento');
            },
            function(error) {
                var data = error[0];
                var status = error[1];
                if (status === 401) {
                    AlertService.addWithTimeout('danger', 'Não foi possível executar a operação');
                }
                else if (status === 412) {
                    $.each(data, function(i, violation) {
                        $("#" + violation.property + "-message").text(violation.message);
                    });
                }
            }
        );
    };

    $scope.delete = function(id) {
        EquipamentoService.delete(id).then(
            function(data) {
                AlertService.addWithTimeout('success', 'Equipamento removido com sucesso');
                $location.path('/equipamento');
                $scope.count();
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            },
            function(error) {
                var data = error[0];
                var status = error[1];
                if (status === 401) {
                    AlertService.addWithTimeout('warning', data.message);
                }
            }
        );
    };

    $scope.edit = function(id) {
        $rootScope.equipamentoCurrentPage = $scope.pagingOptions.currentPage;
        $location.path('/equipamento/edit/' + id);
    };

    $scope.adicionarProduto = function() {
        if (typeof ($scope.produto) === "undefined" || $scope.produto === "") {
            AlertService.addWithTimeout('danger', 'Selecione um produto');
        } else {
            var index = buscaElemento($scope.produto, $scope.produtosSelecionados);

            if (index !== -1) {
                AlertService.addWithTimeout('danger', 'Produto já foi adicionado!');
            } else {
                $scope.produtosSelecionados.push($scope.produto);
            }
        }
    };

    $scope.removeProduto = function(produto) {
        var index = buscaElemento(produto, $scope.produtosSelecionados);

        if (index !== -1) {
            $scope.produtosSelecionados.splice(index, 1);
        }
    };

    function buscaElemento(elemento, lista) {
        var index = -1;
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].nome === elemento.nome) {
                index = i;
                break;
            }
        }
        return index;
    };

    $scope.filterOptions = {
        filterText: '',
        externalFilter: 'searchText',
        useExternalFilter: true
    };

    $scope.pagingOptions = {
        pageSizes: [15],
        pageSize: 15,
        currentPage: 1
    };

    $scope.setPagingData = function(data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.getPagedDataAsync = function(pageSize, page) {
        var field;
        var order;
        if (typeof ($scope.sortInfo) === "undefined") {
            field = "id";
            order = "asc";
        } else {
            field = $scope.sortInfo.fields[0];
            order = $scope.sortInfo.directions[0];
        }

        setTimeout(function() {
            var init = (page - 1) * pageSize;
            EquipamentoService.list(field, order, init, pageSize).then(
                function(data) {
                    $scope.equipamentos = data;
                },
                function(error) {
                    var data = error[0];
                    var status = error[1];

                    if (status === 401) {
                        AlertService.addWithTimeout('warning', data.message);
                    }
                }
            );
        }, 100);
    };

    if ($rootScope.equipamentoCurrentPage != undefined) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $rootScope.equipamentoCurrentPage);
        $scope.pagingOptions.currentPage = $rootScope.equipamentoCurrentPage;
    }
    else {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    }

//    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function(newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }, true);

    $scope.$watch('filterOptions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }, true);

    $scope.$watch('sortInfo', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }, true);

    $scope.$on('ngGridEventSorted', function(event, sortInfo) {
        $scope.sortInfo = sortInfo;
    });

    $scope.gridOptions = {
        data: 'equipamentos',
        columnDefs: [{field: 'id', displayName: '', width: "50"},
            {field: 'tipo', displayName: 'Tipo'},
            {field: 'codigo', displayName: 'Código'},
            {displayName: 'Ação', cellTemplate: '<a ng-show="!currentUser" ng-click="edit(row.entity.id)" class="btn btn-primary btn-xs"><i class="glyphicon glyphicon-eye-open"></i> Visualizar</a>\n\
                                                 <a ng-show="currentUser" ng-click="edit(row.entity.id)" class="btn btn-success btn-xs"><i class="glyphicon glyphicon-plus-sign"></i> Alterar</a>\n\
                                                 <a has-roles="USER_ROLES.ADMINISTRADOR, USER_ROLES.CADASTRADOR" confirm-button title="Excluir?" confirm-action="delete(row.entity.id)" class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-minus-sign"></i> Excluir</a>', width: "200"}],
        selectedItems: [],
        keepLastSelected: true,
        sortInfo: $scope.sortInfo,
        multiSelect: false,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        enableSorting: true,
        useExternalSorting: true,
        i18n: "pt"
//        afterSelectionChange: function(rowItem) {
//            if (rowItem.selected) {
//                $scope.edit($scope.gridOptions.selectedItems[0].id);
//            }
//        }
    };

    $scope.$on('$routeChangeStart', function(event, next) {
        if (next.originalPath.indexOf("equipamento") === -1) {
            $rootScope.equipamentoCurrentPage = 1;
        }
    });

}]);
