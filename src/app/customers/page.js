'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Car, 
  Plus, 
  ArrowLeft, 
  Phone, 
  User, 
  Search, 
  CheckCircle2, 
  Pencil, 
  Trash2, 
  X 
} from 'lucide-react';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  
  // फॉर्म स्टेट्स
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // एडिट स्टेट
  const [editingId, setEditingId] = useState(null);

  // लोकल स्टोरेजमधून माहिती लोड करणे
  useEffect(() => {
    const savedCustomers = localStorage.getItem('garage_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  // नवीन ग्राहक जोडणे किंवा जुना एडिट करणे
  const handleSaveCustomer = (e) => {
    e.preventDefault();

    if (editingId) {
      // एडिट अपडेट लॉजिक
      const updated = customers.map((c) => {
        if (c.id === editingId) {
          return {
            ...c,
            name: name.trim(),
            phone: phone.trim(),
            vehicle_number: vehicleNumber.trim().toUpperCase(),
            model: vehicleModel.trim() || 'इतर',
          };
        }
        return c;
      });

      setCustomers(updated);
      localStorage.setItem('garage_customers', JSON.stringify(updated));
      setSuccessMsg('ग्राहकाची माहिती यशस्वीरित्या अपडेट केली!');
      setEditingId(null);
    } else {
      // नवीन ग्राहक जोडणे
      const newCustomer = {
        id: Date.now(),
        name: name.trim(),
        phone: phone.trim(),
        vehicle_number: vehicleNumber.trim().toUpperCase(),
        model: vehicleModel.trim() || 'इतर',
      };

      const updatedCustomers = [newCustomer, ...customers];
      setCustomers(updatedCustomers);
      localStorage.setItem('garage_customers', JSON.stringify(updatedCustomers));
      setSuccessMsg('नवीन ग्राहक यशस्वीरित्या जोडला!');
    }

    // फॉर्म रिकामा करणे
    setName('');
    setPhone('');
    setVehicleNumber('');
    setVehicleModel('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // एडिट सुरू करणे
  const startEdit = (customer) => {
    setEditingId(customer.id);
    setName(customer.name);
    setPhone(customer.phone);
    setVehicleNumber(customer.vehicle_number);
    setVehicleModel(customer.model === 'इतर' ? '' : customer.model);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // एडिट रद्द करणे
  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setVehicleNumber('');
    setVehicleModel('');
  };

  // ग्राहक डिलीट करणे
  const handleDeleteCustomer = (id, customerName) => {
    if (confirm(`तुम्हाला खात्री आहे का? "${customerName}" या ग्राहकाची नोंद कायमची हटवायची आहे?`)) {
      const updated = customers.filter((c) => c.id !== id);
      setCustomers(updated);
      localStorage.setItem('garage_customers', JSON.stringify(updated));
      setSuccessMsg('ग्राहकाची नोंद हटवली गेली!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // सर्च फिल्टर
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.vehicle_number?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* हेडर */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800">ग्राहक आणि वाहने</h1>
              <p className="text-xs text-slate-500">नोंदणी, फेरबदल व व्यवस्थापन</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* फॉर्म (जोडणे / एडिट करणे) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-32">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Pencil className="w-5 h-5 text-amber-500" />
                    माहिती एडिट करा
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-blue-600" />
                    नवीन ग्राहक जोडा
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

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ग्राहकाचे पूर्ण नाव *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. राजेश पाटील"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  मोबाईल नंबर (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="उदा. 9876543210"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <hr className="border-slate-100 my-2" />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  गाडीचा नंबर (Vehicle No.) *
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
                  गाडीचे मॉडेल / नाव
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="उदा. Honda Activa"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
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
                  {editingId ? 'अपडेट करा' : 'ग्राहक सेव्ह करा'}
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

        {/* ग्राहक यादी */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                नोंदणीकृत ग्राहक ({filteredCustomers.length})
              </h2>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="नाव, नंबर किंवा गाडी शोधा..."
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                कोणताही ग्राहक आढळला नाही.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">
                        {customer.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                        {customer.phone}
                      </p>
                      <div className="mt-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-blue-600" />
                          {customer.vehicle_number} ({customer.model})
                        </span>
                      </div>
                    </div>

                    {/* एडिट आणि डिलीट बटन्स */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => startEdit(customer)}
                        className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="माहिती बदला"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="काढून टाका"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}