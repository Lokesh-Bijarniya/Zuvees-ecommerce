import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    if (
      e.target.name === "street" ||
      e.target.name === "city" ||
      e.target.name === "state" ||
      e.target.name === "postalCode" ||
      e.target.name === "country"
    ) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [e.target.name]: e.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users/profile", formData);
      if (res.data.success) {
        // Update the user context if setUser is available
        if (typeof setUser === "function") {
          setUser({
            ...user,
            ...formData,
          });
        }
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({
        type: "danger",
        text:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-700">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-blue-300 drop-shadow-lg">My Profile</h1>

        {message.text && (
          <motion.div
            className={`mb-6 p-4 rounded-xl shadow-lg backdrop-blur-md bg-opacity-60 border ${
              message.type === "success"
                ? "bg-green-800/60 text-green-100 border-green-400"
                : "bg-red-800/60 text-red-100 border-red-400"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between">
              <p>{message.text}</p>
              <button
                onClick={() => setMessage({ type: "", text: "" })}
                className="text-gray-300 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}

        <div className="rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20">
          <div className="md:flex">
            {/* Left Side - User Info */}
            <div className="md:w-1/3 bg-gradient-to-br from-blue-900/80 to-teal-700/80 p-8 text-white flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-blue-400/30">
                <FaUser size={50} className="text-blue-200 drop-shadow-md" />
              </div>
              <h2 className="text-2xl font-bold text-blue-100 drop-shadow">{user.name}</h2>
              <p className="capitalize bg-white/20 px-3 py-1 rounded-full text-xs mt-2 text-blue-200 tracking-wide shadow">
                {user.role}
              </p>

              <div className="mt-8 w-full">
                <div className="flex items-center mb-4">
                  <FaEnvelope className="mr-3 text-blue-200" />
                  <span className="text-sm truncate text-blue-100">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center mb-4">
                    <FaPhone className="mr-3 text-blue-200" />
                    <span className="text-blue-100">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Profile Details/Form */}
            <div className="md:w-2/3 p-8 bg-white/10 backdrop-blur-xl text-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-blue-200 drop-shadow">Personal Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center bg-blue-500/90 hover:bg-blue-600/80 text-white px-4 py-2 rounded-lg shadow transition-colors backdrop-blur border border-blue-400/40"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div className="flex border-b border-blue-200/20 pb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                      <FaUser className="text-blue-200" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200/70">Full Name</p>
                      <p className="font-medium text-blue-100">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex border-b border-blue-200/20 pb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                      <FaEnvelope className="text-blue-200" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200/70">Email Address</p>
                      <p className="font-medium text-blue-100">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex border-b border-blue-200/20 pb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                      <FaPhone className="text-blue-200" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200/70">Phone Number</p>
                      <p className="font-medium text-blue-100">{user.phone || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                      <FaMapMarkerAlt className="text-blue-200" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200/70">Address</p>
                      <p className="font-medium text-blue-100">
                        {user.address?.street || "Not provided"},{" "}
                        {user.address?.city || ""}, {user.address?.state || ""} {user.address?.postalCode || ""},{" "}
                        {user.address?.country || ""}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-blue-200/80">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-white/10 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/70 backdrop-blur placeholder:text-blue-200/60"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-blue-200/80">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-white/10 text-blue-300 cursor-not-allowed backdrop-blur"
                      disabled
                    />
                    <p className="text-xs text-blue-200/60">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-blue-200/80">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-white/10 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/70 backdrop-blur placeholder:text-blue-200/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="street" className="block text-sm font-medium text-blue-200/80">
                      Street
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-white/10 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/70 backdrop-blur placeholder:text-blue-200/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-blue-200/80">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-white/10 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/70 backdrop-blur placeholder:text-blue-200/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="state" className="block text-sm font-medium text-blue-200/80">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-white/10 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/70 backdrop-blur placeholder:text-blue-200/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-blue-200/80">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-white/10 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/70 backdrop-blur placeholder:text-blue-200/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="country" className="block text-sm font-medium text-blue-200/80">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-white/10 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/70 backdrop-blur placeholder:text-blue-200/60"
                    />
                  </div>

                  <div className="flex space-x-4 mt-4">
                    <button
                      type="submit"
                      className="flex items-center bg-blue-500/90 hover:bg-blue-600/80 text-white px-4 py-2 rounded-lg shadow transition-colors backdrop-blur border border-blue-400/40"
                    >
                      <FaSave className="mr-2" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center bg-gray-200/70 hover:bg-gray-300/90 text-gray-800 px-4 py-2 rounded-lg shadow transition-colors"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
