'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'PROPOSED',
    comments: '',
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const res = await fetch('/api/projects' + (editId ? `?id=${editId}` : ''), {
        method: editId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ title: '', description: '', status: 'PROPOSED', comments: '' });
        setEditId(null);
        fetchProjects();
      } else {
        // handle errors if needed
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description || '',
      status: project.status,
      comments: project.comments || '',
    });
    setEditId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to form on edit
  };

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি প্রকল্পটি মুছে ফেলতে চান?')) return;
    setLoading(true);
    try {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-green-800">প্রকল্প ব্যবস্থাপনা</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-w-3xl mx-auto"
      >
        <input
          type="text"
          placeholder="প্রকল্পের নাম *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />

        <textarea
          placeholder="বর্ণনা"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
          rows={3}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="PROPOSED">প্রস্তাবিত</option>
          <option value="ONGOING">চলমান</option>
          <option value="COMPLETE">সম্পন্ন</option>
          <option value="OTHERS">অন্যান্য</option>
        </select>

        <textarea
          placeholder="মন্তব্য"
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
          rows={2}
        />

        <button
          type="submit"
          disabled={formLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            formLoading
              ? 'bg-green-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {formLoading ? (editId ? 'আপডেট হচ্ছে...' : 'যোগ করা হচ্ছে...') : editId ? 'আপডেট করুন' : 'যোগ করুন'}
        </button>
      </form>

      <div className="mt-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">সকল প্রকল্প</h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <svg
              className="animate-spin h-10 w-10 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg text-sm">
              <thead className="bg-green-100 text-green-700">
                <tr>
                  <th className="p-3 border border-green-200 text-left rounded-tl-lg">নাম</th>
                  <th className="p-3 border border-green-200 text-left rounded-tl-lg">বিবরণ</th>
                  <th className="p-3 border border-green-200 text-left">স্ট্যাটাস</th>
                  <th className="p-3 border border-green-200 text-left">মন্তব্য</th>
                  <th className="p-3 border border-green-200 text-left rounded-tr-lg">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      কোনো প্রকল্প পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  projects.map((proj) => (
                    <tr
                      key={proj.id}
                      className="hover:bg-green-50 transition-colors duration-200"
                    >
                      <td className="p-3 border border-green-200">{proj.title}</td>
                      <td className="p-3 border border-green-200">{proj.description}</td>
                      <td className="p-3 border border-green-200">{statusBn(proj.status)}</td>
                      <td className="p-3 border border-green-200 whitespace-pre-wrap max-w-xs">
                        {proj.comments}
                      </td>
                      <td className="p-3 border border-green-200 flex gap-3">
                        <button
                          onClick={() => handleEdit(proj)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Edit project"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete project"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function statusBn(status) {
  switch (status) {
    case 'PROPOSED':
      return 'প্রস্তাবিত';
    case 'ONGOING':
      return 'চলমান';
    case 'COMPLETE':
      return 'সম্পন্ন';
    case 'OTHERS':
      return 'অন্যান্য';
    default:
      return status;
  }
}
