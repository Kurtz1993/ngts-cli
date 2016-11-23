import { <%= pName %>Controller } from "./<%= hName %>.controller";

let <%= name %>: ng.IComponentOptions = {
    controller: <%= pName %>Controller,
    controllerAs: "<%= ctrlAlias %>",
    templateUrl: "<%= tplPath %><%= hName %>.tpl.html",
    bindings: {

    }
};

export { <%= name %> };