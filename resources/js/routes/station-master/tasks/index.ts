import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\StationMasterController::store
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
*/
export const store = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/station-master/{train}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StationMasterController::store
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
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
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
*/
store.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::store
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
*/
const storeForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::store
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
*/
storeForm.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
export const update = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/station-master/{train}/tasks/{task}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
update.url = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            train: args[0],
            task: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        train: typeof args.train === 'object'
        ? args.train.id
        : args.train,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return update.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
update.put = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
const updateForm = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
updateForm.put = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\StationMasterController::dispatchBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
export const dispatchBot = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dispatchBot.url(args, options),
    method: 'post',
})

dispatchBot.definition = {
    methods: ["post"],
    url: '/station-master/{train}/tasks/{task}/dispatch-bot',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StationMasterController::dispatchBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
dispatchBot.url = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            train: args[0],
            task: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        train: typeof args.train === 'object'
        ? args.train.id
        : args.train,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return dispatchBot.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::dispatchBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
dispatchBot.post = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dispatchBot.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::dispatchBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
const dispatchBotForm = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dispatchBot.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::dispatchBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
dispatchBotForm.post = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dispatchBot.url(args, options),
    method: 'post',
})

dispatchBot.form = dispatchBotForm

const tasks = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    dispatchBot: Object.assign(dispatchBot, dispatchBot),
}

export default tasks