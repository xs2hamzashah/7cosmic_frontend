import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../core/accordion/Accordion";
// import { DataTable } from "@/core/dataTable/DataTable";

import { Divider } from "@nextui-org/react";
import { Edit, Loader2, Plus, Trash, X } from "lucide-react";
import * as yup from "yup";

import { useToasts } from "react-toast-notifications";
// import { getPanelColDef } from "../column/panelColDef";
import { Fragment, useState } from "react";
import { Input } from "../../../core/input/Input";
import { useDeleteMutation } from "../../../service/priceList/afterSalesService";
import {
  useCreatePanelMutation,
  useEditPanelMutation,
  usePanelsQuery,
} from "../../../service/priceList/panel";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../../core/button/Button";
import { getPanelColDef } from "../column/PanelColDef";
import { DataTable } from "../../../core/data-table/DataTable";
const schema = yup
  .object({
    brand_name: yup.string().required(),
    specification: yup.string().required(),
    capacity: yup.number().positive().integer().required(),
    unit: yup.string().required(),
    price: yup.number().positive().integer().required(),
  })
  .required();

function Panel() {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [currentPanelId, setCurrentPanelId] = useState();

  // ----------------- redux toolkit query --------------------------->

  const [deletePanel] = useDeleteMutation();
  const [editPanel] = useEditPanelMutation();

  const [createPanel, createPanelStatus] = useCreatePanelMutation();

  const {
    data: panels,
    isLoading,
    isError,
    error,
  } = usePanelsQuery({ id: "" });

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
    console.log("🚀 ~ onSubmit ~ data:", data);
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

      if (isPanelResponse(response)) {
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
    console.log("🚀 ~ onError ~ errors:", errors);
  };
  // ----------------- functions ----------------------------->

  const setIsPanelEditState = async (id) => {
    const [panel] = await Promise.all([
      panels?.filter((fil) => fil.id === id)[0],
      setIsEdit(true),
      setCurrentPanelId(id),
    ]);

    if (panel) {
      setValue("price", panel?.price);
      setValue("brand_name", panel?.brand_name);
      setValue("capacity", panel?.capacity);
      setValue("specification", panel?.specification);
      setValue("unit", panel?.unit);
    }
  };

  const onPanelDeleteHandler = async (id) => {
    const response = await deletePanel({ id });
    if ("data" in response) {
      addToast(response.data.message, {
        appearance: "info",
        autoDismiss: true,
      });
    }
  };

  const onClearEdit = async () => {
    await new Promise.all([setIsEdit(false), setCurrentPanelId(""), reset()]);
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
    <div className="min-w-full bg-red-600">
      <AccordionItem
        value="panel"
        className=" bg-white dark:bg-dark-surface-mixed-200 mb-4 border-b-0 rounded-[8px] shadow-[0px]"
      >
        <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
          Panel
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-white rounded-[8px] dark:bg-dark-surface-mixed-200">
          <form
            className="flex flex-wrap gap-4 my-10"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <Input
              className="flex-[17%]
               aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
              placeholder="brand name"
              {...register}
              {...register("brand_name")}
              aria-invalid={errors.brand_name ? "true" : "false"}
            />

            <Input
              className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
              placeholder="specification"
              {...register("specification")}
              aria-invalid={errors.specification ? "true" : "false"}
            />

            <Input
              className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
              placeholder="capacity"
              {...register("capacity")}
              aria-invalid={errors.capacity ? "true" : "false"}
              type="number"
            />

            <Input
              className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
              placeholder="unit"
              {...register("unit")}
              aria-invalid={errors.unit ? "true" : "false"}
            />

            <Input
              className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
              placeholder="price"
              {...register("price")}
              aria-invalid={errors.price ? "true" : "false"}
              type="number"
            />

            {!isEdit && (
              <Button
                type="submit"
                variant="default"
                onClick={() => handleSubmit(onSubmit, onError)}
                className=" bg-orange-primary hover:bg-orange-primary rounded-full flex-[4%] max-w-[12%] float-right text-neutral-50"
              >
                {createPanelStatus.isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Plus size={20} />
                )}
              </Button>
            )}

            {isEdit && (
              <Fragment>
                <Button
                  type="submit"
                  variant="default"
                  className=" bg-orange-primary hover:bg-orange-primary rounded-full flex-[4%] max-w-[12%] float-right text-neutral-50"
                  // onClick={() => setIsEdit(true)}
                >
                  <Edit size={20} />
                </Button>
                <Button
                  type="button"
                  variant="default"
                  className=" bg-orange-primary hover:bg-orange-primary rounded-full flex-[4%] max-w-[12%] float-right text-neutral-50"
                  onClick={() => setIsEdit(false)}
                >
                  <Trash size={20} />
                </Button>
              </Fragment>
            )}
          </form>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-orange-primary" />
            <div className="flex-1">
              <hr className="h-[2px] bg-orange-primary" />
            </div>
          </div>

          {panels && (
            <DataTable
              data={panels}
              columns={getPanelColDef({
                onPanelEdit: setIsPanelEditState,
                onPanelDelete: onPanelDeleteHandler,
              })}
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

export default Panel;

function isPanelResponse(obj) {
  return "data" in obj;
}
