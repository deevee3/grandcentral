import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="currentColor"
                d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 6h2v2h-2V8zm0 4h2v6h-2v-6z"
            />
            <circle cx="12" cy="7" r="2" fill="currentColor" />
            <rect
                x="10"
                y="10"
                width="4"
                height="8"
                rx="1"
                fill="currentColor"
            />
            <path fill="currentColor" d="M8 20h8v2H8zM6 18h12v1H6z" />
        </svg>
    );
}
