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
      return { ...state, userID: action.payload, isLoading: false };

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
        // totalPages : state.totalPages,
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

// Helper function to process user images - OUTSIDE component to prevent recreating
const processUserImages = (users) => {
  return users.map((user) => ({
    ...user,
    thumbnail_image: user.thumbnail_image
      ? `data:image/jpeg;base64,${user.thumbnail_image.replace(
          /^.*\/9j\//,
          "/9j/"
        )}`
      : null,
    person_image: user.person_image
      ? `data:image/jpeg;base64,${user.person_image.replace(
          /^.*\/9j\//,
          "/9j/"
        )}`
      : null,
  }));
};

function SubscriptionDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Use refs to store latest values without causing re-renders
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
  } = state;

  // FIXED: Remove all dependencies that cause circular references
  const fetchUsers = useCallback(
    async function fetchUsers(page = 1) {
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
          `http://localhost:8000/api/dynamic/?${queryParams.toString()}`
        );

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        const sortedData = data.items?.sort(
          (a, b) =>
            new Date(b.creation_datetime) - new Date(a.creation_datetime)
        );

        const processedUsers = processUserImages(sortedData);

        dispatch({
          type: "users/loaded",
          payload: {
            users: processedUsers,
            totalPages: data.total_pages,
            page,
          },
        });
      } catch (e) {
        dispatch({ type: "error", payload: e.message });
        toast.error("Failed to fetch users. Please try again later.");
      }
    },
    [] // NO dependencies - use stateRef instead
  );

  // FIXED: Remove circular dependencies
  const handleFilterUser = useCallback(
    async function handleFilterUser(nameQuery, idQuery, page = 1) {
      // If no filters, reset to all users
      if (!nameQuery && !idQuery) {
        dispatch({ type: "filters/reset" });
        return;
      }

      try {
        dispatch({ type: "startOperation" });

        const currentShift = stateRef.current.shift;
        let url = `http://localhost:8000/api/dynamic/?action=person&gender=${
          currentShift === "1" ? "M" : "F"
        }&page=${page}&limit=24`;

        if (idQuery) url += `&id=${encodeURIComponent(idQuery)}`;
        if (nameQuery) url += `&full_name=${encodeURIComponent(nameQuery)}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to filter users");

        const data = await response.json();
        const processedUsers = processUserImages(data.items);

        dispatch({
          type: "users/filtered",
          payload: {
            users: processedUsers,
            totalPages: data.total_pages,
            page,
            filters: { nameQuery, idQuery },
          },
        });
      } catch (e) {
        dispatch({ type: "error", payload: e.message });
        toast.error("Failed to filter users. Please try again.");
      }
    },
    [] // NO dependencies
  );

  // FIXED: Simplified page change handler
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
    [handleFilterUser, fetchUsers] // Only depend on the stable functions
  );

  // FIXED: Simplified add user
  const handleAddUser = useCallback(
    async function handleAddUser(formData) {
      const currentShift = stateRef.current.shift;
      const userData = {
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        full_name: `${formData?.first_name} ${formData?.last_name}`,
        gender: formData.gender,
        national_code: formData.national_code,
        nidentify: "",
        birth_date: formData.birth_date,
        mobile: formData.mobile,
        has_insurance: formData.has_insurance,
        insurance_no: formData.insurance_no,
        ins_start_date: formData.ins_start_date,
        ins_end_date: formData.ins_end_date,
        shift: currentShift,
      };

      try {
        dispatch({ type: "startOperation" });

        const response = await fetch(
          `http://localhost:8000/api/dynamic/?action=person`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          }
        );

        if (!response.ok) throw new Error("Failed to add user");

        const data = await response.json();
        dispatch({ type: "user/added", payload: data.person_id });
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
        dispatch({ type: "error", payload: e.message });
        toast.error("هنگام ثبت کاربر خطایی رخ داد");
      }
    },
    [fetchUsers, handleFilterUser]
  );

  // FIXED: Simplified reset
  const handleResetFilters = useCallback(async function handleResetFilters() {
    dispatch({ type: "filters/reset" });
    fetchUsers(currentPage)
  }, [fetchUsers]);

  // FIXED: Simple shift update
  const updateShift = useCallback(function updateShift(newShift) {
    localStorage.setItem("shift", newShift);
    dispatch({ type: "shift/updated", payload: newShift });
  }, []);

  // FIXED: Memoize value properly with only primitive values and stable functions
  const value = useMemo(
    () => ({
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
    }),
    [
      // Only include primitive values that actually change
      users,
      filteredUsers,
      totalPages,
      isLoading,
      error,
      userID,
      shift,
      currentPage,
      isFiltered,
      // Functions are stable now with empty deps
      fetchUsers,
      handleAddUser,
      handleFilterUser,
      handlePageChange,
      updateShift,
      handleResetFilters,
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
