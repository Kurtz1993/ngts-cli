import { Inject } from "<%= decoratorPath %>";
import { BaseService } from "./base.service";

@Inject("$http", "env")
class <%= name %>Service extends BaseService implements I<%= name %>Service {
    constructor(http: ng.IHttpService, env: any) {
        super(http, env, "prefix");
    }
}

export { <%= name %>Service };