import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs - Admin",
};

export default function LogsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Filter by Type</label>
          <select className="w-full px-3 py-2 border rounded-md">
            <option>All Types</option>
            <option>User Action</option>
            <option>Admin Action</option>
            <option>System Event</option>
            <option>Security</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">User</label>
          <input type="text" placeholder="Search user..." className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input type="date" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input type="date" className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm">2024-01-15 14:32:15</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Admin Action
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">admin001</td>
              <td className="px-6 py-4">Banned user: spammer123</td>
              <td className="px-6 py-4 whitespace-nowrap">192.168.1.100</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm">2024-01-15 14:30:42</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  User Action
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">player123</td>
              <td className="px-6 py-4">Logged in successfully</td>
              <td className="px-6 py-4 whitespace-nowrap">192.168.1.50</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm">2024-01-15 14:28:11</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  System Event
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">system</td>
              <td className="px-6 py-4">Database backup completed</td>
              <td className="px-6 py-4 whitespace-nowrap">-</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm">2024-01-15 14:25:33</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  Security
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">unknown</td>
              <td className="px-6 py-4">Failed login attempt (5 tries)</td>
              <td className="px-6 py-4 whitespace-nowrap">45.123.45.67</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
