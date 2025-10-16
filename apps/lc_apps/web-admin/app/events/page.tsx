import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - Admin",
};

export default function EventsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Event Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Winter Festival</h3>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Special winter event with exclusive rewards and boss fights.
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Dec 20 - Jan 10</span>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-900">Edit</button>
              <button className="text-red-600 hover:text-red-900">End</button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Double XP Weekend</h3>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Scheduled
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Get 2x experience points for all activities during the weekend.
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Jan 20 - Jan 22</span>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-900">Edit</button>
              <button className="text-red-600 hover:text-red-900">Cancel</button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">PvP Tournament</h3>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
              Ended
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Monthly PvP tournament with cash prizes for top players.
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Dec 1 - Dec 15</span>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-900">View</button>
              <button className="text-red-600 hover:text-red-900">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
