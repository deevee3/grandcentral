import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
const TrainAboardController = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: TrainAboardController.url(args, options),
    method: 'get',
})

TrainAboardController.definition = {
    methods: ["get","head"],
    url: '/trains/{train}/aboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
TrainAboardController.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return TrainAboardController.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
TrainAboardController.get = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: TrainAboardController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
TrainAboardController.head = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: TrainAboardController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
const TrainAboardControllerForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: TrainAboardController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
TrainAboardControllerForm.get = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: TrainAboardController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TrainAboardController::__invoke
* @see app/Http/Controllers/TrainAboardController.php:12
* @route '/trains/{train}/aboard'
*/
TrainAboardControllerForm.head = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: TrainAboardController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

TrainAboardController.form = TrainAboardControllerForm

export default TrainAboardController