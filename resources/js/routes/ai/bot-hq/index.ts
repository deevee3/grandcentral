import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/ai/bot-hq',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\AiSettingsController::update
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
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
* @see app/Http/Controllers/Settings/AiSettingsController.php:61
* @route '/settings/ai/bot-hq'
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

const botHq = {
    update: Object.assign(update, update),
}

export default botHq