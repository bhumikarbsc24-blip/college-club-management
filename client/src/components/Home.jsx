
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    return (
        <>
            {/* NAVIGATION */}
            <nav>
                <Link to="/" className="logo">
                    CampusConnect
                </Link>

                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#clubs">Clubs</a>
                    <a href="#events">Events</a>
                    <a href="#announcements">Updates</a>

                    <Link to="/login">Login</Link>

                    <Link className="register" to="/register">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="hero" id="home">
                <div className="hero-content">
                    <p className="small-heading">
                        YOUR CAMPUS. YOUR COMMUNITY. YOUR EXPERIENCE.
                    </p>

                    <h1>
                        Discover Clubs.
                        <br />
                        Connect. <span>Participate.</span>
                    </h1>

                    <p className="description">
                        Explore college clubs, discover exciting events,
                        connect with students and take part in activities
                        that make your college journey memorable.
                    </p>

                    <div className="hero-actions">
                        <a href="#clubs" className="explore-btn">
                            Explore Clubs →
                        </a>

                        <Link to="/register" className="hero-secondary-btn">
                            Join Our Community
                        </Link>
                    </div>
                </div>

                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900"
                        alt="Students participating in a college event"
                    />
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="about" id="about">
                <div className="about-image">
                    <img
                        src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=900"
                        alt="College students working together"
                    />
                </div>

                <div className="about-content">
                    <p className="small-heading">
                        CAMPUS COMMUNITY
                    </p>

                    <h2>
                        Be Part of Something Bigger
                    </h2>

                    <p>
                        College is more than classrooms and textbooks.
                        It is about discovering your interests,
                        building friendships and creating memories.
                    </p>

                    <p>
                        Join clubs, participate in events and connect
                        with students who share your passion.
                        Make every campus experience count.
                    </p>

                    <Link to="/register" className="about-btn">
                        Become a Member →
                    </Link>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="features" id="clubs">
                <p className="small-heading">
                    WHAT YOU CAN DO
                </p>

                <h2>Explore Campus Life</h2>

                <p className="feature-text">
                    Everything you need to stay connected with
                    your college community.
                </p>

                <div className="feature-container">

                    <div className="feature">
                        <div className="icon">👥</div>

                        <h3>College Clubs</h3>

                        <p>
                            Discover different clubs and find one
                            that matches your interests and talents.
                        </p>

                        <Link to="/login">
                            Explore Clubs →
                        </Link>
                    </div>

                    <div className="feature" id="events">
                        <div className="icon">📅</div>

                        <h3>Upcoming Events</h3>

                        <p>
                            Stay connected with workshops,
                            competitions and exciting college events.
                        </p>

                        <Link to="/login">
                            View Events →
                        </Link>
                    </div>

                    <div className="feature" id="announcements">
                        <div className="icon">📢</div>

                        <h3>Announcements</h3>

                        <p>
                            Never miss important updates,
                            news and announcements from your clubs.
                        </p>

                        <Link to="/login">
                            View Updates →
                        </Link>
                    </div>

                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="community-cta">
                <p>MAKE YOUR COLLEGE LIFE COUNT</p>

                <h2>
                    Your Next Campus Experience Starts Here.
                </h2>

                <p>
                    Find your community, discover your passion
                    and make unforgettable memories.
                </p>

                <Link to="/register">
                    Join CampusConnect →
                </Link>
            </section>

            {/* FOOTER */}
            <footer className="site-footer">
                <div className="footer-container">

                    <div className="footer-brand">
                        <h2>CampusConnect</h2>

                        <p>
                            Bringing students, clubs and campus
                            activities together in one place.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h3>Quick Links</h3>

                        <a href="#home">Home</a>
                        <a href="#about">About Us</a>
                        <a href="#clubs">Clubs</a>
                        <a href="#events">Events</a>
                    </div>

                    <div className="footer-links">
                        <h3>Account</h3>

                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>
                        © {new Date().getFullYear()} CampusConnect.
                        All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
