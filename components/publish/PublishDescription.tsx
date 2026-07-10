import { Typography } from "@mui/material";
import React from "react";

type publishDescriptionType = {
  description: string;
};

const PublishDescription = ({ description }: publishDescriptionType) => {
  return (
    <Typography
      component={"p"}
      sx={{
        fontSize: "16px",
        fontFamily: "inherit",
        maxWidth: "1000px",
        marginBottom: "10px",
        color: "#666",
        lineHeight: 1.5,
      }}
    >
      {description}
    </Typography>
  );
};

export default PublishDescription;
