'use client';
import { ColumnDef } from '@tanstack/react-table';
import { EncounterResponse } from '@/types/encounterInterface';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

export const columns = (
  handleRowClick: (id: string) => void
): ColumnDef<EncounterResponse | undefined>[] => [
  // {
  //   accessorKey: "userDetails",
  //   header: "User Details",
  //   cell: ({ row }) => {
  //     const userDetails = row.original?.userDetails;
  //     return userDetails ? (
  //       <div
  //         className="cursor-pointer"
  //         onClick={() => handleRowClick(row.original!.id)}
  //       >
  //         {userDetails.patientId}
  //       </div>
  //     ) : null;
  //   },
  // },
  {
    accessorKey: "visit_type",
    header: "Visit type",
    cell: ({ row }) => {
      const visitType = row.original?.visit_type;
      return visitType ? (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original!.id)}
        >
          {visitType}
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "mode",
    header: "Mode",
    cell: ({ row }) => {
      const mode = row.original?.mode;
      let displayMode = "";
      let iconName = "";

      // Determine the display text and icon based on the mode value
      if (mode === "in_person") {
        displayMode = "In Person";
        iconName = "person";
      } else if (mode === "visit") {
        displayMode = "Visit";
        iconName = "calendar_today";
      } else if (mode === "phone_call") {
        displayMode = "Phone Call";
        iconName = "phone";
      } else if (mode === "online") {
        displayMode = "Online";
        iconName = "computer";
      }

      return displayMode ? (
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => handleRowClick(row.original!.id)}
        >
          <Icon name={iconName} size={16} /> {displayMode}
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "isVerified",
    header: "Is Verified",
    cell: ({ row }) => {
      const { isVerified, id } = row.original || {};

      return (
        <div
          className="cursor-pointer"
          onClick={() => id && handleRowClick(id)}
        >
          {isVerified ? (
            <Badge variant="success" popoverLabel="Yes">
              <Icon name="check" size={16} />
              Yes
            </Badge>
          ) : (
            <Badge variant="warning" popoverLabel="No">
              <Icon name="exclamation" size={16} />
              No
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const createdAt = row.original?.createdAt;
      return createdAt ? (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original!.id)}
        >
          {createdAt.split("T")[0]}
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => {
      const id = row.original?.id;
      return id ? (
        <Button
          variant={"link"}
          onClick={() => handleRowClick(id)}
        ><Icon name="open_in_new" size={16}/>
          Open Encounter
        </Button>
      ) : null;
    },
  },
];
