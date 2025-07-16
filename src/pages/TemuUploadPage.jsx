import { useState } from "react";
import axios from "axios";

function TemuUploadPage() {
    const [form, setForm] = useState({
        date: "",
        unladingPort: "",
        arrivalAirport: "",
        preparerPort: "",
        remotePort: "",
        destinationState: "",
        locationOfGoods: "",
        carrierCode: "",
        voyageFlightNo: "",
        houseAWB: "",
    });

    const [templateFile, setTemplateFile] = useState(null);
    const [combineFile, setCombineFile] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === "template") setTemplateFile(file);
        else setCombineFile(file);
    };

    const handleSubmit = async () => {
        if (!templateFile || !combineFile) {
            alert("Please upload both files.");
            return;
        }

        setLoading(true);
        setStatus("");

        try {
            const formData = new FormData();
            formData.append("template", templateFile);
            formData.append("combine", combineFile);
            formData.append(
                "form",
                new Blob([JSON.stringify(form)], { type: "application/json" })
            );


            const response = await axios.post(
                "https://temu-server-2277.onrender.com/api/convert",
                formData,
                {
                    responseType: "blob",
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "27274824400 UPLOAD GENERATED.xlsx";
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
                <label className="form-label">Temu NetCHB Template</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleFileChange(e, "template")}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Combine Invoice File</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleFileChange(e, "combine")}
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
                    { name: "unladingPort", label: "Unlading Port" },
                    { name: "arrivalAirport", label: "Arrival Airport" },
                    { name: "preparerPort", label: "Preparer Port" },
                    { name: "remotePort", label: "Remote Port" },
                    { name: "destinationState", label: "State of Destination" },
                    { name: "locationOfGoods", label: "Location of Goods" },
                    { name: "carrierCode", label: "Carrier Code" },
                    { name: "voyageFlightNo", label: "Voyage Flight No" },
                    { name: "houseAWB", label: "House AWB" },
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
