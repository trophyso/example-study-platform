'use client';

import React from 'react';
import { toast as sonnerToast } from 'sonner';
import Image from 'next/image';

interface ToastProps {
    id: string | number;
    title: string;
    description: string;
    image?: {
        src: string;
        alt: string;
    };
}

/**
 * A fully custom toast that still maintains the animations and interactions.
 * @param toast - The toast to display.
 * @returns The toast component.
 */
export function toast(toast: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom((id) => (
        <Toast
            id={id}
            title={toast.title}
            description={toast.description}
            image={toast.image}
        />
    ));
}

/**
 * A fully custom toast that still maintains the animations and interactions.
 * @param props - The toast to display.
 * @returns The toast component.
 */
export function Toast(props: ToastProps) {
    const { title, description, image } = props;

    return (
        <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
            {image && (
                <div className="mr-4 flex-shrink-0">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={40}
                        height={40}
                        className="rounded-md"
                    />
                </div>
            )}
            <div className="flex flex-1 items-center">
                <div className="w-full">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    );
}