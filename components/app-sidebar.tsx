import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navItems } from "@/constants/data";
import { Icons } from "./icons";

export function AppSidebar() {
  return (
    <aside className="w-12">
      <Sidebar className="mt-16 w-12">
        <SidebarContent className="w-12 py-4 px-2 bg-[#84012A] text-white flex items-center">
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon && Icons[item.icon as keyof typeof Icons];
              return (
                <SidebarMenuItem key={item.title} >
                  <SidebarMenuButton asChild className="hover:text-[#84012A]">
                    {/* <a href={item.href} className="flex gap-2 items-center"> */}
                    <a href={item.href} >
                    {Icon && <Icon className={`size-10 flex-none`}  />} 
                      {/* <span>{item.title}</span> */}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}
