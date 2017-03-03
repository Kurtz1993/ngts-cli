import * as angular from 'angular';

export const ServicesModule = angular
    .module('<%= appName %>.services', [])
    .constant('apiUrl', 'http://localhost')
    .name;
