import * as angular from 'angular';

export const services = angular
    .module('<%= appName %>.services', [])
    .constant('apiUrl', 'http://localhost')
    .name;
