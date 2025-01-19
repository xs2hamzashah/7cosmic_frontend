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

import { DataTable } from "../../../core/data-table/DataTable";
import { structureTypeEnum } from "../../../types/structure-type.enum";

import { yupResolver } from "@hookform/resolvers/yup";
import { FilterIcon, Pencil, Plus } from "lucide-react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import * as yup from "yup";
import {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
} from "../../../service/priceList/mechanicalWork";
import { Input } from "../../../core/input/Input";
import { getMechanicalWorkColDef } from "../column/mechanicalWorkColDef";
import { Button } from "../../../core/button/Button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../../core/dropdownMenu/DropDownMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../core/dialog/Dialog";
import { Loader2 } from "lucide-react";

const schema = yup
  .object({
    unit: yup.string().required(),
    structure_type: yup.string().required(),
    specification: yup.string().required(),
    price: yup.number().positive().integer().required(),
  })
  .required();

function MechanicalWork() {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [currentPanelId, setCurrentItemId] = useState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ----------------- redux toolkit query --------------------------->

  const [deleteItem, deleteItemStatus] = useDeleteMutation();
  const [editPanel, editStatus] = useEditMutation();
  const [createPanel, createStatus] = useCreateMutation();
  const { data, isLoading, isError, error } = useAllQuery();

  const mechanical = data?.results;

  // ----------------- react-form-hook -------------------------------->
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      structure_type: structureTypeEnum.ironStandard,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      const checkEdit = isEdit && currentPanelId;
      const action = checkEdit ? editPanel : createPanel;
      const payload = checkEdit
        ? { ...formData, id: currentPanelId }
        : formData;

      const response = await action(payload);

      if (response?.data) {
        reset();
        setIsEdit(false);
        setCurrentItemId("");
        setIsFormOpen(false);
        addToast(
          isEdit
            ? "Mechanical Work Updated Successfully"
            : "Mechanical Work Created Successfully",
          { appearance: "success", autoDismiss: true }
        );
      } else if (response?.error) {
        addToast(Object.values(response.error.data).join(", "), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      addToast("An unexpected error occurred", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onError = () => {};

  // ----------------- functions ----------------------------->
  const onPriceListEditHandler = async (id) => {
    const [mechanicalWork] = await Promise.all([
      mechanical?.filter((item) => item.id === id)[0],
      setIsEdit(true),
      setIsFormOpen(true),
      setCurrentItemId(id),
    ]);

    if (mechanicalWork) {
      setValue("structure_type", mechanicalWork?.structure_type);
      setValue("specification", mechanicalWork?.specification);
      setValue("price", mechanicalWork?.price);
      setValue("unit", mechanicalWork?.unit);
    }
  };

  const deletePriceListRow = async (id) => {
    await Promise.all([setIsDeleteOpen(true), setCurrentItemId(id)]);
  };

  const onDeleteConfirm = async () => {
    const response = await deleteItem({ id: currentPanelId });
    if (response.error) {
      setIsDeleteOpen(false);
      addToast("Delete Failed: " + response.error.message, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    await Promise.all([
      setCurrentItemId(""),
      setIsDeleteOpen(false),
      addToast("Deleted Successfully", {
        appearance: "info",
        autoDismiss: true,
      }),
    ]);
  };

  const onCreateDialogClose = async () => {
    await Promise.all([
      reset(),
      setIsEdit(false),
      setIsFormOpen(false),
      setCurrentItemId(""),
    ]);
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
    <Fragment>
      <AccordionItem
        value="mechanical"
        className=" border border-orange-primary mb-4 border-b-0 rounded-[8px]"
      >
        <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
          Mechanical Work
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-slate-50 rounded-[8px] dark:bg-dark-surface-mixed-200">
          <Tabs
            defaultValue={structureTypeEnum.ironStandard}
            className="w-full"
          >
            <div className="flex items-center justify-between gap-x-4 mb-6">
              {/* Filter Button and dropdown */}
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
                      className="w-full data-[state=active]:bg-orange-primary data-[state=active]:text-neutral-50 rounded-[4px] flex-1"
                      value={structureTypeEnum.ironStandard}
                      onClick={() => {
                        setValue(
                          "structure_type",
                          structureTypeEnum.ironStandard
                        );
                      }}
                    >
                      <p className="flex gap-x-2 items-center">
                        <span>Iron Standard</span>
                      </p>
                    </TabsTrigger>

                    <TabsTrigger
                      className="w-full data-[state=active]:bg-orange-primary data-[state=active]:text-neutral-50 rounded-[4px] flex-1"
                      value={structureTypeEnum.aluminumStandard}
                      onClick={() => {
                        setValue(
                          "structure_type",
                          structureTypeEnum.aluminumStandard
                        );
                      }}
                    >
                      <p className="flex gap-x-2 items-center">
                        <span>Aluminum Standard</span>
                      </p>
                    </TabsTrigger>

                    <TabsTrigger
                      className="w-full data-[state=active]:bg-orange-primary data-[state=active]:text-neutral-50 rounded-[4px] flex-1"
                      value={structureTypeEnum.msIronStandard}
                      onClick={() => {
                        setValue(
                          "structure_type",
                          structureTypeEnum.msIronStandard
                        );
                      }}
                    >
                      <p className="flex gap-x-2 items-center">
                        <span>MS Iron Elevated</span>
                      </p>
                    </TabsTrigger>
                  </TabsList>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Create Battery Button */}
              <Button
                onClick={() => setIsFormOpen(true)}
                className="outline-orange-primary border border-orange-primary text-orange-primary"
              >
                Add
              </Button>
            </div>

            <TabsContent value={structureTypeEnum.ironStandard}>
              {mechanical && (
                <DataTable
                  columns={getMechanicalWorkColDef({
                    onDelete: deletePriceListRow,
                    onEdit: onPriceListEditHandler,
                  })}
                  data={mechanical.filter(
                    (item) =>
                      item.structure_type === structureTypeEnum.ironStandard
                  )}
                />
              )}
            </TabsContent>
            <TabsContent value={structureTypeEnum.aluminumStandard}>
              {mechanical && (
                <DataTable
                  columns={getMechanicalWorkColDef({
                    onDelete: deletePriceListRow,
                    onEdit: onPriceListEditHandler,
                  })}
                  data={mechanical.filter(
                    (item) =>
                      item.structure_type === structureTypeEnum.aluminumStandard
                  )}
                />
              )}
            </TabsContent>
            <TabsContent value={structureTypeEnum.msIronStandard}>
              {mechanical && (
                <DataTable
                  columns={getMechanicalWorkColDef({
                    onDelete: deletePriceListRow,
                    onEdit: onPriceListEditHandler,
                  })}
                  data={mechanical.filter(
                    (item) =>
                      item.structure_type === structureTypeEnum.msIronStandard
                  )}
                />
              )}
            </TabsContent>
          </Tabs>
        </AccordionContent>
      </AccordionItem>

      {/* Create Battery Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={onCreateDialogClose}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
        <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>
              {isEdit.bool ? "Edit" : "Create"} Mechanical Work
            </DialogTitle>
            <DialogDescription></DialogDescription>

            <Form
              isEdit={isEdit}
              errors={errors}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              handleSubmit={handleSubmit}
              isLoading={editStatus.isLoading || createStatus.isLoading}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/*  Delete Battery Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
        <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Delete Mechanical Work</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Mechanical Work ?
            </DialogDescription>
            <div className="flex gap-x-3 items-center">
              <Button
                varian="outline"
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 border border-orange-primary text-orange-primary"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={onDeleteConfirm}
                className="flex-1 bg-orange-primary text-neutral-50"
              >
                {deleteItemStatus.isLoading ? (
                  <Fragment>
                    <Loader2 className="animate-spin" />
                    <span>Loading...</span>
                  </Fragment>
                ) : (
                  <span>Delete</span>
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default MechanicalWork;

function Form({
  errors,
  handleSubmit,
  isEdit,
  onError,
  onSubmit,
  register,
  isLoading,
}) {
  return (
    <Fragment>
      <form
        className="flex flex-col flex-wrap gap-4 my-10 "
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Input
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.specification ? "true" : "false"}
          placeholder="Specification i:e Iron Angle/GI L3/Aluminium P1/Garder"
          {...register("specification")}
        />

        <select
          {...register("unit")}
          defaultValue={"watt"}
          className="px-2 py-2.5 flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500 border border-gray-500 rounded-sm bg-transparent"
        >
          {/* <option value="kw">kw</option> */}
          <option value="watt">watt</option>
        </select>

        <Input
          type="number"
          placeholder="Price PKR (please input per watt rate) i:e 15/18/22 etc"
          aria-invalid={errors.price ? "true" : "false"}
          {...register("price")}
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
        />

        <select
          {...register("structure_type")}
          className="px-2 py-2.5 flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500 border border-gray-500 rounded-sm bg-transparent"
        >
          <option value="iron_standard">Iron Standard</option>
          <option value="aluminum_standard">Aluminum Standard</option>
          <option value="ms_iron_standard">Ms Iron Elevated</option>
        </select>

        <div className="w-full">
          {isEdit && (
            <Button
              type="submit"
              variant="default"
              className="w-full flex flex-1 gap-x-2 bg-orange-primary text-neutral-50 rounded-full float-right items-center "
            >
              {isLoading ? (
                <Fragment>
                  <span>
                    <Loader2 size={14} className="animate-spin" />
                  </span>
                  <span>Loading...</span>
                </Fragment>
              ) : (
                <Fragment>
                  <span>
                    <Pencil size={14} />
                  </span>
                  <span> Edit</span>
                </Fragment>
              )}
            </Button>
          )}

          {!isEdit && (
            <Button
              type="submit"
              variant="default"
              className="w-full flex flex-1 gap-x-2 bg-orange-primary text-neutral-50 rounded-full float-right items-center "
            >
              {isLoading ? (
                <Fragment>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Loading...</span>
                </Fragment>
              ) : (
                <Fragment>
                  <Plus size={14} />
                  <span>Add</span>
                </Fragment>
              )}
            </Button>
          )}
        </div>
      </form>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-dark-primary-100" />
        <div className="flex-1">
          {/* <Divider orientation="horizontal" className=" bg-dark-primary-100" /> */}
        </div>
      </div>
    </Fragment>
  );
}
