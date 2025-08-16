import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const [labels, setLabels] = useState<string[]>([]);
    const [timestamp, setTimestamp] = useState("");
    const [loading, setLoading] = useState(false);

    if (!email) return <p>No user email found. Please login.</p>;

    const handleLabel = async () => {
        if (!email) return;
        setLoading(true);

        try {
            const response = await fetch("https://gmail-agent-backend.onrender.com", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",  // ⚡ include credentials for cookies/auth
                body: JSON.stringify({ email, timestamp, labels }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Emails labeled successfully!");
            } else {
                alert("Labeling failed: " + data.error);
            }
        } catch (err) {
            console.error("Label API error:", err);
            alert("Error labeling emails, see console.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Welcome, {email}</h2>

            <div style={{ margin: "20px 0" }}>
                <input
                    type="datetime-local"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                />
            </div>

            <div style={{ margin: "20px 0" }}>
                <input
                    type="text"
                    placeholder="Labels (comma separated)"
                    value={labels.join(",")}
                    onChange={(e) => setLabels(e.target.value.split(","))}
                />
            </div>

            <button onClick={handleLabel} disabled={loading}>
                {loading ? "Labeling..." : "Label!"}
            </button>
        </div>
    );
}
