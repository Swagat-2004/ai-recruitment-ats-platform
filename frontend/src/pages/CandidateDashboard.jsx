import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CandidateDashboard() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        const token = localStorage.getItem("token");

        try {

            const jobsResponse = await fetch(
                "http://localhost:8080/jobs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const jobsData = await jobsResponse.json();

            const applicationsResponse = await fetch(
                "http://localhost:8080/applications/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const applicationsData =
                await applicationsResponse.json();

            setJobs(jobsData);
            setApplications(applicationsData);

        } catch (error) {

            console.error("Dashboard error:", error);

        } finally {

            setLoading(false);

        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    if (loading) {
        return <h2>Loading dashboard...</h2>;
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

                    jobs.map((job) => (

                        <div key={job.id}>

                            <h3>{job.title}</h3>

                            <p>{job.description}</p>

                            <p>
                                Location: {job.location}
                            </p>

                            <p>
                                Employment Type: {job.employmentType}
                            </p>

                            <p>
                                Salary: {job.salary} LPA
                            </p>

                        </div>

                    ))

                )}

            </section>

            <hr />

            <section>

                <h2>My Applications</h2>

                {applications.length === 0 ? (
                    <p>You haven't applied to any jobs yet.</p>
                ) : (

                    applications.map((application) => (

                        <div key={application.id}>

                            <p>
                                Application ID: {application.id}
                            </p>

                            <p>
                                Job ID: {application.jobId}
                            </p>

                            <strong>
                                Status: {application.status}
                            </strong>

                        </div>

                    ))

                )}

            </section>

        </div>
    );
}

export default CandidateDashboard;