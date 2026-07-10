"use client";
import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/navigation";
import Editorslist from "./editorsList";
import { useSelector } from "react-redux";
import { onGetAllEditors } from "@/redux/actions/journalActions";
import { useAppDispatch } from "@/lib/hooks/redux";

type adminValue = {
  role: string;
};

const AdminEditorManagement = ({ role }: adminValue) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const editorData = useSelector(
    (state: any) => state?.editorSlice?.value?.editorData
  );

  React.useEffect(() => {
    dispatch(onGetAllEditors());
  }, [dispatch]);

  const handleRegisterClick = () => {
    router.push(`/admin/editorregister?role=${role.split(" ").join("_")}`);
  };
  return (
    <>
      <button
        className="bg-[#004b23] text-[#fff]  px-4 py-3 font-[inherit]  rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center ml-auto"
        onClick={handleRegisterClick}
      >
        <AddCircleIcon />
        Add New {role}
      </button>

      {editorData?.length > 0 && <Editorslist role={role} />}
    </>
  );
};

export default AdminEditorManagement;
