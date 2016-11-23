import { <%= pName %>Config } from "./<%= hName %>.config";
import { <%= pName %>Controller } from "./<%= hName %>.controller";

let module = angular
    .module("<%= appName %>.<%= name %>", [])
    .controller("<%= pName %>Controller", <%= pName %>Controller)
    .config(<%= pName %>Config);

let <%= name %> = module.name;

export { <%= name %> };