'use strict';

app.factory('EquipamentoService', ['$http', '$q', function($http, $q) {
    var service = {};

    service.findAll = function() {
        return $http
            .get('api/equipamento')
            .then(function(res) {
                return res.data;
            });
    };

    service.save = function(equipamento) {
        var deferred = $q.defer();
        $http({
            url: 'api/equipamento',
            method: equipamento.id ? "PUT" : "POST",
            data: equipamento,
            headers: {
                'Content-Type': 'application/json;charset=utf8'
            }
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status) {
            deferred.reject([data, status]);
        });
        return deferred.promise;
    };

    service.delete = function(id) {
        var deferred = $q.defer();
        $http({
            url: 'api/equipamento/' + id,
            method: "DELETE"
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status) {
            deferred.reject([data, status]);
        });
        return deferred.promise;
    };

    service.get = function(id) {
        var deferred = $q.defer();
        $http({
            url: 'api/equipamento/' + id,
            method: "GET"
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status) {
            deferred.reject([data, status]);
        });
        return deferred.promise;
    };

    service.count = function() {
        var deferred = $q.defer();
        $http({
            url: 'api/equipamento/count',
            method: "GET",
            headers: {
                'Content-Type': 'application/json;charset=utf8'
            }
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status) {
            deferred.reject([data, status]);
        });
        return deferred.promise;
    };

    service.list = function(field, order, init, qtde) {
        var deferred = $q.defer();
        $http({
            url: 'api/equipamento/list/' + field + '/' + order + '/' + init + '/' + qtde,
            method: "GET",
            headers: {
                'Content-Type': 'application/json;charset=utf8'
            }
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status) {
            deferred.reject([data, status]);
        });
        return deferred.promise;
    };

    service.carregarProdutosRelacionados = function(equipamentoId) {
        return $http
            .get('api/equipamento/produto/listaequipamento/' + equipamentoId)
            .then(function(res) {
                return res.data;
            });
    };

    service.adicionarProduto = function(equipamentoId, p) {
        return $http
            .post('api/equipamento/produto', { equipamento: { id: equipamentoId }, produto: { id: p.id } })
            .then(function(res) {
                return;
            });
    };

    service.removerProduto = function(id) {
        return $http
            .delete('api/equipamento/produto/' + id)
            .then(function(res) {
                return;
            });
    };

    return service;
}]);
