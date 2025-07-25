import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const { token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5078/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Failed to fetch profile", err);
      });
  }, [token]);

  if (!profile)
    return (
      <div className="p-6 text-center text-gray-500">Loading profile...</div>
    );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="space-y-3 text-sm text-gray-700">
        <p>
          <strong>Username:</strong> {profile.userName}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {profile.status === 1 ? "Active" : "Inactive"}
        </p>
        <p>
          <strong>Created At:</strong> {formatDate(profile.createdAt)}
        </p>

        {profile.userInfo && (
          <>
            <hr className="my-4" />
            <p>
              <strong>Full Name:</strong> {profile.userInfo.fullName}
            </p>
            <p>
              <strong>Phone:</strong> {profile.userInfo.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {profile.userInfo.address}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
