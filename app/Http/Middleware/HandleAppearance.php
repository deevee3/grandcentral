<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $themeQuery = $request->query('theme');
        $appearance = in_array($themeQuery, ['light', 'dark', 'system'], true)
            ? $themeQuery
            : ($request->cookie('appearance') ?? 'system');

        View::share('appearance', $appearance);

        return $next($request);
    }
}
