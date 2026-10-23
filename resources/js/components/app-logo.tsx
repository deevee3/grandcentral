import { Train } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
                <Train className="size-4.5" />
            </div>
            <div className="ml-1.5 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-serif text-base font-bold tracking-tight text-sidebar-foreground">
                    Grand Central
                </span>
                <span className="truncate font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                    Yard Dispatch
                </span>
            </div>
        </>
    );
}
