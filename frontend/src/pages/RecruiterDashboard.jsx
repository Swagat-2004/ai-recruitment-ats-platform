import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecruiterDashboard() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Create job form
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobLocation, setJobLocation] = useState("");
    const [jobEmploymentType, setJobEmploymentType] =
        useState("FULL_TIME");
    const [jobSalary, setJobSalary] = useState("");
    const [creatingJob, setCreatingJob] = useState(false);

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
                throw new Error(
                    "Failed to load your jobs"
                );
            }

            const jobsData =
                await jobsResponse.json();

            // Load recruiter's applications
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

    // Create Job
    const createJob = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            setCreatingJob(true);

            const response = await fetch(
                "http://localhost:8080/jobs",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title: jobTitle,
                        description: jobDescription,
                        location: jobLocation,
                        employmentType: jobEmploymentType,
                        salary: Number(jobSalary)
                    })
                }
            );

            const responseText =
                await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Failed to create job"
                );
            }

            const createdJob =
                JSON.parse(responseText);

            setJobs((currentJobs) => [
                ...currentJobs,
                createdJob
            ]);

            // Reset form
            setJobTitle("");
            setJobDescription("");
            setJobLocation("");
            setJobEmploymentType("FULL_TIME");
            setJobSalary("");

            alert("Job created successfully!");

        } catch (error) {

            console.error(
                "Create job error:",
                error
            );

            alert(error.message);

        } finally {

            setCreatingJob(false);

        }
    };

    // Update application status
    const updateApplicationStatus = async (
        applicationId,
        status
    ) => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

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

            const responseText =
                await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Failed to update application"
                );
            }

            const updatedApplication =
                JSON.parse(responseText);

            setApplications(
                (currentApplications) =>
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

    // Dashboard statistics
    const totalJobs = jobs.length;

    const totalApplicants =
        applications.length;

    const shortlistedApplicants =
        applications.filter(
            (application) =>
                application.status === "SHORTLISTED"
        ).length;

    const rejectedApplicants =
        applications.filter(
            (application) =>
                application.status === "REJECTED"
        ).length;

    const pendingApplicants =
        applications.filter(
            (application) =>
                application.status === "APPLIED"
        ).length;

    if (loading) {

        return (
            <div>
                <h2>
                    Loading recruiter dashboard...
                </h2>
            </div>
        );
    }

    return (
        <div>

            {/* ================= HEADER ================= */}

            <header>

                <h1>
                    Recruiter Dashboard
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

            {/* ================= DASHBOARD OVERVIEW ================= */}

            <section>

                <h2>
                    Dashboard Overview
                </h2>

                <div>

                    <div>
                        <h3>
                            {totalJobs}
                        </h3>

                        <p>
                            Total Jobs
                        </p>
                    </div>

                    <div>
                        <h3>
                            {totalApplicants}
                        </h3>

                        <p>
                            Total Applicants
                        </p>
                    </div>

                    <div>
                        <h3>
                            {pendingApplicants}
                        </h3>

                        <p>
                            Pending
                        </p>
                    </div>

                    <div>
                        <h3>
                            {shortlistedApplicants}
                        </h3>

                        <p>
                            Shortlisted
                        </p>
                    </div>

                    <div>
                        <h3>
                            {rejectedApplicants}
                        </h3>

                        <p>
                            Rejected
                        </p>
                    </div>

                </div>

            </section>

            <hr />

            {/* ================= CREATE JOB ================= */}

            <section>

                <h2>
                    Create New Job
                </h2>

                <form onSubmit={createJob}>

                    <div>

                        <label>
                            Job Title
                        </label>

                        <br />

                        <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) =>
                                setJobTitle(
                                    e.target.value
                                )
                            }
                            placeholder="e.g. Java Backend Developer"
                            required
                        />

                    </div>

                    <br />

                    <div>

                        <label>
                            Description
                        </label>

                        <br />

                        <textarea
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Describe the job..."
                            rows="4"
                            required
                        />

                    </div>

                    <br />

                    <div>

                        <label>
                            Location
                        </label>

                        <br />

                        <input
                            type="text"
                            value={jobLocation}
                            onChange={(e) =>
                                setJobLocation(
                                    e.target.value
                                )
                            }
                            placeholder="e.g. Bengaluru"
                            required
                        />

                    </div>

                    <br />

                    <div>

                        <label>
                            Employment Type
                        </label>

                        <br />

                        <select
                            value={jobEmploymentType}
                            onChange={(e) =>
                                setJobEmploymentType(
                                    e.target.value
                                )
                            }
                        >

                            <option value="FULL_TIME">
                                FULL_TIME
                            </option>

                            <option value="PART_TIME">
                                PART_TIME
                            </option>

                            <option value="CONTRACT">
                                CONTRACT
                            </option>

                            <option value="INTERNSHIP">
                                INTERNSHIP
                            </option>

                        </select>

                    </div>

                    <br />

                    <div>

                        <label>
                            Salary (LPA)
                        </label>

                        <br />

                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={jobSalary}
                            onChange={(e) =>
                                setJobSalary(
                                    e.target.value
                                )
                            }
                            placeholder="e.g. 7.5"
                            required
                        />

                    </div>

                    <br />

                    <button
                        type="submit"
                        disabled={creatingJob}
                    >
                        {creatingJob
                            ? "Creating..."
                            : "Create Job"}
                    </button>

                </form>

            </section>

            <hr />

            {/* ================= MY JOBS ================= */}

            <section>

                <h2>
                    My Jobs
                </h2>

                {jobs.length === 0 ? (

                    <p>
                        You haven't created any jobs yet.
                    </p>

                ) : (

                    jobs.map((job) => (

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

                        </div>

                    ))
                )}

            </section>

            <hr />

            {/* ================= APPLICANTS ================= */}

            <section>

                <h2>
                    Applicants
                </h2>

                {applications.length === 0 ? (

                    <p>
                        No applications received yet.
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
                                            .candidateName
                                    }
                                </h3>

                                <p>
                                    Email:{" "}
                                    {
                                        application
                                            .candidateEmail
                                    }
                                </p>

                                <p>
                                    Job:{" "}
                                    {
                                        application
                                            .jobTitle
                                    }
                                </p>

                                <p>
                                    Application ID:{" "}
                                    {
                                        application.id
                                    }
                                </p>

                                <strong>
                                    Status:{" "}
                                    {
                                        application.status
                                    }
                                </strong>

                                <br />
                                <br />

                                {/* Shortlist */}

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

                                {" "}

                                {/* Reject */}

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

                        )
                    )

                )}

            </section>

        </div>
    );
}

export default RecruiterDashboard;