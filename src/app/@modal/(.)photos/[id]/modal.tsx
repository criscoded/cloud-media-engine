'use client';

import React, { type ElementRef, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dialogRef = useRef<ElementRef<'dialog'>>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    function onDismiss() {
        router.back();
    }

    return createPortal(
        <dialog
            ref={dialogRef}
            onClose={onDismiss}
            className="
                fixed inset-0
                m-0 border-0
                p-4
                overflow-hidden
                bg-transparent
                backdrop:bg-background/80
                backdrop:backdrop-blur-sm
                w-full h-full
                flex items-center justify-center
            "
        >
            <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl animate-modal-zoom">
                {children}
            </div>
            <button 
                onClick={onDismiss}
                className="absolute top-10 right-10 text-foreground/50 hover:text-foreground transition-colors p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </dialog>
,
        document.getElementById('modal-root')!,
    );
}
