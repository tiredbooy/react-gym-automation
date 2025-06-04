import { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";

const SubscriptionDataContext = createContext();

const initialState = {
  users: [], // List of all users
  filteredUsers: [], // Filtered users based on search
  currentPage : 1,
  totalPages: null, // Total pages for pagination
  isLoading: false, // Loading state for async operations
  error: "", // Error messages
  userID: null, // Selected user ID
  shift: localStorage.getItem("shift") || "1", // Shift (M/F filter)
};

function reducer(state, action) {
  switch (action.type) {
    case "startOperation":
      return { ...state, isLoading: true, error: "" };
    case "users/loaded":
      return {
        ...state,
        users: action.payload.users,
        filteredUsers: action.payload.users, // Reset filtered users
        totalPages: action.payload.totalPages,
        isLoading: false,
      };
    case "users/filtered":
      return { ...state, filteredUsers: action.payload.processedUsers, totalPages : action.payload.totalPages , isLoading: false };
    case "user/added":
      return { ...state, userID: action.payload, isLoading: false };
    case "shift/updated":
      return { ...state, shift: action.payload };
    case "filters/reset" : 
      return { ...state , filteredUsers : state.users , totalPages : state.totalPages, isLoading : false }
    case "error":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

function SubscriptionDataProvider({ children }) {
  const [
    { users, filteredUsers, totalPages, isLoading, error, userID, shift , currentPage },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Fetch all users
  async function fetchUsers(page = 1) {
    try {
      dispatch({ type: "startOperation" });
      const queryParams = new URLSearchParams({
        action: "person",
        order_by: "latest",
        gender: shift === "1" ? "M" : "F",
        page,
        limit: "24",
      });

      const response = await fetch(
        `http://localhost:8000/api/dynamic/?${queryParams.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      const sortedData = data.items?.sort(
        (a, b) => new Date(b.creation_datetime) - new Date(a.creation_datetime)
      );

      const processedUsers = sortedData.map((user) => ({
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

      dispatch({
        type: "users/loaded",
        payload: { users: processedUsers, totalPages: data.total_pages },
      });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      toast.error("Failed to fetch users. Please try again later.");
    }
  }

  // Add a new user
  async function handleAddUser(formData) {
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
      shift,
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
      await fetchUsers(); // Refresh user list
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      toast.error("هنگام ثبت کاربر خطایی رخ داد");
    }
  }

  // Filter users
  async function handleFilterUser(nameQuery, idQuery) {
    if (!nameQuery && !idQuery) {
      // Reset to all users if inputs are empty
      dispatch({ type: "users/filtered", payload: users });
      return;
    }

    try {
      dispatch({ type: "startOperation" });
      let url = `http://localhost:8000/api/dynamic/?action=person&gender=${
        shift === "1" ? "M" : "F"
      }&page=${currentPage}&limit=24`;
      if (idQuery) url += `&id=${encodeURIComponent(idQuery)}`;
      if (nameQuery) url += `&full_name=${encodeURIComponent(nameQuery)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to filter users");

      const data = await response.json();
      const processedUsers = data.items.map((user) => ({
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

      dispatch({ type: "users/filtered", payload: {
        processedUsers,
        totalPages : data.total_pages,
      } });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      toast.error("Failed to filter users. Please try again.");
    }
  }

  function handleResetFilters() {
    dispatch({ type : 'filters/reset' })
  }

  // Update shift and sync with localStorage
  function updateShift(newShift) {
    localStorage.setItem("shift", newShift);
    dispatch({ type: "shift/updated", payload: newShift });
  }

  return (
    <SubscriptionDataContext.Provider
      value={{
        users,
        filteredUsers,
        totalPages,
        isLoading,
        error,
        userID,
        shift,
        fetchUsers,
        handleAddUser,
        handleFilterUser,
        updateShift,
        handleResetFilters
      }}
    >
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
