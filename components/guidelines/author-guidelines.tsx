import { Typography } from "@mui/material";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

type GuidlinesProps = {
  title: String;
  data: String[];
  icon: React.ElementType;
};

const AuthorGuidelines = ({ title, data, icon: Icon }: GuidlinesProps) => {
  return (
    <>
      <Typography
        component={"h2"}
        sx={{
          fontSize: "18px",
          fontFamily: "inherit",
          color: "#004B23",
          fontWeight: 700,
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        {title}
      </Typography>

      <List>
        {data?.map((data, index) => (
          <div key={index + 1}>
            <ListItem disablePadding>
              <ListItemIcon>
                <Icon className="text-[#88C67F] text-[15px]" />
              </ListItemIcon>
              <ListItemText
                sx={{ color: "#666", fontSize: "16px" }}
                primary={data}
              />
            </ListItem>
          </div>
        ))}
      </List>
    </>
  );
};

export default AuthorGuidelines;
