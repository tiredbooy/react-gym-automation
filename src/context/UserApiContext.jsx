import { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";

const SubscriptionDataContext = createContext();

const initialState = {
  user: {},
  isLoading: false,
  error: "",
  userID: null,
};

const BASE_URL = "http://localhost:8000/api/dynamic/?action=person";

function reducer(state, action) {
  switch (action.type) {
    case "user/added":
      return { ...state, userID: action.payload };
    case "startOpration":
      break;
    case "addUser":
      break;
    case "editUser":
      break;
    case "renewalSub":
      break;
    case "users/loaded":
      break;
    case "error":
      break;
  }
}

function SubscriptionDataProvider({ children }) {
  const [{ user, isLoading, error, userID }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function handleAddUser(formData) {
    const userData = {
      first_name: formData?.first_name,
      last_name: formData?.last_name,
      full_name: `${formData?.first_name} ${formData?.last_name}`,
      gender: formData.gender,
      national_code: formData.national_code,
      nidentify : '',
      birth_date: formData.birth_date,
      mobile: formData.mobile,
      has_insurance: formData.has_insurance,
      insurance_no: formData.insurance_no,
      ins_start_date: formData.ins_start_date,
      ins_end_date: formData.ins_end_date,
      shift: 1,
    };

    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok && response.status === 200) return;

      const data = await response.json();

      console.log("Data:", data);

      dispatch({ type: "user/added", payload: userData.person_id });
      toast.success("کاربر با موفقیت ثبت شد");
    } catch (e) {
      toast.error(" هنگام ثبت کاربر خطایی رخ داد");
    } finally {
    }
  }

  // function handleSubscriptionPost(data , id) {
  //   const membershipData = {
  //       member_id: 15,
  //       card_no: "555555555",
  //       person: 200,
  //       role_id: 1,
  //       user: 20,
  //       shift: 3,
  //       is_black_list: false,
  //       box_radif_no: "B555",
  //       has_finger: true,
  //       membership_datetime: "2025-05-01T00:00:00Z",
  //       modifier: "admin",
  //       modification_datetime: "2025-05-21T10:00:00Z",
  //       is_family: false,
  //       max_debit: "1500.00",
  //       minutiae: null,
  //       minutiae2: null,
  //       minutiae3: null,
  //       salary: "6000.00",
  //       face_template_1: null,
  //       face_template_2: null,
  //       face_template_3: null,
  //       face_template_4: null,
  //       face_template_5: null
  //    }
  // }

  function handleEditUser(formData) {}

  function handleRenewalSub(formData) {}

  return (
    <SubscriptionDataContext.Provider
      value={{
        user,
        isLoading,
        error,
        userID,
        handleAddUser,
        handleEditUser,
        handleRenewalSub,
      }}
    >
      {children}
    </SubscriptionDataContext.Provider>
  );
}

function useUser() {
  const context = useContext(SubscriptionDataContext);
  if (context === undefined) throw new Error("unknown provider");
  return context;
}

export { SubscriptionDataProvider, useUser };
