import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickets - Admin",
};

export default function TicketsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>

      <div className="mb-6 flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          All
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Open
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Pending
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Closed
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">#123</td>
              <td className="px-6 py-4">Cannot login to game</td>
              <td className="px-6 py-4 whitespace-nowrap">player123</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Open
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">2024-01-15</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="text-blue-600 hover:text-blue-900">View</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">#122</td>
              <td className="px-6 py-4">Missing items from purchase</td>
              <td className="px-6 py-4 whitespace-nowrap">warrior99</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Pending
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">2024-01-15</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="text-blue-600 hover:text-blue-900">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
