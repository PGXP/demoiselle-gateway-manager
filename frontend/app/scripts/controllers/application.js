'use strict';

app.controller('ApplicationController', ['$rootScope', 'USER_ROLES', 'AuthService', 'LAYOUTS',
    function($rootScope, USER_ROLES, AuthService, LAYOUTS) {

        $rootScope.userRoles = USER_ROLES;
        $rootScope.isAuthorized = AuthService.isAuthorized;
        $rootScope.css = AuthService.getCss();

    }
]);