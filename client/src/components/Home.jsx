
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    return (
        <>
            <nav>
                <div className="logo">College Club Portal</div>

                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#clubs">Clubs</a>
                    <a href="#events">Events</a>
                    <a href="#announcements">Announcements</a>

                    <Link to="/login">Login</Link>
                    <Link className="register" to="/register">
                        Register
                    </Link>
                </div>
            </nav>

            <section className="hero" id="home">
                <div className="hero-content">
                    <p className="small-heading">
                        COLLEGE CLUB MANAGEMENT
                    </p>

                    <h1>
                        Discover Clubs.
                        <br />
                        Connect. <span>Participate.</span>
                    </h1>

                    <p className="description">
                        Explore college clubs, discover exciting events,
                        connect with students and take part in campus activities.
                    </p>

                    <a href="#clubs" className="explore-btn">
                        Explore Clubs →
                    </a>
                </div>

                <div className="hero-image">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzMpB79dF8IdMp8XPpXOW_sWHZCX-YhlYO9ofvDTBlg&s=10"
                        alt="College club activities"
                    />
                </div>
            </section>

            <section className="about">
                <div className="about-image">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjv211XDEW8Kym0yeITEi8W6nSUGwz338EkcdmGmMnlQ&s=10"
                        alt="College students"
                    />
                </div>

                <div className="about-content">
                    <p className="small-heading">CAMPUS COMMUNITY</p>

                    <h2>Be Part of Your College Community</h2>

                    <p>
                        Join clubs, participate in events and connect
                        with students who share your interests.
                    </p>

                    <p>
                        College clubs help students explore their talents,
                        develop new skills and enjoy campus life.
                    </p>
                </div>
            </section>

            <section className="features" id="clubs">
                <h2>Explore Campus Life</h2>

                <p className="feature-text">
                    Everything you need to stay connected with college clubs.
                </p>

                <div className="feature-container">
                    <div className="feature">
                        <div className="icon">👥</div>
                        <h3>College Clubs</h3>
                        <p>
                            Discover different clubs and find one
                            that matches your interests.
                        </p>
                        <Link to="/login">Explore Clubs →</Link>
                    </div>

                    <div className="feature" id="events">
                        <div className="icon">📅</div>
                        <h3>Upcoming Events</h3>
                        <p>
                            Stay updated about workshops,
                            competitions and college events.
                        </p>
                        <Link to="/login">View Events →</Link>
                    </div>

                    <div className="feature" id="announcements">
                        <div className="icon">📢</div>
                        <h3>Announcements</h3>
                        <p>
                            Get the latest updates from your
                            favourite college clubs.
                        </p>
                        <Link to="/login">View Announcements →</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
