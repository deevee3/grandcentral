import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CentralTowerController::index
* @see app/Http/Controllers/CentralTowerController.php:14
* @route '/central-tower'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/central-tower',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CentralTowerController::index
* @see app/Http/Controllers/CentralTowerController.php:14
* @route '/central-tower'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CentralTowerController::index
* @see app/Http/Controllers/CentralTowerController.php:14
* @route '/central-tower'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CentralTowerController::index
* @see app/Http/Controllers/CentralTowerController.php:14
* @route '/central-tower'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CentralTowerController::index
* @see app/Http/Controllers/CentralTowerController.php:14
* @route '/central-tower'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CentralTowerController::index
* @see app/Http/Controllers/CentralTowerController.php:14
* @route '/central-tower'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CentralTowerController::index
* @see app/Http/Controllers/CentralTowerController.php:14
* @route '/central-tower'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\CentralTowerController::syncMissionControl
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
export const syncMissionControl = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMissionControl.url(options),
    method: 'post',
})

syncMissionControl.definition = {
    methods: ["post"],
    url: '/central-tower/sync-mc',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CentralTowerController::syncMissionControl
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
syncMissionControl.url = (options?: RouteQueryOptions) => {
    return syncMissionControl.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CentralTowerController::syncMissionControl
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
syncMissionControl.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMissionControl.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CentralTowerController::syncMissionControl
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
const syncMissionControlForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncMissionControl.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CentralTowerController::syncMissionControl
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
syncMissionControlForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncMissionControl.url(options),
    method: 'post',
})

syncMissionControl.form = syncMissionControlForm

/**
* @see \App\Http\Controllers\CentralTowerController::sendBotHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
export const sendBotHeartbeat = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendBotHeartbeat.url(options),
    method: 'post',
})

sendBotHeartbeat.definition = {
    methods: ["post"],
    url: '/central-tower/bot-heartbeat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CentralTowerController::sendBotHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
sendBotHeartbeat.url = (options?: RouteQueryOptions) => {
    return sendBotHeartbeat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CentralTowerController::sendBotHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
sendBotHeartbeat.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendBotHeartbeat.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CentralTowerController::sendBotHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
const sendBotHeartbeatForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendBotHeartbeat.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CentralTowerController::sendBotHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
sendBotHeartbeatForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendBotHeartbeat.url(options),
    method: 'post',
})

sendBotHeartbeat.form = sendBotHeartbeatForm

const CentralTowerController = { index, syncMissionControl, sendBotHeartbeat }

export default CentralTowerController