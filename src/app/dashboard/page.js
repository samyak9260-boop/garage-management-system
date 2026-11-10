'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Wrench, 
  IndianRupee, 
  Car, 
  ArrowRight, 
  PlusCircle, 
  Clock, 
  TrendingUp 
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalServices: 0,
    totalRevenue: 0,
  });
  const [recentServices, setRecentServices] = useState([]);

  useEffect(() => {
    // ग्राहकांची माहिती लोड करणे
    const savedCustomers = localStorage.getItem('garage_customers');
    const customers = savedCustomers ? JSON.parse(savedCustomers) : [];

    // सर्व्हिस रेकॉर्ड्स लोड करणे
    const savedServices = localStorage.getItem('garage_services');
    const services = savedServices ? JSON.parse(savedServices) : [];

    // एकूण कमाई हिशोब
    const revenue = services.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);

    setStats({
      totalCustomers: customers.length,
      totalServices: services.length,
      totalRevenue: revenue,
    });

    // शेवटच्या ५ सर्व्हिस नोंदी दाखवणे
    setRecentServices(services.slice(0, 5));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* मुख्य हेडर */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              🔧 गॅरेज व्यवस्थापन डॅशबोर्ड
            </h1>
            <p className="text-xs text-slate-500">
              दैनंदिन व्यवसाय, ग्राहक आणि सर्व्हिसचा संपूर्ण ताळेबंद
            </p>
          </div>

          {/* जलद बटणे */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => router.push('/customers')}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              <Users className="w-4 h-4 text-blue-600" />
              ग्राहक व्यवस्थापन
            </button>
            <button
              onClick={() => router.push('/service')}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              नवीन सर्व्हिस नोंदवा
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* आकडेवारी कार्ड्स (Stats Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* एकूण कमाई */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                एकूण कमाई
              </p>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center">
                <IndianRupee className="w-5 h-5 text-emerald-600 mr-0.5" />
                {stats.totalRevenue.toLocaleString('en-IN')}
              </h2>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> सर्व्हिस बिलांमधून
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          {/* नोंदणीकृत ग्राहक */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                नोंदणीकृत ग्राहक
              </p>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                {stats.totalCustomers}
              </h2>
              <button
                onClick={() => router.push('/customers')}
                className="text-[11px] text-blue-600 font-medium hover:underline flex items-center gap-0.5 mt-1"
              >
                यादी तपासा <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* एकूण सर्व्हिसेस */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                पूर्ण झालेल्या सर्व्हिसेस
              </p>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                {stats.totalServices}
              </h2>
              <button
                onClick={() => router.push('/service')}
                className="text-[11px] text-blue-600 font-medium hover:underline flex items-center gap-0.5 mt-1"
              >
                इतिहास पहा <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* अलीकडील सर्व्हिसेसची यादी */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              अलीकडील कामे (Recent Services)
            </h2>
            <button
              onClick={() => router.push('/service')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              सर्व पहा <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentServices.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              अजून कोणतीही सर्व्हिस नोंदवलेली नाही.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentServices.map((service) => (
                <div
                  key={service.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0 mt-0.5">
                      <Car className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">
                          {service.customerName}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold uppercase">
                          {service.vehicleNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-600">
                      ₹{service.cost}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {service.serviceDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}