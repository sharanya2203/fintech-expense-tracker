"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("token");

    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-8 bg-red-500 text-white p-2 rounded w-full"
    >
      Logout
    </button>
  );
}