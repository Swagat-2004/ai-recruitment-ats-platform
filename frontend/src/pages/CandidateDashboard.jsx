import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

function CandidateDashboard() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applyingJobId, setApplyingJobId] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            setError("");

            // Get available jobs
            const jobsResponse = await fetch(
                `${API_BASE_URL}/jobs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!jobsResponse.ok) {
                throw new Error(
                    "Failed to load jobs"
                );
            }

            const jobsData =
                await jobsResponse.json();

            // Get candidate applications
            const applicationsResponse = await fetch(
                `${API_BASE_URL}/applications/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!applicationsResponse.ok) {
                throw new Error(
                    "Failed to load applications"
                );
            }

            const applicationsData =
                await applicationsResponse.json();

            setJobs(jobsData);
            setApplications(applicationsData);

        } catch (error) {

            console.error(
                "Candidate dashboard error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };

    const hasApplied = (jobId) => {

        return applications.some(
            (application) =>
                application.jobId === jobId
        );
    };

    const getApplicationForJob = (jobId) => {

        return applications.find(
            (application) =>
                application.jobId === jobId
        );
    };

    const applyForJob = async (jobId) => {

        if (hasApplied(jobId)) {

            alert(
                "You have already applied for this job"
            );

            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setApplyingJobId(jobId);

        try {

            const response = await fetch(
                `${API_BASE_URL}/applications?jobId=${jobId}`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const responseText =
                await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Failed to apply for job"
                );
            }

            alert(
                "Application submitted successfully!"
            );

            await loadDashboard();

        } catch (error) {

            console.error(
                "Application error:",
                error
            );

            alert(error.message);

        } finally {

            setApplyingJobId(null);
        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    // Dashboard statistics

    const totalJobs = jobs.length;

    const totalApplications =
        applications.length;

    const shortlistedApplications =
        applications.filter(
            (application) =>
                application.status === "SHORTLISTED"
        ).length;

    const rejectedApplications =
        applications.filter(
            (application) =>
                application.status === "REJECTED"
        ).length;

    const pendingApplications =
        applications.filter(
            (application) =>
                application.status === "APPLIED"
        ).length;

    if (loading) {

        return (
            <div>
                <h2>
                    Loading candidate dashboard...
                </h2>
            </div>
        );
    }

    return (
        <div>

            {/* ================= HEADER ================= */}

            <header>

                <h1>
                    Candidate Dashboard
                </h1>

                <button onClick={logout}>
                    Logout
                </button>

            </header>

            <hr />

            {/* ================= ERROR ================= */}

            {error && (

                <div>

                    <p>
                        {error}
                    </p>

                    <button onClick={loadDashboard}>
                        Try Again
                    </button>

                </div>
            )}

            {/* ================= OVERVIEW ================= */}

            <section>

                <h2>
                    Application Overview
                </h2>

                <div>

                    <div>
                        <h3>
                            {totalJobs}
                        </h3>

                        <p>
                            Available Jobs
                        </p>
                    </div>

                    <div>
                        <h3>
                            {totalApplications}
                        </h3>

                        <p>
                            Applications
                        </p>
                    </div>

                    <div>
                        <h3>
                            {pendingApplications}
                        </h3>

                        <p>
                            Pending
                        </p>
                    </div>

                    <div>
                        <h3>
                            {shortlistedApplications}
                        </h3>

                        <p>
                            Shortlisted
                        </p>
                    </div>

                    <div>
                        <h3>
                            {rejectedApplications}
                        </h3>

                        <p>
                            Rejected
                        </p>
                    </div>

                </div>

            </section>

            <hr />

            {/* ================= AVAILABLE JOBS ================= */}

            <section>

                <h2>
                    Available Jobs
                </h2>

                {jobs.length === 0 ? (

                    <p>
                        No jobs available.
                    </p>

                ) : (

                    jobs.map((job) => {

                        const applied =
                            hasApplied(job.id);

                        const applying =
                            applyingJobId === job.id;

                        const application =
                            getApplicationForJob(
                                job.id
                            );

                        return (

                            <div key={job.id}>

                                <h3>
                                    {job.title}
                                </h3>

                                <p>
                                    {job.description}
                                </p>

                                <p>
                                    Location:{" "}
                                    {job.location}
                                </p>

                                <p>
                                    Employment Type:{" "}
                                    {job.employmentType}
                                </p>

                                <p>
                                    Salary:{" "}
                                    {job.salary} LPA
                                </p>

                                <p>
                                    Job ID:{" "}
                                    {job.id}
                                </p>

                                {applied && application && (

                                    <p>
                                        Application Status:{" "}
                                        <strong>
                                            {
                                                application
                                                    .status
                                            }
                                        </strong>
                                    </p>

                                )}

                                <button
                                    onClick={() =>
                                        applyForJob(
                                            job.id
                                        )
                                    }
                                    disabled={
                                        applied ||
                                        applying
                                    }
                                >

                                    {applied
                                        ? "✓ Applied"
                                        : applying
                                            ? "Applying..."
                                            : "Apply"}

                                </button>

                            </div>
                        );
                    })

                )}

            </section>

            <hr />

            {/* ================= MY APPLICATIONS ================= */}

            <section>

                <h2>
                    My Applications
                </h2>

                {applications.length === 0 ? (

                    <p>
                        You haven't applied to any jobs yet.
                    </p>

                ) : (

                    applications.map(
                        (application) => (

                            <div
                                key={
                                    application.id
                                }
                            >

                                <h3>
                                    {
                                        application
                                            .jobTitle
                                    }
                                </h3>

                                <p>
                                    Job ID:{" "}
                                    {
                                        application.jobId
                                    }
                                </p>

                                <p>
                                    Application ID:{" "}
                                    {
                                        application.id
                                    }
                                </p>

                                <p>
                                    Candidate:{" "}
                                    {
                                        application
                                            .candidateName
                                    }
                                </p>

                                <p>
                                    Email:{" "}
                                    {
                                        application
                                            .candidateEmail
                                    }
                                </p>

                                <strong>
                                    Status:{" "}
                                    {
                                        application.status
                                    }
                                </strong>

                            </div>

                        )
                    )

                )}

            </section>

        </div>
    );
}

export default CandidateDashboard;