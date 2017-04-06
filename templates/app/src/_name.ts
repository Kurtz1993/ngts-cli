import * as angular from 'angular';
import { <%= pAppName %>Config } from './<%= hAppName %>.config';
import { <%= pAppName %>Run } from './<%= hAppName %>.run';
import { ServicesModule } from './services/services.module';

angular
    .module('<%= appName %>', [
        // Uncomment to use your app templates.
        // '<%= appName %>.tpls',
        'ui.router',
        ServicesModule
    ])
    .config(<%= pAppName %>Config)
    .run(<%= pAppName %>Run);