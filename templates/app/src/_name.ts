import { <%= pAppName %>Config } from "./<%= hAppName %>.config";
import { <%= pAppName %>Run } from "./<%= hAppName %>.run";

angular.module("<%= appName %>", [
    "<%= appName %>.tpls",
    "ui.router"
])
.config(<%= pAppName %>Config)
.run(<%= pAppName %>Run);