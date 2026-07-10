import axios from "axios";
import { getUsersData } from "../features/user-slice";
import { JournalPaperType } from "@/types/Journals/author";
import { getJournalData } from "../features/admin-slice";
import { clearError, setError, setLoading } from "../features/loading-slice";
import { getEditorData } from "../features/editor-slice";
import { getReviewerData } from "../features/reviewer-slice";
import { getAssociateData } from "../features/associate-slice";
import { authorSubmittedPaper } from "../features/submitted-paper";
import { setAssignedJournals } from "../features/journal-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const getUser = (email: any) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/get-user", {
      data: email,
    });
    if (response.status === 200) {
      dispatch(getUsersData(response.data));
      dispatch(clearError());
      return response.data;
    } else {
      dispatch(setError(response.data));
      throw new Error("Error getting user details");
    }
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const onGetAllEditors = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/get-editor");
    if (response.status === 200) {
      dispatch(getEditorData(response.data));
      dispatch(clearError());
      return response.data;
    } else {
      dispatch(setError(response.data));
      throw new Error("Error getting user details");
    }
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const onGetSubmittedPaper = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/getSubmittedPaper")
    if (response.status == 200) {
      dispatch(authorSubmittedPaper(response.data))
      dispatch(clearError())
      return response.data
    } else {
      dispatch(setError(response.data))
      throw new Error("Error getting submit paper")
    }

  } catch (error: any) {
    dispatch(setError(error.message))
    throw error;

  } finally {
    dispatch(setLoading(false))
  }
}

