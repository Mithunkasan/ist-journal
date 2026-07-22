"use client";

import { Button, Container, FormControl, FormLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { FaSearch } from "react-icons/fa";
import { useLanguage } from "@/lib/LanguageContext";
import { useAppDispatch } from "@/lib/hooks/redux";
import { filterByJournalID } from "@/redux/actions/journalActions";
import { JournalPaperType } from "@/types/Journals/author";
import { formatPaperId } from "@/lib/utils/utils";

const TrackStatus = () => {
  const { t, lang, dir } = useLanguage();
  const [paperId, setPaperId] = useState("");
  const dispatch = useAppDispatch();
  const [filteredJournal, setFilteredJournal] = useState([]);

  const [paperIdError, setPaperIdError] = useState(false);
  const [updatedFlag, setUpdatedFlag] = useState(false);

  const handleInputChange = (event: any) => {
    setPaperId(event.target.value);
  };

  useEffect(() => {
    const filterByPaperID = async () => {
      try {
        const filterByPapersId = await dispatch(filterByJournalID(paperId));
        setFilteredJournal(filterByPapersId);
        setUpdatedFlag(false);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    filterByPaperID();
  }, [dispatch, updatedFlag,paperId]);

  const handleSubmitPaper = (e: any) => {
    e.preventDefault();

    if (paperId === "") {
      setPaperIdError(true);
      return;
    }
    setUpdatedFlag(true);
  };

  function convertTime(timeString: any) {
    const date = new Date(timeString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <Container dir={dir} className={lang === "ar" ? "rtl" : "ltr"}>
      <Typography
        component={"h2"}
        sx={{
          fontSize: "20px",
          fontFamily: "inherit",
          color: "#004B23",
          fontWeight: 600,
          marginBlock: "10px",
          textAlign: lang === "ar" ? "right" : "left",
        }}
      >
        {t("track.title")}
      </Typography>

      <Card sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "10px",
              flexDirection: lang === "ar" ? "row-reverse" : "row",
            }}
          >
            {React.createElement(FaSearch as React.ElementType, {
              size: 20,
              color: "#004b23",
              style: { fontWeight: 500 },
            })}
            <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
              {t("track.subtitle")}
            </Typography>
          </Box>

          <Box component={"form"} onSubmit={handleSubmitPaper}>
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "30px",
                alignItems: "center",
                marginBlock: "20px",
                paddingInline: "30px",
                "@media(max-width:768px)": {
                  flexDirection: "column",
                  gap: "10px",
                },
              }}
            >
              <FormLabel
                sx={{
                  fontSize: "16px",
                  width: "310px",
                  color: "#000",
                  textAlign: lang === "ar" ? "right" : "left",
                }}
              >
                {t("track.paperId")} <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Box sx={{ width: "100%" }}>
                <input
                  required
                  type="number"
                  name="paperId"
                  dir={dir}
                  value={paperId}
                  className={
                    paperIdError
                      ? "outline-none border py-3 px-3 rounded-lg border-[red] w-full lg:w-[500px]"
                      : "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-full lg:w-[500px]"
                  }
                  placeholder={t("track.placeholder")}
                  onChange={(event) => handleInputChange(event)}
                />
                {paperIdError && (
                  <p
                    style={{
                      marginTop: "5px",
                      fontSize: "13px",
                      color: "red",
                      textAlign: lang === "ar" ? "right" : "left",
                    }}
                  >
                    {t("track.required")}
                  </p>
                )}
              </Box>
            </FormControl>

            <Button
              type="submit"
              sx={{
                display: "block",
                color: "#000",
                border: "2px solid #006400",
                margin: "10px auto",
                padding: "10px 20px",
                alignSelf: "center",
                transition: "all 0.4s ease",
                ":hover": {
                  backgroundColor: "#006400",
                  color: "#fff",
                },
              }}
            >
              {t("track.submit")}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center">
        {filteredJournal?.map((data: JournalPaperType) => (
          <Card
            key={data?.id}
            sx={{
              display: "flex",
              marginTop: "20px",
              width: "100%",
              maxWidth: "500px",
              textAlign: lang === "ar" ? "right" : "left",
            }}
          >
            <CardContent sx={{ flex: "1 0 auto" }}>
              <div
                className="flex flex-col gap-2"
                style={{ direction: dir }}
              >
                <div className="flex gap-2 text-[15px]">
                  <span className="text-[#004b23] font-semibold ">
                    {t("track.cardId")}
                  </span>
                  <span>{formatPaperId(data?.paperID)}</span>
                </div>

                <div className="flex gap-2 text-[15px]">
                  <span className="text-[#004b23] font-semibold ">
                    {t("track.cardTitle")}
                  </span>
                  <span>{data?.title}</span>
                </div>

                <div className="flex gap-2 text-[15px]">
                  <span className="text-[#004b23] font-semibold ">
                    {t("track.cardType")}
                  </span>
                  <span>{data?.type}</span>
                </div>

                <div className="flex gap-2 text-[15px]">
                  <span className="text-[#004b23] font-semibold ">
                    {t("track.cardDate")}
                  </span>
                  <span>{convertTime(data?.createdAt)}</span>
                </div>

                <div className="flex gap-2 text-[15px]">
                  <span className="text-[#004b23] font-semibold ">
                    {t("track.cardStatus")}
                  </span>
                  <span className="text-[#004b23] font-bold">
                    {data?.status === "SUBMITTED" || data?.status === "ASSIGNED_TO_EDITOR" || data?.status === "EDITOR_SCREENING"
                      ? "Paper Submitted"
                      : (data?.status || "").replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default TrackStatus;
