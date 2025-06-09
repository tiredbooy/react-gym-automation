import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";
import toast from "react-hot-toast";

const SubscriptionDataContext = createContext();

const initialState = {
  users: [],
  userFullName: "",
  filteredUsers: [],
  currentPage: 1,
  totalPages: 0,
  isLoading: false,
  error: "",
  userID: null,
  shift: localStorage.getItem("shift") || "1",
  isFiltered: false,
  currentFilters: {
    nameQuery: "",
    idQuery: null,
  },
  membership: [],
  payments: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "startOperation":
      return { ...state, isLoading: true, error: "" };

    case "users/loaded":
      return {
        ...state,
        users: action.payload.users,
        filteredUsers: action.payload.users,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.page || 1,
        isLoading: false,
        isFiltered: false,
        currentFilters: { nameQuery: "", idQuery: null },
      };

    case "users/filtered":
      return {
        ...state,
        filteredUsers: action.payload.users,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.page || 1,
        isLoading: false,
        isFiltered: true,
        currentFilters: action.payload.filters,
      };

    case "page/changed":
      return {
        ...state,
        currentPage: action.payload,
      };

    case "user/added":
      return {
        ...state,
        userID: action.payload.userID,
        userFullName: action.payload.fullName,
        isLoading: false,
      };

    case "shift/updated":
      return {
        ...state,
        shift: action.payload,
        currentPage: 1,
        isFiltered: false,
        currentFilters: { nameQuery: "", idQuery: null },
      };

    case "filters/reset":
      return {
        ...state,
        filteredUsers: state.users,
        currentPage: 1,
        isLoading: false,
        isFiltered: false,
        currentFilters: { nameQuery: "", idQuery: null },
      };

    case "membership/added":
      return {
        ...state,
        membership: [...state.membership, action.payload],
        isLoading: false,
      };

    case "payment/added": // New action for payments
      return {
        ...state,
        payments: [...state.payments, action.payload],
        isLoading: false,
      };

    case "error":
      return { ...state, isLoading: false, error: action.payload };

    default:
      return state;
  }
}

// Improved image processing function
const processUserImages = (users) => {
  return users.map((user) => {
    const processImage = (imageData) => {
      if (!imageData) return null;

      // Remove any existing data URL prefix if present
      const cleanBase64 = imageData.replace(
        /^data:image\/[a-zA-Z]*;base64,/,
        ""
      );

      // Detect image format based on base64 signature
      let mimeType = "image/jpeg"; // default

      if (cleanBase64.startsWith("/9j/")) {
        mimeType = "image/jpeg";
      } else if (cleanBase64.startsWith("iVBORw0KGgo")) {
        mimeType = "image/png";
      } else if (cleanBase64.startsWith("R0lGODlh")) {
        mimeType = "image/gif";
      } else if (cleanBase64.startsWith("UklGR")) {
        mimeType = "image/webp";
      }
      // Add more format detection as needed

      return `data:${mimeType};base64,${cleanBase64}`;
    };

    return {
      ...user,
      thumbnail_image: processImage(user.thumbnail_image),
      person_image: processImage(user.person_image),
    };
  });
};

function SubscriptionDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const {
    users,
    filteredUsers,
    totalPages,
    isLoading,
    error,
    userID,
    shift,
    currentPage,
    isFiltered,
    currentFilters,
    userFullName,
  } = state;

  // Optimized fetchUsers with better error handling
  const fetchUsers = useCallback(async function fetchUsers(page = 1) {
    try {
      dispatch({ type: "startOperation" });

      const currentShift = stateRef.current.shift;
      const queryParams = new URLSearchParams({
        action: "person",
        order_by: "latest",
        gender: currentShift === "1" ? "M" : "F",
        page: page.toString(),
        limit: "24",
      });

      const response = await fetch(
        `http://localhost:8000/api/dynamic/?${queryParams.toString()}`,
        {
          signal: AbortSignal.timeout(10000), // 10 second timeout
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response structure
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error("Invalid response format");
      }

      // Ensure we always have an array for processing
      const items = Array.isArray(data.items) ? data.items : [];
      const sortedData = items.sort(
        (a, b) => new Date(b.creation_datetime) - new Date(a.creation_datetime)
      );

      const processedUsers = processUserImages(sortedData);

      dispatch({
        type: "users/loaded",
        payload: {
          users: processedUsers,
          totalPages: data.total_pages || 1,
          page,
        },
      });
    } catch (e) {
      const errorMessage =
        e.name === "AbortError"
          ? "Request timeout. Please try again."
          : e.message || "Failed to fetch users";

      dispatch({ type: "error", payload: errorMessage });
      toast.error(errorMessage);
    }
  }, []);

  // Optimized filter function with debouncing capability
  const handleFilterUser = useCallback(async function handleFilterUser(
    nameQuery,
    idQuery,
    page = 1
  ) {
    if (!nameQuery && !idQuery) {
      dispatch({ type: "filters/reset" });
      return;
    }

    try {
      dispatch({ type: "startOperation" });

      const currentShift = stateRef.current.shift;
      const params = new URLSearchParams({
        action: "person",
        gender: currentShift === "1" ? "M" : "F",
        page: page.toString(),
        limit: "24",
      });

      if (idQuery) params.append("id", idQuery);
      if (nameQuery) params.append("full_name", nameQuery);

      const response = await fetch(
        `http://localhost:8000/api/dynamic/?${params.toString()}`,
        {
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Ensure we always have an array
      const items = Array.isArray(data.items) ? data.items : [];
      const processedUsers = processUserImages(items);

      dispatch({
        type: "users/filtered",
        payload: {
          users: processedUsers,
          totalPages: data.total_pages || 1,
          page,
          filters: { nameQuery, idQuery },
        },
      });
    } catch (e) {
      const errorMessage =
        e.name === "AbortError"
          ? "Request timeout. Please try again."
          : e.message || "Failed to filter users";

      dispatch({ type: "error", payload: errorMessage });
      toast.error(errorMessage);
    }
  },
  []);

  const handlePageChange = useCallback(
    async function handlePageChange(page) {
      dispatch({ type: "page/changed", payload: page });

      const { isFiltered: currentIsFiltered, currentFilters: filters } =
        stateRef.current;

      if (currentIsFiltered) {
        await handleFilterUser(filters.nameQuery, filters.idQuery, page);
      } else {
        await fetchUsers(page);
      }
    },
    [handleFilterUser, fetchUsers]
  );

  const handleAddUser = useCallback(
    async function handleAddUser(formData) {
      const currentShift = stateRef.current.shift;

      // Debug logging
      console.log("=== DEBUG: handleAddUser ===");
      console.log("FormData received:", {
        ...formData,
        person_image: formData.person_image
          ? `${formData.person_image.substring(0, 50)}...`
          : null,
        thumbnail_image: formData.thumbnail_image
          ? `${formData.thumbnail_image.substring(0, 50)}...`
          : null,
      });

      // Validate and clean image data
      const cleanImageData = (imageData) => {
        if (!imageData) return null;

        // Remove data URL prefix if present
        const cleanBase64 = imageData.replace(
          /^data:image\/[a-zA-Z]*;base64,/,
          ""
        );

        // Validate base64
        try {
          atob(cleanBase64.substring(0, 100)); // Test decode first 100 chars
          console.log("Image validation passed, length:", cleanBase64.length);
          return cleanBase64;
        } catch (e) {
          console.error("Invalid base64 image data:", e);
          return null;
        }
      };

      const userData = {
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        full_name: `${formData?.first_name} ${formData?.last_name}`,
        gender: formData.gender,
        national_code: formData.national_code,
        nidentify: "",
        person_image: cleanImageData(formData.person_image),
        thumbnail_image: cleanImageData(formData.thumbnail_image),
        birth_date: formData.birth_date,
        mobile: formData.mobile,
        has_insurance: formData.has_insurance,
        insurance_no: formData.insurance_no,
        ins_start_date: formData.ins_start_date,
        ins_end_date: formData.ins_end_date,
        shift: currentShift,
      };

      console.log("Final userData being sent:", {
        ...userData,
        person_image: userData.person_image
          ? `${userData.person_image.substring(0, 50)}... (length: ${
              userData.person_image.length
            })`
          : null,
        thumbnail_image: userData.thumbnail_image
          ? `${userData.thumbnail_image.substring(0, 50)}... (length: ${
              userData.thumbnail_image.length
            })`
          : null,
      });

      let toastId;

      try {
        dispatch({ type: "startOperation" });

        toastId = toast.loading("درحال آپلود کاربر");

        const payloadSize = JSON.stringify(userData).length;
        console.log(
          "Payload size:",
          `${(payloadSize / 1024 / 1024).toFixed(2)} MB`
        );

        if (payloadSize > 10 * 1024 * 1024) {
          toast.error(
            `حجم عکس بزرگتر از 10 مگابایت لطفا جهت اپتیمایز نگه داشتن برنامه از عکس  با سایز کمتر استفاده کنید`
          );
          toast.dismiss(toastId); // Important!
          return;
        }

        const response = await fetch(
          `http://localhost:8000/api/dynamic/?action=person`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(userData),
            signal: AbortSignal.timeout(20000),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP ${response.status}: ${response.statusText} - ${errorText}`
          );
        }

        const data = await response.json();

        dispatch({
          type: "user/added",
          payload: { userID: data.id, fullName: data.full_name },
        });

        toast.success("کاربر با موفقیت ثبت شد", { id: toastId });

        const { isFiltered: currentIsFiltered, currentFilters: filters } =
          stateRef.current;

        if (currentIsFiltered) {
          await handleFilterUser(filters.nameQuery, filters.idQuery, 1);
        } else {
          await fetchUsers(1);
        }
      } catch (e) {
        console.error("=== ERROR in handleAddUser ===", e);

        const errorMessage =
          e.name === "AbortError"
            ? "Upload timeout. Please try again."
            : e.message || "Failed to add user";

        dispatch({ type: "error", payload: errorMessage });

        if (toastId) {
          toast.error(errorMessage, { id: toastId });
        } else {
          toast.error(errorMessage); // fallback if toastId was never created
        }
      }
    },
    [fetchUsers, handleFilterUser]
  );

  const handleResetFilters = useCallback(
    async function handleResetFilters() {
      dispatch({ type: "filters/reset" });
      await fetchUsers(1); // Always go to page 1 when resetting
    },
    [fetchUsers]
  );

  const updateShift = useCallback(function updateShift(newShift) {
    localStorage.setItem("shift", newShift);
    dispatch({ type: "shift/updated", payload: newShift });
  }, []);

  const handleSubscription = useCallback(
    async function handleSubscription(formData) {
      const today = new Date().toISOString();

      const memberData = {
        card_no: formData.card_no ? formData.card_no : null,
        person: userID,
        role: 1,
        user: 1,
        shift,
        is_black_list: false,
        box_radif_no: "B555",
        membership_datetime: formData.start_date,
        modifier: "admin",
        modification_datetime: today,
        is_family: false,
        max_debit: "",
        minutiae: formData?.fingerMinutiae1 ? formData?.fingerMinutiae1 : null,
        minutiae2: formData?.fingerMinutiae2 ? formData?.fingerMinutiae2 : null,
        minutiae3: formData?.fingerMinutiae3 ? formData?.fingerMinutiae3 : null,
        face_template_1: formData?.face_template
          ? formData?.face_template
          : null,
        face_template_2: formData?.face_template
          ? formData?.face_template
          : null,
        face_template_3: formData?.face_template
          ? formData?.face_template
          : null,
        face_template_4: formData?.face_template
          ? formData?.face_template
          : null,
        face_template_5: formData?.face_template
          ? formData?.face_template
          : null,
      };

      const paymentData = {
        user: userID,
        price: formData?.total_price,
        duration: formData?.duration,
        payment_date : new Date().toISOString(),
        paid_method: formData?.paid_method,
        payment_status: "Completed",
        full_name: userFullName,
      };

      let toastId;

      try {
        dispatch({ type: "startOperation" });
        toastId = toast.loading("درحال ثبت اشتراک...");

        // Add subscription (member)
        let subsData;
        try {
          const subsResponse = await fetch(
            `http://localhost:8000/api/dynamic/?action=member`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(memberData),
              signal: AbortSignal.timeout(10000),
            }
          );

          if (!subsResponse.ok) {
            const errorText = await subsResponse.text();
            throw new Error(
              `HTTP ${subsResponse.status}: ${subsResponse.statusText} - ${errorText}`
            );
          }

          subsData = await subsResponse.json();
          dispatch({ type: "membership/added", payload: subsData });
          toast.success("اشتراک با موفقیت ثبت شد", { id: toastId });
          console.log('subsData:', subsData);
        } catch (e) {
          const errorMessage =
            e.name === "AbortError"
              ? "Request timeout. Please try again."
              : e.message || "خطا در ثبت اشتراک";
          dispatch({ type: "error", payload: errorMessage });
          toast.error(errorMessage, { id: toastId });
          return; // Stop if subscription fails, as payment depends on it
        }

        // Add payment
        toastId = toast.loading("درحال ثبت پرداخت...");
        try {
          const paymentResponse = await fetch(
            "http://localhost:8000/api/payments/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(paymentData),
              signal: AbortSignal.timeout(10000),
            }
          );

          if (!paymentResponse.ok) {
            const errorText = await paymentResponse.text();
            throw new Error(
              `HTTP ${paymentResponse.status}: ${paymentResponse.statusText} - ${errorText}`
            );
          }

          const paymentResult = await paymentResponse.json();
          dispatch({ type: "payment/added", payload: paymentResult });
          toast.success("پرداخت با موفقیت ثبت شد", { id: toastId });
          console.log('paymentResult:', paymentResult);
        } catch (e) {
          const errorMessage =
            e.name === "AbortError"
              ? "Request timeout. Please try again."
              : e.message || "خطا در ثبت پرداخت";
          dispatch({ type: "error", payload: errorMessage });
          toast.error(errorMessage, { id: toastId });
        }
      } catch (e) {
        // Catch any unexpected errors outside the inner try-catch blocks
        const errorMessage = e.message || "خطای غیرمنتظره در ثبت اطلاعات";
        dispatch({ type: "error", payload: errorMessage });
        toast.error(errorMessage, { id: toastId });
      } finally {
        // Ensure loading state is reset regardless of success or failure
        dispatch({ type: "error", payload: "" }); // Clear error and loading
      }
    },
    [userID, shift, userFullName]
  );

  // Memoized context value - only recalculates when dependencies actually change
  const value = useMemo(
    () => ({
      // State values
      users,
      filteredUsers,
      totalPages,
      isLoading,
      error,
      userID,
      shift,
      currentPage,
      isFiltered,
      // Stable function references
      fetchUsers,
      handleAddUser,
      handleFilterUser,
      handlePageChange,
      updateShift,
      handleResetFilters,
      handleSubscription,
    }),
    [
      users,
      filteredUsers,
      totalPages,
      isLoading,
      error,
      userID,
      shift,
      currentPage,
      isFiltered,
      fetchUsers,
      handleAddUser,
      handleFilterUser,
      handlePageChange,
      updateShift,
      handleResetFilters,
      handleSubscription,
    ]
  );

  return (
    <SubscriptionDataContext.Provider value={value}>
      {children}
    </SubscriptionDataContext.Provider>
  );
}

function useUser() {
  const context = useContext(SubscriptionDataContext);
  if (context === undefined)
    throw new Error("SubscriptionDataContext used outside provider");
  return context;
}

export { SubscriptionDataProvider, useUser };
