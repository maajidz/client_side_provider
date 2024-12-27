import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

function LabOrdersDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button
          type="button"
          variant="ghost"
          className="text-blue-500 underline hover:text-blue-500 hover:bg-transparent"
        >
          Search and Add
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Search & Add</DrawerTitle>
            <DrawerDescription>Search and add your lab.</DrawerDescription>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default LabOrdersDrawer;