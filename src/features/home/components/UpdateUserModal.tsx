"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import UserSignupForm from "@/features/auth/components/UserSignupForm";

import type { UserType, UserRecord } from "@/features/users/types";

type UpdateUserModalProps = {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  showTrigger?: boolean;
  userTypeOptions?: UserType[];
  onUpdated?: (user: UserRecord) => void;
  userToEdit?: UserRecord | null;
};

export default function UpdateUserModal({
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
  showTrigger = true,
  userTypeOptions,
  onUpdated,
  userToEdit,
}: UpdateUserModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof externalIsOpen === "boolean" && typeof externalSetIsOpen === "function";
  const isOpen = isControlled ? externalIsOpen! : internalOpen;
  const setIsOpen = isControlled ? externalSetIsOpen! : setInternalOpen;

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  const modalContent = (
     <div
className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl md:p-8">
           <button
          onClick={() => setIsOpen(false)}
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
        >
   <X size={18} />
</button>
        
<div className="mb-4">
 <h2 className="text-xl font-bold text-white">Update User</h2>
<p className="text-sm text-gray-400">Modify details for {userToEdit?.name}</p>
        </div>

        <UserSignupForm
          userTypeOptions={userTypeOptions}
          apiPath={`/api/users/${userToEdit?.id}`}
          userToEdit={userToEdit}
          method="PATCH"
          onUpdated={(updatedUser) => {
            onUpdated?.(updatedUser as UserRecord);
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
  return (
    <>
      {showTrigger ? (
        <button
          onClick={() => setIsOpen(true)}
          className=" bg-emerald-500 text-black px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-400 transition-all active:scale-95"
        >
          Update User
        </button>
      ) : null}

      {isOpen && userToEdit && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
