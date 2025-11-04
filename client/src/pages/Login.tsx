import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // 3. Call the context's login function
      // This will update context state, localStorage, and the api token
      await login(formData.email, formData.password);

      toast.success("Login successful!");
      navigate("/dashboard"); // 4. Now this will work!
      
    } catch (err: any) {
      // The api wrapper in AuthContext should throw an error on failure
      const message = err.response?.data?.message || err.message || "Login failed";
      toast.error(`${message}`);
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

      {/* 🔐 Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-[90vw] max-w-lg md:max-w-md"
      >
        <Card className="bg-white/85 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl py-8 px-6 sm:px-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl text-center font-semibold text-gray-800 tracking-tight">
              Welcome Back!
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="xyz@gmail.com"
                    className="pl-10 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-transparent h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-transparent h-11 rounded-lg"
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
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-sm text-center text-gray-700">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-indigo-600 font-medium cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
