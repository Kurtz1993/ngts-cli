import { Inject } from '<%= decoratorPath %>';

@Inject('$stateProvider')
export class <%= pName %>Config {
    constructor(stateProvider: ng.ui.IStateProvider) {
        stateProvider
            .state('<%= appName %>.<%= name %>', {
                url: '/<%= hName %>',
                views: {
                    <%= viewName %>: {
                        templateUrl: '<%= tplPath %><%= hName %>/<%= hName %>.tpl.html',
                        controller: '<%= pName %>Controller',
                        controllerAs: '<%= ctrlAlias %>'
                    }
                }
            });
    }
}