export const onGetAllAssociates = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/get-associate");
    if (response.status === 200) {
      dispatch(getAssociateData(response.data));
      dispatch(clearError());
      return response.data;
    } else {
      dispatch(setError(response.data));
      throw new Error("Error getting user details");
    }
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const onGetAllReviewer = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/get-reviewer");
    if (response.status === 200) {
      dispatch(getReviewerData(response.data));
      dispatch(clearError());
      return response.data;
    } else {
      dispatch(setError(response.data));
      throw new Error("Error getting user details");
    }
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const onGetAllPublishedPaper = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/get-published-paper");
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch(setError(response.data));
      throw new Error("Error getting");
    }
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const onGetFilterPaper =
  (
    authorName: any,
    paperTitle: any,
    paperType: any,
    country: any,
    editorName: any
  ) =>
    async (dispatch: any) => {
      dispatch(setLoading(true));
      try {
        const response = await axios.post("/api/filter-get-paper", {
          data: { authorName, paperTitle, paperType, country, editorName },
        });
        if (response.status === 200) {
          return response.data;
        } else {
          dispatch(setError(response.data));
          throw new Error("Error getting user details");
        }
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    };

export const onGetFilterPaperByAccepted =
  (
    authorName: any,
    paperTitle: any,
    paperType: any,
    country: any,
    editorName: any
  ) =>
    async (dispatch: any) => {
      dispatch(setLoading(true));
      try {
        const response = await axios.post("/api/filter-get-accepted-paper", {
          data: { authorName, paperTitle, paperType, country, editorName },
        });
        if (response.status === 200) {
          return response.data;
        } else {
          dispatch(setError(response.data));
          throw new Error("Error getting user details");
        }
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    };

export const onGetFilterPaperAdmin =
  (
    authorName: string,
    paperTitle: string,
    paperType: string,
    country: string,
    editor: string
  ) =>
    async (dispatch: any) => {
      dispatch(setLoading(true));
      try {
        const response = await axios.post("/api/filter-get-paper-admin", {
          data: { authorName, paperTitle, paperType, country, editor },
        });
        if (response.status === 200) {
          return response.data;
        } else {
          dispatch(setError(response.data));
          throw new Error("Error getting user details");
        }
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    };

export const submitJournalPaper =
  (journalData: JournalPaperType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post("/api/submit-journal-paper", {
        data: journalData,
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error submitting journal paper");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.message ||
        "Error submitting journal paper";

      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const onGetAllJournalRecords = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/get-journal");
    if (response.status === 200) {
      // dispatch(getJournalData(response.data));
      dispatch(clearError());
      return response.data;
    } else {
      dispatch(setError(response.data));
      throw new Error("Error getting user details");
    }
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const AssignJournalPaper =
  (journalData: JournalPaperType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post("/api/assign-to-editor", {
        data: journalData,
      });
      if (response.status === 200) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error assign to editor details");
      }
    } catch (error: any) {
      dispatch(setError(error.message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const onCreateArchivePaper =
  (archiveData: any) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post("/api/assign-to-archive", {
        data: archiveData,
      });
      if (response.status === 200) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error Archive details");
      }
    } catch (error: any) {
      dispatch(setError(error.message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
export const onCreateRejectedPaper =
  (rejectedData: any) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post("/api/assign-to-rejected", {
        data: rejectedData,
      });
      if (response.status === 200) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error Rejected details");
      }
    } catch (error: any) {
      dispatch(setError(error.message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const onCreatePublishedPaper =
  (publishedData: any) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post("/api/assign-to-publish", {
        data: publishedData,
      });
      if (response.status === 200) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error Archive details");
      }
    } catch (error: any) {
      dispatch(setError(error.message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateSubmittedJournalPaper =
  (paperID: number, value: any) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.patch(
        `/api/update-submit-paper/${paperID}`,
        {
          data: value,
        }
      );
      if (response.status === 200) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error assign to PaperID details");
      }
    } catch (error: any) {
      dispatch(setError(error.message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateEditorName =
  (paperID: number, value: any) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.patch(
        `/api/update-assigned-editor/${paperID}`,
        {
          data: value,
        }
      );
      if (response.status === 200) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error assign to PaperID details");
      }
    } catch (error: any) {
      dispatch(setError(error.message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

// export const onGetAllAssignedJournalRecords = () => async (dispatch: any) => {
//   dispatch(setLoading(true));
//   try {
//     const response = await axios.post("/api/get-assigned-journal");
//     if (response.status === 200) {
//       dispatch(getJournalData(response.data));
//       dispatch(clearError());
//       return response.data;
//     } else {
//       dispatch(setError(response.data));
//       throw new Error("Error getting user details");
//     }
//   } catch (error: any) {
//     dispatch(setError(error.message));
//     throw error;
//   } finally {
//     dispatch(setLoading(false));
//   }
// };
export const onGetAllRejectedJournalRecodrs = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/get-rejected-paper");
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch(setError(response.data));
      throw new Error("Error geting rejected paper");
    }
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const OnUpdateAssignedJournalPaper =
  (paperID: number, assignedData: any) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.patch(
        `/api/update-assigned-journals/add-reviewer/${paperID}`,
        { data: assignedData }
      );
      if (response.status === 200) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error assign to editor details");
      }
    } catch (error: any) {
      dispatch(setError(error.message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

// export const OnUpdateAssignedJournalPaperUrl =
//   (paperID: number, dataUrl: any) => async (dispatch: any) => {
//     dispatch(setLoading(true));
//     try {
//       const response = await axios.patch(
//         `/api/update-assigned-journals/update-assigned-paperUrl/${paperID}`,
//         { data: dataUrl }
//       );
//       if (response.status === 200) {
//         dispatch(clearError());
//         return response.data;
//       } else {
//         dispatch(setError(response.data));
//         throw new Error("Error assign to editor details");
//       }
//     } catch (error: any) {
//       dispatch(setError(error.message));

//       throw error;
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

export const OnUpdateAssignedJournalPaperStatus =
  (paperID: number, assignedData: any) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.patch(
        `/api/update-assigned-journals/update-assigned-paper-status/${paperID}`,
        { data: assignedData }
      );
      if (response.status === 200) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error assign to editor details");
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const filterByJournalID = (paperID: String) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/track-paper", {
      data: paperID,
    });
    if (response.status === 200) {
      dispatch(clearError());
      return response.data;
    } else {
      dispatch(setError(response.data));
      throw new Error("Error assign to editor details");
    }
  } catch (error: any) {
    dispatch(setError(error.message));

    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const OnUpdateAssignedJournalPaperIsPublished =
  (id: number, assignedData: any) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.patch(
        `/api/update-assigned-journals/update-assigned-journals-ispublish/${id}`,
        { data: assignedData }
      );
      if (response.status === 200) {
        dispatch(clearError());
        return response.data;
      } else {
        dispatch(setError(response.data));
        throw new Error("Error assign to editor details");
      }
    } catch (error: any) {
      dispatch(setError(error.message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const AssignedJournalsrecords = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/get-assigned-editor-papers");
    if (response.status === 200) {
      dispatch(setAssignedJournals(response.data));
      return response.data;

    } else {
      dispatch(setError(response.data));
      throw new Error("Error fetching assigned journals");
    }
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const onGetAllAssignedJournalRecords = createAsyncThunk(
  "journal/onGetAllAssignedJournalRecords",
  async (userId: string) => {
    const response = await fetch("/api/get-assigned-journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) throw new Error("Failed to fetch assigned journals");

    const data = await response.json();
    return data;
  }
);

// export const OnUpdateAssignedJournalAssociateEditor =
//   (paperID: any, updateAssignValue: any) => async (dispatch: any) => {
//     dispatch(setLoading(true));
//     try {
//       const response = await axios.patch(
//         `/api/update-assigned-journals/update-associateEditor/${paperID}`,
//         { data: updateAssignValue }
//       );
//       if (response.status === 200) {
//         dispatch(clearError());
//         return response.data;
//       } else {
//         dispatch(setError(response.data));
//         throw new Error("Error assign to editor details");
//       }
//     } catch (error: any) {
//       dispatch(setError(error.message));

//       throw error;
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
