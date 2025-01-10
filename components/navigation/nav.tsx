"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { cn } from "@/lib/utils"

const components: { id: string; title: string; href: string }[] = [
  {
    id: "about",
    title: "About",
    href: "/about",
  },
  {
    id: "blog",
    title: "Blog",
    href: "/blog",
  },
  {
    id: "projects",
    title: "Projects",
    href: "/projects",
  },
  {
    id: "cv",
    title: "CV",
    href: "/cv",
  },
]

export function Nav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {components.map((component) => (
            <Link
              key={component.id}
              href={component.href}
              legacyBehavior
              passHref
            >
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hover:text-primary text-foreground/60 h-auto"
                )}
              >
                {component.title}
              </NavigationMenuLink>
            </Link>
          ))}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}