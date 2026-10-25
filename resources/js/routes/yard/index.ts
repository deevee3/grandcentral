import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\YardSettingsController::edit
* @see app/Http/Controllers/Settings/YardSettingsController.php:16
* @route '/settings/yard'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/yard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::edit
* @see app/Http/Controllers/Settings/YardSettingsController.php:16
* @route '/settings/yard'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::edit
* @see app/Http/Controllers/Settings/YardSettingsController.php:16
* @route '/settings/yard'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::edit
* @see app/Http/Controllers/Settings/YardSettingsController.php:16
* @route '/settings/yard'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::edit
* @see app/Http/Controllers/Settings/YardSettingsController.php:16
* @route '/settings/yard'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::edit
* @see app/Http/Controllers/Settings/YardSettingsController.php:16
* @route '/settings/yard'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::edit
* @see app/Http/Controllers/Settings/YardSettingsController.php:16
* @route '/settings/yard'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::update
* @see app/Http/Controllers/Settings/YardSettingsController.php:43
* @route '/settings/yard'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/yard',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::update
* @see app/Http/Controllers/Settings/YardSettingsController.php:43
* @route '/settings/yard'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::update
* @see app/Http/Controllers/Settings/YardSettingsController.php:43
* @route '/settings/yard'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::update
* @see app/Http/Controllers/Settings/YardSettingsController.php:43
* @route '/settings/yard'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::update
* @see app/Http/Controllers/Settings/YardSettingsController.php:43
* @route '/settings/yard'
*/
updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::rescan
* @see app/Http/Controllers/Settings/YardSettingsController.php:80
* @route '/settings/yard/rescan'
*/
export const rescan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rescan.url(options),
    method: 'post',
})

rescan.definition = {
    methods: ["post"],
    url: '/settings/yard/rescan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::rescan
* @see app/Http/Controllers/Settings/YardSettingsController.php:80
* @route '/settings/yard/rescan'
*/
rescan.url = (options?: RouteQueryOptions) => {
    return rescan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::rescan
* @see app/Http/Controllers/Settings/YardSettingsController.php:80
* @route '/settings/yard/rescan'
*/
rescan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rescan.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::rescan
* @see app/Http/Controllers/Settings/YardSettingsController.php:80
* @route '/settings/yard/rescan'
*/
const rescanForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rescan.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\YardSettingsController::rescan
* @see app/Http/Controllers/Settings/YardSettingsController.php:80
* @route '/settings/yard/rescan'
*/
rescanForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rescan.url(options),
    method: 'post',
})

rescan.form = rescanForm

const yard = {
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    rescan: Object.assign(rescan, rescan),
}

export default yard