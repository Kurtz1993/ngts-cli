<% if (!moduleOnly) { %>import { <%= pName %>Config } from "./<%= hName %>.config";
import { <%= pName %>Controller } from "./<%= hName %>.controller";

<% } %>export const <%= name %> = angular
    .module("<%= appName %>.<%= name %>", [])<% if (!moduleOnly) { %>
    .controller("<%= pName %>Controller", <%= pName %>Controller)
    .config(<%= pName %>Config)<% } %>
    .name;
