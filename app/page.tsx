"use client"
import WebApp from '@twa-dev/sdk';
WebApp.ready();
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";



interface UserData{
  id:number;
  firstName?:string;
  lastName?:string;
  username?:string;
  photo_url?:string;
}

const Home = () => {
  const [open, setOpen] = useState(false);
  const [usertData,setUserData]=useState<UserData | null>(null);
  useEffect(() => {
    // Check if WebApp SDK is available and only use it on the client side
    if ( WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Navigation */}
    
      <nav className="px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-indigo-600">TelegramBot</div>
      </nav>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Test Telegram Mini App
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create something amazing with our powerful platform designed to bring your ideas to life.
          </p>
          <button
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium 
                        hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
            onClick={() => setOpen(!open)}
          >
            User data
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Custom Modal Dialog */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-semibold text-gray-900">User Data</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Telegram User Data
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    View and manage your Telegram user information: {usertData ? usertData.id : "No user data"}
                  </p>

                  {/* Dynamic User Data Section */}
                  {usertData ? (
                    <div className="space-y-4 text-left">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900">User Information</h3>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="text-gray-900">{usertData.username || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">User ID</p>
                            <p className="text-gray-900">{usertData.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No user data available.</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                            rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center text-gray-600">
            © 2025 Brand. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
