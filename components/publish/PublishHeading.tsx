import { Typography } from "@mui/material";
import React from "react";

type phublishHeadingProps = {
  heading: string;
};

const PublishHeading = ({ heading }: phublishHeadingProps) => {
  return (
    <Typography
      component={"h2"}
      sx={{
        fontSize: "18px",
        fontFamily: "inherit",
        color: "#004B23",
        fontWeight: 700,
        // textAlign: "center",
        marginTop: "20px",
        marginBottom: "10px",
      }}
    >
      {heading}
    </Typography>
  );
};

export default PublishHeading;
