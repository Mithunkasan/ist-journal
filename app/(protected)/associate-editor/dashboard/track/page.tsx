"use client";
import { RoleGate } from "@/components/auth/role-gate";
import { Paper, Typography } from "@mui/material";
import { UserRole } from "@prisma/client";
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { onGetAllPublishedPaper } from "@/redux/actions/journalActions";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const PublishedPaper = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const session = useSession();

  const [flag, setFlag] = useState(false);
  const [publishedPaper, setPublishedPaper] = useState([]);

  const loadingSlice = useSelector(
    (state: any) => state?.loaderSlice?.value?.isLoading
  );

  useEffect(() => {
    const FetchAllPublishedPaper = async () => {
      try {
        const fetchPublishedPaper = await dispatch(onGetAllPublishedPaper());
        const publishedPaper = fetchPublishedPaper.filter((data: any) => {
          return (
            data.associateEditor === session.data?.user?.name &&
            data.status === "PUBLISHED"
          );
        });
        // const filterPublishedPaper=fetchPublishedPaper.filter((data)=>)
        setPublishedPaper(publishedPaper);
      } catch (error) {
        console.error(error);
      }
    };
    FetchAllPublishedPaper();
  }, [dispatch, session, flag]);

  const handleRegisterClick = () => {
    router.back();
  };

  return (
    <RoleGate allowedRole={UserRole.ASSOCIATE_EDITOR}>
      <Container sx={{ marginBlock: "20px" }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={handleRegisterClick}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>
        <Typography
          sx={{
            marginBlock: "20px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#004b23",
            fontFamily: "inherit",
            textAlign: "center",
          }}
        >
          Published Paper
        </Typography>
        <Paper sx={{ maxWidth: "100%", overflow: "hidden", marginTop: "20px" }}>
          <JournalsTable
            journalsPaper={publishedPaper}
            flag={flag}
            setFlag={setFlag}
            loadingSlice={loadingSlice}
            titles="published_paper"
          />
        </Paper>
      </Container>
    </RoleGate>
  );
};

export default PublishedPaper;
