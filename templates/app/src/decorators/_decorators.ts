/**
 * Adds the dependencies inside the static $inject property of the class.
 * @param args Any dependency to be added to the class.
 */
export function Inject(...args: string[]) {
    return function (target: Function) {
        target.$inject = args;
    }
}