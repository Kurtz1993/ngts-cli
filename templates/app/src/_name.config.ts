import { Inject } from "./decorators/decorators";

@Inject("$stateProvider", "$urlRouterProvider")
export class <%= pAppName %>Config {
    constructor(stateProvider: ng.ui.IStateProvider, urlRouterProvider: ng.ui.IUrlRouterProvider) {
        stateProvider
            .state("<%= appName %>", {
                url: "/",
                template: "<h2>Hello world!</h2>"
            });

        urlRouterProvider.otherwise("/");
    }
}