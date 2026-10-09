"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookA, Dumbbell, GraduationCap, Home, ScrollText } from "lucide-react";

import { cn } from "@/lib/cn";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/topics", label: "Lessons", icon: GraduationCap },
  { href: "/vocabulary", label: "Vocab", icon: BookA },
  { href: "/grammar", label: "Grammar", icon: ScrollText },
  { href: "/practice", label: "Practice", icon: Dumbbell },
];

/** Thumb-friendly bottom navigation for the main sections, phones only. */
export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="site-tabbar fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/70 md:hidden"
    >
      <div className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-1 pb-1.5 pt-1.5 text-[11px] font-medium transition-colors focus-ring",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-[9px] transition-colors",
                  active
                    ? "bg-card text-primary shadow-[0_0_0_1px_var(--hairline),var(--shadow-sm)]"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
