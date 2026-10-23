import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Train } from 'lucide-react';

const sampleDepartures = [
    {
        track: '01',
        destination: 'Grand Central Core',
        platform: 'Laravel · React',
        status: 'ON TIME',
        tone: 'text-emerald-700 dark:text-emerald-400',
    },
    {
        track: '04',
        destination: 'Conductor Scanner',
        platform: 'Artisan Daemon',
        status: 'BOARDING',
        tone: 'text-primary',
    },
    {
        track: '07',
        destination: 'Station Master AI',
        platform: 'Gemini · Ollama',
        status: 'ON TIME',
        tone: 'text-emerald-700 dark:text-emerald-400',
    },
    {
        track: '12',
        destination: 'Legacy Freight API',
        platform: 'Python · FastAPI',
        status: 'IN YARD',
        tone: 'text-muted-foreground',
    },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Grand Central — Railway Control for Local Projects" />
            <div className="min-h-screen bg-background font-sans text-foreground">
                <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 md:px-10">
                    {/* Top Architectural Header */}
                    <header className="flex items-center justify-between border-b border-border pb-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
                                <Train className="size-5" />
                            </div>
                            <div>
                                <span className="block font-serif text-xl leading-none font-bold tracking-tight text-foreground">
                                    Grand Central
                                </span>
                                <span className="mt-0.5 block font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                    Terminal Dispatch
                                </span>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3">
                            <AppearanceToggleDropdown />
                            {auth.user ? (
                                <Button asChild variant="default">
                                    <Link href={dashboard().url}>
                                        Open Departure Board
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost">
                                        <Link href={login().url}>Log in</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild>
                                            <Link href={register().url}>
                                                Register
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    {/* Hero Section */}
                    <main className="my-auto py-12 lg:py-20">
                        <div className="grid items-center gap-12 lg:grid-cols-12">
                            <div className="space-y-6 lg:col-span-6">
                                <h1 className="font-serif text-4xl leading-[1.08] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    Every repository on a single{' '}
                                    <span className="text-primary">
                                        master timetable.
                                    </span>
                                </h1>
                                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                                    Grand Central turns your local development
                                    directory into an organized railway control
                                    center—complete with automated filesystem
                                    discovery, milestone dispatch, and one-click
                                    editor boarding.
                                </p>

                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    {auth.user ? (
                                        <Button
                                            asChild
                                            size="lg"
                                            className="h-11 px-6 font-semibold"
                                        >
                                            <Link href={dashboard().url}>
                                                Enter Concourse
                                                <ArrowRight className="ml-1.5 size-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                asChild
                                                size="lg"
                                                className="h-11 px-6 font-semibold"
                                            >
                                                <Link href={register().url}>
                                                    Issue Station Pass
                                                    <ArrowRight className="ml-1.5 size-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="lg"
                                                className="h-11 px-6"
                                            >
                                                <Link href={login().url}>
                                                    Operator Sign In
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Solari Split-Flap Timetable Preview */}
                            <div className="lg:col-span-6">
                                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                                    <div className="flex items-center justify-between border-b border-border bg-muted/60 px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="size-2.5 rounded-full bg-primary" />
                                            <span className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
                                                Main Concourse — Live Departures
                                            </span>
                                        </div>
                                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                                            77 TRAINS INDEXED
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left font-mono text-sm">
                                            <thead>
                                                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground uppercase">
                                                    <th className="px-5 py-2.5 font-medium">
                                                        Trk
                                                    </th>
                                                    <th className="px-4 py-2.5 font-medium">
                                                        Destination
                                                    </th>
                                                    <th className="px-4 py-2.5 font-medium">
                                                        Platform
                                                    </th>
                                                    <th className="px-5 py-2.5 text-right font-medium">
                                                        Remarks
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {sampleDepartures.map((row) => (
                                                    <tr
                                                        key={row.track}
                                                        className="transition-colors hover:bg-muted/40"
                                                    >
                                                        <td className="px-5 py-3.5 font-bold text-primary tabular-nums">
                                                            {row.track}
                                                        </td>
                                                        <td className="px-4 py-3.5 font-semibold text-foreground">
                                                            {row.destination}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                                            {row.platform}
                                                        </td>
                                                        <td
                                                            className={`px-5 py-3.5 text-right text-xs font-bold tracking-wider tabular-nums ${row.tone}`}
                                                        >
                                                            {row.status}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Architectural Capabilities Ledger */}
                        <section className="mt-16 grid gap-8 border-t border-border pt-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
                            <div className="space-y-2 md:pr-8">
                                <h2 className="font-serif text-xl font-bold text-foreground">
                                    The Departure Board
                                </h2>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Inspect every project in your yard at a
                                    glance with live status indicators, stack
                                    badges, and instant editor deep links.
                                </p>
                            </div>

                            <div className="space-y-2 md:px-8">
                                <h2 className="font-serif text-xl font-bold text-foreground">
                                    The Conductor Service
                                </h2>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Walks your local development directory to
                                    detect frameworks, git activity, and AI
                                    project summaries automatically.
                                </p>
                            </div>

                            <div className="space-y-2 md:pl-8">
                                <h2 className="font-serif text-xl font-bold text-foreground">
                                    Station Master & Tower
                                </h2>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Coordinate milestones, loose tasks, and
                                    two-way synced project documentation across
                                    your entire fleet.
                                </p>
                            </div>
                        </section>
                    </main>

                    {/* Footer */}
                    <footer className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 font-mono text-xs text-muted-foreground uppercase">
                        <span>Grand Central Terminal</span>
                        <span>Track & Yard Operations</span>
                        <span>All Signals Normal</span>
                    </footer>
                </div>
            </div>
        </>
    );
}
