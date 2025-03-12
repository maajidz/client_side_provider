import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface Patient {
  id: string
  name: string
  email: string
  phoneNumber: string
}

interface PatientSearchProps {
  patients: Patient[]
  selectedPatient: Patient | null
  onSelect: (patient: Patient) => void
}

export function PatientSearch({ patients, selectedPatient, onSelect }: PatientSearchProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPatient ? selectedPatient.name : "Select patient..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search patients..." />
          <CommandEmpty>No patient found.</CommandEmpty>
          <CommandGroup>
            {patients.map((patient) => (
              <CommandItem
                key={patient.id}
                value={patient.name}
                onSelect={() => {
                  onSelect(patient)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedPatient?.id === patient.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {patient.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 