import { Inject } from "<%= decoratorPath %>";
import { <%= pName %>Controller } from "./<%= hName %>.controller";

@Inject("$stateProvider")
export class <%= pName %>Config {
    constructor(stateProvider: ng.ui.IStateProvider) {
        stateProvider
            .state("<%= appName %>.<%= name %>", {
                url: "/<%= pName %>",
                views: {
                    <%= viewName %>: {
                        templateUrl: "<%= tplPath %><%= hName %>/<%= hName %>.tpl.html",
                        controller: <%= pName %>Controller,
                        controllerAs: "<%= ctrlAlias %>"
                    }
                }
            });
    }
}
