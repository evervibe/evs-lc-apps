import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redeem Codes - Admin",
};

export default function RedeemPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Redeem Code Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Generate Code
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Generate New Code</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Code Type</label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option>Cash Reward</option>
              <option>Item Pack</option>
              <option>Premium Days</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input type="number" className="w-full px-3 py-2 border rounded-md" defaultValue="1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Expiry Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Uses</label>
            <input type="number" className="w-full px-3 py-2 border rounded-md" defaultValue="100" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-mono">WELCOME2024</td>
              <td className="px-6 py-4 whitespace-nowrap">Cash Reward</td>
              <td className="px-6 py-4 whitespace-nowrap">45/100</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                <button className="text-red-600 hover:text-red-900">Disable</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
