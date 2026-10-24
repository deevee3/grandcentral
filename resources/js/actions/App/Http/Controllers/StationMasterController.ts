import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:18
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
* @see app/Http/Controllers/StationMasterController.php:18
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
* @see app/Http/Controllers/StationMasterController.php:18
* @route '/station-master/{train}'
*/
show.get = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:18
* @route '/station-master/{train}'
*/
show.head = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:18
* @route '/station-master/{train}'
*/
const showForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:18
* @route '/station-master/{train}'
*/
showForm.get = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::show
* @see app/Http/Controllers/StationMasterController.php:18
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
* @see \App\Http\Controllers\StationMasterController::updateTrain
* @see app/Http/Controllers/StationMasterController.php:56
* @route '/station-master/{train}'
*/
export const updateTrain = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateTrain.url(args, options),
    method: 'put',
})

updateTrain.definition = {
    methods: ["put"],
    url: '/station-master/{train}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StationMasterController::updateTrain
* @see app/Http/Controllers/StationMasterController.php:56
* @route '/station-master/{train}'
*/
updateTrain.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateTrain.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::updateTrain
* @see app/Http/Controllers/StationMasterController.php:56
* @route '/station-master/{train}'
*/
updateTrain.put = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateTrain.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateTrain
* @see app/Http/Controllers/StationMasterController.php:56
* @route '/station-master/{train}'
*/
const updateTrainForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTrain.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateTrain
* @see app/Http/Controllers/StationMasterController.php:56
* @route '/station-master/{train}'
*/
updateTrainForm.put = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTrain.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateTrain.form = updateTrainForm

/**
* @see \App\Http\Controllers\StationMasterController::syncMissionControl
* @see app/Http/Controllers/StationMasterController.php:67
* @route '/station-master/{train}/sync-mc'
*/
export const syncMissionControl = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMissionControl.url(args, options),
    method: 'post',
})

syncMissionControl.definition = {
    methods: ["post"],
    url: '/station-master/{train}/sync-mc',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StationMasterController::syncMissionControl
* @see app/Http/Controllers/StationMasterController.php:67
* @route '/station-master/{train}/sync-mc'
*/
syncMissionControl.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return syncMissionControl.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::syncMissionControl
* @see app/Http/Controllers/StationMasterController.php:67
* @route '/station-master/{train}/sync-mc'
*/
syncMissionControl.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMissionControl.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::syncMissionControl
* @see app/Http/Controllers/StationMasterController.php:67
* @route '/station-master/{train}/sync-mc'
*/
const syncMissionControlForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncMissionControl.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::syncMissionControl
* @see app/Http/Controllers/StationMasterController.php:67
* @route '/station-master/{train}/sync-mc'
*/
syncMissionControlForm.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncMissionControl.url(args, options),
    method: 'post',
})

syncMissionControl.form = syncMissionControlForm

/**
* @see \App\Http\Controllers\StationMasterController::storeMilestone
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
export const storeMilestone = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMilestone.url(args, options),
    method: 'post',
})

storeMilestone.definition = {
    methods: ["post"],
    url: '/station-master/{train}/milestones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StationMasterController::storeMilestone
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
storeMilestone.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeMilestone.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::storeMilestone
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
storeMilestone.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMilestone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::storeMilestone
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
const storeMilestoneForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeMilestone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::storeMilestone
* @see app/Http/Controllers/StationMasterController.php:286
* @route '/station-master/{train}/milestones'
*/
storeMilestoneForm.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeMilestone.url(args, options),
    method: 'post',
})

storeMilestone.form = storeMilestoneForm

/**
* @see \App\Http\Controllers\StationMasterController::updateMilestone
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
export const updateMilestone = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMilestone.url(args, options),
    method: 'put',
})

updateMilestone.definition = {
    methods: ["put"],
    url: '/station-master/{train}/milestones/{milestone}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StationMasterController::updateMilestone
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
updateMilestone.url = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return updateMilestone.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{milestone}', parsedArgs.milestone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::updateMilestone
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
updateMilestone.put = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMilestone.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateMilestone
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
const updateMilestoneForm = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMilestone.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateMilestone
* @see app/Http/Controllers/StationMasterController.php:306
* @route '/station-master/{train}/milestones/{milestone}'
*/
updateMilestoneForm.put = (args: { train: number | { id: number }, milestone: number | { id: number } } | [train: number | { id: number }, milestone: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMilestone.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateMilestone.form = updateMilestoneForm

/**
* @see \App\Http\Controllers\StationMasterController::storeTask
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
*/
export const storeTask = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTask.url(args, options),
    method: 'post',
})

