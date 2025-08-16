import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const loggedIn = params.get("loggedIn");
        const email = params.get("email");

        if (loggedIn && email) {
            // Redirect to dashboard without query params
            navigate(`/dashboard?email=${encodeURIComponent(email)}`);
        }
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Gmail Agent</h1>
            <a href="https://gmail-agent-backend.onrender.com/auth/google">
                <button>Login with Google</button>
            </a>
        </div>
    );
}
