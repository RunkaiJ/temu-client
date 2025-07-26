import { useState } from "react";
import axios from "axios";

function TemuUploadPage() {
    const [form, setForm] = useState({
        date: "",
        portCode: "", // single port code
        destinationState: "",
        carrierCode: "",
        voyageFlightNo: "",
        houseAWB: "",
        airlineCode: "", // new
        masterBillNumber: "", // new
    });

    const [manifestFile, setManifestFile] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleFileChange = (e) => setManifestFile(e.target.files[0]);

    const handleSubmit = async () => {
        if (!manifestFile) {
            alert("Please upload the Manifest file.");
            return;
        }

        setLoading(true);
        setStatus("");

        try {
            const localUrl = "http://localhost:5000/api/convert";
            const onlineUrl =
                "https://temu-server-production.up.railway.app/api/convert";
            const fd = new FormData();
            fd.append("manifest", manifestFile);
            fd.append("form", JSON.stringify(form));

            const response = await axios.post(onlineUrl, fd, {
                responseType: "blob",
            });

            // extract filename from headers
            const cd = response.headers["content-disposition"];
            let filename = "download.xlsx";
            if (cd) {
                const m = cd.match(/filename="?(.+?)"?$/);
                if (m) filename = m[1];
            }

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();

            setStatus("✅ File successfully generated and downloaded.");
        } catch (err) {
            console.error(err);
            setStatus("❌ Failed to generate file. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <h3 className="mb-4">Temu Upload Generator</h3>

            <div className="mb-3">
                <label className="form-label">Manifest File</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Date for All Fields</label>
                <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={form.date}
                    onChange={handleInputChange}
                />
            </div>

            <div className="row">
                {[
                    {
                        name: "portCode",
                        label: "Port Code (for Unlading/Arrival/Remote)",
                    },
                    { name: "destinationState", label: "State of Destination" },
                    { name: "carrierCode", label: "Carrier Code" },
                    { name: "voyageFlightNo", label: "Voyage Flight No" },
                    { name: "houseAWB", label: "House AWB" },
                    { name: "airlineCode", label: "Airline Code (3-digit)" }, // new
                    { name: "masterBillNumber", label: "Master Bill Number" }, // new
                ].map(({ name, label }) => (
                    <div className="col-md-6 mb-3" key={name}>
                        <label className="form-label">{label}</label>
                        <input
                            type="text"
                            className="form-control"
                            name={name}
                            value={form[name]}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}
            </div>

            <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Upload File"}
            </button>

            {status && (
                <div
                    className={`alert mt-3 ${
                        status.startsWith("✅")
                            ? "alert-success"
                            : "alert-danger"
                    }`}
                >
                    {status}
                </div>
            )}
        </div>
    );
}

export default TemuUploadPage;
