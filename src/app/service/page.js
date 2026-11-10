'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  Car, 
  IndianRupee, 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  Search, 
  MessageCircle, 
  Printer, 
  X,
  Pencil,
  Trash2
} from 'lucide-react';

export default function ServicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [garageProfile, setGarageProfile] = useState(null);

  // फॉर्म स्टेट्स
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // एडिट व प्रिंट स्टेट
  const [editingId, setEditingId] = useState(null);
  const [activePrintRecord, setActivePrintRecord] = useState(null);

  useEffect(() => {
    const savedCustomers = localStorage.getItem('garage_customers');
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));

    const savedServices = localStorage.getItem('garage_services');
    if (savedServices) setServiceRecords(JSON.parse(savedServices));

    const savedProfile = localStorage.getItem('garage_profile');
    if (savedProfile) setGarageProfile(JSON.parse(savedProfile));
  }, []);

  const handleCustomerChange = (e) => {
    const custId = e.target.value;
    setSelectedCustomer(custId);

    const found = customers.find((c) => String(c.id) === custId);
    if (found) {
      setVehicleNumber(found.vehicle_number || '');
    }
  };

  // सर्व्हिस जोडणे किंवा अपडेट करणे
  const handleSaveService = (e) => {
    e.preventDefault();

    const cust = customers.find((c) => String(c.id) === selectedCustomer);

    if (editingId) {
      // एडिट अपडेट लॉजिक
      const updated = serviceRecords.map((s) => {
        if (s.id === editingId) {
          return {
            ...s,
            customerName: cust ? cust.name : s.customerName,
            customerPhone: cust ? cust.phone : s.customerPhone,
            vehicleNumber: vehicleNumber.trim().toUpperCase() || s.vehicleNumber,
            description: description.trim(),
            cost: Number(cost) || 0,
            nextServiceDate: nextServiceDate || 'ठरले नाही',
          };
        }
        return s;
      });

      setServiceRecords(updated);
      localStorage.setItem('garage_services', JSON.stringify(updated));
      setSuccessMsg('सर्व्हिस नोंद यशस्वीरित्या अपडेट केली!');
      setEditingId(null);
    } else {
      // नवीन नोंद लॉजिक
      const newService = {
        id: Date.now(),
        customerName: cust ? cust.name : 'ग्राहक',
        customerPhone: cust ? cust.phone : '',
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        description: description.trim(),
        cost: Number(cost) || 0,
        serviceDate: new Date().toLocaleDateString('en-GB'),
        nextServiceDate: nextServiceDate || 'ठरले नाही',
      };

      const updatedServices = [newService, ...serviceRecords];
      setServiceRecords(updatedServices);
      localStorage.setItem('garage_services', JSON.stringify(updatedServices));
      setSuccessMsg('सर्व्हिसची नोंद यशस्वीरित्या झाली!');
    }

    // फॉर्म रिसेट
    setSelectedCustomer('');
    setVehicleNumber('');
    setDescription('');
    setCost('');
    setNextServiceDate('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // एडिट सुरू करणे
  const startEdit = (service) => {
    setEditingId(service.id);
    const foundCust = customers.find(
      (c) => c.vehicle_number?.toUpperCase() === service.vehicleNumber?.toUpperCase()
    );
    if (foundCust) {
      setSelectedCustomer(String(foundCust.id));
    } else {
      setSelectedCustomer('');
    }
    setVehicleNumber(service.vehicleNumber);
    setDescription(service.description);
    setCost(service.cost);
    setNextServiceDate(service.nextServiceDate === 'ठरले नाही' ? '' : service.nextServiceDate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // एडिट रद्द करणे
  const cancelEdit = () => {
    setEditingId(null);
    setSelectedCustomer('');
    setVehicleNumber('');
    setDescription('');
    setCost('');
    setNextServiceDate('');
  };

  // सर्व्हिस नोंद डिलीट करणे
  const handleDeleteService = (id, vehicleNum) => {
    if (confirm(`गाडी क्रमांक "${vehicleNum}" ची ही सर्व्हिस नोंद कायमची हटवायची आहे का?`)) {
      const updated = serviceRecords.filter((s) => s.id !== id);
      setServiceRecords(updated);
      localStorage.setItem('garage_services', JSON.stringify(updated));
      setSuccessMsg('सर्व्हिस नोंद हटवली गेली!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // WhatsApp बिल
  const sendWhatsAppBill = (service) => {
    let phone = service.customerPhone ? service.customerPhone.replace(/[^0-9]/g, '') : '';
    if (phone.length === 10) phone = '91' + phone;

    const gName = garageProfile?.garageName || 'गॅरेज सर्व्हिस';
    const gPhone = garageProfile?.phone || '';
    const upi = garageProfile?.upiId ? `\n💳 *पेमेंटसाठी UPI ID:* ${garageProfile.upiId}` : '';

    const message = 
      `🏢 *${gName}* 🏢\n` +
      (gPhone ? `📞 संपर्क: ${gPhone}\n\n` : '\n') +
      `नमस्कार *${service.customerName}*,\n` +
      `तुमच्या वाहनाची (*${service.vehicleNumber}*) सर्व्हिस यशस्वीरित्या पूर्ण झाली आहे.\n\n` +
      `🛠️ *केलेले काम:* ${service.description}\n` +
      `💰 *एकूण रक्कम:* ₹${service.cost}\n` +
      `📅 *तारीख:* ${service.serviceDate}\n` +
      `🔔 *पुढील सर्व्हिस तारीख:* ${service.nextServiceDate}\n` +
      upi +
      `\n\nआपल्या विश्वासाबद्दल धन्यवाद! 🙏`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredServices = serviceRecords.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.customerName?.toLowerCase().includes(q) ||
      s.vehicleNumber?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* हेडर */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800">सर्व्हिस रेकॉर्ड्स व बिलिंग</h1>
              <p className="text-xs text-slate-500">पावती प्रिंट, WhatsApp बिल व व्यवस्थापन</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/customers')}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-medium transition"
          >
            + ग्राहक यादी
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* फॉर्म */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-32">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Pencil className="w-5 h-5 text-amber-500" />
                    सर्व्हिस एडिट करा
                  </>
                ) : (
                  <>
                    <Wrench className="w-5 h-5 text-blue-600" />
                    नवीन सर्व्हिस नोंदवा
                  </>
                )}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> रद्द
                </button>
              )}
            </div>

            {successMsg && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2.5 rounded-xl flex items-center text-xs gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ग्राहक निवडा {editingId ? '(ऐच्छिक)' : '*'}
                </label>
                <select
                  required={!editingId}
                  value={selectedCustomer}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="">
                    {editingId ? '-- आधीचाच ग्राहक कायम ठेवा --' : '-- ग्राहक निवडा --'}
                  </option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.vehicle_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  गाडीचा नंबर *
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="उदा. MH12AB1234"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm uppercase focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  कामाचे वर्णन *
                </label>
                <textarea
                  required
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="उदा. ऑइल चेंज, ब्रेक काम..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  एकूण खर्च (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="उदा. 450"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  पुढील सर्व्हिस तारीख
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={nextServiceDate}
                    onChange={(e) => setNextServiceDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className={`flex-1 py-2.5 text-white font-medium text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition ${
                    editingId 
                      ? 'bg-amber-500 hover:bg-amber-600' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {editingId ? 'अपडेट करा' : 'सर्व्हिस सेव्ह करा'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition"
                  >
                    रद्द
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* यादी */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                सर्व्हिस इतिहास ({filteredServices.length})
              </h2>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="नाव, गाडी नंबर शोधा..."
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {filteredServices.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                कोणतीही नोंद उपलब्ध नाही.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-800">
                          {service.customerName}
                        </h3>
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold">
                          {service.vehicleNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        काम: {service.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        दिनांक: {service.serviceDate} | पुढील: {service.nextServiceDate}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <span className="text-base font-bold text-emerald-600">
                        ₹{service.cost}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActivePrintRecord(service)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                          title="पावती प्रिंट करा"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          पावती
                        </button>
                        <button
                          onClick={() => sendWhatsAppBill(service)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                          title="WhatsApp बिल"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </button>
                        <button
                          onClick={() => startEdit(service)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="एडिट करा"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id, service.vehicleNumber)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="हटवा"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* प्रिंट पावती मॉडेअल */}
      {activePrintRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActivePrintRecord(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div id="printable-receipt" className="border border-dashed border-slate-300 p-5 rounded-xl">
              <div className="text-center border-b border-slate-200 pb-3 mb-3">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {garageProfile?.garageName || 'गॅरेज सर्व्हिस'}
                </h2>
                {garageProfile?.address && (
                  <p className="text-xs text-slate-500 mt-0.5">{garageProfile.address}</p>
                )}
                {garageProfile?.phone && (
                  <p className="text-xs text-slate-500">संपर्क: {garageProfile.phone}</p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>ग्राहक: <b>{activePrintRecord.customerName}</b></span>
                  <span>तारीख: {activePrintRecord.serviceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>वाहन क्रमांक: <b>{activePrintRecord.vehicleNumber}</b></span>
                  <span>मोबाईल: {activePrintRecord.customerPhone || '-'}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg mb-4 text-xs">
                <p className="font-semibold text-slate-700 mb-1">केलेले काम:</p>
                <p className="text-slate-600">{activePrintRecord.description}</p>
                <p className="text-[11px] text-slate-400 mt-2">
                  पुढील सर्व्हिस तारीख: {activePrintRecord.nextServiceDate}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-center mb-3">
                <span className="font-bold text-slate-800 text-sm">एकूण रक्कम:</span>
                <span className="font-extrabold text-base text-slate-900">₹{activePrintRecord.cost}</span>
              </div>

              {garageProfile?.upiId && (
                <div className="text-center bg-blue-50/60 p-2 rounded-lg text-[11px] text-blue-800 font-medium">
                  UPI ID: {garageProfile.upiId}
                </div>
              )}

              <p className="text-center text-[11px] text-slate-400 mt-4">
                ।। पुन्हा सेवेची संधी द्या! ।।
              </p>
            </div>

            <div className="mt-5 flex gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" /> पावती प्रिंट करा / PDF सेव्ह करा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}