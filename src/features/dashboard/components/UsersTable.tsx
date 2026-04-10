import { type UserRecord } from "@/features/users/types";

type UsersTableProps = {
  users: UserRecord[];
  isLoadingUsers: boolean;
  title: string;
  emptyMessage: string;
};//

export default function UsersTable({
  users,
  isLoadingUsers,
  title,
  emptyMessage,
}: UsersTableProps) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 font-semibold">{title}</div>
      <table className="w-full text-left">
        <thead className="text-xs uppercase text-gray-500 bg-white/5">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone</th>
            <th className="p-4">User Type</th>
            <th className="p-4">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {isLoadingUsers ? (
            <tr>
              <td className="p-4 text-gray-400" colSpan={5}>
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td className="p-4 text-gray-400" colSpan={5}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-300">{user.email}</td>
                <td className="p-4 text-gray-300">{user.phone}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                    {user.userType}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">
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
