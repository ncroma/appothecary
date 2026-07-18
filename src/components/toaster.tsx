"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toastDismissed, type Toast } from "@/store/toastsSlice";

const TOAST_LIFETIME_MS = 4000;

function ToastItem({ toast }: { toast: Toast }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const timer = setTimeout(() => dispatch(toastDismissed(toast.id)), TOAST_LIFETIME_MS);
        return () => clearTimeout(timer);
    }, [dispatch, toast.id]);

    const toneClass = toast.tone === "error" ? "border-l-2 border-oxblood" : "border-l-2 border-herb";

    return (
        <div className={`flex items-center gap-3 rounded-sm surface-vial px-4 py-3 text-sm ${toneClass}`}>
            <span>{toast.message}</span>
            <button type="button" aria-label="Dismiss" onClick={() => dispatch(toastDismissed(toast.id))} className="-m-2 ml-auto cursor-pointer p-2 opacity-60 transition-opacity hover:opacity-100">
                ✕
            </button>
        </div>
    );
}

export function Toaster() {
    const toasts = useAppSelector((state) => state.toasts);

    return (
        <div aria-live="polite" className="fixed right-4 bottom-4 left-4 z-50 flex flex-col gap-2 sm:left-auto">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}
