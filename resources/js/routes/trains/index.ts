import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
export const aboard = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: aboard.url(args, options),
    method: 'get',
})

aboard.definition = {
    methods: ["get","head"],
    url: '/trains/{train}/aboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
aboard.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { train: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { train: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            train: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        train: typeof args.train === 'object'
        ? args.train.id
        : args.train,
    }

    return aboard.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
aboard.get = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: aboard.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
aboard.head = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: aboard.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
const aboardForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: aboard.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
aboardForm.get = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: aboard.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
aboardForm.head = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: aboard.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

aboard.form = aboardForm

const trains = {
    aboard: Object.assign(aboard, aboard),
}

export default trains