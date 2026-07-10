import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import homePageContent from "@/lib/mockapi/src/fakedb/HomePage";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useLanguage } from "@/lib/LanguageContext";

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "350px",
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
}));

const ImportantDates = () => {
  const { t, lang } = useLanguage();

  return (
    <Container>
      <Typography
        component={"h2"}
        sx={{
          fontSize: "28px",
          fontFamily: "inherit",
          color: "#004B23",
          fontWeight: 700,
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        {t("dates.title")}
      </Typography>

      <Grid container spacing={2} sx={{ paddingInline: "30px" }}>
        {homePageContent?.importantDates?.map((data, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <DemoPaper
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                paddingTop: "25px",
                height: "300px",
                transition: "all 0.3s",
                ":hover": {
                  backgroundColor: "#007200",
                  color: "#fff !important",
                  transform: lang === "ar" ? "translateY(-10px) translateX(-10px)" : "translateY(-10px) translateX(10px)",
                },
              }}
              square={false}
            >
             {data.icon &&
  React.createElement(data.icon as React.ElementType, {
    size: 45, 
    style: { fontSize: "55px", color: "inherit" },
  })}

              <Box>
                <Typography
                  component={"p"}
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    mb: "10px",
                  }}
                >
                  {lang === "ar" && data.titleAr ? data.titleAr : data?.title}
                </Typography>
                <div
                  style={{ fontSize: "14px" }}
                  dangerouslySetInnerHTML={{ __html: lang === "ar" && data.descriptionAr ? data.descriptionAr : data?.description }}
                />
              </Box>
            </DemoPaper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ImportantDates;
