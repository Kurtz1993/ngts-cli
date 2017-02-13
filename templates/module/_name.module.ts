import * as angular from "angular";
import uiRouter from "angular-ui-router";
<% if (!moduleOnly) { %>import { <%= pName %>Config } from "./<%= hName %>.config";
import { <%= pName %>Controller } from "./<%= hName %>.controller";

<% } %>export const <%= name %> = angular
    .module("<%= appName %>.<%= name %>", [uiRouter])<% if (!moduleOnly) { %>
    .controller("<%= pName %>", <%= pName %>Controller)
    .config(<%= pName %>Config)<% } %>
    .name;
