import { Plus, Pencil } from "lucide-react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import * as yup from "yup";
import {
  useAllQuery,
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
} from "../../../service/priceList/battery";

import { voltageTypeEnum } from "../../../types/voltage-type.enum";
import { batteryTypeEnum } from "../../../types/battery-type.enum";
import { Input } from "../../../core/input/Input";
import { Button } from "../../../core/button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { getBatteryColDef } from "../column/BatteryColDef";

const schema = yup
  .object({
    brand_name: yup.string().required(),
    system_type: yup.string().required(),
    specification: yup.string().required(),
    capacity: yup.number().positive().integer().required(),
    unit: yup.string().required(),
    price: yup.number().positive().integer().required(),
    voltage_type: yup.mixed().oneOf(Object.values(voltageTypeEnum)).required(),
  })
  .required();

function Battery() {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [currentPanelId, setCurrentPanelId] = useState();

  // ----------------- redux toolkit query --------------------------->

  const [deletePanel] = useDeleteMutation();
  const [editPanel] = useEditMutation();
  const [createPanel] = useCreateMutation();
  const {
    data: batteries,
    isLoading,
    isError,
    error,
  } = useAllQuery({ id: "" });

  // ----------------- react-form-hook -------------------------------->
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      system_type: batteryTypeEnum.tubular,
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
      } else {
        // console.log(response.error);
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
      } else {
        // console.log(response.error);
      }
    }
  };

  const onError = () => {
    console.log(errors);
  };

  // ----------------- functions ----------------------------->
  const onPriceListEditHandler = async (id) => {
    setIsEdit(true);
    setCurrentPanelId(id);
    const battery = batteries?.filter((fil) => fil.id === id)[0];
    if (battery) {
      setValue("price", battery?.price);
      setValue("brand_name", battery?.brand_name);
      setValue("capacity", battery?.capacity);
      setValue("specification", battery?.specification);
      setValue("unit", battery?.unit);
      setValue("system_type", battery.system_type);
      setValue("voltage_type", battery.voltage_type);
    }
  };

  const onPriceListRowDeleteHandler = async (id) => {
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
      value="battery"
      className=" dark:bg-dark-surface-mixed-200 mb-4 border-b-0 rounded-[8px]"
    >
      <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
        Battery
      </AccordionTrigger>
      <AccordionContent className="p-4 bg-slate-50 rounded-[8px] dark:bg-dark-surface-mixed-200">
        <Tabs defaultValue={"tubular"} className="w-full">
          <TabsList className="border-1 rounded-[8px] w-full">
            <TabsTrigger
              value={"tubular"}
              className="data-[state=active]:bg-dark-primary-100 rounded-[4px] flex-1"
              onClick={() => {
                setValue("system_type", batteryTypeEnum.tubular);
              }}
            >
              <p className="flex gap-x-2 items-center">
                <span>Tubular</span>
              </p>
            </TabsTrigger>

            <TabsTrigger
              value={"lithium"}
              className="data-[state=active]:bg-dark-primary-100 rounded-[4px] flex-1"
              onClick={() => {
                setValue("system_type", batteryTypeEnum.lithium);
              }}
            >
              <p className="flex gap-x-2 items-center">
                <span>Lithium</span>
              </p>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tubular" className="">
            <Form
              handleSubmit={handleSubmit}
              isEdit={isEdit}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              errors={errors}
            />
            {batteries && (
              <DataTable
                columns={getBatteryColDef({
                  onDelete: onPriceListRowDeleteHandler,
                  onEdit: onPriceListEditHandler,
                })}
                data={batteries.filter(
                  (item) => item.system_type === "tubular"
                )}
              />
            )}
          </TabsContent>
          <TabsContent value="lithium">
            <Form
              handleSubmit={handleSubmit}
              isEdit={isEdit}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              errors={errors}
            />
            {batteries && (
              <DataTable
                columns={getBatteryColDef({
                  onDelete: onPriceListRowDeleteHandler,
                  onEdit: onPriceListEditHandler,
                })}
                data={batteries.filter(
                  (item) => item.system_type === "lithium"
                )}
              />
            )}
          </TabsContent>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
}

export default Battery;

function Form({ register, onSubmit, onError, errors, isEdit, handleSubmit }) {
  return (
    <Fragment>
      <form
        className="flex flex-wrap gap-4 my-10"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Input
          className="flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.brand_name ? "true" : "false"}
          placeholder="brand_name"
          {...register("brand_name")}
        />

        <Input
          className="flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="specification"
          {...register("specification")}
          aria-invalid={errors.specification ? "true" : "false"}
        />

        <Input
          type="number"
          className="flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="capacity"
          {...register("capacity")}
          aria-invalid={errors.capacity ? "true" : "false"}
        />
        <Input
          className="flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="unit"
          {...register("unit")}
          aria-invalid={errors.unit ? "true" : "false"}
        />

        <Input
          type="number"
          className="flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="price"
          {...register("price")}
          aria-invalid={errors.price ? "true" : "false"}
        />

        <select
          id=""
          {...register("voltage_type")}
          className="px-2 flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500 border border-gray-500 rounded-sm bg-transparent"
        >
          <option value="hv">HV</option>
          <option value="lv">LV</option>
        </select>

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
