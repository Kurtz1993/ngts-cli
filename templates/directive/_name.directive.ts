import { <%= pName %>Controller } from "./<%= hName %>.controller.ts";

let <%= name %>Directive = (): ng.IDirective => {
    return {
        bindToController: true,
        controllerAs: "$ctrl",
        controller: <%= pName %>Controller
    };
};

export { <%= name %>Directive };