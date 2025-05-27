import { createContext, useReducer } from "react";

const SubscriptionDataContext = createContext()

const initialState = {
    user : {},
    isLoading : false,
    error : '',
}

function reducer (state , action) [

]

function SubscriptionDataProvider({children}) {

    const {user, isLoading , error} = useReducer(reducer , initialState)

    function handleAddUser(){}

    function handleEditUser() {}

    function handleRenewalSub()  {}

    return <SubscriptionDataContext.Provider value={{
        user , 
        isLoading , 
        error,
        onAddUser,
        oneEditUser,
        onRenewal
    }}>
        {children}
    </SubscriptionDataContext.Provider>
}