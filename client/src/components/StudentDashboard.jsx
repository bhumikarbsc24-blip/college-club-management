
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
        if (Array.isArray(data?.[key])) return data[key];
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
    };

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const [
                    clubRes,
                    eventRes,
                    announcementRes,
                    membershipRes
                ] = await Promise.all([
                    API.get("/clubs"),
                    API.get("/events"),
                    API.get("/announcements"),
                    API.get("/memberships/my-memberships")
                ]);

                if (!cancelled) {
                    setClubs(getList(clubRes.data, "clubs"));
                    setEvents(getList(eventRes.data, "events"));
                    setAnnouncements(
                        getList(announcementRes.data, "announcements")
                    );
                    setMemberships(
                        getList(membershipRes.data, "memberships")
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load portal information."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
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
            const response = await API.post(
                `/memberships/join/${clubId}`
            );

            setMessage(
                response.data.message || "Joining request submitted!"
            );

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

    const tabs = [
        { id: "clubs", icon: "👥", label: "Explore Clubs" },
        { id: "events", icon: "📅", label: "College Events" },
        { id: "announcements", icon: "📢", label: "Announcements" },
        { id: "memberships", icon: "🎓", label: "My Memberships" },
        { id: "profile", icon: "👤", label: "My Profile" }
    ];

    return (
        <div className="dashboard student-dashboard">

            <header className="dashboard-header">
                <div className="student-brand">
                    <div className="student-brand-icon">C</div>
                    <div>
                        <h2>CampusConnect</h2>
                        <p>RV University</p>
                    </div>
                </div>

                <div className="student-header-right">
                    <span className="student-user-name">
                        Welcome, {user.name || "Student"}
                    </span>

                    <button onClick={logout} className="logout-button">
                        Logout ↗
                    </button>
                </div>
            </header>

            <div className="student-layout">

                <aside className="student-sidebar">
                    <div className="sidebar-heading">
                        STUDENT MENU
                    </div>

                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`student-nav-item ${
                                activeTab === tab.id
                                    ? "student-nav-active"
                                    : ""
                            }`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setMessage("");
                                setError("");
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}

                    <div className="sidebar-bottom">
                        <div className="sidebar-help-icon">💙</div>
                        <h4>CampusConnect</h4>
                        <p>Your campus, your community.</p>
                    </div>
                </aside>

                <main className="student-main">

                    <section className="student-welcome">
                        <div>
                            <p className="student-eyebrow">
                                STUDENT PORTAL
                            </p>

                            <h1>
                                Hello, {user.name || "Student"}! 👋
                            </h1>

                            <p>
                                Discover opportunities, connect with clubs
                                and stay updated with campus life.
                            </p>
                        </div>

                        <div className="welcome-decoration">🎓</div>
                    </section>

                    <section className="student-stats">

                        <article className="student-stat-card stat-blue">
                            <div className="stat-icon">👥</div>
                            <div>
                                <p>Available Clubs</p>
                                <h2>{clubs.length}</h2>
                            </div>
                        </article>

                        <article className="student-stat-card stat-purple">
                            <div className="stat-icon">📅</div>
                            <div>
                                <p>Campus Events</p>
                                <h2>{events.length}</h2>
                            </div>
                        </article>

                        <article className="student-stat-card stat-orange">
                            <div className="stat-icon">📢</div>
                            <div>
                                <p>Announcements</p>
                                <h2>{announcements.length}</h2>
                            </div>
                        </article>

                        <article className="student-stat-card stat-green">
                            <div className="stat-icon">🎓</div>
                            <div>
                                <p>My Memberships</p>
                                <h2>{memberships.length}</h2>
                            </div>
                        </article>

                    </section>

                    <section className="student-content-panel">

                        <div className="student-section-heading">
                            <div>
                                <p className="student-eyebrow">
                                    YOUR CAMPUS SPACE
                                </p>

                                <h2>
                                    {tabs.find(
                                        (tab) => tab.id === activeTab
                                    )?.label}
                                </h2>
                            </div>
                        </div>

                        {message && (
                            <p className="success-message">{message}</p>
                        )}

                        {error && (
                            <p className="error-message">{error}</p>
                        )}

                        {loading ? (
                            <p className="loading-message">
                                Loading information...
                            </p>
                        ) : (

                            <div className="student-tab-content">

                                {/* CLUBS */}

                                {activeTab === "clubs" && (
                                    <div className="student-card-grid clubs-grid">

                                        {clubs.length === 0 ? (
                                            <p>No clubs available yet.</p>
                                        ) : clubs.map((club) => {
                                            const membership =
                                                getMembership(club._id);

                                            return (
                                                <article
                                                    className="student-data-card"
                                                    key={club._id}
                                                >
                                                    <div className="data-card-icon">
                                                        👥
                                                    </div>

                                                    <span className="data-card-label">
                                                        {club.category || "College Club"}
                                                    </span>

                                                    <h3>{club.name}</h3>

                                                    <p>{club.description}</p>

                                                    <p>
                                                        <strong>
                                                            Faculty Coordinator:
                                                        </strong>{" "}
                                                        {club.facultyCoordinator}
                                                    </p>

                                                    {membership ? (
                                                        <button
                                                            className="student-action-button joined-button"
                                                            disabled
                                                        >
                                                            {membership.status}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="student-action-button"
                                                            onClick={() =>
                                                                joinClub(club._id)
                                                            }
                                                        >
                                                            Join Club →
                                                        </button>
                                                    )}
                                                </article>
                                            );
                                        })}

                                    </div>
                                )}

                                {/* EVENTS */}

                                {activeTab === "events" && (
                                    <div className="student-card-grid events-grid">

                                        {events.length === 0 ? (
                                            <p>No events available.</p>
                                        ) : events.map((event) => (
                                            <article
                                                className="student-data-card event-card"
                                                key={event._id}
                                            >

                                                <div className="event-card-top">
                                                    <div className="data-card-icon">
                                                        📅
                                                    </div>

                                                    <span className="event-status">
                                                        {event.status || "Upcoming"}
                                                    </span>
                                                </div>

                                                <span className="data-card-label">
                                                    {event.category || "Campus Event"}
                                                </span>

                                                <h3>{event.title}</h3>

                                                <p className="event-description">
                                                    {event.description}
                                                </p>

                                                <div className="event-details">

                                                    <div>
                                                        <span>📆</span>
                                                        <p>
                                                            <strong>Date</strong>
                                                            {event.date
                                                                ? new Date(event.date).toLocaleDateString()
                                                                : "Date not available"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <span>📍</span>
                                                        <p>
                                                            <strong>Venue</strong>
                                                            {event.venue || "Venue not specified"}
                                                        </p>
                                                    </div>

                                                </div>

                                            </article>
                                        ))}

                                    </div>
                                )}

                                {/* ANNOUNCEMENTS */}

                                {activeTab === "announcements" && (
                                    <div className="student-card-grid announcements-grid">

                                        {announcements.length === 0 ? (
                                            <p>No announcements available.</p>
                                        ) : announcements.map((item) => (
                                            <article
                                                className="student-data-card"
                                                key={item._id}
                                            >
                                                <div className="data-card-icon">
                                                    📢
                                                </div>

                                                <span className="data-card-label">
                                                    {item.category || "Announcement"}
                                                </span>

                                                <h3>{item.title}</h3>

                                                <p>{item.message}</p>

                                                <p>
                                                    <strong>Published:</strong>{" "}
                                                    {new Date(
                                                        item.publishedDate
                                                    ).toLocaleDateString()}
                                                </p>

                                            </article>
                                        ))}

                                    </div>
                                )}

                                {/* MEMBERSHIPS */}

                                {activeTab === "memberships" && (
                                    <div className="student-card-grid memberships-grid">

                                        {memberships.length === 0 ? (
                                            <p>
                                                You have not joined any clubs yet.
                                            </p>
                                        ) : memberships.map((item) => (
                                            <article
                                                className="student-data-card"
                                                key={item._id}
                                            >
                                                <div className="data-card-icon">
                                                    🎓
                                                </div>

                                                <span className="data-card-label">
                                                    My Club
                                                </span>

                                                <h3>
                                                    {item.club?.name || "College Club"}
                                                </h3>

                                                <p>
                                                    <strong>Category:</strong>{" "}
                                                    {item.club?.category || "N/A"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Membership Status:
                                                    </strong>{" "}
                                                    {item.status}
                                                </p>
                                            </article>
                                        ))}

                                    </div>
                                )}

                                {/* PROFILE */}

                                {activeTab === "profile" && (
                                    <article className="student-data-card student-profile-card">

                                        <div className="profile-avatar">
                                            {(user.name || "S")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <h3>{user.name || "Student"}</h3>

                                        <p className="profile-subtitle">
                                            Student Profile
                                        </p>

                                        <div className="profile-details">

                                            <p>
                                                <strong>Name</strong>
                                                <span>{user.name || "N/A"}</span>
                                            </p>

                                            <p>
                                                <strong>Email</strong>
                                                <span>{user.email || "N/A"}</span>
                                            </p>

                                            <p>
                                                <strong>USN</strong>
                                                <span>{user.usn || "N/A"}</span>
                                            </p>

                                            <p>
                                                <strong>Department</strong>
                                                <span>{user.department || "N/A"}</span>
                                            </p>

                                            <p>
                                                <strong>Role</strong>
                                                <span>Student</span>
                                            </p>

                                        </div>
                                    </article>
                                )}

                            </div>
                        )}

                    </section>

                    <footer className="student-footer">
                        © {new Date().getFullYear()} CampusConnect | RV University
                    </footer>

                </main>
            </div>
        </div>
    );
}
