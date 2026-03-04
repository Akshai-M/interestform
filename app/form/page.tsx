'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, Upload } from 'lucide-react';

interface FormContentProps {
  uid: string;
  company: string;
}

export default function FormContent({ uid, company }: FormContentProps) {
  const [studentName, setStudentName] = useState('');
  const [jd, setJd] = useState('');
  const [interest, setInterest] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchStudentDetails();
  }, [uid, company]);

  const fetchStudentDetails = async () => {
    try {
      const res = await fetch(`/api/sheets?sheetName=${company}`);
      const students = await res.json();
      const student = students.find((s: any) => s.uid == uid);
      
      if (student) {
        setStudentName(student.name);
      }
      
      setJd("Job description will be loaded here...");
    } catch (error) {
      console.error("Failed to fetch student details");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!interest) {
      alert('Please select your interest');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveResponse',
          sheetName: company,
          uid,
          name: studentName,
          response: {
            interest,
            resumeUrl
          }
        }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setSubmitted(true);
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      alert('Error submitting response');
    }
    
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h2>
          <p className="text-slate-600 mb-4">Your response has been submitted successfully.</p>
          <p className="text-sm text-slate-500">We'll get back to you soon regarding the {company} opportunity.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold">{company}</h1>
            <p className="text-blue-100 mt-1">Placement Opportunity</p>
          </div>

          <div className="p-6 bg-slate-50 border-b">
            <p className="text-sm text-slate-600">Student Name</p>
            <p className="text-lg font-semibold text-slate-800">{studentName || 'Loading...'}</p>
            <p className="text-xs text-slate-500 mt-1">UID: {uid}</p>
          </div>

          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-slate-800 mb-3">Job Description</h2>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700 whitespace-pre-wrap">{jd}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Your Response</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Are you interested in this opportunity? *
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="radio"
                    name="interest"
                    value="Yes"
                    checked={interest === 'Yes'}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="ml-3 text-slate-800 font-medium">Yes, I'm interested</span>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="radio"
                    name="interest"
                    value="No"
                    checked={interest === 'No'}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="ml-3 text-slate-800 font-medium">No, not interested</span>
                </label>
              </div>
            </div>

            {interest === 'Yes' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Resume URL (Google Drive link)
                </label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !interest}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Response'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}