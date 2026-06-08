"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./components/LogoutButton";


import {
  FaHome,
  FaMoneyBillWave,
  FaWallet,
  FaChartBar,
} from "react-icons/fa";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar =
    pathname === "/login" ||
    pathname === "/register";

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">

          {!hideSidebar && (
            <div className="w-64 bg-black text-white p-6">

              <h1 className="text-3xl font-bold mb-8">
                FinTech
              </h1>

              <div className="flex flex-col gap-3">

                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 p-3 rounded ${
                    pathname === "/dashboard"
                      ? "bg-white text-black"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <FaHome />
                  Dashboard
                </Link>

                <Link
                  href="/expenses"
                  className={`flex items-center gap-3 p-3 rounded ${
                    pathname === "/expenses"
                      ? "bg-white text-black"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <FaMoneyBillWave />
                  Expenses
                </Link>

                <Link
                  href="/budgets"
                  className={`flex items-center gap-3 p-3 rounded ${
                    pathname === "/budgets"
                      ? "bg-white text-black"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <FaWallet />
                  Budgets
                </Link>

                <Link
                  href="/reports"
                  className={`flex items-center gap-3 p-3 rounded ${
                    pathname === "/reports"
                      ? "bg-white text-black"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <FaChartBar />
                  Reports
                </Link>

              </div>

              <div className="mt-8">
                <LogoutButton />
              </div>

            </div>
          )}

          <div className="flex-1 p-6">
            {children}
          </div>

        </div>
      </body>
    </html>
  );
}