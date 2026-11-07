
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
            const [
                clubRes,
                eventRes,
                announcementRes,
                membershipRes
            ] = await Promise.all([
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

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
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
        if (!window.confirm("Are you sure you want to delete this club?")) {
            return;
        }

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
        if (!window.confirm("Are you sure you want to delete this event?")) {
            return;
        }

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
        if (!window.confirm("Are you sure you want to delete this announcement?")) {
            return;
        }

        try {
            await API.delete(`/announcements/${id}`);
            showMessage("Announcement deleted successfully!");
            await loadData();
        } catch (err) {
            showError(err, "Unable to delete announcement.");
        }
    };

    // Approve or reject a membership
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
        "dashboard",
        "clubs",
        "events",
        "announcements",
        "memberships"
    ];

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h2>College Club Portal</h2>
                    <p>Club Coordinator Panel</p>
                </div>

                <button onClick={logout} className="logout-button">
                    Logout
                </button>
            </header>

            <main className="dashboard-content">
                <section className="welcome-section">
                    <h1>Welcome, {user.name || "Coordinator"}!</h1>
                    <p>Manage college clubs and campus activities.</p>
                </section>

                <nav className="dashboard-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={activeTab === tab ? "active-tab" : ""}
                            onClick={() => {
                                setActiveTab(tab);
                                setMessage("");
                                setError("");
                            }}
                        >
                            {tab === "memberships"
                                ? "Membership Requests"
                                : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>

                {message && (
                    <p className="success-message">{message}</p>
                )}

                {error && (
                    <p className="error-message">{error}</p>
                )}

                {loading ? (
                    <p className="loading-message">Loading dashboard...</p>
                ) : (
                    <section className="dashboard-section">

                        {/* Dashboard overview */}
                        {activeTab === "dashboard" && (
                            <>
                                <h2>Dashboard Overview</h2>

                                <div className="dashboard-grid">
                                    <article className="dashboard-card">
                                        <h3>Total Clubs</h3>
                                        <h2>{clubs.length}</h2>
                                    </article>

                                    <article className="dashboard-card">
                                        <h3>Total Events</h3>
                                        <h2>{events.length}</h2>
                                    </article>

                                    <article className="dashboard-card">
                                        <h3>Announcements</h3>
                                        <h2>{announcements.length}</h2>
                                    </article>

                                    <article className="dashboard-card">
                                        <h3>Pending Requests</h3>
                                        <h2>
                                            {memberships.filter(
                                                (item) => item.status === "Pending"
                                            ).length}
                                        </h2>
                                    </article>
                                </div>
                            </>
                        )}

                        {/* Manage clubs */}
                        {activeTab === "clubs" && (
                            <>
                                <h2>Manage Clubs</h2>

                                <form className="dashboard-form" onSubmit={addClub}>
                                    <h3>Add New Club</h3>

                                    <input
                                        placeholder="Club Name"
                                        value={clubForm.name}
                                        onChange={(e) => setClubForm({
                                            ...clubForm,
                                            name: e.target.value
                                        })}
                                        required
                                    />

                                    <textarea
                                        placeholder="Club Description"
                                        value={clubForm.description}
                                        onChange={(e) => setClubForm({
                                            ...clubForm,
                                            description: e.target.value
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

                                    <button type="submit">Add Club</button>
                                </form>

                                <h3>Existing Clubs</h3>

                                <div className="dashboard-grid">
                                    {clubs.length === 0 ? (
                                        <p>No clubs available.</p>
                                    ) : clubs.map((club) => (
                                        <article className="dashboard-card" key={club._id}>
                                            <h3>{club.name}</h3>
                                            <p>{club.description}</p>
                                            <p><strong>Category:</strong> {club.category}</p>
                                            <p><strong>Coordinator:</strong> {club.facultyCoordinator}</p>

                                            <button
                                                className="delete-button"
                                                onClick={() => deleteClub(club._id)}
                                            >
                                                Delete Club
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Manage events */}
                        {activeTab === "events" && (
                            <>
                                <h2>Manage Events</h2>

                                <form className="dashboard-form" onSubmit={addEvent}>
                                    <h3>Create New Event</h3>

                                    <input
                                        placeholder="Event Title"
                                        value={eventForm.title}
                                        onChange={(e) => setEventForm({
                                            ...eventForm,
                                            title: e.target.value
                                        })}
                                        required
                                    />

                                    <textarea
                                        placeholder="Event Description"
                                        value={eventForm.description}
                                        onChange={(e) => setEventForm({
                                            ...eventForm,
                                            description: e.target.value
                                        })}
                                        required
                                    />

                                    <label>Event Date</label>
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

                                    <input
                                        placeholder="Category"
                                        value={eventForm.category}
                                        onChange={(e) => setEventForm({
                                            ...eventForm,
                                            category: e.target.value
                                        })}
                                        required
                                    />

                                    <button type="submit">Add Event</button>
                                </form>

                                <h3>Existing Events</h3>

                                {events.map((event) => (
                                    <article className="dashboard-card" key={event._id}>
                                        <h3>{event.title}</h3>
                                        <p>{event.description}</p>
                                        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                                        <p><strong>Venue:</strong> {event.venue}</p>
                                        <p><strong>Status:</strong> {event.status}</p>

                                        <button
                                            className="delete-button"
                                            onClick={() => deleteEvent(event._id)}
                                        >
                                            Delete Event
                                        </button>
                                    </article>
                                ))}
                            </>
                        )}

                        {/* Manage announcements */}
                        {activeTab === "announcements" && (
                            <>
                                <h2>Manage Announcements</h2>

                                <form
                                    className="dashboard-form"
                                    onSubmit={addAnnouncement}
                                >
                                    <h3>Publish Announcement</h3>

                                    <input
                                        placeholder="Announcement Title"
                                        value={announcementForm.title}
                                        onChange={(e) => setAnnouncementForm({
                                            ...announcementForm,
                                            title: e.target.value
                                        })}
                                        required
                                    />

                                    <textarea
                                        placeholder="Announcement Message"
                                        value={announcementForm.message}
                                        onChange={(e) => setAnnouncementForm({
                                            ...announcementForm,
                                            message: e.target.value
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

                                    <button type="submit">
                                        Publish Announcement
                                    </button>
                                </form>

                                <h3>Published Announcements</h3>

                                {announcements.map((item) => (
                                    <article className="dashboard-card" key={item._id}>
                                        <h3>{item.title}</h3>
                                        <p>{item.message}</p>
                                        <p><strong>Category:</strong> {item.category}</p>

                                        <button
                                            className="delete-button"
                                            onClick={() => deleteAnnouncement(item._id)}
                                        >
                                            Delete Announcement
                                        </button>
                                    </article>
                                ))}
                            </>
                        )}

                        {/* Membership requests */}
                        {activeTab === "memberships" && (
                            <>
                                <h2>Student Membership Requests</h2>

                                {memberships.length === 0 ? (
                                    <p>No membership requests yet.</p>
                                ) : memberships.map((item) => (
                                    <article className="dashboard-card" key={item._id}>
                                        <h3>{item.student?.name || "Student"}</h3>

                                        <p>
                                            <strong>Email:</strong>{" "}
                                            {item.student?.email || "N/A"}
                                        </p>

                                        <p>
                                            <strong>USN:</strong>{" "}
                                            {item.student?.usn || "N/A"}
                                        </p>

                                        <p>
                                            <strong>Club:</strong>{" "}
                                            {item.club?.name || "N/A"}
                                        </p>

                                        <p>
                                            <strong>Status:</strong>{" "}
                                            {item.status}
                                        </p>

                                        {item.status === "Pending" && (
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => updateMembership(item._id, "Approved")}
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() => updateMembership(item._id, "Rejected")}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </>
                        )}

                    </section>
                )}
            </main>
        </div>
    );
}
