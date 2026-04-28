import { type UserRecord, type UserType } from "@/features/users/types";
import CommonTablePagination from "@/shared/components/CommonTablePagination";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import UpdateUserModal from "@/features/home/components/UpdateUserModal";

type UsersPaginationProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
};

type UsersTableProps = {
  users: UserRecord[];
  isLoadingUsers: boolean;
  title: string;
  emptyMessage: string;
  userTypeOptions?: UserType[];
  onRefresh?: () => void | Promise<void>;
  onCreateUser?: () => void;
  pagination: UsersPaginationProps;
};

export default function UsersTable({
  users,
  isLoadingUsers,
  title,
  emptyMessage,
  onCreateUser,
  pagination,
  userTypeOptions,
  onRefresh
}: UsersTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [userToEdit, setUserToEdit] = useState<UserRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleEditClick = (user: UserRecord) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleCreateUser = () => {
    onCreateUser?.();
  };

  const handleDelete = async (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (!confirm(`Are you sure want to delete ${userToDelete?.name}?`)) return;
    
    if (isDeleting) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        toast.success('User deleted successfully');
          
        if (onRefresh) {
    onRefresh(); 
  }
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete user');
      }
    } catch {
      toast.error('Error connecting to server');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
       <UpdateUserModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        showTrigger={false}
        userToEdit={userToEdit}
        userTypeOptions={userTypeOptions}
        onUpdated={() => {
          if (onRefresh) onRefresh();
          setIsEditModalOpen(false);
          setUserToEdit(null);
        }}
      />
      <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4 text-sm font-semibold sm:p-6 sm:text-base">
        <span>{title}</span>
        {onCreateUser ? (
          <button
            type="button"
            onClick={handleCreateUser}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold whitespace-nowrap hover:bg-indigo-700 sm:px-4 sm:text-sm"
          >
            Create User
          </button>
        ) : null}
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-gray-500 bg-white/5">
          <tr>
            <th className="p-2 sm:p-4">Name</th>
            <th className="p-2 sm:p-4 hidden sm:table-cell">Email</th>
            <th className="p-2 sm:p-4 hidden md:table-cell">Phone</th>
            <th className="p-2 sm:p-4">Type</th>
            <th className="p-2 sm:p-4 hidden lg:table-cell">Joined</th>
            <th className="p-2 sm:p-4">Edit</th>
            <th className="p-2 sm:p-4">Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {isLoadingUsers ? (
            <tr><td colSpan={7} className="p-4 text-center text-gray-400">Loading users...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={7} className="p-4 text-center text-gray-400">{emptyMessage}</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition border-b border-white/5">
                <td className="p-2 sm:p-4 font-medium">{user.name}</td>
                <td className="p-2 sm:p-4 text-gray-300 hidden sm:table-cell">{user.email}</td>
                <td className="p-2 sm:p-4 text-gray-300 hidden md:table-cell text-xs">{user.phone}</td>
                <td className="p-2 sm:p-4">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                    {user.userType.toLowerCase()}
                  </span>
                </td>
                <td className="p-2 sm:p-4 text-gray-500 text-xs hidden lg:table-cell">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 sm:p-4"><button 
                    onClick={() => handleEditClick(user)}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                   
                </td>
                <td className="p-2 sm:p-4">
                   <button 
                    disabled={isDeleting === user.id}
                    className={`${isDeleting === user.id ? 'opacity-30' : 'text-red-500 hover:text-red-400'}`}
                    onClick={() => handleDelete(user.id)}
                    >
                    <DeleteForeverIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!isLoadingUsers && pagination.count > 0 && (
        <CommonTablePagination
          count={pagination.count}
          page={pagination.page}
          rowsPerPage={pagination.rowsPerPage}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={pagination.onPageChange}
          onRowsPerPageChange={pagination.onRowsPerPageChange}
        />
      )}
    </div>
  );
}