storeTask.definition = {
    methods: ["post"],
    url: '/station-master/{train}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StationMasterController::storeTask
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
*/
storeTask.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeTask.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::storeTask
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
*/
storeTask.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::storeTask
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
*/
const storeTaskForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::storeTask
* @see app/Http/Controllers/StationMasterController.php:321
* @route '/station-master/{train}/tasks'
*/
storeTaskForm.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTask.url(args, options),
    method: 'post',
})

storeTask.form = storeTaskForm

/**
* @see \App\Http\Controllers\StationMasterController::updateTask
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
export const updateTask = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateTask.url(args, options),
    method: 'put',
})

updateTask.definition = {
    methods: ["put"],
    url: '/station-master/{train}/tasks/{task}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StationMasterController::updateTask
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
updateTask.url = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return updateTask.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::updateTask
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
updateTask.put = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateTask.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateTask
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
const updateTaskForm = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTask.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateTask
* @see app/Http/Controllers/StationMasterController.php:357
* @route '/station-master/{train}/tasks/{task}'
*/
updateTaskForm.put = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTask.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateTask.form = updateTaskForm

/**
* @see \App\Http\Controllers\StationMasterController::dispatchTaskBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
export const dispatchTaskBot = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dispatchTaskBot.url(args, options),
    method: 'post',
})

dispatchTaskBot.definition = {
    methods: ["post"],
    url: '/station-master/{train}/tasks/{task}/dispatch-bot',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StationMasterController::dispatchTaskBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
dispatchTaskBot.url = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return dispatchTaskBot.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::dispatchTaskBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
dispatchTaskBot.post = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dispatchTaskBot.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::dispatchTaskBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
const dispatchTaskBotForm = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dispatchTaskBot.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::dispatchTaskBot
* @see app/Http/Controllers/StationMasterController.php:94
* @route '/station-master/{train}/tasks/{task}/dispatch-bot'
*/
dispatchTaskBotForm.post = (args: { train: number | { id: number }, task: number | { id: number } } | [train: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dispatchTaskBot.url(args, options),
    method: 'post',
})

dispatchTaskBot.form = dispatchTaskBotForm

/**
* @see \App\Http\Controllers\StationMasterController::getMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:115
* @route '/station-master/{train}/markdown/{filename}'
*/
export const getMarkdownFile = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMarkdownFile.url(args, options),
    method: 'get',
})

getMarkdownFile.definition = {
    methods: ["get","head"],
    url: '/station-master/{train}/markdown/{filename}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StationMasterController::getMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:115
* @route '/station-master/{train}/markdown/{filename}'
*/
getMarkdownFile.url = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions) => {
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

    return getMarkdownFile.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::getMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:115
* @route '/station-master/{train}/markdown/{filename}'
*/
getMarkdownFile.get = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMarkdownFile.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::getMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:115
* @route '/station-master/{train}/markdown/{filename}'
*/
getMarkdownFile.head = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getMarkdownFile.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StationMasterController::getMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:115
* @route '/station-master/{train}/markdown/{filename}'
*/
const getMarkdownFileForm = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getMarkdownFile.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::getMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:115
* @route '/station-master/{train}/markdown/{filename}'
*/
getMarkdownFileForm.get = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getMarkdownFile.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StationMasterController::getMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:115
* @route '/station-master/{train}/markdown/{filename}'
*/
getMarkdownFileForm.head = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getMarkdownFile.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getMarkdownFile.form = getMarkdownFileForm

/**
* @see \App\Http\Controllers\StationMasterController::updateMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:133
* @route '/station-master/{train}/markdown/{filename}'
*/
export const updateMarkdownFile = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMarkdownFile.url(args, options),
    method: 'put',
})

