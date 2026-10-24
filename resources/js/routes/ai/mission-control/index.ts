import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/ai/mission-control',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
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
* @see app/Http/Controllers/Settings/AiSettingsController.php:40
* @route '/settings/ai/mission-control'
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

const missionControl = {
    update: Object.assign(update, update),
}

export default missionControl