
import { useEffect, useState } from "react";
import API from "../services/api";

export default function CoordinatorDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [clubForm, setClubForm] = useState({
        name: "",
        description: "",
        category: "",
        facultyCoordinator: ""
    });

    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        date: "",
        venue: "",
        category: ""
    });

    const [announcementForm, setAnnouncementForm] = useState({
        title: "",
        message: "",
        category: ""
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const getList = (data, key) => {
        if (Array.isArray(data[key])) return data[key];
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
    };

    const loadData = async () => {
        setError("");

        try {
            const [clubRes, eventRes, announcementRes, membershipRes] =
                await Promise.all([
                    API.get("/clubs"),
                    API.get("/events"),
                    API.get("/announcements"),
                    API.get("/memberships")
                ]);

            setClubs(getList(clubRes.data, "clubs"));
            setEvents(getList(eventRes.data, "events"));
            setAnnouncements(getList(announcementRes.data, "announcements"));
            setMemberships(getList(membershipRes.data, "memberships"));
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load dashboard information."
            );
        } finally {
            setLoading(false);
        }
    };

    // Initial dashboard data loading
    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                const [clubRes, eventRes, announcementRes, membershipRes] =
                    await Promise.all([
                        API.get("/clubs"),
                        API.get("/events"),
                        API.get("/announcements"),
                        API.get("/memberships")
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
                        "Unable to load dashboard information."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const showMessage = (text) => {
        setMessage(text);
        setError("");
    };

    const showError = (err, fallback) => {
        setError(err.response?.data?.message || fallback);
        setMessage("");
    };

    // Add a new club
    const addClub = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/clubs", clubForm);
            showMessage(response.data.message || "Club added successfully!");

            setClubForm({
                name: "",
                description: "",
                category: "",
                facultyCoordinator: ""
            });

            await loadData();
        } catch (err) {
            showError(err, "Unable to add club.");
        }
    };

    // Delete a club
    const deleteClub = async (id) => {
        if (!window.confirm("Are you sure you want to delete this club?")) return;

        try {
            await API.delete(`/clubs/${id}`);
            showMessage("Club deleted successfully!");
            await loadData();
        } catch (err) {
            showError(err, "Unable to delete club.");
        }
    };

    // Add a new event
    const addEvent = async (e) => {
        e.preventDefault();

        try {
            await API.post("/events", eventForm);
            showMessage("Event added successfully!");

            setEventForm({
                title: "",
                description: "",
                date: "",
                venue: "",
                category: ""
            });

            await loadData();
        } catch (err) {
            showError(err, "Unable to add event.");
        }
    };

    // Delete an event
    const deleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            await API.delete(`/events/${id}`);
            showMessage("Event deleted successfully!");
            await loadData();
        } catch (err) {
            showError(err, "Unable to delete event.");
        }
    };

    // Add an announcement
    const addAnnouncement = async (e) => {
        e.preventDefault();

        try {
            await API.post("/announcements", announcementForm);
            showMessage("Announcement published successfully!");

            setAnnouncementForm({
                title: "",
                message: "",
                category: ""
            });

            await loadData();
        } catch (err) {
            showError(err, "Unable to publish announcement.");
        }
    };

    // Delete an announcement
    const deleteAnnouncement = async (id) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;

        try {
            await API.delete(`/announcements/${id}`);
            showMessage("Announcement deleted successfully!");
            await loadData();
        } catch (err) {
            showError(err, "Unable to delete announcement.");
        }
    };

    // Approve or reject membership
    const updateMembership = async (id, status) => {
        try {
            await API.put(`/memberships/${id}`, { status });
            showMessage(`Membership ${status.toLowerCase()} successfully!`);
            await loadData();
        } catch (err) {
            showError(err, "Unable to update membership.");
        }
    };

    const tabs = [
        { id: "dashboard", label: "Overview", icon: "📊" },
        { id: "clubs", label: "Manage Clubs", icon: "🎓" },
        { id: "events", label: "Manage Events", icon: "📅" },
        { id: "announcements", label: "Announcements", icon: "📢" },
        { id: "memberships", label: "Membership Requests", icon: "👥" }
    ];

    const pendingCount = memberships.filter(
        (item) => item.status === "Pending"
    ).length;

    return (
        <div className="dashboard coordinator-dashboard">

            <header className="coordinator-header">
                <div className="coordinator-brand">
                    <div className="coordinator-logo">CC</div>
                    <div>
                        <h2>CampusConnect</h2>
                        <p>Coordinator Portal</p>
                    </div>
                </div>

                <button onClick={logout} className="logout-button">
                    Logout ↗
                </button>
            </header>

            <main className="coordinator-content">

                <section className="coordinator-welcome">
                    <div>
                        <span className="coordinator-eyebrow">
                            COORDINATOR WORKSPACE
                        </span>
                        <h1>Welcome back, {user.name || "Coordinator"}!</h1>
                        <p>
                            Manage your college clubs, organize events and
                            stay connected with students.
                        </p>
                    </div>

                    <div className="coordinator-welcome-icon">🎓</div>
                </section>

                <nav className="coordinator-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={
                                activeTab === tab.id
                                    ? "coordinator-tab active"
                                    : "coordinator-tab"
                            }
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
                </nav>

                {message && (
                    <div className="coordinator-alert success-message">
                        ✓ {message}
                    </div>
                )}

                {error && (
                    <div className="coordinator-alert error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="loading-message">Loading dashboard...</p>
                ) : (
                    <section className="coordinator-section">

                        {/* DASHBOARD OVERVIEW */}
                        {activeTab === "dashboard" && (
                            <>
                                <div className="coordinator-section-heading">
                                    <div>
                                        <h2>Dashboard Overview</h2>
                                        <p>Here's what's happening on your campus.</p>
                                    </div>
                                </div>

                                <div className="coordinator-stats-grid">
                                    <article className="coordinator-stat-card">
                                        <div className="coordinator-stat-icon blue">🎓</div>
                                        <p>Total Clubs</p>
                                        <h2>{clubs.length}</h2>
                                        <span>Registered college clubs</span>
                                    </article>

                                    <article className="coordinator-stat-card">
                                        <div className="coordinator-stat-icon purple">📅</div>
                                        <p>Total Events</p>
                                        <h2>{events.length}</h2>
                                        <span>Campus activities</span>
                                    </article>

                                    <article className="coordinator-stat-card">
                                        <div className="coordinator-stat-icon orange">📢</div>
                                        <p>Announcements</p>
                                        <h2>{announcements.length}</h2>
                                        <span>Published updates</span>
                                    </article>

                                    <article className="coordinator-stat-card">
                                        <div className="coordinator-stat-icon green">👥</div>
                                        <p>Pending Requests</p>
                                        <h2>{pendingCount}</h2>
                                        <span>Awaiting your approval</span>
                                    </article>
                                </div>

                                <div className="coordinator-quick-section">
                                    <h2>Quick Actions</h2>
                                    <p>Manage your campus activities easily.</p>

                                    <div className="coordinator-quick-grid">
                                        <button onClick={() => setActiveTab("clubs")}>
                                            <span>🎓</span>
                                            <strong>Add or Manage Clubs</strong>
                                            <small>Manage college clubs</small>
                                        </button>

                                        <button onClick={() => setActiveTab("events")}>
                                            <span>📅</span>
                                            <strong>Create an Event</strong>
                                            <small>Organize campus events</small>
                                        </button>

                                        <button onClick={() => setActiveTab("announcements")}>
                                            <span>📢</span>
                                            <strong>Publish Announcement</strong>
                                            <small>Share important updates</small>
                                        </button>

                                        <button onClick={() => setActiveTab("memberships")}>
                                            <span>👥</span>
                                            <strong>Review Requests</strong>
                                            <small>Approve student memberships</small>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* MANAGE CLUBS */}
                        {activeTab === "clubs" && (
                            <>
                                <div className="coordinator-section-heading">
                                    <div>
                                        <h2>Manage Clubs</h2>
                                        <p>Create and manage college clubs.</p>
                                    </div>
                                </div>

                                <form className="coordinator-form" onSubmit={addClub}>
                                    <h3>＋ Add New Club</h3>

                                    <div className="coordinator-form-grid">
                                        <input
                                            placeholder="Club Name"
                                            value={clubForm.name}
                                            onChange={(e) => setClubForm({
                                                ...clubForm,
                                                name: e.target.value
                                            })}
                                            required
                                        />

                                        <input
                                            placeholder="Category"
                                            value={clubForm.category}
                                            onChange={(e) => setClubForm({
                                                ...clubForm,
                                                category: e.target.value
                                            })}
                                            required
                                        />

                                        <input
                                            placeholder="Faculty Coordinator"
                                            value={clubForm.facultyCoordinator}
                                            onChange={(e) => setClubForm({
                                                ...clubForm,
                                                facultyCoordinator: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <textarea
                                        placeholder="Club Description"
                                        value={clubForm.description}
                                        onChange={(e) => setClubForm({
                                            ...clubForm,
                                            description: e.target.value
                                        })}
                                        required
                                    />

                                    <button type="submit" className="coordinator-submit">
                                        Add Club
                                    </button>
                                </form>

                                <div className="coordinator-list-heading">
                                    <h3>Existing Clubs</h3>
                                    <span>{clubs.length} Clubs</span>
                                </div>

                                <div className="coordinator-card-grid">
                                    {clubs.length === 0 ? (
                                        <p>No clubs available.</p>
                                    ) : clubs.map((club) => (
                                        <article className="coordinator-item-card" key={club._id}>
                                            <div className="coordinator-item-icon">🎓</div>
                                            <span className="coordinator-category">{club.category}</span>
                                            <h3>{club.name}</h3>
                                            <p>{club.description}</p>
                                            <div className="coordinator-item-detail">
                                                Faculty: {club.facultyCoordinator}
                                            </div>
                                            <button
                                                className="coordinator-delete"
                                                onClick={() => deleteClub(club._id)}
                                            >
                                                Delete Club
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* MANAGE EVENTS */}
                        {activeTab === "events" && (
                            <>
                                <div className="coordinator-section-heading">
                                    <div>
                                        <h2>Manage Events</h2>
                                        <p>Plan and organize exciting campus events.</p>
                                    </div>
                                </div>

                                <form className="coordinator-form" onSubmit={addEvent}>
                                    <h3>＋ Create New Event</h3>

                                    <div className="coordinator-form-grid">
                                        <input
                                            placeholder="Event Title"
                                            value={eventForm.title}
                                            onChange={(e) => setEventForm({
                                                ...eventForm,
                                                title: e.target.value
                                            })}
                                            required
                                        />

                                        <input
                                            placeholder="Category"
                                            value={eventForm.category}
                                            onChange={(e) => setEventForm({
                                                ...eventForm,
                                                category: e.target.value
                                            })}
                                            required
                                        />

                                        <input
                                            type="datetime-local"
                                            value={eventForm.date}
                                            onChange={(e) => setEventForm({
                                                ...eventForm,
                                                date: e.target.value
                                            })}
                                            required
                                        />

                                        <input
                                            placeholder="Venue"
                                            value={eventForm.venue}
                                            onChange={(e) => setEventForm({
                                                ...eventForm,
                                                venue: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <textarea
                                        placeholder="Event Description"
                                        value={eventForm.description}
                                        onChange={(e) => setEventForm({
                                            ...eventForm,
                                            description: e.target.value
                                        })}
                                        required
                                    />

                                    <button type="submit" className="coordinator-submit">
                                        Add Event
                                    </button>
                                </form>

                                <div className="coordinator-list-heading">
                                    <h3>Existing Events</h3>
                                    <span>{events.length} Events</span>
                                </div>

                                <div className="coordinator-card-grid">
                                    {events.length === 0 ? (
                                        <p>No events available.</p>
                                    ) : events.map((event) => (
                                        <article className="coordinator-item-card" key={event._id}>
                                            <div className="coordinator-item-icon">📅</div>
                                            <span className="coordinator-category">{event.category}</span>
                                            <h3>{event.title}</h3>
                                            <p>{event.description}</p>

                                            <div className="coordinator-item-detail">
                                                Date: {event.date
                                                    ? new Date(event.date).toLocaleString()
                                                    : "N/A"}
                                            </div>

                                            <div className="coordinator-item-detail">
                                                Venue: {event.venue}
                                            </div>

                                            <div className="coordinator-item-detail">
                                                Status: {event.status || "N/A"}
                                            </div>

                                            <button
                                                className="coordinator-delete"
                                                onClick={() => deleteEvent(event._id)}
                                            >
                                                Delete Event
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* MANAGE ANNOUNCEMENTS */}
                        {activeTab === "announcements" && (
                            <>
                                <div className="coordinator-section-heading">
                                    <div>
                                        <h2>Manage Announcements</h2>
                                        <p>Share important information with students.</p>
                                    </div>
                                </div>

                                <form className="coordinator-form" onSubmit={addAnnouncement}>
                                    <h3>＋ Publish Announcement</h3>

                                    <div className="coordinator-form-grid">
                                        <input
                                            placeholder="Announcement Title"
                                            value={announcementForm.title}
                                            onChange={(e) => setAnnouncementForm({
                                                ...announcementForm,
                                                title: e.target.value
                                            })}
                                            required
                                        />

                                        <input
                                            placeholder="Category"
                                            value={announcementForm.category}
                                            onChange={(e) => setAnnouncementForm({
                                                ...announcementForm,
                                                category: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <textarea
                                        placeholder="Announcement Message"
                                        value={announcementForm.message}
                                        onChange={(e) => setAnnouncementForm({
                                            ...announcementForm,
                                            message: e.target.value
                                        })}
                                        required
                                    />

                                    <button type="submit" className="coordinator-submit">
                                        Publish Announcement
                                    </button>
                                </form>

                                <div className="coordinator-list-heading">
                                    <h3>Published Announcements</h3>
                                    <span>{announcements.length} Announcements</span>
                                </div>

                                <div className="coordinator-card-grid">
                                    {announcements.length === 0 ? (
                                        <p>No announcements available.</p>
                                    ) : announcements.map((item) => (
                                        <article className="coordinator-item-card" key={item._id}>
                                            <div className="coordinator-item-icon">📢</div>
                                            <span className="coordinator-category">{item.category}</span>
                                            <h3>{item.title}</h3>
                                            <p>{item.message}</p>

                                            <button
                                                className="coordinator-delete"
                                                onClick={() => deleteAnnouncement(item._id)}
                                            >
                                                Delete Announcement
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* MEMBERSHIP REQUESTS */}
                        {activeTab === "memberships" && (
                            <>
                                <div className="coordinator-section-heading">
                                    <div>
                                        <h2>Membership Requests</h2>
                                        <p>Review and manage student club applications.</p>
                                    </div>

                                    <span className="coordinator-pending-count">
                                        {pendingCount} Pending
                                    </span>
                                </div>

                                <div className="coordinator-card-grid">
                                    {memberships.length === 0 ? (
                                        <p>No membership requests yet.</p>
                                    ) : memberships.map((item) => (
                                        <article className="coordinator-item-card membership-card" key={item._id}>
                                            <div className="coordinator-item-icon">👤</div>

                                            <span className={
                                                item.status === "Approved"
                                                    ? "membership-status approved"
                                                    : item.status === "Rejected"
                                                        ? "membership-status rejected"
                                                        : "membership-status pending"
                                            }>
                                                {item.status}
                                            </span>

                                            <h3>{item.student?.name || "Student"}</h3>

                                            <div className="coordinator-item-detail">
                                                Email: {item.student?.email || "N/A"}
                                            </div>

                                            <div className="coordinator-item-detail">
                                                USN: {item.student?.usn || "N/A"}
                                            </div>

                                            <div className="coordinator-item-detail">
                                                Club: {item.club?.name || "N/A"}
                                            </div>

                                            {item.status === "Pending" && (
                                                <div className="coordinator-membership-actions">
                                                    <button
                                                        className="coordinator-approve"
                                                        onClick={() => updateMembership(item._id, "Approved")}
                                                    >
                                                        ✓ Approve
                                                    </button>

                                                    <button
                                                        className="coordinator-reject"
                                                        onClick={() => updateMembership(item._id, "Rejected")}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}

                    </section>
                )}
            </main>

            <footer className="coordinator-footer">
                <p>© 2026 CampusConnect | College Club Management Portal</p>
            </footer>

        </div>
    );
}
