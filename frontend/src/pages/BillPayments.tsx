import React, { useState } from "react";
import Navbar2 from "../components/Navbar2";
import Sidebar from "../components/layout/Sidebar";
import NoticeBanner from "../components/NoticeBanner";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { useBills } from "@/hooks/useBills";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/context/AuthContext";

interface Bill {
  id: number | string;
  title: string;
  amount: string;
  dueDate: string;
  status: "Pending" | "Paid" | string;
}

const BillPayments: React.FC = () => {
  const { bills: apiBills, loading, error, payBill: payBillApi } = useBills();
  const { show } = useToast();
  const { user } = useAuth();

  // Transform API bills to component format
  const bills: Bill[] = apiBills.map((b: any) => ({
    id: b.id || b._id,
    title: b.title || b.biller_name || 'Bill',
    amount: typeof b.amount === 'string' ? b.amount : `₹${b.amount?.toLocaleString('en-IN') || '0'}`,
    dueDate: b.dueDate || b.due_date || '',
    status: b.payment_status === 'paid' ? 'Paid' : 'Pending',
  }));

  const payBill = async (id: number | string) => {
    try {
      await payBillApi(String(id));
      show("Payment successful!", 'success');
    } catch (err: any) {
      show(err.message || "Payment failed", 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="mt-4 text-lg">Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <NoticeBanner />
      <Navbar2 user={user || undefined} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 max-w-5xl mx-auto p-6 space-y-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-6">Bill Payments</h1>

          {/* Pending Bills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Pending Bills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {bills.filter(b => b.status === "Pending").map(bill => (
                <motion.div
                  key={bill.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-900/60 p-5 rounded-2xl shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="text-lg font-semibold">{bill.title}</div>
                    <div className="text-gray-300 mt-1">Due: {bill.dueDate}</div>
                    <div className="text-yellow-400 mt-2 font-bold">{bill.amount}</div>
                  </div>
                  <button
                    className="mt-4 bg-yellow-400 text-black font-bold rounded-xl py-2 shadow hover:scale-105 transition"
                    onClick={() => payBill(bill.id)}
                  >
                    Pay Now
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mt-8">
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Recent Transactions</h2>
            <div className="space-y-3">
              {bills.map(bill => (
                <motion.div
                  key={bill.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900/50 p-4 rounded-2xl shadow flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{bill.title}</div>
                    <div className="text-gray-400 text-sm">Status: {bill.status}</div>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400 font-bold">
                    <DollarSign size={20} />
                    {bill.amount}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BillPayments;
