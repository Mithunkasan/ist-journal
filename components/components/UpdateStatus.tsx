import { useState } from "react";

type Props = {
  params: any;
  stateValue: any;
  setStateValue: any;
  selectValue: any;
};

export const UpdateStatus = ({
  params,
  stateValue,
  setStateValue,
  selectValue,
}: Props) => {
  // console.log(params, "scsdf");

  const handleAssignStatus = (paperID: number, status: string) => {
    setStateValue({ ...stateValue, [paperID]: status });
  };

  return (
    <>
      <select
        required
        className={
          "outline-none border m-0 p-0 w-[150px] rounded-lg border-[#d2d2d2] h-14 text-[15px] "
        }
        name="status"
        value={stateValue[params?.id] || ""}
        onChange={(event) =>
          handleAssignStatus(params?.id, event?.target?.value)
        }
      >
        <option value="">Select Value</option>

        {selectValue?.map((value: any, index: number) => (
          <option key={index} value={value?.name}>
            {value?.name}
          </option>
        ))}
      </select>
    </>
  );
};
