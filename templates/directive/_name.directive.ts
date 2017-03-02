import { <%= pName %>Controller } from './<%= hName %>.controller';

export const <%= pName %>Directive = (): ng.IDirective => {
    return {<% if (restrict) { %>
        restrict: '<%= restriction %>',<% } %>
        bindToController: true,
        controllerAs: '<%= ctrlAlias %>',
        controller: <%= pName %>Controller,<% if (hasTemplate) { %>
        templateUrl: '<%= tplPath %><%= hName %>/<%= hName %>.tpl.html',<% } %>
    };
};