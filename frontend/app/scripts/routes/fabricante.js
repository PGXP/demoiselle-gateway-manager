'use strict';

app.config(['$routeProvider', 'USER_ROLES', function ($routeProvider, USER_ROLES) {

        $routeProvider

                .when('/fabricante', {
                    templateUrl: 'views/fabricante/fabricante-listar.html',
                    controller: 'FabricanteController',
                    data: {
                        authorizedRoles: [USER_ROLES.NOT_LOGGED]
                    }
                })

                .when('/fabricante/edit', {
                    templateUrl: 'views/fabricante/fabricante-edit.html',
                    controller: 'FabricanteController',
                    data: {
                        authorizedRoles: [USER_ROLES.ADMINISTRADOR, USER_ROLES.CADASTRADOR]
                    }
                })

                .when('/fabricante/edit/:id', {
                    templateUrl: 'views/fabricante/fabricante-edit.html',
                    controller: 'FabricanteController',
                    data: {
                        authorizedRoles: [USER_ROLES.NOT_LOGGED]
                    }
                })

    }]);

