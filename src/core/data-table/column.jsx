"use client";

import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion/Accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";

export const columns = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">Id</div>,
    cell: ({ row }) => {
      const id = row.getValue("id");
      return <div className="text-center font-medium">{id}</div>;
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email");
      return <div className="text-center font-medium">{email}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <div className="text-center font-medium">{status}</div>;
    },
  },

  {
    accessorKey: "amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: () => {
      // const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-dark-surface-mixed-300 border-none shadow-lg rounded-[4px] "
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem className="hover:bg-orange-primary cursor-pointer">
              <div className="flex items-center gap-2">
                <Pencil size={14} />
                <span className="text-md">edit</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="hover:bg-orange-primary cursor-pointer">
              <div className="flex items-center gap-2">
                <Trash2 size={14} />
                <span className="text-md">delete</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
