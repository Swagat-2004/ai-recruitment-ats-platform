import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecruiterDashboard() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            // Load recruiter's jobs
            const jobsResponse = await fetch(
                "http://localhost:8080/jobs/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!jobsResponse.ok) {
                throw new Error("Failed to load your jobs");
            }

            const jobsData = await jobsResponse.json();

            // Load recruiter's applicants
            const applicationsResponse = await fetch(
                "http://localhost:8080/applications/recruiter",
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
                "Recruiter dashboard error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };

    const updateApplicationStatus = async (
        applicationId,
        status
    ) => {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                `http://localhost:8080/applications/${applicationId}/status?status=${status}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText ||
                    "Failed to update application"
                );
            }

            const updatedApplication =
                JSON.parse(responseText);

            setApplications((currentApplications) =>
                currentApplications.map(
                    (application) =>
                        application.id === applicationId
                            ? updatedApplication
                            : application
                )
            );

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(error.message);
        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    if (loading) {

        return (
            <div>
                <h2>Loading recruiter dashboard...</h2>
            </div>
        );
    }

    return (
        <div>

            <header>

                <h1>Recruiter Dashboard</h1>

                <button onClick={logout}>
                    Logout
                </button>

            </header>

            <hr />

            {error && (
                <div>
                    <p>{error}</p>

                    <button onClick={loadDashboard}>
                        Try Again
                    </button>
                </div>
            )}

            <section>

                <h2>My Jobs</h2>

                {jobs.length === 0 ? (

                    <p>
                        You haven't created any jobs yet.
                    </p>

                ) : (

                    jobs.map((job) => (

                        <div key={job.id}>

                            <h3>{job.title}</h3>

                            <p>
                                {job.description}
                            </p>

                            <p>
                                Location: {job.location}
                            </p>

                            <p>
                                Employment Type:{" "}
                                {job.employmentType}
                            </p>

                            <p>
                                Salary: {job.salary} LPA
                            </p>

                            <p>
                                Job ID: {job.id}
                            </p>

                        </div>

                    ))

                )}

            </section>

            <hr />

            <section>

                <h2>Applicants</h2>

                {applications.length === 0 ? (

                    <p>
                        No applications received yet.
                    </p>

                ) : (

                    applications.map((application) => (

                        <div key={application.id}>

                            <h3>
                                {application.candidateName}
                            </h3>

                            <p>
                                Email:{" "}
                                {application.candidateEmail}
                            </p>

                            <p>
                                Job:{" "}
                                {application.jobTitle}
                            </p>

                            <p>
                                Application ID:{" "}
                                {application.id}
                            </p>

                            <strong>
                                Status:{" "}
                                {application.status}
                            </strong>

                            <div>

                                {application.status !==
                                    "SHORTLISTED" && (

                                    <button
                                        onClick={() =>
                                            updateApplicationStatus(
                                                application.id,
                                                "SHORTLISTED"
                                            )
                                        }
                                    >
                                        Shortlist
                                    </button>

                                )}

                                {application.status !==
                                    "REJECTED" && (

                                    <button
                                        onClick={() =>
                                            updateApplicationStatus(
                                                application.id,
                                                "REJECTED"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                )}

                            </div>

                        </div>

                    ))

                )}

            </section>

        </div>
    );
}

export default RecruiterDashboard;