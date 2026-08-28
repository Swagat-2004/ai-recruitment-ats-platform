import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

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

    const getToken = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return null;
        }

        return token;
    };

    const loadDashboard = async () => {

        const token = getToken();

        if (!token) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            console.log(
                "API Base URL:",
                API_BASE_URL
            );

            // =========================
            // LOAD MY JOBS
            // =========================

            const jobsResponse = await fetch(
                `${API_BASE_URL}/jobs/my`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Jobs response:",
                jobsResponse.status
            );

            if (jobsResponse.status === 401 ||
                jobsResponse.status === 403) {

                throw new Error(
                    `Unable to access recruiter jobs (${jobsResponse.status})`
                );
            }

            if (!jobsResponse.ok) {

                throw new Error(
                    "Failed to load your jobs"
                );
            }

            const jobsData =
                await jobsResponse.json();

            // =========================
            // LOAD MY APPLICATIONS
            // =========================

            const applicationsResponse =
                await fetch(
                    `${API_BASE_URL}/applications/recruiter`,
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            console.log(
                "Applications response:",
                applicationsResponse.status
            );

            if (
                applicationsResponse.status === 401 ||
                applicationsResponse.status === 403
            ) {

                throw new Error(
                    `Unable to access recruiter applications (${applicationsResponse.status})`
                );
            }

            if (!applicationsResponse.ok) {

                throw new Error(
                    "Failed to load applications"
                );
            }

            const applicationsData =
                await applicationsResponse.json();

            console.log(
                "My jobs:",
                jobsData
            );

            console.log(
                "My applications:",
                applicationsData
            );

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

    // =========================
    // CREATE JOB
    // =========================

    const createJob = async (e) => {

        e.preventDefault();

        const token = getToken();

        if (!token) {
            return;
        }

        try {

            setCreatingJob(true);

            const response = await fetch(
                `${API_BASE_URL}/jobs`,
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
                        employmentType:
                            jobEmploymentType,
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

            setJobTitle("");
            setJobDescription("");
            setJobLocation("");
            setJobEmploymentType("FULL_TIME");
            setJobSalary("");

            alert(
                "Job created successfully!"
            );

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

    // =========================
    // UPDATE APPLICATION STATUS
    // =========================

    const updateApplicationStatus = async (
        applicationId,
        status
    ) => {

        const token = getToken();

        if (!token) {
            return;
        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/applications/${applicationId}/status?status=${status}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
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
                            application.id ===
                            applicationId
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

    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    // =========================
    // STATISTICS
    // =========================

    const totalJobs =
        jobs.length;

    const totalApplicants =
        applications.length;

    const shortlistedApplicants =
        applications.filter(
            (application) =>
                application.status ===
                "SHORTLISTED"
        ).length;

    const rejectedApplicants =
        applications.filter(
            (application) =>
                application.status ===
                "REJECTED"
        ).length;

    const pendingApplicants =
        applications.filter(
            (application) =>
                application.status ===
                "APPLIED"
        ).length;

    // =========================
    // LOADING
    // =========================

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

            {/* HEADER */}

            <header>

                <h1>
                    Recruiter Dashboard
                </h1>

                <button onClick={logout}>
                    Logout
                </button>

            </header>

            <hr />

            {/* ERROR */}

            {error && (

                <div>

                    <h3>
                        Dashboard Error
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={loadDashboard}
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* DASHBOARD OVERVIEW */}

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

            {/* CREATE JOB */}

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

            {/* MY JOBS */}

            <section>

                <h2>
                    My Jobs
                </h2>

                {jobs.length === 0 ? (

                    <p>
                        You haven't created any
                        jobs yet.
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

            {/* APPLICANTS */}

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