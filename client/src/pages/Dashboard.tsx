import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://fastapi-backend-t2e9.onrender.com/send-report";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [complaint, setComplaint] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSubmittedImage, setLastSubmittedImage] = useState<File | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          toast.success("Location detected!");
        },
        () => {
          toast.error("Location permission denied. Please enter manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      toast.success("Image selected successfully!");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Error during logout. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (image && lastSubmittedImage && image.name === lastSubmittedImage.name && image.size === lastSubmittedImage.size) {
      toast.error("This report has already been submitted.");
      return;
    }

    setLoading(true);
    toast.loading("📤 Sending report...");

    try {
      const formData = new FormData();
      formData.append("name", `${user?.name || ""} ${user?.surname || ""}`.trim());
      formData.append("email", user?.email || "unknown@example.com");
      formData.append("location", location);
      formData.append("complaint", complaint);
      if (image) formData.append("image", image);

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss();

      if (res.ok && data.status === "success") {
        toast.success("Report submitted successfully!");
        setLastSubmittedImage(image);
        setLocation("");
        setComplaint("");
        handleRemoveImage();
      } else {
        toast.error("Failed to send report. Please try again.");
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error("Network or server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative flex justify-center items-center min-h-screen bg-linear-to-br from-blue-200 via-blue-50 to-cyan-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button
        onClick={handleLogout}
        className="absolute top-6 right-8 px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition-all"
      >
        Logout
      </Button>

      <Card className="w-full max-w-2xl p-8 rounded-3xl border border-white/40 bg-white/20 backdrop-blur-2xl shadow-[inset_1px_1px_6px_rgba(255,255,255,0.6),4px_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[inset_1px_1px_8px_rgba(255,255,255,0.8),6px_6px_20px_rgba(0,0,0,0.25)]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-blue-800 tracking-tight drop-shadow-sm">
            🏙️ CityGuardian Dashboard
          </CardTitle>
          <p className="text-gray-700/90 text-sm font-medium">
            Report civic issues — quick, effective & seamless
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Full Name
              </label>
              <Input
                type="text"
                value={`${user?.name || ""} ${user?.surname || ""}`.trim()}
                readOnly
                className="bg-white/40 border border-white/50 text-gray-800 cursor-not-allowed rounded-xl focus-visible:ring-0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                readOnly
                className="bg-white/40 border border-white/50 text-gray-800 cursor-not-allowed rounded-xl focus-visible:ring-0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Location
              </label>
              <Input
                type="text"
                placeholder="Detecting location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white/40 border border-white/60 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Describe the Issue
              </label>
              <Textarea
                placeholder="Potholes near MG Road causing traffic..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="bg-white/40 border border-white/60 text-gray-800 rounded-xl min-h-[120px] focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Attach Image (optional)
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer bg-white/40 border border-white/60 rounded-xl"
              />
              {preview && (
                <div className="flex items-center gap-4 mt-4">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-28 h-20 object-cover rounded-xl border border-white/50 shadow-md"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleRemoveImage}
                    className="text-sm px-3 py-1.5 bg-gray-200/60 hover:bg-gray-300/80 rounded-xl backdrop-blur-md"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="mt-4 py-2 text-base font-semibold bg-blue-600/90 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-300/40 hover:shadow-blue-400/60 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
