import { Inject } from '<%= decoratorPath %>';
import { BaseService } from './base.service';

@Inject('$http', 'env')
export class <%= pName %>Service extends BaseService implements I<%= pName %>Service {
    constructor(http: ng.IHttpService, env: any) {
        super(http, env, 'prefix');
    }
}

export interface I<%= pName %>Service {
}