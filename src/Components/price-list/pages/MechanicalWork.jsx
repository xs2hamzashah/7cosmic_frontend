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
import { Pencil, Plus } from "lucide-react";
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

const schema = yup
  .object({
    structure_type: yup.string().required(),
    specification: yup.string().required(),
    unit: yup.string().required(),
    price: yup.number().positive().integer().required(),
  })
  .required();

function MechanicalWork() {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [currentPanelId, setCurrentPanelId] = useState();

  // ----------------- redux toolkit query --------------------------->

  const [deletePanel] = useDeleteMutation();
  const [editPanel] = useEditMutation();
  const [createPanel] = useCreateMutation();
  const {
    data: mechanical,
    isLoading,
    isError,
    error,
  } = useAllQuery({
    id: "",
  });

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

  const onSubmit = async (data) => {
    if (isEdit && currentPanelId) {
      const _data = { ...data, id: currentPanelId };
      const response = await editPanel(_data);

      if ("data" in response) {
        if (response.data.success) {
          reset();
          addToast(response.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
        }
        setIsEdit(false);
        setCurrentPanelId("");
      }
    } else {
      const response = await createPanel(data);

      if ("data" in response) {
        if (response.data.success) {
          reset();
          addToast(response.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
        }
      }
    }
  };

  const onError = () => {};

  // ----------------- functions ----------------------------->
  const onPriceListEditHandler = async (id) => {
    setIsEdit(true);
    setCurrentPanelId(id);
    const mechanicalWork = mechanical?.filter((item) => item.id === id)[0];

    if (mechanicalWork) {
      setValue("structure_type", mechanicalWork?.structure_type);
      setValue("specification", mechanicalWork?.specification);
      setValue("price", mechanicalWork?.price);
      setValue("unit", mechanicalWork?.unit);
    }
  };

  const onPriceListDeleteHandler = async (id) => {
    const response = await deletePanel({ id });
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
    <AccordionItem
      value="mechanical"
      className=" dark:bg-dark-surface-mixed-200 mb-4 border-b-0 rounded-[8px]"
    >
      <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
        Mechanical Work
      </AccordionTrigger>
      <AccordionContent className="p-4 bg-slate-50 rounded-[8px] dark:bg-dark-surface-mixed-200">
        <Tabs defaultValue={structureTypeEnum.ironStandard} className="w-full">
          <TabsList className="border-1 rounded-[8px] w-full">
            <TabsTrigger
              className="data-[state=active]:bg-dark-primary-100 rounded-[4px] flex-1"
              value={structureTypeEnum.ironStandard}
              onClick={() => {
                setValue("structure_type", structureTypeEnum.ironStandard);
              }}
            >
              <p className="flex gap-x-2 items-center">
                <span>Iron Standard</span>
              </p>
            </TabsTrigger>

            <TabsTrigger
              className="data-[state=active]:bg-dark-primary-100 rounded-[4px] flex-1"
              value={structureTypeEnum.aluminumStandard}
              onClick={() => {
                setValue("structure_type", structureTypeEnum.aluminumStandard);
              }}
            >
              <p className="flex gap-x-2 items-center">
                <span>Aluminum Standard</span>
              </p>
            </TabsTrigger>

            <TabsTrigger
              className="data-[state=active]:bg-dark-primary-100 rounded-[4px] flex-1"
              value={structureTypeEnum.msIronStandard}
              onClick={() => {
                setValue("structure_type", structureTypeEnum.msIronStandard);
              }}
            >
              <p className="flex gap-x-2 items-center">
                <span>MS Iron Elevated</span>
              </p>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={structureTypeEnum.ironStandard}>
            <Form
              errors={errors}
              isEdit={isEdit}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              handleSubmit={handleSubmit}
            />
            {mechanical && (
              <DataTable
                columns={getMechanicalWorkColDef({
                  onDelete: onPriceListDeleteHandler,
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
            <Form
              errors={errors}
              isEdit={isEdit}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              handleSubmit={handleSubmit}
            />
            {mechanical && (
              <DataTable
                columns={getMechanicalWorkColDef({
                  onDelete: onPriceListDeleteHandler,
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
            <Form
              errors={errors}
              isEdit={isEdit}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              handleSubmit={handleSubmit}
            />
            {mechanical && (
              <DataTable
                columns={getMechanicalWorkColDef({
                  onDelete: onPriceListDeleteHandler,
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
  );
}

export default MechanicalWork;

function Form({ errors, handleSubmit, isEdit, onError, onSubmit, register }) {
  return (
    <Fragment>
      <form
        className="flex flex-wrap gap-4 my-10 "
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Input
          className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.specification ? "true" : "false"}
          placeholder="specification"
          {...register("specification")}
        />
        <Input
          className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.specification ? "true" : "false"}
          placeholder="unit"
          {...register("unit")}
        />
        <Input
          className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.price ? "true" : "false"}
          placeholder="price"
          type="number"
          {...register("price")}
        />

        <div className="w-full">
          <Button
            type="submit"
            variant="default"
            className="bg-dark-primary-100 hover:bg-dark-primary-200 rounded-full flex-[4%] max-w-[12%] float-right
              flex gap-x-2 items-center
              "
          >
            {isEdit ? (
              <Fragment>
                <span>
                  <Pencil size={14} />
                </span>
                <span> Edit</span>
              </Fragment>
            ) : (
              <Fragment>
                <span>
                  <Plus size={14} />
                </span>
                <span>Create</span>
              </Fragment>
            )}
          </Button>
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
