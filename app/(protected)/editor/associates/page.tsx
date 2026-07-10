"use client";
import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/navigation";
import ReviewList from "@/components/editor/ReviewList";
import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { onGetAllReviewer } from "@/redux/actions/journalActions";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useAppDispatch } from "@/lib/hooks/redux";

const EditorReviewerManagement = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reviewerData = useSelector(
    (state: any) => state?.reviewerSlice?.value?.reviewerData
  );
  React.useEffect(() => {
    dispatch(onGetAllReviewer());
  }, [dispatch]);

  const handleRegisterClick = () => {
    router.push("/editor/reviewerregister");
  };

  const handleAssociateRegisterClick = () => {
    router.push("/editor/associate-register");
  };

  const handleBackClick = () => {
    router.back();
  };
  return (
    <Container>
      <button
        className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
        onClick={handleBackClick}
      >
        <KeyboardBackspaceIcon />
        Back
      </button>
      <button
        className="bg-[#004b23] text-[#fff] w-[290px] px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center ml-auto mt-12 "
        onClick={handleAssociateRegisterClick}
      >
        <AddCircleIcon />
        Add Associate Editor
      </button>

      <button
        className="bg-[#004b23] text-[#fff] w-[250px] px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center ml-auto mt-4 "
        onClick={handleRegisterClick}
      >
        <AddCircleIcon />
        Add New Reviewer
      </button>

      {reviewerData?.length > 0 && <ReviewList />}
    </Container>
  );
};

export default EditorReviewerManagement;
