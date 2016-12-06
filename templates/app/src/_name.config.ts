import { Inject } from "./decorators/decorators";

@Inject("$stateProvider", "$urlRouterProvider")
export class <%= pAppName %>Config {
    constructor(stateProvider: ng.ui.IStateProvider, urlRouterProvider: ng.ui.IUrlRouterProvider) {
        stateProvider
            .state("<%= appName %>", {
                url: "/",
                templateUrl: "<%= hAppName %>.tpl.html"
            });

        urlRouterProvider.otherwise("/");
    }
}