updateMarkdownFile.definition = {
    methods: ["put"],
    url: '/station-master/{train}/markdown/{filename}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StationMasterController::updateMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:133
* @route '/station-master/{train}/markdown/{filename}'
*/
updateMarkdownFile.url = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions) => {
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

    return updateMarkdownFile.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::updateMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:133
* @route '/station-master/{train}/markdown/{filename}'
*/
updateMarkdownFile.put = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMarkdownFile.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:133
* @route '/station-master/{train}/markdown/{filename}'
*/
const updateMarkdownFileForm = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMarkdownFile.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateMarkdownFile
* @see app/Http/Controllers/StationMasterController.php:133
* @route '/station-master/{train}/markdown/{filename}'
*/
updateMarkdownFileForm.put = (args: { train: number | { id: number }, filename: string | number } | [train: number | { id: number }, filename: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMarkdownFile.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateMarkdownFile.form = updateMarkdownFileForm

/**
* @see \App\Http\Controllers\StationMasterController::suggestSchedule
* @see app/Http/Controllers/StationMasterController.php:149
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
* @see app/Http/Controllers/StationMasterController.php:149
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
* @see app/Http/Controllers/StationMasterController.php:149
* @route '/station-master/{train}/suggest-schedule'
*/
suggestSchedule.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSchedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::suggestSchedule
* @see app/Http/Controllers/StationMasterController.php:149
* @route '/station-master/{train}/suggest-schedule'
*/
const suggestScheduleForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: suggestSchedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::suggestSchedule
* @see app/Http/Controllers/StationMasterController.php:149
* @route '/station-master/{train}/suggest-schedule'
*/
suggestScheduleForm.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: suggestSchedule.url(args, options),
    method: 'post',
})

suggestSchedule.form = suggestScheduleForm

/**
* @see \App\Http\Controllers\StationMasterController::applySchedule
* @see app/Http/Controllers/StationMasterController.php:172
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
* @see app/Http/Controllers/StationMasterController.php:172
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
* @see app/Http/Controllers/StationMasterController.php:172
* @route '/station-master/{train}/apply-schedule'
*/
applySchedule.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applySchedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::applySchedule
* @see app/Http/Controllers/StationMasterController.php:172
* @route '/station-master/{train}/apply-schedule'
*/
const applyScheduleForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: applySchedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::applySchedule
* @see app/Http/Controllers/StationMasterController.php:172
* @route '/station-master/{train}/apply-schedule'
*/
applyScheduleForm.post = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: applySchedule.url(args, options),
    method: 'post',
})

applySchedule.form = applyScheduleForm

/**
* @see \App\Http\Controllers\StationMasterController::updateFingerprint
* @see app/Http/Controllers/StationMasterController.php:379
* @route '/station-master/{train}/fingerprint'
*/
export const updateFingerprint = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFingerprint.url(args, options),
    method: 'put',
})

updateFingerprint.definition = {
    methods: ["put"],
    url: '/station-master/{train}/fingerprint',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StationMasterController::updateFingerprint
* @see app/Http/Controllers/StationMasterController.php:379
* @route '/station-master/{train}/fingerprint'
*/
updateFingerprint.url = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateFingerprint.definition.url
            .replace('{train}', parsedArgs.train.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StationMasterController::updateFingerprint
* @see app/Http/Controllers/StationMasterController.php:379
* @route '/station-master/{train}/fingerprint'
*/
updateFingerprint.put = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFingerprint.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateFingerprint
* @see app/Http/Controllers/StationMasterController.php:379
* @route '/station-master/{train}/fingerprint'
*/
const updateFingerprintForm = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateFingerprint.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StationMasterController::updateFingerprint
* @see app/Http/Controllers/StationMasterController.php:379
* @route '/station-master/{train}/fingerprint'
*/
updateFingerprintForm.put = (args: { train: number | { id: number } } | [train: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateFingerprint.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateFingerprint.form = updateFingerprintForm

const StationMasterController = { show, updateTrain, syncMissionControl, storeMilestone, updateMilestone, storeTask, updateTask, dispatchTaskBot, getMarkdownFile, updateMarkdownFile, suggestSchedule, applySchedule, updateFingerprint }

export default StationMasterController