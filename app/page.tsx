"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Building2,
  FileText,
  Users,
  Loader2,
  LogOut,
} from "lucide-react";

interface Student {
  uid: string;
  name: string;
  phone: string;
  sc_email: string;
  status: string;
}

export default function PlacementDashboard() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [jd, setJd] = useState("");
  

  const scEmails = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((student) => {
      if (student.sc_email) {
        counts[student.sc_email] = (counts[student.sc_email] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([scEmail, scCount]) => ({
      scEmail,
      scCount,
    }));
  }, [students]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  

 

 

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-blue-600" />
              <h2 className="text-lg font-bold text-black">Company Details</h2>
            </div>

            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter Sheet Name (e.g. Google_2024)"
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-black focus:ring-2 focus:ring-blue-600 outline-hidden"
            />

          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-green-600" />
              <h2 className="text-lg font-bold text-black">Job Description</h2>
            </div>

            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={6}
              placeholder="Paste the job description details here..."
              className="w-full border border-gray-300 p-3 rounded-lg text-black focus:ring-2 focus:ring-green-600 outline-hidden"
            />
          </div>
        </div>

        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Email Distribution
            </h3>
          </div>

          
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-black">Student List</h2>
            {preparingLinks && (
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <Loader2 className="animate-spin" size={16} />
                Generating Hashes...
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            {students.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr className="bg-white">
                    <th className="px-6 py-4 text-black font-bold">UID</th>
                    <th className="px-6 py-4 text-black font-bold">Name</th>
                    <th className="px-6 py-4 text-black font-bold">SC Email</th>
                    <th className="px-6 py-4 text-black font-bold">Status</th>
                    <th className="px-6 py-4 text-black font-bold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                
              </table>
            ) : (
              <div className="p-20 text-center">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">
                  No students found. Please enter a company name and load the
                  list.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
