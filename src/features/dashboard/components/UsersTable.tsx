import { type UserRecord } from "@/features/users/types";

type UsersTableProps = {
  users: UserRecord[];
  isLoadingUsers: boolean;
  title: string;
  emptyMessage: string;
};

export default function UsersTable({
  users,
  isLoadingUsers,
  title,
  emptyMessage,
}: UsersTableProps) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
      <div className="p-4 sm:p-6 border-b border-white/10 font-semibold text-sm sm:text-base">{title}</div>
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-gray-500 bg-white/5">
          <tr>
            <th className="p-2 sm:p-4">Name</th>
            <th className="p-2 sm:p-4 hidden sm:table-cell">Email</th>
            <th className="p-2 sm:p-4 hidden md:table-cell">Phone</th>
            <th className="p-2 sm:p-4">Type</th>
            <th className="p-2 sm:p-4 hidden lg:table-cell">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {isLoadingUsers ? (
            <tr>
              <td className="p-2 sm:p-4 text-gray-400 text-xs sm:text-sm" colSpan={5}>
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td className="p-2 sm:p-4 text-gray-400 text-xs sm:text-sm" colSpan={5}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition border-b border-white/5">
                <td className="p-2 sm:p-4 font-medium text-xs sm:text-sm">{user.name}</td>
                <td className="p-2 sm:p-4 text-gray-300 hidden sm:table-cell text-xs sm:text-sm">{user.email}</td>
                <td className="p-2 sm:p-4 text-gray-300 hidden md:table-cell text-xs">{user.phone}</td>
                <td className="p-2 sm:p-4">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                    {user.userType.toLowerCase()}
                  </span>
                </td>
                <td className="p-2 sm:p-4 text-gray-500 text-xs hidden lg:table-cell">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
