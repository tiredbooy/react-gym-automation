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

      try {
        dispatch({ type: "startOperation" });

        // Calculate payload size
        const payloadSize = JSON.stringify(userData).length;
        console.log(
          "Payload size:",
          `${(payloadSize / 1024 / 1024).toFixed(2)} MB`
        );

        if (payloadSize > 10 * 1024 * 1024) {
          // 10MB warning
          console.warn("Large payload detected, might cause issues");
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
            signal: AbortSignal.timeout(30000), // Extended timeout for large images
          }
        );

        console.log("Response status:", response.status);
        console.log(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error(
            `HTTP ${response.status}: ${response.statusText} - ${errorText}`
          );
        }

        const data = await response.json();
        console.log("Server response data:", data);

        dispatch({
          type: "user/added",
          payload: { userID: data.id, fullName: data.full_name },
        });
        toast.success("کاربر با موفقیت ثبت شد");

        // Refresh current view
        const { isFiltered: currentIsFiltered, currentFilters: filters } =
          stateRef.current;
        if (currentIsFiltered) {
          await handleFilterUser(filters.nameQuery, filters.idQuery, 1);
        } else {
          await fetchUsers(1);
        }
      } catch (e) {
        console.error("=== ERROR in handleAddUser ===");
        console.error("Error type:", e.name);
        console.error("Error message:", e.message);
        console.error("Full error:", e);

        const errorMessage =
          e.name === "AbortError"
            ? "Upload timeout. Please try again."
            : e.message || "Failed to add user";

        dispatch({ type: "error", payload: errorMessage });
        toast.error(errorMessage);
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

      // barae role id : 1,  //action=role
      // baraye membership //action=membership_type


      const memberData = {
        // card_no: formData.card_no ? formData.card_no : null,
        person: userID,
        role_id: 1,
        user: 20,
        shift,
        is_black_list: false,
        box_radif_no: "B555",
        // has_finger: formData.authMethod === 'finger' ? true : false,
        membership_datetime: "2025-05-01T00:00:00Z",
        modifier: "admin",
        modification_datetime: "2025-05-21T10:00:00Z",
        is_family: false,
        max_debit: "1500.00",
        minutiae: formData.fingerMinutiae1 ? formData.fingerMinutiae1 : null,
        minutiae2: formData.fingerMinutiae2 ? formData.fingerMinutiae2 : null,
        minutiae3: formData.fingerMinutiae3 ? formData.fingerMinutiae3 : null,
        // salary: "6000.00",  IDK what is This
        face_template_1: formData.face_template_1 ? formData.face_template : null,
        face_template_2: formData.face_template_1 ? formData.face_template : null,
        face_template_3: formData.face_template_1 ? formData.face_template : null,
        face_template_4: formData.face_template_1 ? formData.face_template : null,
        face_template_5: formData.face_template_1 ? formData.face_template : null,
      };

      const paymentData = {
        user: 1,
        price : formData.total_price,
        duration : formData.duration,
        paid_method : formData.paid_method,
        payment_status: "Completed",
        full_name: userFullName,
      };
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
