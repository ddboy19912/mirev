"use client";

import type { ReactNode } from "react";

import { XIcon } from "lucide-react";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./drawer";

type ResponsiveDialogProps = {
  children: ReactNode;
  description: string;
  closeButtonClassName?: string;
  contentClassName?: string;
  label: string;
  labelClassName?: string;
  mobileContentClassName?: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  descriptionClassName?: string;
  title: string;
  titleClassName?: string;
};

export function ResponsiveDialog({
  children,
  closeButtonClassName,
  contentClassName,
  description,
  descriptionClassName,
  label,
  labelClassName,
  mobileContentClassName,
  onOpenChange,
  open,
  title,
  titleClassName,
}: ResponsiveDialogProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className={cn(
            "rounded-t-3xl border-gray-100 bg-white px-1 pb-6",
            mobileContentClassName,
          )}
        >
          <DrawerHeader className="px-6 pt-3 pb-0 text-left">
            <p
              className={cn(
                "text-xs font-semibold tracking-widest text-gray-400 uppercase",
                labelClassName,
              )}
            >
              {label}
            </p>
            <DrawerTitle
              className={cn(
                "mt-2 text-xl font-bold tracking-tight text-gray-900",
                titleClassName,
              )}
            >
              {title}
            </DrawerTitle>
            <DrawerDescription
              className={cn(
                "mt-3 text-sm leading-6 text-gray-500",
                descriptionClassName,
              )}
            >
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-6 pt-6">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-md rounded-3xl border border-gray-100 bg-white p-7 shadow-2xl",
          contentClassName,
        )}
        showCloseButton={false}
      >
        <DialogHeader className="gap-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={cn(
                  "text-xs font-semibold tracking-widest text-gray-400 uppercase",
                  labelClassName,
                )}
              >
                {label}
              </p>
              <DialogTitle
                className={cn(
                  "mt-2 text-xl font-bold tracking-tight text-gray-900",
                  titleClassName,
                )}
              >
                {title}
              </DialogTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className={cn(
                "rounded-full text-gray-400 hover:text-gray-900",
                closeButtonClassName,
              )}
            >
              <XIcon />
            </Button>
          </div>
          <DialogDescription
            className={cn(
              "mt-3 text-sm leading-6 text-gray-500",
              descriptionClassName,
            )}
          >
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
