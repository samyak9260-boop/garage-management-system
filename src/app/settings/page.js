'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  ArrowLeft, 
  Save, 
  CheckCircle2,
  Download,
  Upload,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [garageName, setGarageName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [upiId, setUpiId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // सेव्ह केलेली माहिती लोड करणे
  useEffect(() => {
    const savedProfile = localStorage.getItem('garage_profile');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setGarageName(data.garageName || '');
      setOwnerName(data.ownerName || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
      setUpiId(data.upiId || '');
    }
  }, []);

  // प्रोफाईल सेव्ह करणे
  const handleSaveProfile = (e) => {
    e.preventDefault();

    const profileData = {
      garageName: garageName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      upiId: upiId.trim(),
    };

    localStorage.setItem('garage_profile', JSON.stringify(profileData));
    setSuccessMsg('गॅरेज प्रोफाईल यशस्वीरित्या सेव्ह झाली!');

    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // संपूर्ण डेटा JSON फाईलमध्ये बॅकअप/डाऊनलोड करणे
  const handleExportBackup = () => {
    const customers = JSON.parse(localStorage.getItem('garage_customers') || '[]');
    const services = JSON.parse(localStorage.getItem('garage_services') || '[]');
    const profile = JSON.parse(localStorage.getItem('garage_profile') || '{}');

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toLocaleString('en-IN'),
      profile,
      customers,
      services,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garage_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccessMsg('बॅकअप फाईल यशस्वीरित्या डाऊनलोड झाली!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // डाऊनलोड केलेली फाईल अपलोड करून डेटा रिस्टोअर करणे
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        if (!parsed.customers && !parsed.services && !parsed.profile) {
          alert('अवैध बॅकअप फाईल! कृपया योग्य JSON फाईल निवडा.');
          return;
        }

        if (parsed.customers) {
          localStorage.setItem('garage_customers', JSON.stringify(parsed.customers));
        }
        if (parsed.services) {
          localStorage.setItem('garage_services', JSON.stringify(parsed.services));
        }
        if (parsed.profile) {
          localStorage.setItem('garage_profile', JSON.stringify(parsed.profile));
          setGarageName(parsed.profile.garageName || '');
          setOwnerName(parsed.profile.ownerName || '');
          setPhone(parsed.profile.phone || '');
          setAddress(parsed.profile.address || '');
          setUpiId(parsed.profile.upiId || '');
        }

        setSuccessMsg('डेटा यशस्वीरित्या पूर्ववत (Restore) झाला!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        alert('फाईल वाचण्यात अडचण आली. कृपया योग्य फाईल निवडा.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* हेडर */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                गॅरेज प्रोफाईल व सेटिंग्स
              </h1>
              <p className="text-xs text-slate-500">गॅरेजचे नाव, पत्ता व डेटा बॅकअप व्यवस्थापन</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {/* प्रोफाईल फॉर्म कार्ड */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {successMsg && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-2.5 rounded-xl flex items-center text-xs gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            गॅरेज प्रोफाईल माहिती
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                गॅरेजचे नाव (Garage Name) *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={garageName}
                  onChange={(e) => setGarageName(e.target.value)}
                  placeholder="उदा. Qulity Garage"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  चालकाचे / मालकाचे नाव
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="उदा. sonya khaire"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  संपर्क मोबाईल नंबर *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="उदा. 7499935620"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                गॅरेजचा पत्ता
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="उदा. rahatni"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                UPI ID (पेमेंट स्वीकारण्यासाठी)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="उदा. 3665525@upi"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
              >
                <Save className="w-4 h-4" />
                माहिती सेव्ह करा
              </button>
            </div>
          </form>
        </div>

        {/* डेटा बॅकअप आणि रिस्टोअर कार्ड */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            डेटा बॅकअप व सुरक्षा (Backup & Restore)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            तुमचा सर्व डेटा (ग्राहक, गाड्या, बिले आणि सर्व्हिस नोंदी) एका फाईलमध्ये सुरक्षित डाऊनलोड करा किंवा नवीन डिव्हाइसवर परत लोड करा.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* डाऊनलोड बॅकअप */}
            <button
              onClick={handleExportBackup}
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition"
            >
              <Download className="w-4 h-4" />
              संपूर्ण डेटा बॅकअप डाऊनलोड करा
            </button>

            {/* अपलोड बॅकअप */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportBackup}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition"
              >
                <Upload className="w-4 h-4" />
                बॅकअप फाईल अपलोड (Restore) करा
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}