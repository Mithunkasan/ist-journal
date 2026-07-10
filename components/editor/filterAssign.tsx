"use client";

import * as React from "react";

import { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Switch,
  Box,
  Chip,
} from "@mui/material";
import {
  onGetAllAssignedJournalRecords,
  onGetFilterPaper,
  onGetFilterPaperAdmin,
} from "@/redux/actions/journalActions";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useSession } from "next-auth/react";
import countryFilter from "@/lib/countryFilter";
import { keywordsFilter } from "@/lib/keywordsFilter";
import { auth } from "@/lib/utils/firebase";

type filterTypes = {
  filterJournal: any;
  reUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  isEditor?: boolean;
  isStatus?: boolean;
  filter: any;
};

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

export default function FilterAssign({
  filterJournal,
  reUpdated,
  filter,
  isEditor,
}: filterTypes) {
  const session = useSession();

  const dispatch = useAppDispatch();
  const [archivePaper, setArchivePaper] = React.useState<any>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [authorName, setAuthorName] = React.useState<any>("");
  const [paperType, setPaperType] = React.useState<any>("");
  const [paperTitle, setPaperTitle] = React.useState<any>("");
  const [country, setCountry] = React.useState<any>("");
  const [editor, setEditor] = React.useState<any>("");
  // const [keyword, setKeyword] = React.useState<any>([]);
  // const [isFlag, setIsFlag] = React.useState<any>(false);
  const editorName = session?.data?.user?.name;
  const role = session?.data?.user?.role;
  useEffect(() => {
    const FetchAllPaper = async () => {
      try {
        if (role === "ADMIN") {
          const fetchArchivePapers = await dispatch(
            onGetFilterPaperAdmin(
              authorName,
              paperTitle,
              paperType,
              country,
              editor
            )
          );
          setArchivePaper(fetchArchivePapers);
        }

        if (role === "EDITOR") {
          const fetchArchivePapers = await dispatch(
            filter(authorName, paperTitle, paperType, country, editorName)
          );

          setArchivePaper(fetchArchivePapers);
        }

        reUpdated(false);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchAllPaper();
  }, [dispatch, authorName, paperTitle, paperType, country, editor, role, reUpdated, filter, editorName]);

  useEffect(() => {
    if (
      authorName === "" &&
      paperType === "" &&
      country === "" &&
      paperTitle === "" &&
      editor === ""
    ) {
      reUpdated(true);
    }
  }, [authorName, paperTitle, paperType, country, editor, reUpdated]);

  const applyButton = () => {
    filterJournal(archivePaper);
  };

  return (
    <FormControl className="bg-[#F1F4FD] rounded-3xl p-6" fullWidth>
      <div className="mb-3">
        <Switch
          checked={showFilters}
          onChange={(e: any) => setShowFilters(e.target.checked)}
          color="success"
        />
        Show Filters
      </div>

      {showFilters && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={isEditor ? 2.4 : 3}>
            <FormControl variant="outlined" fullWidth>
              <input
                type="text"
                onChange={(e: any) => {
                  setAuthorName(e.target.value);
                }}
                placeholder="Author Name"
                className="cursor-pointer bg-[#F1F4FD] border-[#b6b4b4] hover:border-[black] block p-4 border rounded  focus:ring-blue-500 focus:border-blue-500    dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={isEditor ? 2.4 : 3}>
            <FormControl variant="outlined" fullWidth>
              <input
                type="text"
                onChange={(e: any) => {
                  setPaperTitle(e.target.value);
                }}
                placeholder="Title"
                className="cursor-pointer bg-[#F1F4FD] border-[#b6b4b4] hover:border-[black] block p-4 border rounded  focus:ring-blue-500 focus:border-blue-500  dark:border-gray-100 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={isEditor ? 2.4 : 3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="paper-type-label">Paper Type</InputLabel>
              <Select
                labelId="paper-type-label"
                id="paper-type-checkbox"
                value={paperType}
                onChange={(e: any) => {
                  setPaperType(e.target.value);
                }}
                label="Paper Type"
                MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
              >
                <MenuItem value={""}>--select--</MenuItem>
                <MenuItem value={"Research Paper"}>Research Paper</MenuItem>
                <MenuItem value={"Review/Survey Paper"}>
                  Review/Survey Paper
                </MenuItem>
                {/* {archivePaper.map((name:any) => (
              <MenuItem key={name.id} value={name.type}>
                <Checkbox checked={paperType.indexOf(name.type) > -1} />
                <ListItemText primary={name.type} />
              </MenuItem>
            ))} */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={isEditor ? 2.4 : 3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                id="country-checkbox"
                value={country}
                onChange={(e: any) => {
                  setCountry(e.target.value);
                }}
                label="Country"
                MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
              >
                <MenuItem value={""} defaultChecked>
                  --Select--
                </MenuItem>
                {countryFilter?.map((data: any, index: any) => (
                  <MenuItem key={index} value={data}>
                    {data}
                  </MenuItem>
                ))}

                {/* {archivePaper.map((name:any) => (
              <MenuItem key={name.id} value={name.country}>
                <Checkbox checked={country.indexOf(name.country) > -1} />
                <ListItemText primary={name.country} />
              </MenuItem>
            ))} */}
              </Select>
            </FormControl>
          </Grid>
          {isEditor && (
            <Grid item xs={12} sm={6} md={isEditor ? 2.4 : 3}>
              <FormControl variant="outlined" fullWidth>
                <input
                  type="text"
                  onChange={(e: any) => {
                    setEditor(e.target.value);
                  }}
                  placeholder="Editor Name"
                  className="cursor-pointer bg-[#F1F4FD] border-[#b6b4b4] hover:border-[black] block p-4 border rounded  focus:ring-blue-500 focus:border-blue-500  dark:border-gray-100 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </FormControl>
            </Grid>
          )}

          {/* <Grid item xs={12} sm={6} md={2.4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status-checkbox"
                value={status}
                onChange={handleStatus}
                label="status"
                MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
              >
                <MenuItem value={""} defaultChecked>
                  --Select--
                </MenuItem>
                <MenuItem value={"ACCEPTED"}>ACCEPTED</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={12} md={12} className="flex justify-center">
            <Button
              sx={{ marginTop: 2, height: 40 }}
              className="bg-[#004b23]"
              variant="contained"
              onClick={applyButton}
              disabled={
                authorName === "" &&
                paperType === "" &&
                paperTitle === "" &&
                country === "" &&
                editor === ""
              }
              color="success"
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      )}
    </FormControl>
  );
}
