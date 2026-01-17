import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

export function MobileHeader({ selectedCity, onCitySelect }: { selectedCity?: string, onCitySelect: (city: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="md:hidden h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-50">
       <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
          <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          AHON
      </div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
          <Menu className="w-6 h-6" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-r-0">
          <Sidebar 
            selectedCity={selectedCity} 
            onCitySelect={(city) => {
              onCitySelect(city);
              setOpen(false);
            }} 
          />
        </SheetContent>
      </Sheet>
    </header>
  );
}
