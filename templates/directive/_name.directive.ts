import { <%= pName %>Controller } from "./<%= hName %>.controller.ts";

let <%= name %>Directive = (): ng.IDirective => {
    return {
        bindToController: true,
        controllerAs: "<%= ctrlAlias %>",
        controller: <%= pName %>Controller
    };
};

export { <%= name %>Directive };