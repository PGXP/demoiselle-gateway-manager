'use strict';

app.config(['$routeProvider', 'USER_ROLES', function($routeProvider, USER_ROLES) {

    $routeProvider

        .when('/equipamento', {
        templateUrl: 'views/equipamento/list.html',
        controller: 'EquipamentoController',
        data: {
            authorizedRoles: [USER_ROLES.NOT_LOGGED]
        }
    })

    .when('/equipamento/edit', {
        templateUrl: 'views/equipamento/edit.html',
        controller: 'EquipamentoController',
        data: {
            authorizedRoles: [USER_ROLES.NOT_LOGGED]
        }
    })

    .when('/equipamento/edit/:id', {
        templateUrl: 'views/equipamento/edit.html',
        controller: 'EquipamentoController',
        data: {
            authorizedRoles: [USER_ROLES.NOT_LOGGED]
        }
    })

}]);
