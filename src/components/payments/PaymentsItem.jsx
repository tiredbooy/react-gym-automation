// GymPaymentLogsPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Filter, Calendar, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useTheme } from "../../context/ThemeContext";

const PaymentTableHeader = () => {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  return (
    <thead className={`bg-${primary} text-${secondary}`}>
      <tr>
        <th className="p-3 text-right">ردیف</th>
        <th className="p-3 text-right">نام عضو</th>
        <th className="p-3 text-right">مدت اشتراک</th>
        <th className="p-3 text-right">مبلغ پرداختی</th>
        <th className="p-3 text-right">تاریخ پرداخت</th>
        <th className="p-3 text-right">وضعیت</th>
        <th className="p-3 text-right">روش پرداخت</th>
      </tr>
    </thead>
  );
};

const PaymentTableRow = ({ payment }) => {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;
  let paymentMethod ;

  switch(payment.paid_method) {
    case 'cash' : 
      paymentMethod = 'نقدی'
      break;
    case 'card' : 
      paymentMethod = 'کارتخوان';
      break;
    case 'card-to-card' : 
      paymentMethod = 'کارت به کارت';
      break;
    default : paymentMethod = 'نامشخص';
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-${secondary}/40 text-${accent} hover:bg-${background}/20 transition cursor-pointer rounded-lg`}
    >
      <td className="p-3 text-right">{payment.id}</td>
      <td className="p-3 text-right">{payment?.full_name}</td>
      <td className="p-3 text-right">12</td>
      <td className="p-3 font-medium text-right text-green-600">
        {Number(payment?.price)?.toLocaleString('fa-IR')} تومان
      </td>
      <td className="p-3 text-right">{payment?.payment_date}</td>
      <td className="p-3 text-right">
        <span className={`px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full shadow ${payment?.payment_status !== 'Completed' ? 'bg-red-500' : ''}`}>
          {payment?.payment_status === 'Completed' ? 'پرداخت شده' : 'پرداخت  ناموفق'} 

        </span>
      </td>
      <td className="p-3 text-right">{paymentMethod}</td>
    </motion.tr>
  );
};

const GymPaymentLogsPage = () => {
  // const payments = [
  //   {
  //     id: 1,
  //     name: "تست تست2",
  //     membership: "(VIP) سه ماهه",
  //     amount: "14,000,000",
  //     date: "1404-01-26",
  //     method: "کارتخوان",
  //   },
  //   {
  //     id: 2,
  //     name: "مهدی کاظمی",
  //     membership: "(VIP) ماهانه",
  //     amount: "1,680,000",
  //     date: "1404-01-26",
  //     method: "کارتخوان",
  //   },
  //   {
  //     id: 3,
  //     name: "مهدی کاظمی",
  //     membership: "(VIP) ماهانه",
  //     amount: "1,400,000",
  //     date: "1404-01-26",
  //     method: "کارتخوان",
  //   },
  // ];

  const [payments , setPayments] = useState([]);
  
  useEffect(() => {
    async function fetchPayments () {
      const response = await fetch('http://localhost:8000/api/payments/');
      const data = await response.json();
      setPayments(data)
    }
    fetchPayments()
  })

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  const exportToExcel = () => {
    const wsData = [
      [
        "ردیف",
        "نام عضو",
        "نوع عضویت",
        "مبلغ پرداختی",
        "تاریخ پرداخت",
        "وضعیت",
        "روش پرداخت",
      ],
      ...payments.map((p) => [
        p.id,
        p.name,
        p.membership,
        `${p.amount} تومان`,
        p.date,
        "پرداخت شده",
        p.method,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "لیست پرداخت‌ها");
    XLSX.writeFile(workbook, "لیست_پرداخت‌ها.xlsx");
  };

  return (
    <div
      className={`min-h-screen bg-${background} flex flex-col items-center justify-start p-4 space-y-6`}
      dir="rtl"
    >
      <header
        className={`w-full max-w-5xl bg-${primary} text-${secondary} p-4 rounded-2xl shadow-lg flex justify-between items-center`}
      >
        <h1 className={`text-2xl text-${background} font-bold text-center flex-1`}>
          لیست پرداخت‌ها
        </h1>
        <button
          onClick={exportToExcel}
          className={`flex items-center gap-2 bg-${background} hover:bg-${secondary} text-${accent} px-4 py-2 rounded-xl shadow transition`}
        >
          <FileDown className="w-5 h-5" />
          <span className="text-sm">خروجی اکسل</span>
        </button>
      </header>

      {/* Filters Section */}
      <div
        className={`w-full max-w-5xl bg-${secondary} rounded-2xl shadow-md p-4 flex flex-row gap-4 items-center`}
      >
        <div className={`relative w-full text-${primary}`}>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            placeholder="از تاریخ"
            inputClass={`p-2 rounded-xl border border-${primary} bg-${background} text-${accent} text-right w-full pr-10`}
            format="YYYY/MM/DD"
          />
          <Calendar
            size={18}
            className={`absolute right-2 top-2.5 text-${primary} pointer-events-none`}
          />
        </div>
        <div className={`relative w-full text-${primary}`}>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            placeholder="تا تاریخ"
            inputClass={`p-2 rounded-xl border border-${primary} bg-${background} text-${accent} text-right w-full pr-10`}
            format="YYYY/MM/DD"
          />
          <Calendar
            size={18}
            className={`absolute right-2 top-2.5 text-${primary} pointer-events-none`}
          />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[150px]">
          <Filter className="w-5 h-5 text-darkBlue" />
          <motion.select
            whileTap={{ scale: 0.95 }}
            className={`w-full bg-${background} text-${accent} p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-${secondary}`}
          >
            <option>همه روش‌ها</option>
            <option>کارتخوان</option>
            <option>نقدی</option>
          </motion.select>
        </div>
      </div>

      {/* Payment Logs Table */}
      <div
        className={`w-full max-w-5xl bg-${secondary} rounded-2xl shadow-md overflow-x-auto`}
      >
        <table
          className={`min-w-full table-auto border-collapse text-[#030303] rounded-2xl overflow-hidden`}
        >
          <PaymentTableHeader />
          <tbody>
            {payments.map((payment) => (
              <PaymentTableRow key={payment.id} payment={payment} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GymPaymentLogsPage;
