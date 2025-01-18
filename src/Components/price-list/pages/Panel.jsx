import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../core/accordion/Accordion";

import { Edit, Loader2, Pencil, Plus, Trash, X } from "lucide-react";
import * as yup from "yup";

import { useToasts } from "react-toast-notifications";
// import { getPanelColDef } from "../column/panelColDef";
import { Fragment, useEffect, useState } from "react";
import { Input } from "../../../core/input/Input";
import {
  useDeletePanelMutation,
  useCreatePanelMutation,
  useEditPanelMutation,
  usePanelsQuery,
} from "../../../service/priceList/panel";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../../core/button/Button";
import { getPanelColDef } from "../column/PanelColDef";
import { DataTable } from "../../../core/data-table/DataTable";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../core/dialog/Dialog";

const schema = yup
  .object({
    brand_name: yup.string().required(),
    specification: yup.string().required(),
    capacity: yup.number().positive().integer().required(),
    unit: yup.string().required(),
    price: yup.number().positive().integer().required(),
  })
  .required();

function Panel({ setIsLoading }) {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [currentItemId, setCurrentItemId] = useState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ----------------- redux toolkit query --------------------------->

  const [editPanel, editStatus] = useEditPanelMutation();
  const [createPanel, createStatus] = useCreatePanelMutation();
  const [deleteItem, deleteItemStatus] = useDeletePanelMutation();
  const { data, isLoading, isError, error } = usePanelsQuery({ page: 1 });
  const panels = data?.results;

  console.log("🚀 ~ Panel ~ data:", data);

  // ----------------- react-form-hook -------------------------------->
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const action = isEdit && currentItemId ? editPanel : createPanel;
    const payload = isEdit ? { ...data, id: currentItemId } : data;
    const response = await action(payload);

    if ("data" in response) {
      await Promise.all([
        reset(),
        setIsEdit(false),
        setCurrentItemId(""),
        setIsFormOpen(false),
        addToast(
          isEdit ? "Panel Edited Successfully" : "Panel Added Successfully",
          {
            appearance: "success",
            autoDismiss: true,
          }
        ),
      ]);
    }
  };

  // const onSubmit = async (data) => {
  //   if (isEdit && currentItemId) {
  //     const _data = { ...data, id: currentItemId };
  //     const response = await editPanel(_data);

  //     if ("data" in response) {
  //       reset();
  //       addToast(response.data.message, {
  //         appearance: "success",
  //         autoDismiss: true,
  //       });
  //       setIsEdit(false);
  //       setCurrentItemId("");
  //     } else {
  //       // console.log(response.error);
  //     }
  //   } else {
  //     const response = await createPanel(data);

  //     if (isPanelResponse(response)) {
  //       if (response.data.success) {
  //         reset();
  //         addToast(response.data.message, {
  //           appearance: "success",
  //           autoDismiss: true,
  //         });
  //       }
  //     } else {
  //       // console.log(response.error);
  //     }
  //   }
  // };

  const onError = () => {};
  // ----------------- functions ----------------------------->

  const onPriceListEditHandler = async (id) => {
    const [_result] = await Promise.all([
      panels?.filter((fil) => fil.id === id)[0],
      setIsEdit(true),
      setCurrentItemId(id),
      setIsFormOpen(true),
    ]);

    if (_result) {
      setValue("brand_name", _result.brand_name);
      setValue("capacity", _result.capacity);
      setValue("specification", _result?.specification);
      setValue("unit", _result?.unit);
      setValue("price", _result?.price);
    }
  };

  const onPriceListDeleteHandler = async (id) => {
    await Promise.all([setIsDeleteOpen(true), setCurrentItemId(id)]);
  };

  const onDeleteConfirm = async () => {
    const response = await deleteItem({ id: currentItemId });

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

  // ----------------- useEffect ----------------------------->

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);
  // ----------------- render -------------------------------->

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    // addToast(JSON.stringify(error), { appearance: "error" });
    return <div>error is: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="min-w-full">
      <AccordionItem
        value="panel"
        className=" bg-white border border-orange-primary dark:bg-dark-surface-mixed-200 mb-4 border-b-0 rounded-[8px] shadow-[0px]"
      >
        <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
          Panel
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-neutral-50 rounded-[8px] dark:bg-dark-surface-mixed-200">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="mb-3 bg-orange-primary text-stone-50"
          >
            Add
          </Button>

          {panels && (
            <DataTable
              data={panels}
              columns={getPanelColDef({
                onPanelEdit: onPriceListEditHandler,
                onPanelDelete: onPriceListDeleteHandler,
              })}
            />
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Create Battery Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={onCreateDialogClose}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
        <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>{isEdit.bool ? "Edit" : "Create"} Panel</DialogTitle>
            <DialogDescription></DialogDescription>

            <form
              className="flex flex-col flex-wrap gap-4 my-10"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <Input
                className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
                aria-invalid={errors.specification ? "true" : "false"}
                placeholder="Brand Name i:e JA , Jinko, Longi, etc"
                {...register("brand_name")}
                type="text"
              />

              <Input
                className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
                aria-invalid={errors.specification ? "true" : "false"}
                placeholder="specification"
                {...register("specification")}
                type="text"
              />
              <Input
                className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
                aria-invalid={errors.capacity ? "true" : "false"}
                placeholder="capacity"
                {...register("capacity")}
                type="number"
              />
              {/* <Input
             className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
             aria-invalid={errors.unit ? "true" : "false"}
             placeholder="unit"
             {...register("unit")}
             type="text"
           /> */}

              <select
                {...register("unit")}
                defaultValue={"watt"}
                aria-invalid={errors.unit ? "true" : "false"}
                className="px-2 py-2.5 flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500 border border-gray-500 rounded-sm bg-transparent"
              >
                {/* <option value="kw">kw</option> */}
                <option value="watt">watt</option>
              </select>

              <Input
                className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
                aria-invalid={errors.price ? "true" : "false"}
                placeholder="price"
                {...register("price")}
                type="number"
              />

              <div className="w-full">
                {isEdit && (
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full flex flex-1 gap-x-2 bg-orange-primary text-neutral-50 rounded-full float-right items-center "
                  >
                    {editStatus.isLoading ? (
                      <Fragment>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Loading...</span>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Pencil size={14} />
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
                    {createStatus.isLoading ? (
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
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/*  Delete Battery Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
        <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Delete Battery</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Battery
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
    </div>
  );
}

export default Panel;

function isPanelResponse(obj) {
  return "data" in obj;
}
