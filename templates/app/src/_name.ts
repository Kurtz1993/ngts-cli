import { <%= pAppName %>Config } from "./<%= hAppName %>.config";
import { <%= pAppName %>Run } from "./<%= hAppName %>.run";

angular.module("<%= appName %>", [
    // Uncomment to use your app templates.
    // "<%= appName %>.tpls",
    "ui.router"
])
.config(<%= pAppName %>Config)
.run(<%= pAppName %>Run);