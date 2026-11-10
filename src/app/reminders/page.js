'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Calendar, 
  Car, 
  Phone, 
  ArrowLeft, 
  MessageCircle, 
  Search, 
  AlertCircle, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedServices = localStorage.getItem('garage_services');
    if (!savedServices) return;

    const services = JSON.parse(savedServices);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // फक्त अशा सर्व्हिसेस घ्या ज्यांची पुढील तारीख ठरलेली आहे
    const list = services
      .filter((s) => s.nextServiceDate && s.nextServiceDate !== 'ठरले नाही')
      .map((s) => {
        const dueDate = new Date(s.nextServiceDate);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status = 'upcoming'; // आगामी
        let statusText = `${diffDays} दिवसांत देय`;

        if (diffDays < 0) {
          status = 'overdue'; // तारीख उलटून गेली
          statusText = `${Math.abs(diffDays)} दिवसांपूर्वी तारीख उलटली`;
        } else if (diffDays === 0) {
          status = 'today'; // आजच आहे
          statusText = 'आजच सर्व्हिस देय आहे';
        }

        return {
          ...s,
          diffDays,
          status,
          statusText,
        };
      })
      // ज्यांची तारीख उलटली आहे किंवा जवळ आहे त्यांना वर दाखवा
      .sort((a, b) => a.diffDays - b.diffDays);

    setReminders(list);
  }, []);

  // WhatsApp रिमाइंडर मेसेज पाठवणे
  const sendWhatsAppReminder = (item) => {
    let phone = item.customerPhone ? item.customerPhone.replace(/[^0-9]/g, '') : '';
    if (phone.length === 10) {
      phone = '91' + phone;
    }

    const message =
      `🔔 *सर्व्हिस रिमाइंडर* 🔔\n\n` +
      `नमस्कार *${item.customerName}*,\n` +
      `आपल्या वाहनाची (*${item.vehicleNumber}*) पुढील सर्व्हिस तारीख जवळ आली आहे.\n\n` +
      `📅 *पुढील सर्व्हिस तारीख:* ${item.nextServiceDate}\n` +
      `🛠️ *मागील सर्व्हिस:* ${item.description}\n\n` +
      `वाहनाची सुरक्षितता आणि उत्तम मायलेजसाठी वेळेवर सर्व्हिसिंग करून घ्या.\n` +
      `आजच गॅरेजला भेट द्या किंवा वेळ ठरवा! 🙏`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // सर्च फिल्टर
  const filteredReminders = reminders.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.customerName?.toLowerCase().includes(q) ||
      r.vehicleNumber?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* हेडर */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                सर्व्हिस रिमाइंडर्स
              </h1>
              <p className="text-xs text-slate-500">
                गाड्यांच्या पुढील सर्व्हिसची तारीख व WhatsApp रिमाइंडर
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/service')}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl font-medium transition"
          >
            + नवीन सर्व्हिस नोंदवा
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-4">
        {/* शोध पट्टी */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-600">
            एकूण रिमाइंडर्स: {filteredReminders.length}
          </span>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ग्राहक, गाडी नंबर शोधा..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        {/* रिमाइंडर्स यादी */}
        <div className="space-y-3">
          {filteredReminders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
              कोणतीही आगामी किंवा प्रलंबित सर्व्हिस नाही.
            </div>
          ) : (
            filteredReminders.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-800">
                      {item.customerName}
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold uppercase">
                      {item.vehicleNumber}
                    </span>

                    {/* स्टेटस बॅज */}
                    {item.status === 'overdue' && (
                      <span className="text-[11px] px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {item.statusText}
                      </span>
                    )}
                    {item.status === 'today' && (
                      <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.statusText}
                      </span>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.statusText}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    मागील काम: <span className="text-slate-700 font-medium">{item.description}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    पुढील तारीख: <span className="font-semibold text-slate-700">{item.nextServiceDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => sendWhatsAppReminder(item)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp रिमाइंडर पाठवा
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}