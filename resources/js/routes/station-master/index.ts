import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import milestones from './milestones'
import tasks from './tasks'
import markdown from './markdown'
import fingerprint from './fingerprint'
/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:17
* @route '/station-master/{train}'
*/
export const show = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/station-master/{train}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:17
* @route '/station-master/{train}'
*/
show.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:17
* @route '/station-master/{train}'
*/
show.get = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:17
* @route '/station-master/{train}'
*/
show.head = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:17
* @route '/station-master/{train}'
*/
const showForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:17
* @route '/station-master/{train}'
*/
showForm.get = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:17
* @route '/station-master/{train}'
*/
showForm.head = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see app/Http/Controllers/StationMasterController.php:34
* @route '/station-master/{train}'
*/
export const update = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/station-master/{train}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:34
* @route '/station-master/{train}'
*/
update.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:34
* @route '/station-master/{train}'
*/
update.put = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StationMasterController::update
* @see app/Http/Controllers/StationMasterController.php:34
* @route '/station-master/{train}'
*/
const updateForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/StationMasterController.php:34
* @route '/station-master/{train}'
*/
updateForm.put = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\StationMasterController::suggestSchedule
* @see app/Http/Controllers/StationMasterController.php:79
* @route '/station-master/{train}/suggest-schedule'
*/
export const suggestSchedule = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSchedule.url(args, options),
    method: 'post',
})

suggestSchedule.definition = {
    methods: ["post"],
    url: '/station-master/{train}/suggest-schedule',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StationMasterController::suggestSchedule
* @see app/Http/Controllers/StationMasterController.php:79
* @route '/station-master/{train}/suggest-schedule'
*/
suggestSchedule.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return suggestSchedule.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::suggestSchedule
* @see app/Http/Controllers/StationMasterController.php:79
* @route '/station-master/{train}/suggest-schedule'
*/
suggestSchedule.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSchedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::suggestSchedule
* @see app/Http/Controllers/StationMasterController.php:79
* @route '/station-master/{train}/suggest-schedule'
*/
const suggestScheduleForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: suggestSchedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::suggestSchedule
* @see app/Http/Controllers/StationMasterController.php:79
* @route '/station-master/{train}/suggest-schedule'
*/
suggestScheduleForm.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: suggestSchedule.url(args, options),
    method: 'post',
})

suggestSchedule.form = suggestScheduleForm

/**
* @see \App\Http\Controllers\StationMasterController::applySchedule
* @see app/Http/Controllers/StationMasterController.php:110
* @route '/station-master/{train}/apply-schedule'
*/
export const applySchedule = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applySchedule.url(args, options),
    method: 'post',
})

applySchedule.definition = {
    methods: ["post"],
    url: '/station-master/{train}/apply-schedule',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StationMasterController::applySchedule
* @see app/Http/Controllers/StationMasterController.php:110
* @route '/station-master/{train}/apply-schedule'
*/
applySchedule.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return applySchedule.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::applySchedule
* @see app/Http/Controllers/StationMasterController.php:110
* @route '/station-master/{train}/apply-schedule'
*/
applySchedule.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applySchedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::applySchedule
* @see app/Http/Controllers/StationMasterController.php:110
* @route '/station-master/{train}/apply-schedule'
*/
const applyScheduleForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: applySchedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::applySchedule
* @see app/Http/Controllers/StationMasterController.php:110
* @route '/station-master/{train}/apply-schedule'
*/
applyScheduleForm.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: applySchedule.url(args, options),
    method: 'post',
})

applySchedule.form = applyScheduleForm

const stationMaster = {
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    milestones: Object.assign(milestones, milestones),
    tasks: Object.assign(tasks, tasks),
    markdown: Object.assign(markdown, markdown),
    suggestSchedule: Object.assign(suggestSchedule, suggestSchedule),
    applySchedule: Object.assign(applySchedule, applySchedule),
    fingerprint: Object.assign(fingerprint, fingerprint),
}

export default stationMaster