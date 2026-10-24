import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AiSettingsController::edit
* @see app/Http/Controllers/Settings/AiSettingsController.php:16
* @route '/settings/ai'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/ai',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::edit
* @see app/Http/Controllers/Settings/AiSettingsController.php:16
* @route '/settings/ai'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::edit
* @see app/Http/Controllers/Settings/AiSettingsController.php:16
* @route '/settings/ai'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::edit
* @see app/Http/Controllers/Settings/AiSettingsController.php:16
* @route '/settings/ai'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::edit
* @see app/Http/Controllers/Settings/AiSettingsController.php:16
* @route '/settings/ai'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::edit
* @see app/Http/Controllers/Settings/AiSettingsController.php:16
* @route '/settings/ai'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::edit
* @see app/Http/Controllers/Settings/AiSettingsController.php:16
* @route '/settings/ai'
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
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:29
* @route '/settings/ai'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/ai',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:29
* @route '/settings/ai'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:29
* @route '/settings/ai'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:29
* @route '/settings/ai'
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
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:29
* @route '/settings/ai'
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
* @see \App\Http\Controllers\Settings\AiSettingsController::updateMissionControl
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
*/
export const updateMissionControl = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMissionControl.url(options),
    method: 'patch',
})

updateMissionControl.definition = {
    methods: ["patch"],
    url: '/settings/ai/mission-control',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::updateMissionControl
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
*/
updateMissionControl.url = (options?: RouteQueryOptions) => {
    return updateMissionControl.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::updateMissionControl
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
*/
updateMissionControl.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMissionControl.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::updateMissionControl
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
*/
const updateMissionControlForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMissionControl.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::updateMissionControl
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
*/
updateMissionControlForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMissionControl.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateMissionControl.form = updateMissionControlForm

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::updateBotHq
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
*/
export const updateBotHq = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateBotHq.url(options),
    method: 'patch',
})

updateBotHq.definition = {
    methods: ["patch"],
    url: '/settings/ai/bot-hq',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::updateBotHq
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
*/
updateBotHq.url = (options?: RouteQueryOptions) => {
    return updateBotHq.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::updateBotHq
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
*/
updateBotHq.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateBotHq.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::updateBotHq
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
*/
const updateBotHqForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateBotHq.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::updateBotHq
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
*/
updateBotHqForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateBotHq.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateBotHq.form = updateBotHqForm

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::destroy
* @see app/Http/Controllers/Settings/AiSettingsController.php:78
* @route '/settings/ai'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/ai',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::destroy
* @see app/Http/Controllers/Settings/AiSettingsController.php:78
* @route '/settings/ai'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::destroy
* @see app/Http/Controllers/Settings/AiSettingsController.php:78
* @route '/settings/ai'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::destroy
* @see app/Http/Controllers/Settings/AiSettingsController.php:78
* @route '/settings/ai'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::destroy
* @see app/Http/Controllers/Settings/AiSettingsController.php:78
* @route '/settings/ai'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const AiSettingsController = { edit, update, updateMissionControl, updateBotHq, destroy }

export default AiSettingsController