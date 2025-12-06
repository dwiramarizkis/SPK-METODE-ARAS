import React from 'react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-lg font-bold">K2</span>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Kelompok 2</span>
                <span className="truncate text-xs">Metode ARAS</span>
            </div>
        </div>
    );
}
