import { <%= pName %>Controller } from "./<%= hName %>.controller.ts";

let <%= name %>Directive = (): ng.IDirective => {
    return {<% if (restrict) { %>
        restrict: "<%= restriction %>",<% } %>
        bindToController: true,
        controllerAs: "<%= ctrlAlias %>",
        controller: <%= pName %>Controller
    };
};

export { <%= name %>Directive };