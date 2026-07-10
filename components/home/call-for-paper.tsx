import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

const CallForPaper = () => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        border: "1px solid #38B000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "0 auto",
        borderRadius: "3px",
        flexWrap: "wrap",
        paddingBlock: "20px",
      }}
    >
      <Image
        src="/uploads/telescope.jpg"
        alt="Telescope"
        width={300}
        height={200}
        style={{ objectFit: "contain" }}
        priority
      />
      <Typography
        component={"p"}
        sx={{
          fontSize: "25px",
          color: "#70E000",
          transition: "all 0.3s ease",
          fontWeight: "bold",
          ":hover": {
            color: "#004B23",
            borderBottom: "2px solid #70E000",
          },
        }}
      >
        <Link href={"/journals"}>{t("cfp.title")}</Link>
      </Typography>
    </Box>
  );
};

export default CallForPaper;
