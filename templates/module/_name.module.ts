<%if (!noImport) { %>import * as angular from 'angular';
<% } %><% if (!moduleOnly) { %>import { <%= pName %>Config } from './<%= hName %>.config';
import { <%= pName %>Controller } from './<%= hName %>.controller';

<% } %>export const <%= pName %>Module = angular
    .module('<%= appName %>.<%= name %>', [<% if (!moduleOnly) { %>'ui.router'])
    .controller('<%= pName %>Controller', <%= pName %>Controller)
    .config(<%= pName %>Config)<% } else { %>])<% } %>
    .name;