import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\StationMasterController::store
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
export const store = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/station-master/{train}/milestones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StationMasterController::store
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
store.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::store
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
store.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::store
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
const storeForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::store
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
storeForm.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
export const update = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/station-master/{train}/milestones/{milestone}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
update.url = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            train: args[0],
            milestone: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        train: typeof args.train === 'object'
        ? args.train.id
        : args.train,
        milestone: typeof args.milestone === 'object'
        ? args.milestone.id
        : args.milestone,
    }

    return update.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{milestone}', parsedArgs.milestone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
update.put = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
const updateForm = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
updateForm.put = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const milestones = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
}

export default milestones