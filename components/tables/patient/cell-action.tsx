'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserDataInterface } from '@/types/userInterface';
import { deleteQuestion } from '@/services/formServices';
import { BadgePercentIcon, BookUser, Clipboard, ClipboardPlus, ClipboardPlusIcon, DollarSign, MoreHorizontal, Pill } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: UserDataInterface;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleViewMoreClick = () => {
    router.push(`/dashboard/patient/patientDetails/${data.userDetailsId}`);
  };

  const handleAppointmentClick = () => {
    router.push(`/dashboard/patient/appointments/${data.userDetailsId}`);
  };

  const handleSubscriptionClick = () => {
    router.push(`/dashboard/patient/subscriptions/${data.userDetailsId}`);
  };

  const handlePaymentsClick = () => {
    router.push(`/dashboard/patient/payments/${data.userDetailsId}`);
  };

  const handleMedicationClick = () => {
    router.push(`/dashboard/patient/medications/${data.userDetailsId}`)
  }

  const handleOnboardingFormsClick = () => {
    router.push(`/dashboard/patient/onboardingForms/${data.userDetailsId}`)
  }

  const handleFormsClick = () => {
    router.push(`/dashboard/patient/forms/${data.userDetailsId}`)
  }

  const handleEncounterClick = () => {
    router.push(`/dashboard/patient/encounter/${data.userDetailsId}`)
  }

  const onConfirm = async () => {
    setLoading(true);
    try {
      await deleteQuestion({ id: data.id });
      router.refresh();
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className="h-8 w-8 p-0 border-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={handleViewMoreClick}
          >
            <BookUser className="mr-2 h-4 w-4" /> View more details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleAppointmentClick}
          >
            <ClipboardPlus className="mr-2 h-4 w-4" /> Appointment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSubscriptionClick}>
            <BadgePercentIcon className="mr-2 h-4 w-4" /> Subscription
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePaymentsClick}>
            <DollarSign className="mr-2 h-4 w-4" /> Payments
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMedicationClick}>
            <Pill className="mr-2 h-4 w-4" /> Medication
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOnboardingFormsClick}>
            <Clipboard className="mr-2 h-4 w-4" /> Onboarding Forms
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleFormsClick}>
            <Clipboard className="mr-2 h-4 w-4" /> Health Forms
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEncounterClick}>
            <ClipboardPlusIcon className="mr-2 h-4 w-4" /> Patient Encounter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
