import React, { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import { motion } from "framer-motion";
import { User, Briefcase, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { show } = useToast();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    password: "",
    age: user?.age?.toString() || "",
    gender: user?.gender || "",
    email: user?.email || "",
    nationality: user?.nationality || "",
    address: user?.address || "",
    phone: user?.phoneNumber || "",
    pan: user?.pan || "",
    aadhaar: user?.aadhaar || "",
    salarySlip: "",
    employmentType: user?.employmentType || "",
    company: user?.company || "",
    yoe: user?.yearsOfExperience?.toString() || "",
    annualIncome: user?.annualIncome?.toString() || "",
    bankDetails: "",
    existingLoan: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        password: "",
        age: user.age?.toString() || "",
        gender: user.gender || "",
        email: user.email || "",
        nationality: user.nationality || "",
        address: user.address || "",
        phone: user.phoneNumber || "",
        pan: user.pan || "",
        aadhaar: user.aadhaar || "",
        salarySlip: "",
        employmentType: user.employmentType || "",
        company: user.company || "",
        yoe: user.yearsOfExperience?.toString() || "",
        annualIncome: user.annualIncome?.toString() || "",
        bankDetails: "",
        existingLoan: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUser({
        first_name: profile.firstName,
        last_name: profile.lastName,
        email: profile.email,
        age: profile.age ? parseInt(profile.age) : undefined,
        gender: profile.gender,
        nationality: profile.nationality,
        address: profile.address,
        phone_number: profile.phone,
        pan: profile.pan,
        aadhaar: profile.aadhaar,
        employment_type: profile.employmentType,
        company: profile.company,
        years_of_experience: profile.yoe ? parseInt(profile.yoe) : undefined,
        annual_income: profile.annualIncome ? parseFloat(profile.annualIncome) : undefined,
      });
      show("Profile updated successfully!", 'success');
    } catch (err: any) {
      show(err.message || "Failed to update profile", 'error');
    }
  };

  return (
    <PageLayout maxWidth="4xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-yellow-400 mb-10 text-center drop-shadow-lg"
      >
        👤 Profile Management
      </motion.h1>

      {/* PERSONAL INFORMATION */}
      <SectionCard title="Personal Information" icon={<User size={24} className="text-yellow-400" />}>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} />
          <Input label="Username" name="username" value={profile.username} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={profile.password} onChange={handleChange} />
          <Input label="Age" name="age" value={profile.age} onChange={handleChange} />
          <Select label="Gender" name="gender" value={profile.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
          <Input label="Email" name="email" value={profile.email} onChange={handleChange} />
          <Input label="Nationality" name="nationality" value={profile.nationality} onChange={handleChange} />
          <Input label="Address" name="address" value={profile.address} onChange={handleChange} />
          <Input label="Phone Number" name="phone" value={profile.phone} onChange={handleChange} />
          <Input label="PAN Number" name="pan" value={profile.pan} onChange={handleChange} />
          <Input label="Aadhaar Number" name="aadhaar" value={profile.aadhaar} onChange={handleChange} />
          <FileUpload label="Upload Salary Slip" name="salarySlip" onChange={handleChange} />
        </div>
      </SectionCard>

      {/* EMPLOYMENT DETAILS */}
      <SectionCard title="Employment Details" icon={<Briefcase size={24} className="text-yellow-400" />}>
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Employment Type"
            name="employmentType"
            value={profile.employmentType}
            onChange={handleChange}
            options={["Salaried", "Self Employed", "Unemployed"]}
          />
          <Input label="Company" name="company" value={profile.company} onChange={handleChange} />
          <Input label="Years of Experience" name="yoe" value={profile.yoe} onChange={handleChange} />
        </div>
      </SectionCard>

      {/* FINANCIAL INFORMATION */}
      <SectionCard title="Financial Information" icon={<CreditCard size={24} className="text-yellow-400" />}>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Annual Income (₹)" name="annualIncome" value={profile.annualIncome} onChange={handleChange} />
          <Input label="Bank Account Details" name="bankDetails" value={profile.bankDetails} onChange={handleChange} />
          <Input label="Existing Loan Amount (if any)" name="existingLoan" value={profile.existingLoan} onChange={handleChange} />
        </div>
      </SectionCard>

      {/* SAVE BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className="w-full mt-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold rounded-2xl shadow-lg hover:shadow-yellow-500/30 transition-all"
      >
        Save Profile
      </motion.button>
    </PageLayout>
  );
};

// ✨ Reusable Section Wrapper
const SectionCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-lg mb-8"
  >
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="text-2xl font-semibold text-yellow-400">{title}</h2>
    </div>
    {children}
  </motion.div>
);

// 🧩 Input Component
const Input: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}> = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-400/40 outline-none transition-all"
    />
  </div>
);

// 🧩 Select Component
const Select: React.FC<{
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ label, name, value, options, onChange }) => (
  <div>
    <label className="block text-gray-300 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-400/40 outline-none transition-all"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// 🧩 File Upload Component
const FileUpload: React.FC<{
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, onChange }) => (
  <div>
    <label className="block text-gray-300 mb-1">{label}</label>
    <input
      type="file"
      name={name}
      onChange={onChange}
      className="w-full p-2 rounded-xl bg-gray-800/70 border border-gray-700 text-gray-400 focus:ring-2 focus:ring-yellow-400/40 outline-none transition-all"
    />
  </div>
);

export default Profile;
