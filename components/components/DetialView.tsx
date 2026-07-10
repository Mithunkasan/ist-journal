"use client";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { onGetAllAssignedJournalRecords } from "@/redux/actions/journalActions";
import { JournalPaperType } from "@/types/Journals/author";
import { CircularProgress } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import axios from "axios";

const DetialView = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [details, SetDetails] = useState<JournalPaperType[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  useEffect(() => {
    const FetchData = async function () {
      try {
        setLoading(false);
        
        const paperId = parseInt(
          Array.isArray(params.paperID) ? params.paperID[0] : params.paperID || "0"
        );

        const response = await axios.get("/api/editor/papers");
        const journalData = response.data || [];

        const filterByPaperID = journalData.filter(
          (data: JournalPaperType) => {
            return data.paperID === paperId;
          }
        );

        setFile(filterByPaperID[0]?.paperUrl || "");
        SetDetails(filterByPaperID);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching journal records:", error);
        setLoading(true);
      }
    };

    FetchData();
  }, [dispatch, params.paperID]);

  const docs = [
    {
      uri: file,
    },
  ];

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      {loading ? (
        details.length > 0 ? (
          details.map((data: JournalPaperType) => (
            <div
              id="main-content"
              key={data.id}
              className="blog-page bg-gray-100 mt-5"
            >
              <div className="container mx-auto">
                <button
                  className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
                  onClick={handleBack}
                >
                  <KeyboardBackspaceIcon />
                  Back
                </button>
                <div className="flex justify-center">
                  <h1 className="font-bold m-2 text-[#004b23] text-2xl">
                    Details Views
                  </h1>
                </div>
                <div className="row ">
                  <div className="col-lg-8 col-md-12 left-box">
                    <div className="card single_post bg-white shadow-md mb-8 rounded-lg ">
                      <div className="m-5 px-20 mt-6 mb-4">
                        <div className="flex ">
                          <p className="font-bold text-2xl tracking-[1px] p-2 mt-5">
                            <span className="font-medium font-sans  text-[#004b23]">
                              Paper {data.paperID}{" "}
                            </span>
                            <span className="font-normal">: </span>
                            {data.title}
                          </p>
                        </div>
                        <div className="flex justify-around font-serif m-5">
                          <div className="font-bold">
                            Primary Domain:{" "}
                            <span className="font-normal text-[#004B23] text-sm">
                              {data.primaryDomain}
                            </span>
                          </div>
                          <div className="font-bold">
                            Seconday Domain:{" "}
                            <span className="font-normal text-[#004B23] text-sm">
                              {data.secondaryDomain}
                            </span>{" "}
                          </div>
                        </div>
                        <div className="tracking-wide antialiased text-clip text-lg p-3 text-justify">
                          <span className="italic text-[#004b23] font-extrabold font-serif">
                            Abstract:{" "}
                          </span>
                          {data.abstract}
                        </div>

                        <div className="text-base font-normal flex items-center p-2 ">
                          <span className="font-serif font-extralight">
                            <LocalOfferIcon className="text-[20px] text-[#cdcdcd]" />{" "}
                            Keywords:{" "}
                          </span>
                          <p>{data.keywords}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card bg-white shadow-md mb-8 rounded-lg">
                      <div className="header text-xl  font-bold p-5 flex justify-center">
                        <h2>Author Details</h2>
                      </div>
                      <div className="flex justify-evenly gap-2 flex-wrap">
                        {data.authorNames?.split(",").map((names, index) => (
                          <div key={index} className="w-60 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4">
                            <div className="flex flex-col items-center pb-10">
                              <div className="justify-center mt-4">
                                <PermIdentityIcon className="text-[60px] text-[#004B23]" />
                              </div>
                              <h5 className="mb-1 text-xl font-medium text-gray-900  ">
                                {names.trim()}
                              </h5>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {data.authorEmail}
                              </span>
                              <div className="flex mt-4 md:mt-6">
                                <a
                                  href="#"
                                  className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                  Message
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card bg-white shadow-md mb-8 rounded-lg">
                      <div className="body p-5 flex justify-center">
                        <div className="paperUrl">
                          {file && (
                            <DocViewer
                              documents={docs}
                              pluginRenderers={DocViewerRenderers}
                              style={{ height: 1000, width: 900 }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">No details found for this paper.</p>
          </div>
        )
      ) : (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )}
    </>
  );
};
export default DetialView;
