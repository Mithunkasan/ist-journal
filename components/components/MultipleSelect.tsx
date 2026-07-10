"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useSelector } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type Props = {
  params: any;
  reviewer: any;
  reviewerNames: any;
};
type Reviewer = {
  name: string;
};

export default function MultipleSelect({
  params,
  reviewer,
  reviewerNames,
}: Props) {
  // console.log(params.id, reviewerNames, "asfads");

  const reviewers_names: Reviewer[] = useSelector(
    (state: any) => state?.reviewerSlice?.value?.reviewerData
  );
  const handleChange = (newValue: any, paperId: string) => {
    reviewer((prevState: any) => ({
      ...prevState,
      [paperId]: newValue,
    }));
  };

  return (
    <FormControl sx={{ width: 250 }}>
      {/* <Select
          multiple
          displayEmpty
          value={reviewerNames[params.id] || []}
          placeholder="Reviewers "
          onChange={(event) => handleChange(event, params.id)}
          sx={{ width: "250px", height: "64px" }}
          renderValue={(selected) => {
            if (selected?.length === 0) {
              return <em>Select Reviewers</em>;
            }
            return (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {selected?.map((value: any) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            );
          }}
          MenuProps={MenuProps}
        >
          {reviewers_names?.map((name: any, index: number) => (
            <MenuItem key={index} value={name?.name}>
              {name?.name}
            </MenuItem>
          ))}
        </Select> */}
      <Autocomplete
        multiple
        id="multiple-limit-tags"
        options={reviewers_names?.map((reviewer: Reviewer) => reviewer?.name) || []}
        getOptionLabel={(option) => option || ""}
        value={reviewerNames[params.row?.paperID || params.id] || []}
        onChange={(event, newValue) => handleChange(newValue, params.row?.paperID || params.id)}
        renderInput={(params) => (
          <TextField
            sx={{
              width: "250px",
              "& .MuiInputBase-root": {
                height: "64px",
              },
            }}
            {...params}
            placeholder="Select Reviewers"
          />
        )}
        renderTags={(value, getTagProps) =>
          value?.map((option, index) => {
            const tagProps = getTagProps({ index });
            return (
              // eslint-disable-next-line react/jsx-key
              <Chip
                sx={{ width: "60px" }}
                label={option}
                {...tagProps}
              />
            );
          })
        }
        sx={{ width: "250px", height: "64px" }}
      />
    </FormControl>
  );
}
