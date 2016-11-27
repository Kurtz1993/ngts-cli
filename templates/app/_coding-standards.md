# Angular in TypeScript Coding Conventions

This guide specifies the coding conventions for angular applications written in TypeScript and help maintaining our codebase clean, readable and easy to follow.

More information about the TypeScript language can be found here: [TypeScript Handbook](http://www.typescriptlang.org/docs/handbook/basic-types.html).

## All documentation must be clear and descriptive.

## Naming Conventions

- All local variable, public and static property and method names should be written in `camelCase` and self-descriptive.

```typescript
import { Inject } from "../decorators/decorators";
let userName: string;

@Inject("$scope")
class Hello {
    public greeting: string;

    constructor() {}
}
```

- All private properties and methods should be prepended with an underscore and written in `camelCase`.

```typescript
class Hello {
    private _myPrivateProperty: any;
}
```

- All class names should be written using `PascalCase`.

```typescript
class ExampleController {
    constructor() {}
}
```

- Code must be formatted and idented. You can use Alt + Shift + F in Visual Studio Code or Ctrl + K, Ctrl + D in Visual Studio in order to accomplish this.

## Variables

- All variables must specify its type.

## Typings

- All typings must be declared as interfaces and documented using JSDoc.
- Interface name must use `PascalCase`.
- Interface properties must use `camelCase` and must be *optional*.
- Interface properties provide short but clear descriptions.
- Typings for third-party libraries can be installed with the command `typings install dt~<typing-name> --global --save`.
    - This requires you to have the typings command line installed, which can be done by running a `npm install`.

More information about JSDoc can be found here: [JSDoc](http://usejsdoc.org/).
Below is an example of a custom typing:

```typescript
/** Represents a user in the application. */
delacre interface User {
    /** User defined username. */
    username?: string;
    /** User defined password. */
    password?: string;
    /** User first name. */
    firstName?: string;
    /** User last name. */
    lastName?: string;
}
```

## Modules

These conventions specify how angular modules should be structured in the application.

### Modules Name Conventions

- All modules should be written in its own folder, which should have the same name as the module written in `hyphen-separated-form`.

```
src/
   |_ example-module
```

- Module definition file/entry point file name should be written as follows: `module-name.ts`.
- Module controller file name should be written as follows: `module-name.controller.ts`.
- Module configuration file name should be written as follows: `module-name.config.ts`.
- Module stylesheet file name should be written as follows: `module-name.scss`.
- Module template file name should be written as follows: `module-name.tpl.html`.
- Module typings must live inside typings/ folder.

The folder structure is specified below.

```
src/
   |_ example-module/
      |_ typings/
      |_ example-module.scss
      |_ example-module.ts
      |_ example-module.config.ts
      |_ example-module.controller.ts
      |_ example-module.tpl.html
```

### Module Definition File/Entry Point

This file is where we define the angular module with all its necessary dependencies.

- Entry point should import all dependencies using destructuring.
- Entry point should define a variable with the name of the module in `camelCase` which will contain the angular module.
- Entry point should export the module variable using destructuring.
- Module name should be prepended with `app.`.
- Module name should be in `camelCase`.
- If the module depends on other modules created for the application, they should be imported using destructuring and should be used in the dependency array using the `name` property of the imported variable.
    - This prevents errors if a module name changes.
- Controller name of the module should be the same of the imported controller name, and it should be in `PascalCase`.

More information about destructuring can be found here: [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring).

Below you can find an example of a simple module definition.

```typescript
import { ExampleModuleConfig } from "./example-module.config";
import { ExampleModuleController } from "./example-module.controller";
import { anotherModule } from "../another-module/another-module";

let module = angular
    .module("app.exampleModule", [
        anotherModule
    ])
    .controller("ExampleModuleController", ExampleModuleController)
    .config(ExampleModuleConfig);

let exampleModule = module.name

export { exampleModule };
```

### Module Controller File

This file is where we define the controller that our module will use.

- Controller must be a class.
- Controller should be exported within the class definition.
- Controller name is specified with the module name in `PascalCase` and the word `Controller` appended to it. E.g. `ExampleModuleController`.
- Controller must handle dependency injection with the $inject Property Annotation. This requires a static $inject property inside the class. This is done by using the @Inject() decorator.
    - More information can be found here: [AngularJS Docs](https://code.angularjs.org/1.5.8/docs/guide/di#-inject-property-annotation).
- Controller static properties must have the `static` keyword.
- Controller public properties must have the `public` keyword.
- Controller private properties must have the `private` keyword.
- Controller
- Controller must not expose static methods.
- Controller public methods must have the `public` keyword.
- Controller private methods must have the `private` keyword.
- Controller methods must be documented using JSDoc.
- Controller methods must declare its return value.
- Controller properties and methods must be in this order:
    - static
    - public
    - private
- Controller injected properties must be declared as private inside the constructor.

An example of a controller can be found below.

```typescript
import { Inject } from "../decorators/decorators";

@Inject("$scope")
export class ExampleModuleController {
    public saveButtonText: string;
    private _status: number;

    constructor(private _scope: ng.IScope) {}

    /**
     * Saves the changes to the database.
     */
    public saveChanges(): void {
        this._sendInformation();
        this.saveButtonText = "Saving...";
    }

    /**
     * Sends the user information to the server.
     */
    private _sendInformation(): void {
        // Send the information.
    }
}
```

### Module Configuration File

This file includes all the module configuration passed to the `.config()` method of the `angular.module`.

- Configuration file must import dependencies using destructuring.
- Configuration file must be a class.
- Configuration class name must be the name of the module in `PascalCase` with the word `Config` appended to it.
- Configuration file must be exported in the class declaration.
- Configuration file must handle dependency injection with the $inject Property Annotation. This requires a static $inject property inside the class.
    - More information can be found here: [AngularJS Docs](https://code.angularjs.org/1.5.8/docs/guide/di#-inject-property-annotation).
- Configuration file defines how controller works, so:
    - Configuration file must define the `controllerAs` property and assign the string `"vm"` to it in order to use the controller properties instead of `$scope`.
- Configuration file url must be defined in `camelCase`.
- Configuration file state must be defined as `app.` following the module name in `camelCase`.

An example configuration file can be found below.

```typescript
import { Inject } from "../decorators/decorators";

@Inject("$stateProvider")
export class ExampleModuleConfig {
    constructor(stateProvider: ng.ui.IStateProvider) {
        stateProvider
            .state("app.exampleModule", {
                url: "/exampleModule",
                views: {
                    "ui-view-name": {
                        templateUrl: "<src-path>/example-module/example-module.tpl.html",
                        controller: "ExampleModuleController",
                        controllerAs: "vm"
                    }
                }
            });
    }
}
```

### Module Template File

- In the case that the module requires specific styling, it should wrap all the template inside a `<div>` with a class named `app-module-name`.

An example of a template with specific styling can be found below:

```html
<div class="app-example-module">
    <h1 class="title">Hello module!</h1>
</div>
```

### Module Stylesheet File

- In the case that the module requires specific styling, this file should exist, otherwise it can be omitted.
- Styles written in this file must be wrapped inside a class named `.app-module-name` to prevent styles to be overriden.
- Colors must be variables, and they must be defined inside `src/styles/dependencies/_variables.scss`.
- If a style requires vendor prefixes it should use the `prefix` mixin.

An example of a module stylesheet can be found below.

```scss
.app-example-module {
    background-color: $white;
    .title {
        font-size: 14px;
        @include prefix(border-radius, 5px);
    }
}
```

## Services

- All services live inside `app.services` module, and must be inside the `services/` folder.
- All services extend the BaseService class.
- All services must be registered as a dependency in the `app.services` module.
- All services must point to _ONLY ONE_ prefixed endpoint.
    - E.g. AccountsService must point to `/accounts` only
- All services have to prefix its endpoint.
- All services are registered with its `camelCase` name.
- All services must define an interface with the following name `IServiceName`.
    - The interface must define the public methods of the service.
    - All methods must be documented using JSDoc.
- Service file name must be defined as follows: `service-name.service.ts`.

An example service can be found below.

example-service.ts

```typescript
import { Inject } from "../decorators/decorators";
import { BaseService } from "./base.service";

@Inject("$http", "env")
class ExampleService extends BaseService implements IExampleService {
    constructor(http: ng.IHttpService, env: any) {
        super(http, env, "example");
    }
}

export { ExampleService }
```

services.ts

```typescript
import { ExampleService } from "./example.service";

let module = angular
    .module("app.services", [])
    .service("exampleService", ExampleService);

let services = module.name;

export { services };
```