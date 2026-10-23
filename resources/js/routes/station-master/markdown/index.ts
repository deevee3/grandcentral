import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:45
* @route '/station-master/{train}/markdown/{filename}'
*/
export const show = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/station-master/{train}/markdown/{filename}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:45
* @route '/station-master/{train}/markdown/{filename}'
*/
show.url = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            train: args[0],
            filename: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        train: typeof args.train === 'object'
        ? args.train.id
        : args.train,
        filename: args.filename,
    }

    return show.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:45
* @route '/station-master/{train}/markdown/{filename}'
*/
show.get = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:45
* @route '/station-master/{train}/markdown/{filename}'
*/
show.head = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:45
* @route '/station-master/{train}/markdown/{filename}'
*/
const showForm = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:45
* @route '/station-master/{train}/markdown/{filename}'
*/
showForm.get = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:45
* @route '/station-master/{train}/markdown/{filename}'
*/
showForm.head = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:63
* @route '/station-master/{train}/markdown/{filename}'
*/
export const update = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/station-master/{train}/markdown/{filename}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:63
* @route '/station-master/{train}/markdown/{filename}'
*/
update.url = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            train: args[0],
            filename: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        train: typeof args.train === 'object'
        ? args.train.id
        : args.train,
        filename: args.filename,
    }

    return update.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:63
* @route '/station-master/{train}/markdown/{filename}'
*/
update.put = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:63
* @route '/station-master/{train}/markdown/{filename}'
*/
const updateForm = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/StationMasterController.php:63
* @route '/station-master/{train}/markdown/{filename}'
*/
updateForm.put = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const markdown = {
    show: Object.assign(show, show),
    update: Object.assign(update, update),
}

export default markdown