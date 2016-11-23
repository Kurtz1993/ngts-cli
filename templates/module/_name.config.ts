import { Inject } from "<%= decoratorPath %>";

@Inject("$stateProvider")
export class <%= pName %>Config {
    constructor(stateProvider: ng.ui.IStateProvider) {
        stateProvider
            .state("<%= appName %>.<%= name %>", {
                url: "/<%= pName %>",
                views: {
                    content: {
                        templateUrl: "<%= tplPath %><%= hName %>.tpl.html",
                        controller: "<%= pName %>Controller",
                        controllerAs: "<%= ctrlAlias %>"
                    }
                }
            });
    }
}