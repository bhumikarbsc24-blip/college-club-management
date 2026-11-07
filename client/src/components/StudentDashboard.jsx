
import { useEffect, useState } from "react";
import API from "../services/api";

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState("clubs");
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const getList = (data, key) => {
        if (Array.isArray(data[key])) return data[key];
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
    };

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const [clubRes, eventRes, announcementRes, membershipRes] =
                    await Promise.all([
                        API.get("/clubs"),
                        API.get("/events"),
                        API.get("/announcements"),
                        API.get("/memberships/my-memberships")
                    ]);

                if (!cancelled) {
                    setClubs(getList(clubRes.data, "clubs"));
                    setEvents(getList(eventRes.data, "events"));
                    setAnnouncements(getList(announcementRes.data, "announcements"));
                    setMemberships(getList(membershipRes.data, "memberships"));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load portal information."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    const refreshMemberships = async () => {
        const response = await API.get("/memberships/my-memberships");
        setMemberships(getList(response.data, "memberships"));
    };

    const joinClub = async (clubId) => {
        setMessage("");
        setError("");

        try {
            const response = await API.post(`/memberships/join/${clubId}`);

            setMessage(response.data.message || "Joining request submitted!");
            await refreshMemberships();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to join this club."
            );
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const getMembership = (clubId) =>
        memberships.find((item) => {
            const id = item.club?._id || item.club;
            return String(id) === String(clubId);
        });

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h2>College Club Portal</h2>
                    <p>RV University</p>
                </div>

                <button onClick={logout} className="logout-button">
                    Logout
                </button>
            </header>

            <main className="dashboard-content">
                <section className="welcome-section">
                    <h1>Welcome, {user.name || "Student"}!</h1>
                    <p>Explore clubs, events and announcements on campus.</p>
                </section>

                <nav className="dashboard-tabs">
                    {["clubs", "events", "announcements", "memberships", "profile"].map((tab) => (
                        <button
                            key={tab}
                            className={activeTab === tab ? "active-tab" : ""}
                            onClick={() => {
                                setActiveTab(tab);
                                setMessage("");
                                setError("");
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                {loading ? (
                    <p className="loading-message">Loading information...</p>
                ) : (
                    <section className="dashboard-section">

                        {activeTab === "clubs" && (
                            <>
                                <h2>Explore College Clubs</h2>
                                <div className="dashboard-grid">
                                    {clubs.length === 0 ? (
                                        <p>No clubs available yet.</p>
                                    ) : clubs.map((club) => {
                                        const membership = getMembership(club._id);

                                        return (
                                            <article className="dashboard-card" key={club._id}>
                                                <h3>{club.name}</h3>
                                                <p>{club.description}</p>
                                                <p><strong>Category:</strong> {club.category}</p>
                                                <p><strong>Faculty Coordinator:</strong> {club.facultyCoordinator}</p>

                                                {membership ? (
                                                    <button disabled>
                                                        {membership.status}
                                                    </button>
                                                ) : (
                                                    <button onClick={() => joinClub(club._id)}>
                                                        Join Club
                                                    </button>
                                                )}
                                            </article>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {activeTab === "events" && (
                            <>
                                <h2>College Events</h2>
                                {events.length === 0 ? (
                                    <p>No events available.</p>
                                ) : events.map((event) => (
                                    <article className="dashboard-card" key={event._id}>
                                        <h3>{event.title}</h3>
                                        <p>{event.description}</p>
                                        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                                        <p><strong>Venue:</strong> {event.venue}</p>
                                        <p><strong>Category:</strong> {event.category}</p>
                                        <p><strong>Status:</strong> {event.status}</p>
                                    </article>
                                ))}
                            </>
                        )}

                        {activeTab === "announcements" && (
                            <>
                                <h2>Latest Announcements</h2>
                                {announcements.length === 0 ? (
                                    <p>No announcements available.</p>
                                ) : announcements.map((item) => (
                                    <article className="dashboard-card" key={item._id}>
                                        <h3>{item.title}</h3>
                                        <p>{item.message}</p>
                                        <p><strong>Category:</strong> {item.category}</p>
                                        <p><strong>Published:</strong> {new Date(item.publishedDate).toLocaleDateString()}</p>
                                    </article>
                                ))}
                            </>
                        )}

                        {activeTab === "memberships" && (
                            <>
                                <h2>My Club Memberships</h2>
                                {memberships.length === 0 ? (
                                    <p>You have not joined any clubs yet.</p>
                                ) : memberships.map((item) => (
                                    <article className="dashboard-card" key={item._id}>
                                        <h3>{item.club?.name || "College Club"}</h3>
                                        <p><strong>Category:</strong> {item.club?.category || "N/A"}</p>
                                        <p><strong>Membership Status:</strong> {item.status}</p>
                                    </article>
                                ))}
                            </>
                        )}

                        {activeTab === "profile" && (
                            <>
                                <h2>My Profile</h2>
                                <article className="dashboard-card profile-card">
                                    <p><strong>Name:</strong> {user.name || "N/A"}</p>
                                    <p><strong>Email:</strong> {user.email || "N/A"}</p>
                                    <p><strong>USN:</strong> {user.usn || "N/A"}</p>
                                    <p><strong>Department:</strong> {user.department || "N/A"}</p>
                                    <p><strong>Role:</strong> Student</p>
                                </article>
                            </>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
