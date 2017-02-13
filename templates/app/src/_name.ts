import * as angular from "angular";
import { <%= pAppName %>Config } from "./<%= hAppName %>.config";
import { <%= pAppName %>Run } from "./<%= hAppName %>.run";
import { services } from "./services/services";

angular.module("<%= appName %>", [
    // Uncomment to use your app templates.
    // "<%= appName %>.tpls",
    "ui.router",
    services
])
.config(<%= pAppName %>Config)
.run(<%= pAppName %>Run);