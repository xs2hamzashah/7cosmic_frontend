import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../core/accordion/Accordion";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../core/tabs/Tabs";

import {
  useAllQuery,
  useDeleteMutation,
} from "../../../service/priceList/inverter";

import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import InverterForm from "../form/InverterForm";
import { DataTable } from "../../../core/data-table/DataTable";
import { systemTypeEnum } from "../../../types/system-type.enum";
import { getInverterColDef } from "../column/InverterColDef";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../core/dialog/Dialog";
import { Button } from "../../../core/button/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../core/dropdownMenu/DropDownMenu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Filter, FilterIcon, MoreHorizontal } from "lucide-react";

function Inverter() {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [selectedSystemType, setSelectedSystemType] = useState(
    systemTypeEnum.onGrid
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState({ bool: false, id: "" });

  // ----------------- redux toolkit query --------------------------->
  const [deleteInverter] = useDeleteMutation();

  const {
    data: inverters,
    isLoading,
    isError,
    error,
  } = useAllQuery({ id: "" });

  console.log("🚀 ~ Inverter ~ inverters:", inverters);

  // ----------------- functions ----------------------------->
  const addNewPress = () => {
    console.log("🚀 ~ addNewPress ~ addNewPress");
    setIsFormOpen(true);
  };

  const onSetIsEditHandler = async (id) => {
    await Promise.all([setIsEdit({ bool: true, id })]);
    setIsFormOpen(true);
  };

  const onInverterDeleteHandler = async (id) => {
    const response = await deleteInverter({ id });
    if ("data" in response) {
      addToast(response.data.message, {
        appearance: "info",
        autoDismiss: true,
      });
    }
  };

  // ----------------- render -------------------------------->

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    // addToast(JSON.stringify(error), { appearance: "error" });
    return <div>error is: {JSON.stringify(error)}</div>;
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <div className="min-w-full bg-red-600">
        <AccordionItem
          value="inventory"
          className=" bg-white dark:bg-dark-surface-mixed-200 mb-4 border-b-0 rounded-[8px] shadow-[0px]"
        >
          <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
            Inverter
          </AccordionTrigger>
          {/*  */}
          <AccordionContent className="p-4 bg-slate-50 rounded-[8px] dark:bg-dark-surface-mixed-200">
            <Tabs defaultValue={"onGrid"} className="w-full">
              <div className="flex items-center justify-between gap-x-4 mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="space-x-3 bg-orange-primary text-white  "
                    >
                      <span className="">Select Type</span>
                      <FilterIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white border-none shadow-lg rounded-[4px] "
                  >
                    {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}

                    <TabsList className="h-20 flex flex-col gap-y-2 border-1 rounded-[8px] w-full bg-orange-primary bg-opacity-10">
                      <TabsTrigger
                        value={"onGrid"}
                        className="w-full data-[state=active]:bg-orange-primary data-[state=active]:text-neutral-50 rounded-[4px] flex-1"
                      >
                        <p className="flex gap-x-2 items-center">
                          <span>On Grid</span>
                        </p>
                      </TabsTrigger>

                      <TabsTrigger
                        value={"hybrid"}
                        className="w-full data-[state=active]:bg-orange-primary data-[state=active]:text-neutral-50 rounded-[4px] flex-1"
                      >
                        <p className="flex gap-x-2 items-center">
                          <span>Hybrid</span>
                        </p>
                      </TabsTrigger>
                    </TabsList>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DialogTrigger asChild>
                  <Button className="outline-orange-primary border border-orange-primary text-orange-primary">
                    Add
                  </Button>
                </DialogTrigger>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-orange-primary" />
                <div className="flex-1">
                  <hr className="h-[2px] bg-orange-primary" />
                </div>
              </div>

              <TabsContent value="onGrid" className="">
                {inverters && (
                  <DataTable
                    columns={getInverterColDef({
                      addNew: addNewPress,
                      onDelete: onInverterDeleteHandler,
                      onEdit: onSetIsEditHandler,
                    })}
                    data={inverters.filter(
                      (items) => items.system_type === systemTypeEnum.onGrid
                    )}
                  />
                )}
              </TabsContent>
              <TabsContent value="hybrid">
                {inverters && (
                  <DataTable
                    columns={getInverterColDef({
                      addNew: addNewPress,
                      onDelete: onInverterDeleteHandler,
                      onEdit: onSetIsEditHandler,
                    })}
                    data={inverters.filter(
                      (items) => items.system_type === systemTypeEnum.hybrid
                    )}
                  />
                )}
              </TabsContent>
            </Tabs>
          </AccordionContent>
          {/*  */}
        </AccordionItem>
      </div>

      <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isEdit.bool ? "Edit" : "Create"} Inverter</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <InverterForm
          isEdit={isEdit.bool}
          currentId={isEdit.id}
          setIsEdit={setIsEdit}
          systemType={systemTypeEnum.onGrid}
          closeForm={() => setIsFormOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default Inverter;
