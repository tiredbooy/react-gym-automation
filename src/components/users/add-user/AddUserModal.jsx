import { easeIn, easeInOut, motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import AddUserForm from "./AddUserForm";
import UserProfilePicture from "./UserProfilePicture";

function AddUserModal() {
  return (
    <>
      {/* Background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }} // darker overlay
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black"
        style={{ backdropFilter: "blur(12px)" }} // optional: slight blur for smoothness
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="bg-offWhite my-8 p-8 overflow-auto rounded-2xl shadow-2xl w-full max-w-7xl mx-auto fixed inset-0 m-auto z-50"
      >
        <motion.header
          initial={{ x: 800 }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="border-b pb-4 flex flex-row gap-1 items-center justify-center"
        >
          <UserPlus className="text-darkBlue" />
          <h1 className="font-bold text-darkBlue text-3xl">افزودن کاربر</h1>
        </motion.header>

        <div className="flex flex-row gap-3 mt-5 ">
          <AddUserForm />
          {/* <div className="bg-red-500 w-1/5">w</div> */}
          <UserProfilePicture />
        </div>
      </motion.div>
    </>
  );
}
export default AddUserModal;
