import { <%= pAppName %>Config } from "./<%= hAppName %>.config";

angular.module("<%= appName %>", [
    "ui.router"
])
.config(<%= pAppName %>Config);