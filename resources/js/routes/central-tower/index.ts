import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
* @see \App\Http\Controllers\CentralTowerController::syncMc
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
export const syncMc = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMc.url(options),
    method: 'post',
})

syncMc.definition = {
    methods: ["post"],
    url: '/central-tower/sync-mc',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CentralTowerController::syncMc
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
syncMc.url = (options?: RouteQueryOptions) => {
    return syncMc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CentralTowerController::syncMc
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
syncMc.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMc.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CentralTowerController::syncMc
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
const syncMcForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncMc.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CentralTowerController::syncMc
* @see app/Http/Controllers/CentralTowerController.php:55
* @route '/central-tower/sync-mc'
*/
syncMcForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncMc.url(options),
    method: 'post',
})

syncMc.form = syncMcForm

/**
* @see \App\Http\Controllers\CentralTowerController::botHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
export const botHeartbeat = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: botHeartbeat.url(options),
    method: 'post',
})

botHeartbeat.definition = {
    methods: ["post"],
    url: '/central-tower/bot-heartbeat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CentralTowerController::botHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
botHeartbeat.url = (options?: RouteQueryOptions) => {
    return botHeartbeat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CentralTowerController::botHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
botHeartbeat.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: botHeartbeat.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CentralTowerController::botHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
const botHeartbeatForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: botHeartbeat.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CentralTowerController::botHeartbeat
* @see app/Http/Controllers/CentralTowerController.php:69
* @route '/central-tower/bot-heartbeat'
*/
botHeartbeatForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: botHeartbeat.url(options),
    method: 'post',
})

botHeartbeat.form = botHeartbeatForm

const centralTower = {
    index: Object.assign(index, index),
    syncMc: Object.assign(syncMc, syncMc),
    botHeartbeat: Object.assign(botHeartbeat, botHeartbeat),
}

export default centralTower