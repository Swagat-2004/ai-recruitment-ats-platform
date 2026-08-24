import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CandidateDashboard() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingJobId, setApplyingJobId] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        const token = localStorage.getItem("token");

        try {
            // Get available jobs
            const jobsResponse = await fetch(
                "http://localhost:8080/jobs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!jobsResponse.ok) {
                throw new Error("Failed to load jobs");
            }

            const jobsData = await jobsResponse.json();

            // Get candidate's applications
            const applicationsResponse = await fetch(
                "http://localhost:8080/applications/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!applicationsResponse.ok) {
                throw new Error("Failed to load applications");
            }

            const applicationsData =
                await applicationsResponse.json();

            setJobs(jobsData);
            setApplications(applicationsData);

        } catch (error) {
            console.error("Dashboard error:", error);

            if (
                error.message === "Failed to load jobs" ||
                error.message === "Failed to load applications"
            ) {
                alert(error.message);
            }

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

    const applyForJob = async (jobId) => {
        // Prevent duplicate request from frontend
        if (hasApplied(jobId)) {
            alert("You have already applied for this job");
            return;
        }

        const token = localStorage.getItem("token");

        setApplyingJobId(jobId);

        try {
            const response = await fetch(
                `http://localhost:8080/applications?jobId=${jobId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                if (response.status === 409) {
                    throw new Error(
                        errorText ||
                        "You have already applied for this job"
                    );
                }

                throw new Error(
                    errorText ||
                    "Failed to apply for job"
                );
            }

            alert("Application submitted successfully!");

            await loadDashboard();

        } catch (error) {
            console.error("Application error:", error);

            alert(error.message);

        } finally {
            setApplyingJobId(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div>
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    return (
        <div>

            <header>
                <h1>Candidate Dashboard</h1>

                <button onClick={logout}>
                    Logout
                </button>
            </header>

            <hr />

            <section>

                <h2>Available Jobs</h2>

                {jobs.length === 0 ? (

                    <p>No jobs available.</p>

                ) : (

                    jobs.map((job) => {

                        const applied = hasApplied(job.id);

                        const applying =
                            applyingJobId === job.id;

                        return (
                            <div key={job.id}>

                                <h3>{job.title}</h3>

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

                                <button
                                    onClick={() =>
                                        applyForJob(job.id)
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

            <section>

                <h2>My Applications</h2>

                {applications.length === 0 ? (

                    <p>
                        You haven't applied to any jobs yet.
                    </p>

                ) : (

                    applications.map((application) => (

                        <div key={application.id}>

                            <p>
                                Application ID:{" "}
                                {application.id}
                            </p>

                            <p>
                                Job ID:{" "}
                                {application.jobId}
                            </p>

                            <strong>
                                Status:{" "}
                                {application.status}
                            </strong>

                        </div>

                    ))

                )}

            </section>

        </div>
    );
}

export default CandidateDashboard;