// UserReportsList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ApiService from "../services/apiServices";
import { toast } from "react-toastify";

function UserReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    urgencyLevel: "",
  });

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.type) queryParams.append("type", filters.type);
      if (filters.urgencyLevel)
        queryParams.append("urgencyLevel", filters.urgencyLevel);

      const response = await ApiService.getUserReports(queryParams.toString());
      setReports(response.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      reviewed: "bg-blue-100 text-blue-800 border-blue-300",
      processing: "bg-purple-100 text-purple-800 border-purple-300",
      resolved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getUrgencyColor = (level) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return colors[level] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6]">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-[#37B7C3] to-[#088395] text-white py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="font-bold text-4xl md:text-5xl mb-4">My Reports</h1>
          <p className="text-lg opacity-90">
            Track and manage all your submitted reports
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#37B7C3]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="processing">Processing</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#37B7C3]"
              >
                <option value="">All Types</option>
                <option value="domestic_violence">Domestic Violence</option>
                <option value="harassment">Harassment</option>
                <option value="discrimination">Discrimination</option>
                <option value="physical_assault">Physical Assault</option>
                <option value="stalking">Stalking</option>
                <option value="other">Other</option>
              </select>

              <select
                value={filters.urgencyLevel}
                onChange={(e) =>
                  setFilters({ ...filters, urgencyLevel: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#37B7C3]"
              >
                <option value="">All Urgency</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* <Link
              to="/create-report"
              className="bg-[#37B7C3] hover:bg-[#088395] text-white px-6 py-2 rounded-full transition-colors duration-200"
            >
              + New Report
            </Link> */}
          </div>
        </div>
      </section>

      {/* Reports List */}
      <section className="max-w-7xl mx-auto px-5 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37B7C3] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reports...</p>
            </div>
          </div>
        ) : reports?.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="font-bold text-2xl mb-2">No Reports Found</h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any reports yet.
            </p>
            <Link
              to="/create-report"
              className="inline-block bg-[#37B7C3] text-white px-8 py-3 rounded-full hover:bg-[#088395] transition-colors"
            >
              Create Your First Report
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-full ${getUrgencyColor(
                              report.urgencyLevel
                            )}`}
                          ></span>
                          <span className="text-sm font-medium text-gray-600">
                            {report.urgencyLevel} urgency
                          </span>
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-2">
                        {report.type
                          .split("_")
                          .map(
                            (word) => word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </h3>
                      {report.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {report.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {report.location && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{report.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* {report.toReportedNgo && (
                      <div className="flex items-center gap-2">
                        <span>🏢</span>
                        <span>
                          Assigned to: {report.toReportedNgo.username}
                        </span>
                      </div>
                    )} */}
                  </div>

                  {report.status === "rejected" && report.reasonForRejection && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        Reason for Rejection:
                      </p>
                      <p className="text-sm text-red-700">
                        {report.reasonForRejection}
                      </p>
                    </div>
                  )}

                  {/* <Link
                    to={`/reports/${report._id}`}
                    className="inline-block bg-[#EBF4F6] text-[#088395] px-6 py-2 rounded-full hover:bg-[#37B7C3] hover:text-white transition-colors duration-200 font-medium"
                  >
                    View Details →
                  </Link> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// NGOReportsList.jsx
function NGOReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    urgencyLevel: "",
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    reasonForRejection: "",
  });

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.type) queryParams.append("type", filters.type);
      if (filters.urgencyLevel)
        queryParams.append("urgencyLevel", filters.urgencyLevel);

      const response = await ApiService.getNgoReports(queryParams.toString());
      console.log("report data",response.data);
      
      setReports(response.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await ApiService.updateReportStatus(selectedReport._id, statusUpdate);
      setShowModal(false);
      fetchReports();
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setStatusUpdate({
      status: report.status,
      reasonForRejection: report.reasonForRejection || "",
    });
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      reviewed: "bg-blue-100 text-blue-800 border-blue-300",
      processing: "bg-purple-100 text-purple-800 border-purple-300",
      resolved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getUrgencyColor = (level) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return colors[level] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6]">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-[#37B7C3] to-[#088395] text-white py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="font-bold text-4xl md:text-5xl mb-4">
            Reports Dashboard
          </h1>
          <p className="text-lg opacity-90">
            Review and manage reported cases
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#37B7C3]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="processing">Processing</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#37B7C3]"
            >
              <option value="">All Types</option>
              <option value="domestic_violence">Domestic Violence</option>
              <option value="harassment">Harassment</option>
              <option value="discrimination">Discrimination</option>
              <option value="physical_assault">Physical Assault</option>
              <option value="stalking">Stalking</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filters.urgencyLevel}
              onChange={(e) =>
                setFilters({ ...filters, urgencyLevel: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#37B7C3]"
            >
              <option value="">All Urgency</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </section>

      {/* Reports List */}
      <section className="max-w-7xl mx-auto px-5 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37B7C3] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reports...</p>
            </div>
          </div>
        ) : reports?.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="font-bold text-2xl mb-2">No Reports Found</h3>
            <p className="text-gray-600">
              No reports match your current filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-full ${getUrgencyColor(
                              report.urgencyLevel
                            )}`}
                          ></span>
                          <span className="text-sm font-medium text-gray-600">
                            {report.urgencyLevel} urgency
                          </span>
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-2">
                        {report.type
                          .split("_")
                          .map(
                            (word) => word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </h3>
                      {report.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {report.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {report.location && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{report.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* {report.reporter && (
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>Reporter: {report.reporter.name}</span>
                      </div>
                    )} */}
                  </div>

                  {report.status === "rejected" && report.reasonForRejection && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        Reason for Rejection:
                      </p>
                      <p className="text-sm text-red-700">
                        {report.reasonForRejection}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => openModal(report)}
                      className="bg-[#37B7C3] text-white px-6 py-2 rounded-full hover:bg-[#088395] transition-colors duration-200 font-medium"
                    >
                      Update Status
                    </button>
                    {/* <Link
                      to={`/ngo/reports/${report._id}`}
                      className="bg-[#EBF4F6] text-[#088395] px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 font-medium"
                    >
                      View Details
                    </Link> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Update Status Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="font-bold text-2xl mb-6 text-gray-800">
              Update Report Status
            </h2>
            <form onSubmit={handleUpdateStatus}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) =>
                    setStatusUpdate({ ...statusUpdate, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#37B7C3]"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="processing">Processing</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {statusUpdate.status === "rejected" && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={statusUpdate.reasonForRejection}
                    onChange={(e) =>
                      setStatusUpdate({
                        ...statusUpdate,
                        reasonForRejection: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#37B7C3] resize-none"
                    rows="4"
                    required
                    placeholder="Please provide a detailed reason..."
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#37B7C3] text-white py-3 rounded-full hover:bg-[#088395] transition-colors font-semibold"
                >
                  Update Status
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { UserReportsList, NGOReportsList };