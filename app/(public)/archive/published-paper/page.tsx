"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks/redux";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { onGetAllPublishedPaper } from "@/redux/actions/journalActions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CircularProgress, Tooltip } from "@mui/material";
import SellIcon from "@mui/icons-material/Sell";
import { useLanguage } from "@/lib/LanguageContext";

const Published = () => {
  const router = useRouter();
  const session = useSession();
  const { lang } = useLanguage();
  const [archivePaper, setArchivePaper] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);
  const dispatch: any = useAppDispatch();

  useEffect(() => {
    const FetchAllApprovelPaper = async () => {
      try {
        const fetchArchivePapers = await dispatch(onGetAllPublishedPaper());
        setArchivePaper(fetchArchivePapers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchAllApprovelPaper();
  }, [dispatch, session]);
  return (
    <>
      {loading ? (
        <div className="flex justify-center content-center my-10">
          <CircularProgress />
        </div>
      ) : (
        <div className="text-justify px-4 pb-4 mx-10 bg-gray">
          {archivePaper.map((paper: any) => (
            <div className="m-3 pt-5" key={paper.id}>
              <p className="text-2xl font-medium">
                IST {paper.volume} {paper.issue}
              </p>
              <div className="m-2 indent-5">
                <p>
                  <span className="text-base font-light font-serif">
                    Revised Copyright Statement:
                  </span>{" "}
                  This publication is openly accessible and licensed under a
                  Creative Commons Attribution 4.0 International License,
                  granting unrestricted use, distribution, and reproduction in
                  any medium, including commercial purposes, provided that
                  proper attribution to the original work is maintained.
                </p>
              </div>
              <hr className="text-[#cdcdcd]" />

              <div className="m-2">
                <div className="text-2xl mb-2 font-bold ">
                  <span className="font-serif text-[#004b23]">Paper</span>:{" "}
                  <button
                    onClick={() => {
                      router.push(`/archive/published-paper/${paper.id}`);
                    }}
                  >
                    <span className="hover:text-[#38B000] font-bold">
                      {paper.title}
                    </span>
                  </button>
                </div>
                {paper.doi && (
                  <div className="text-sm font-normal flex items-center mb-2 gap-1 flex-wrap">
                    <span className="font-serif font-bold text-[#004B23]">
                      {lang === "ar" ? "معرّف الكائن الرقمي (DOI):" : "DOI:"}
                    </span>
                    <a
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#38B000] hover:text-[#004B23] hover:underline font-mono font-medium transition-colors"
                    >
                      https://doi.org/{paper.doi}
                    </a>
                  </div>
                )}
                <div className="text-justify my-2 indent-3">
                  <span className="italic font-serif">Abstract</span> :{" "}
                  {paper.abstract}
                </div>
                <div className="indent-7 flex gap-20">
                  {true &&
                    (paper?.authorNames)
                      .split(",")
                      .map((names: String, index: number) => (
                        <div
                          key={index}
                          className=" text-sm font-light items-center"
                        >
                          <PersonOutlineIcon className="text-[17px] text-[#cdcdcd]" />{" "}
                          <span className="indent-1">Author {index + 1}:</span>{" "}
                          {names}
                        </div>
                      ))}
                </div>
                <div className="capitalize m-2">
                  <SellIcon className="text-[#004b23] text-[20px]" />
                  <span className="italic font-serif">Keywords</span> :{" "}
                  {(paper?.keywords).split(",").join("; ")}
                </div>
                <div className="flex mx-4 justify-end mb-2">
                  <Tooltip arrow placement="top" title="Download pdf">
                    <div>
                      <a
                        className=" text-sm uppercase font-medium me-2 px-2.5 py-0.5 rounded-md w-19 h-8 content-center  border outline-2 bg-[#064420]  text-white "
                        href={paper.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        pdf
                      </a>
                    </div>
                  </Tooltip>
                </div>
                <hr className="text-[#cdcdcd]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Published;
