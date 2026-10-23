import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Box, Shield } from 'lucide-react';

export default function Landing({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    return (
        <>
            <Head title="Heexo - The database for modern applications">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-6">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-gray-900">
                        heexo
                    </div>

                    {/* Navigation */}
                    <nav className="hidden items-center space-x-8 text-gray-600 md:flex">
                        <a
                            href="#"
                            className="transition-colors hover:text-gray-900"
                        >
                            Why heexo?
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-gray-900"
                        >
                            Platform
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-gray-900"
                        >
                            Solutions
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-gray-900"
                        >
                            Changelog
                        </a>
                    </nav>

                    {/* Authentication / CTA */}
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-gray-900 px-6 py-2.5 text-white transition-colors hover:bg-gray-800"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="px-6 py-2.5 text-gray-600 transition-colors hover:text-gray-900"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-lg bg-gray-900 px-6 py-2.5 text-white transition-colors hover:bg-gray-800"
                                    >
                                        Sign up
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative px-8 py-20 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            {/* Main Headline */}
                            <h1 className="mb-8 text-5xl leading-tight font-bold text-gray-900 lg:text-7xl">
                                The database for
                                <br />
                                modern applications
                            </h1>

                            {/* CTA Buttons */}
                            <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
                                <button className="rounded-lg bg-gray-900 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800">
                                    Start 14-day trial
                                </button>
                                <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-900 px-8 py-4 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-50">
                                    <span>Learn more</span>
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Description */}
                            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
                                Hurree centralizes data from your entire tech
                                stack and database creating one clear view of
                                performance.
                            </p>
                        </div>

                        {/* Abstract Graphic with Overlay Cards */}
                        <div className="relative mx-auto h-96 max-w-5xl lg:h-[500px]">
                            {/* Background Abstract Graphic */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-300 opacity-60">
                                {/* Abstract lines and shapes */}
                                <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-red-400 opacity-30 blur-xl"></div>
                                <div className="absolute right-20 bottom-20 h-48 w-48 rounded-full bg-yellow-400 opacity-40 blur-xl"></div>
                                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-orange-400 opacity-20 blur-2xl"></div>

                                {/* Red lines */}
                                <div className="absolute top-1/4 right-0 left-0 h-0.5 bg-red-500 opacity-40"></div>
                                <div className="absolute top-1/2 right-0 left-0 h-0.5 bg-red-500 opacity-30"></div>
                                <div className="absolute right-0 bottom-1/4 left-0 h-0.5 bg-red-500 opacity-40"></div>
                                <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-red-500 opacity-30"></div>
                                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500 opacity-40"></div>
                                <div className="absolute top-0 right-1/4 bottom-0 w-0.5 bg-red-500 opacity-30"></div>
                            </div>

                            {/* Overlay Card 1 */}
                            <div className="absolute top-8 left-8 max-w-xs rounded-xl bg-white p-6 shadow-lg">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="text-2xl font-bold text-gray-900">
                                        $434/700
                                        <span className="ml-2 text-sm text-gray-500">
                                            (62.2%)
                                        </span>
                                    </div>
                                    <div className="relative h-12 w-12">
                                        <svg className="h-12 w-12 -rotate-90 transform">
                                            <circle
                                                cx="24"
                                                cy="24"
                                                r="20"
                                                stroke="#e5e7eb"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <circle
                                                cx="24"
                                                cy="24"
                                                r="20"
                                                stroke="#f97316"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 20 * 0.622} ${2 * Math.PI * 20}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Spend management enabled
                                    </span>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-500 transition-colors">
                                        <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition-transform"></span>
                                    </button>
                                </div>
                            </div>

                            {/* Overlay Card 2 */}
                            <div className="absolute right-8 bottom-8 max-w-xs rounded-xl bg-white p-6 shadow-lg">
                                <div className="mb-4 flex items-center gap-3">
                                    <Shield className="h-6 w-6 text-gray-700" />
                                    <h3 className="font-semibold text-gray-900">
                                        Advanced bot protection
                                    </h3>
                                </div>
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Spend management enabled
                                    </span>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-500 transition-colors">
                                        <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition-transform"></span>
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800">
                                        Activate
                                    </button>
                                    <a
                                        href="#"
                                        className="px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                                    >
                                        Learn more
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white px-8 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-12 md:grid-cols-2">
                            {/* Feature 1 */}
                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                        <Box className="h-6 w-6 text-gray-700" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                                        Use Database with your stack
                                    </h3>
                                    <p className="leading-relaxed text-gray-600">
                                        We offer client and server libraries in
                                        everything from React and Ruby to iOS.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                        <Shield className="h-6 w-6 text-gray-700" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                                        Security & privacy
                                    </h3>
                                    <p className="leading-relaxed text-gray-600">
                                        Database supports PII data encrypted
                                        with AES-256 at rest or explicit user
                                        consent flows.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
