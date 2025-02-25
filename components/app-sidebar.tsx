"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navItems } from "@/constants/data";
import { Icons } from "./icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import imageUrl from "@/public/images/logo_initial.svg";
import Image from "next/image";
import AccountIcon from "./account/AccountIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar className="bg-[#F3EFF0] border-none">
      <SidebarHeader className="flex items-center justify-center py-10 px-4 bg-[#F3EFF0]">
        <Link href={"/dashboard"}>
          <Image src={imageUrl} alt={"logo"} height={24} priority />
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex items-center px-4 bg-[#F3EFF0]">
        <TooltipProvider>
          <SidebarMenu>
            {navItems.map((item, index) => {
              const Icon = item.icon && Icons[item.icon as keyof typeof Icons];
              return (
                <Tooltip key={index}>
                  <TooltipTrigger>
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`h-10  text-[#7D7177] hover:cursor-pointer transition-all hover:text-[#84012A] flex justify-center overflow-hidden rounded-md hover:bg-[#E9DFE9] text-sm font-medium items-center ${
                          path === item.href
                            ? "bg-accent text-[#7D7177]"
                            : "transparent"
                        } ${item.disabled && "cursor-not-allowed opacity-80"}`}
                      >
                        <Link href={item.href ? item.href : "/"}>
                          {Icon && <Icon className={`size-5`} />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <TooltipContent
                      align="center"
                      side="right"
                      sideOffset={8}
                      className="inline-block"
                    >
                      {item.title}
                    </TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
              );
            })}
          </SidebarMenu>
        </TooltipProvider>
      </SidebarContent>
      <SidebarFooter className="flex items-center px-4 bg-[#F3EFF0]">
        <AccountIcon />
      </SidebarFooter>
    </Sidebar>
  );
}
