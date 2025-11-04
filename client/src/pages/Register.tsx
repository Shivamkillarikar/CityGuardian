import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Home } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-blue-100 via-indigo-100 to-purple-100 p-6">
      {/* 🌐 Floating Orbs */}
      <motion.div
        className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
        animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-120px] right-[-100px] w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
        animate={{ y: [0, -30, 0], x: [0, -25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[45%] left-[60%] w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ✨ Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-[90vw] max-w-2xl md:max-w-xl"
      >
        <Card className="bg-white/85 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl py-8 px-8 sm:px-10">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl text-center font-semibold text-gray-800 tracking-tight">
              Create Your Account
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="relative">
                <Label htmlFor="name" className="text-gray-700">Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Andrew"
                    className="pl-10 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* Surname */}
              <div className="relative">
                <Label htmlFor="surname" className="text-gray-700">Surname</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="surname"
                    name="surname"
                    required
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Tate"
                    className="pl-10 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative md:col-span-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="xyz@gmail.com"
                    className="pl-10 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="relative md:col-span-2">
                <Label htmlFor="address" className="text-gray-700">Address</Label>
                <div className="relative mt-1">
                  <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    className="pl-10 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 h-11 rounded-lg"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-5 mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-indigo-500 to-blue-500 text-white font-medium py-3 rounded-lg hover:opacity-90 transition-all"
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>
              <p className="text-sm text-center text-gray-700">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 font-medium cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
