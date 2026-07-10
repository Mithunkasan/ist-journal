// @ts-nocheck
import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { IoCheckbox } from "react-icons/io5";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import {
  authorGuidelines,
  submitInstruction,
  formattingInstructions,
} from "../../../../lib/howtoHearThis";
import AuthorGuidelines from "@/components/guidelines/author-guidelines";
import PublishDescription from "@/components/publish/PublishDescription";
import PublishHeading from "@/components/publish/PublishHeading";

const Guidelines = () => {
  return (
    <Container sx={{ marginTop: "20px" }}>
      <Typography
        component={"h2"}
        sx={{
          fontSize: "20px",
          fontFamily: "inherit",
          color: "#004B23",
          fontWeight: 600,
          // textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Author Guidelines
      </Typography>
      <PublishDescription
        description="Each section below contains important information for authors. We
        recommend reading them thoroughly before submitting your contribution."
      />
      <div className="h-1 w-full bg-[#919191] mt-2 opacity-[0.2]" />
      <PublishHeading heading="The Editorial Review Process" />

      <PublishDescription
        description="Articles being considered for publication in IST Journals are evaluated
        by members of the editorial committee."
      />

      <PublishDescription
        description="  Reviewers give feedback and often suggest specific improvements, which
        are communicated to the authors."
      />

      <PublishDescription
        description="         Reviewers assess submissions based on five criteria
        "
      />

      <List>
        {authorGuidelines?.map((data, index) => (
          <div key={index + 1}>
            <ListItem disablePadding>
              <ListItemIcon>
                <RiCheckboxCircleLine className="text-[#88C67F] text-[23px]" />
              </ListItemIcon>
              <ListItemText
                sx={{ color: "#666", fontSize: "16px" }}
                primary={data}
              />
            </ListItem>
          </div>
        ))}
      </List>

      <div className="h-[2px] w-full bg-[#919191] mt-2 opacity-[0.2]" />

      <AuthorGuidelines
        title="Submission Instructions"
        data={submitInstruction}
        icon={RiCheckboxBlankCircleLine}
      />

      <div className="h-[3px] w-full bg-[#919191] mt-2 opacity-[0.2]" />

      <AuthorGuidelines
        title="Formatting Instructions"
        data={formattingInstructions}
        icon={IoCheckbox}
      />
    </Container>
  );
};

export default Guidelines;
