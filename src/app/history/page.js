'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Wrench, Phone, Calendar, CheckCircle2, Car } from 'lucide-react';

function HistoryContent() {
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get('phone') || '';
  const [phone, setPhone] = useState(phoneParam);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchHistory = async (searchPhone) => {
    if (!searchPhone) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('customer_phone', searchPhone.trim())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneParam) {
      fetchHistory(phoneParam);
    }
  }, [phoneParam]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Qulity Garage</h1>
          <p className="text-sm text-slate-500">रहाटणी, पुणे | सर्व्हिसिंग पावती व इतिहास</p>
          <div className="mt-3 inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
            UPI: 3665525@upi
          </div>
        </div>

        {/* Search Bar */}
        {!phoneParam && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder="मोबाईल नंबर टाका"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            />
            <button
              onClick={() => fetchHistory(phone)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              शोधा
            </button>
          </div>
        )}

        {loading && <div className="text-center py-8 text-slate-500">माहिती शोधत आहे...</div>}

        {!loading && searched && services.length === 0 && (
          <div className="bg-white p-6 rounded-xl border text-center text-slate-500">
            या नंबरवर कोणतीही सर्व्हिस नोंद सापडली नाही.
          </div>
        )}

        <div className="space-y-4">
          {services.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start border-b pb-3 border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{item.customer_name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Car className="w-3.5 h-3.5" />
                    <span className="font-semibold text-slate-700">{item.vehicle_no}</span>
                    {item.vehicle_model && <span>({item.vehicle_model})</span>}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> {item.status}
                </span>
              </div>

              <div className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block mb-1">केलेली कामे / साहित्य:</span>
                <p className="whitespace-pre-line text-slate-700">{item.items || 'General Servicing'}</p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.created_at).toLocaleDateString('mr-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">एकूण रक्कम</span>
                  <span className="text-lg font-black text-blue-600">₹{item.total_amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">लोड होत आहे...</div>}>
      <HistoryContent />
    </Suspense>
  );
}