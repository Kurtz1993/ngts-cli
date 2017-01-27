<% if (!moduleOnly) { %>import { <%= pName %>Config } from "./<%= hName %>.config";

<% } %>export const <%= name %> = angular
    .module("<%= appName %>.<%= name %>", [])<% if (!moduleOnly) { %>
    .config(<%= pName %>Config)<% } %>
    .name;
