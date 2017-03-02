import { <%= pName %>Controller } from './<%= hName %>.controller';

export const <%= pName %>Component: ng.IComponentOptions = {
    controller: <%= pName %>Controller,
    controllerAs: '<%= ctrlAlias %>',
    templateUrl: '<%= tplPath %><%= hName %>/<%= hName %>.tpl.html',
    bindings: {

    }
};