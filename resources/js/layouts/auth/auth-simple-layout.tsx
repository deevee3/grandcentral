import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { Train } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="absolute top-6 right-6">
                <AppearanceToggleDropdown />
            </div>
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2.5 font-medium transition-opacity hover:opacity-90"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                                <Train className="size-5" />
                            </div>
                            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                                Grand Central
                            </span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
                                {title}
                            </h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
