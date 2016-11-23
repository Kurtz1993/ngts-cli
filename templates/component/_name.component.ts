import { <%= pName %>Controller } from "./<%= hName %>.controller";

let <%= name %>: ng.IComponentOptions = {
    controller: <%= pName %>Controller,
    templateUrl: "<%= hName %>/<%= hName %>.tpl.html",
    bindings: {

    }
};

export { <%= name %> };