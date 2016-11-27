/** Base class for all services. */
abstract class BaseService {
    protected serviceUrl: string;
    protected headers: ng.IHttpRequestConfigHeaders = {};
    private _reqConfig: ng.IRequestShortcutConfig;
    private _storage: Storage;

    /**
     * Use the base service class to create your services.
     * @param http Angular HTTP service.
     * @param env Variable set on startup that has the API endpoint.
     * @param prefix Prefix to use with the service. For example: "auth";
     */
    constructor(protected http: ng.IHttpService, env: any, prefix: string) {
        this._storage = window.sessionStorage;
        this.serviceUrl = `${env.api}/${prefix}`;
        let token = this._storage.getItem("token");
        this.headers["Authorization"] = `Bearer ${token}`;
        this._reqConfig = {
            headers: this.headers,
            timeout: 45000
        };
    }

    /**
     * Triggers a HTTP POST to the server with the specified endpoint and data.
     * @param endpoint The endpoint to POST to.
     * @param [data=null] Any data to be sent to the server.
     * @returns A promise in the format of ng.IHttpPromise<any>.
     */
    protected post(endpoint: string, data: any = null): ng.IHttpPromise<any> {
        return this.http.post(`${this.serviceUrl}/${endpoint}`, data, this._reqConfig);
    }

    /**
     * Triggers a HTTP GET to the server with the specified endpoint and query parameters.
     * @param endpoint The endpoint to GET from.
     * @param [queryParams] Any data to be sent to the server. Keys must match query parameter name.
     * @param [cache=false] Specifies if the request should be cached.
     * @returns A promise in the format of ng.IHttpPromise<any>.
     */
    protected get(endpoint: string, queryParams?: Object, cache: boolean = false): ng.IHttpPromise<any> {
        let getConfig = angular.copy(this._reqConfig);
        getConfig.params = queryParams;
        getConfig.cache = cache;
        return this.http.get(`${this.serviceUrl}/${endpoint}`, getConfig);
    }

    /**
     * Triggers a HTTP DELETE to the server with the specified endpoint and query parameters.
     * @param endpoint The endpoint to DELETE from.
     * @param [queryParams] Any data to be sent to the server. Keys must match query parameter name.
     * @returns A promise in the format of ng.IHttpPromise<any>.
     */
    protected delete(endpoint: string, queryParams?: Object): ng.IHttpPromise<any> {
        let deleteConfig = angular.copy(this._reqConfig);
        deleteConfig.params = queryParams;
        return this.http.delete(`${this.serviceUrl}/${endpoint}`, deleteConfig);
    }

    /**
     * Triggers a HTTP PUT to the server with the specified endpoint and query parameters.
     * @param endpoint The endpoint to PUT at.
     * @param [data=null] Any data to be sent to the server.
     * @returns A promise in the format of ng.IHttpPromise<any>.
     */
    protected put(endpoint: string, data: any = null): ng.IHttpPromise<any> {
        return this.http.put(`${this.serviceUrl}/${endpoint}`, data, this._reqConfig);
    }
}

export { BaseService };