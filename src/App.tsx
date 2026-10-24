import React, { useMemo, useState, useEffect } from 'react';
import {
  Truck,
  Package,
  Building2,
  Gavel,
  Calculator,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Route,
  Boxes,
  EyeOff,
  BadgeCheck,
  Send,
  Activity,
  Filter,
  Download,
  Share2,
  Phone,
  Navigation,
  Globe,
  Smartphone,
  Maximize2,
  X,
  Compass,
  Check,
  AlertCircle,
  Sparkles,
  Wifi,
  WifiOff,
  Battery,
  Layers,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from './hooks/usePWA';

export type Role = 'Party' | 'First Transporter' | 'Second Transporter' | 'Truck Owner' | 'Admin';
export type Language = 'en' | 'hi';

export interface Bid {
  id: number;
  transporter: string;
  transporterHi?: string;
  amount: number;
  days: number;
  truck: string;
  verified: boolean;
  status: 'Pending' | 'Winner' | 'Not selected';
  submittedAt: string;
}

export interface Load {
  id: string;
  from: string;
  to: string;
  cargo: string;
  cargoHi: string;
  weight: number;
  dimensions: string;
  deadline: string;
  estimate: number;
  status: 'Bidding open' | 'Awaiting admin' | 'Assigned';
  bids: Bid[];
  party: string;
  distance: number;
  pickupDate: string;
  truckTypeRequired: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: string;
  etaHours?: number;
}

const initialLoads: Load[] = [
  {
    id: 'RF-1024',
    from: 'Jaipur, Rajasthan',
    to: 'Ahmedabad, Gujarat',
    cargo: 'Industrial packaging',
    cargoHi: 'औद्योगिक पैकेजिंग बॉक्स',
    weight: 5000,
    dimensions: '300 × 150 × 150 cm',
    deadline: '2 days',
    estimate: 25000,
    status: 'Bidding open',
    party: 'Shree Industries',
    distance: 675,
    pickupDate: 'Tomorrow 9:00 AM',
    truckTypeRequired: '14 ft truck (3-5T)',
    driverName: 'Rameshwar Gurjar',
    driverPhone: '+91 98290 XXXXX',
    currentLocation: 'Udaipur Bypass (NH-48)',
    etaHours: 11,
    bids: [
      { id: 1, transporter: 'Kamal Logistics', amount: 23500, days: 2, truck: '14 ft truck', verified: true, status: 'Pending', submittedAt: '25 min ago' },
      { id: 2, transporter: 'Rajasthan Freight Co.', amount: 22800, days: 2, truck: '17 ft truck', verified: true, status: 'Pending', submittedAt: '1 hr ago' },
      { id: 3, transporter: 'Marwar Cargo Lines', amount: 24000, days: 1, truck: '14 ft truck', verified: true, status: 'Pending', submittedAt: '3 hrs ago' }
    ]
  },
  {
    id: 'RF-1025',
    from: 'Kota, Rajasthan',
    to: 'Indore, Madhya Pradesh',
    cargo: 'Agricultural equipment',
    cargoHi: 'कृषि उपकरण पार्ट्स',
    weight: 3200,
    dimensions: '240 × 140 × 130 cm',
    deadline: '3 days',
    estimate: 18500,
    status: 'Bidding open',
    party: 'Kisan Machinery Ltd.',
    distance: 390,
    pickupDate: 'Today 5:00 PM',
    truckTypeRequired: '14 ft truck (3-5T)',
    driverName: 'Suresh Jat',
    driverPhone: '+91 94140 XXXXX',
    currentLocation: 'Jhalawar Toll Gate',
    etaHours: 6,
    bids: [
      { id: 4, transporter: 'Shakti Roadways', amount: 17200, days: 3, truck: '14 ft truck', verified: true, status: 'Pending', submittedAt: '4 hrs ago' },
      { id: 5, transporter: 'Highway Cargo Service', amount: 17900, days: 2, truck: '17 ft truck', verified: false, status: 'Pending', submittedAt: '6 hrs ago' }
    ]
  },
  {
    id: 'RF-1026',
    from: 'Ajmer, Rajasthan',
    to: 'Delhi, NCR',
    cargo: 'Textile cotton rolls',
    cargoHi: 'टेक्सटाइल कॉटन रोल्स',
    weight: 7000,
    dimensions: '350 × 180 × 160 cm',
    deadline: '1 day',
    estimate: 31000,
    status: 'Awaiting admin',
    party: 'Aarav Textiles Export',
    distance: 410,
    pickupDate: 'Ready for loading',
    truckTypeRequired: '19 ft truck (7-9T)',
    driverName: 'Virendra Yadav',
    driverPhone: '+91 98110 XXXXX',
    currentLocation: 'Manesar Express Corridor',
    etaHours: 3,
    bids: [
      { id: 6, transporter: 'Northline Fast Transport', amount: 29500, days: 1, truck: '19 ft truck', verified: true, status: 'Pending', submittedAt: '3 hrs ago' },
      { id: 7, transporter: 'Kamal Logistics', amount: 30200, days: 1, truck: '19 ft truck', verified: true, status: 'Pending', submittedAt: '5 hrs ago' }
    ]
  },
  {
    id: 'RF-1027',
    from: 'Bhilwara, Rajasthan',
    to: 'Surat, Gujarat',
    cargo: 'Yarn & fabric bundles',
    cargoHi: 'धागा और कपड़ा बंडल',
    weight: 9500,
    dimensions: '420 × 200 × 200 cm',
    deadline: '2 days',
    estimate: 42000,
    status: 'Assigned',
    party: 'Surat Weaving Mill',
    distance: 720,
    pickupDate: 'In Transit',
    truckTypeRequired: '22 ft multi-axle',
    driverName: 'Harpreet Singh',
    driverPhone: '+91 98765 XXXXX',
    currentLocation: 'Godhra Highway Bypass',
    etaHours: 5,
    bids: [
      { id: 8, transporter: 'Gujarat Rajasthan Express', amount: 39500, days: 2, truck: '22 ft truck', verified: true, status: 'Winner', submittedAt: '1 day ago' }
    ]
  }
];

const money = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<Role>('Party');
  const [activeTab, setActiveTab] = useState<'loads' | 'calculator' | 'bids' | 'tracking' | 'profile'>('loads');
  const [viewMode, setViewMode] = useState<'phone' | 'full'>('phone');
  const [loads, setLoads] = useState<Load[]>(initialLoads);
  const [selectedLoadId, setSelectedLoadId] = useState<string>('RF-1024');
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showBidSheet, setShowBidSheet] = useState<boolean>(false);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Filters
  const [query, setQuery] = useState('');
  const [truckFilter, setTruckFilter] = useState('All');

  // Bid form
  const [bidAmountInput, setBidAmountInput] = useState('');
  const [chosenTruckType, setChosenTruckType] = useState('14 ft truck');

  // Calculator Form
  const [calcForm, setCalcForm] = useState({
    from: 'Jaipur, Rajasthan',
    to: 'Ahmedabad, Gujarat',
    cargo: 'Industrial packaging',
    weight: '5000',
    distance: 675,
    days: '2',
    length: '300',
    breadth: '150',
    height: '150'
  });

  const [truckRateKm, setTruckRateKm] = useState(35);
  const [otherTolls, setOtherTolls] = useState(3500);
  const [adminMargin, setAdminMargin] = useState(10);

  // PWA Hooks
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Current active load
  const activeLoad = loads.find(l => l.id === selectedLoadId) || loads[0];

  // Calculated freight
  const volumeM3 = ((Number(calcForm.length) || 0) * (Number(calcForm.breadth) || 0) * (Number(calcForm.height) || 0)) / 1000000;
  const calculatedEstimate = Math.round(((calcForm.distance || 0) * truckRateKm + otherTolls) * (1 + adminMargin / 100));

  function notify(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 3500);
  }

  // Dictionary for Bilingual Hindi/English UI
  const t = {
    appTitle: lang === 'hi' ? 'रूटफ्लो ट्रांसपोर्ट' : 'RouteFlow Mobile',
    loadsTab: lang === 'hi' ? 'लॉट्स' : 'Loads',
    calcTab: lang === 'hi' ? 'भाड़ा' : 'Calculator',
    bidsTab: lang === 'hi' ? 'सौदे' : 'My Bids',
    trackTab: lang === 'hi' ? 'ट्रैकिंग' : 'Live GPS',
    profileTab: lang === 'hi' ? 'प्रोफाइल' : 'Account',
    searchPlaceholder: lang === 'hi' ? 'रूट या माल खोजें (उदा. जयपुर)...' : 'Search lane, cargo, city...',
    allLoads: lang === 'hi' ? 'सभी लॉट्स' : 'All Loads',
    biddingOpen: lang === 'hi' ? 'बिडिंग चालू' : 'Bidding Open',
    assigned: lang === 'hi' ? 'गाड़ी तय (Assigned)' : 'Assigned',
    postLoad: lang === 'hi' ? 'नया लोड डालें' : 'Post New Load',
    bidNow: lang === 'hi' ? 'रेट लगाएं (Bid)' : 'Submit Bid',
    details: lang === 'hi' ? 'विवरण' : 'Details',
    sealedInfo: lang === 'hi' ? 'गोपनीय बिडिंग: रेट और ट्रांसपोर्टर का नाम सुरक्षित है।' : 'Sealed Bidding: Quotes remain hidden until admin awards contract.',
    origin: lang === 'hi' ? 'कहाँ से (Pickup)' : 'Origin',
    destination: lang === 'hi' ? 'कहाँ तक (Delivery)' : 'Destination',
    weight: lang === 'hi' ? 'वजन (किलो)' : 'Weight (kg)',
    distance: lang === 'hi' ? 'दूरी (किमी)' : 'Distance (km)',
    estBudget: lang === 'hi' ? 'अनुमानित भाड़ा (Target)' : 'Estimated Freight Budget',
    createOrderBtn: lang === 'hi' ? 'लोड पोस्ट करें' : 'Create & Post Order',
    roleLabel: lang === 'hi' ? 'आपका रोल' : 'Active Role',
    installApp: lang === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'
  };

  const roleLabels: Record<Role, { en: string; hi: string; subtitle: string }> = {
    'Party': { en: 'Party (Shipper)', hi: 'पार्टी (माल भेजने वाला)', subtitle: 'Post freight & track quotes' },
    'First Transporter': { en: 'Broker Desk', hi: 'ट्रांसपोर्ट ब्रोकर', subtitle: 'Primary freight partner' },
    'Second Transporter': { en: 'Fleet Operator', hi: 'लोकल ट्रांसपोर्टर', subtitle: 'Execution fleet partner' },
    'Truck Owner': { en: 'Truck Owner', hi: 'गाड़ी मालिक (ड्राइवर)', subtitle: 'Direct vehicle owner' },
    'Admin': { en: 'Admin Operations', hi: 'सुपर एडमिन कंट्रोल', subtitle: 'Contract award & pricing' }
  };

  // Submit Bid
  function handlePlaceBid() {
    const amt = Number(bidAmountInput);
    if (!amt || amt <= 0) {
      notify(lang === 'hi' ? 'कृपया सही राशि भरें।' : 'Please enter a valid bid amount.');
      return;
    }

    const bidderName =
      role === 'Truck Owner'
        ? 'Apex Trucklines (Your Truck)'
        : role === 'Second Transporter'
        ? 'Regional Express (Your Team)'
        : 'Broker Connect (Your Firm)';

    setLoads(prev =>
      prev.map(l => {
        if (l.id === activeLoad.id) {
          const newBid: Bid = {
            id: Date.now(),
            transporter: bidderName,
            amount: amt,
            days: Number(l.deadline.split(' ')[0]) || 2,
            truck: chosenTruckType,
            verified: true,
            status: 'Pending',
            submittedAt: 'Just now'
          };
          return { ...l, bids: [newBid, ...l.bids] };
        }
        return l;
      })
    );

    setBidAmountInput('');
    setShowBidSheet(false);
    notify(lang === 'hi' ? `₹${amt} की बोली दर्ज हो गई!` : `Bid of ${money(amt)} placed successfully!`);
  }

  // Create Order
  function handleCreateOrder() {
    if (!calcForm.from || !calcForm.to || Number(calcForm.weight) <= 0) {
      notify(lang === 'hi' ? 'कृपया सभी जानकारी भरें।' : 'Please provide route and cargo specs.');
      return;
    }
    const newId = `RF-${1028 + loads.length - 4}`;
    const newLoad: Load = {
      id: newId,
      from: calcForm.from,
      to: calcForm.to,
      cargo: calcForm.cargo || 'Commercial Freight',
      cargoHi: calcForm.cargo || 'व्यापारिक माल',
      weight: Number(calcForm.weight),
      dimensions: `${calcForm.length} × ${calcForm.breadth} × ${calcForm.height} cm`,
      deadline: `${calcForm.days} days`,
      estimate: calculatedEstimate,
      status: 'Bidding open',
      party: 'You (Demo Party)',
      distance: calcForm.distance,
      pickupDate: 'Tomorrow Morning',
      truckTypeRequired: '14 ft truck (3-5T)',
      driverName: 'Assigned on award',
      driverPhone: 'Revealed on award',
      currentLocation: 'Origin loading yard',
      bids: []
    };

    setLoads([newLoad, ...loads]);
    setSelectedLoadId(newId);
    setShowOrderModal(false);
    setActiveTab('loads');
    notify(lang === 'hi' ? `लोड #${newId} सफलतापूर्वक पोस्ट हो गया!` : `Order #${newId} posted for bidding!`);
  }

  // Award Winner (Admin)
  function handleAward(loadId: string, bidId: number) {
    setLoads(prev =>
      prev.map(l => {
        if (l.id === loadId) {
          return {
            ...l,
            status: 'Assigned',
            bids: l.bids.map(b => ({
              ...b,
              status: b.id === bidId ? 'Winner' : 'Not selected'
            }))
          };
        }
        return l;
      })
    );
    notify(lang === 'hi' ? 'ट्रांसपोर्टर को आर्डर दे दिया गया!' : 'Transporter awarded successfully!');
  }

  // Filtered Loads
  const filteredLoads = useMemo(() => {
    return loads.filter(l => {
      const matchText = (l.from + ' ' + l.to + ' ' + l.cargo + ' ' + l.cargoHi + ' ' + l.id).toLowerCase();
      const matchQuery = matchText.includes(query.toLowerCase());
      if (!matchQuery) return false;
      if (truckFilter === 'Open') return l.status === 'Bidding open';
      if (truckFilter === 'Assigned') return l.status === 'Assigned';
      return true;
    });
  }, [loads, query, truckFilter]);

  const canBid = ['First Transporter', 'Second Transporter', 'Truck Owner'].includes(role);

  return (
    <div className="min-h-screen bg-[#08130f] text-[#1d2c27] flex flex-col items-center justify-center p-0 sm:p-4">
      {/* Top Desktop Controls Bar */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between py-2 px-3 text-xs text-[#9bb5a6]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#c5f36b] animate-ping" />
          <span className="font-semibold text-white tracking-wide">RouteFlow Mobile App</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'phone' ? 'full' : 'phone')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#142921] hover:bg-[#1e3b30] rounded-lg text-white border border-[#2b4c3e] transition text-[11px]"
          >
            {viewMode === 'phone' ? (
              <>
                <Maximize2 size={12} />
                <span>Full Width</span>
              </>
            ) : (
              <>
                <Smartphone size={12} />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Mobile App Frame */}
      <div
        className={`${
          viewMode === 'phone' ? 'mobile-device-frame' : 'w-full max-w-2xl min-h-screen bg-[#f5f7f5]'
        } flex flex-col`}
      >
        {/* Mobile Top Status Bar */}
        <div className="bg-[#10251f] text-white px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-medium tracking-tight select-none">
          <span>09:41</span>
          <div className="flex items-center gap-2 text-[#a2baa8]">
            <span className="text-[10px] uppercase font-bold tracking-wider">5G</span>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} className="text-amber-400" />}
            <div className="flex items-center">
              <span className="text-[10px] mr-1">98%</span>
              <Battery size={15} />
            </div>
          </div>
        </div>

        {/* Offline Notification */}
        {!isOnline && (
          <div className="bg-amber-500 text-black px-4 py-1.5 text-[11px] font-bold flex items-center justify-center gap-1.5 animate-pulse">
            <WifiOff size={13} />
            <span>{lang === 'hi' ? 'ऑफलाइन मोड: कैश्ड डेटा इस्तेमाल हो रहा है' : 'Offline Mode: Using cached route data'}</span>
          </div>
        )}

        {/* Mobile App Bar Header */}
        <header className="bg-[#10251f] text-white px-4 py-3 flex items-center justify-between border-b border-[#213f33] shadow-md z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c5f36b] text-[#10251f] flex items-center justify-center font-extrabold shadow-sm">
              <Route size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white leading-tight">
                {t.appTitle}
              </div>
              <button
                onClick={() => setShowRoleModal(true)}
                className="flex items-center gap-1 text-[10px] text-[#c5f36b] hover:underline"
              >
                <span>{roleLabels[role][lang]}</span>
                <ChevronDown size={11} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#193a2e] text-[#c5f36b] border border-[#2b5443] text-[10px] font-bold"
              title="Switch Language / भाषा बदलें"
            >
              <Globe size={11} />
              <span>{lang === 'en' ? 'हिन्दी' : 'ENG'}</span>
            </button>

            {/* In-App PWA Install Button */}
            {isInstallable && (
              <button
                onClick={install}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#c5f36b] text-[#10251f] font-bold text-[10px] shadow-sm animate-bounce"
              >
                <Download size={11} />
                <span>{t.installApp}</span>
              </button>
            )}

            {isIOS && !isInstalled && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#193a2e] text-white text-[10px]"
              >
                <Download size={11} />
                <span>iOS</span>
              </button>
            )}

            {/* Notifications */}
            <button
              onClick={() => notify(lang === 'hi' ? 'नई बोली: जयपुर-अहमदाबाद रूट पर 3 बोलियां तैयार हैं।' : 'Notification: 3 quotes ready on Jaipur-Ahmedabad lane.')}
              className="relative p-1.5 rounded-lg bg-[#193a2e] text-[#a4baa9] hover:text-white"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#c5f36b]" />
            </button>
          </div>
        </header>

        {/* Scrollable Mobile Body Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#f5f7f5] pb-24">
          {/* TAB 1: LOADS & MARKETPLACE */}
          {activeTab === 'loads' && (
            <div className="p-4 space-y-3.5">
              {/* Mobile Search & Action Bar */}
              <div className="space-y-2">
                <div className="relative flex items-center">
                  <Search size={15} className="absolute left-3 text-[#798e81]" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#dee6de] rounded-xl shadow-2xs focus:outline-none focus:border-[#4d8b39]"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-3 text-[#798e81] p-1"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Status Chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    onClick={() => setTruckFilter('All')}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                      truckFilter === 'All'
                        ? 'bg-[#10251f] text-white'
                        : 'bg-white text-[#52685a] border border-[#dce4dc]'
                    }`}
                  >
                    {t.allLoads} ({loads.length})
                  </button>
                  <button
                    onClick={() => setTruckFilter('Open')}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                      truckFilter === 'Open'
                        ? 'bg-[#3b7829] text-white'
                        : 'bg-white text-[#52685a] border border-[#dce4dc]'
                    }`}
                  >
                    {t.biddingOpen}
                  </button>
                  <button
                    onClick={() => setTruckFilter('Assigned')}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                      truckFilter === 'Assigned'
                        ? 'bg-[#2561aa] text-white'
                        : 'bg-white text-[#52685a] border border-[#dce4dc]'
                    }`}
                  >
                    {t.assigned}
                  </button>
                </div>
              </div>

              {/* Shippers Quick Post Action Banner */}
              {role === 'Party' && (
                <div className="bg-gradient-to-r from-[#17382d] to-[#255242] p-3.5 rounded-2xl text-white shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#c5f36b] font-bold uppercase tracking-wider">
                      {lang === 'hi' ? 'माल भेजने के लिए' : 'Have Cargo to Transport?'}
                    </div>
                    <div className="text-xs font-bold mt-0.5">
                      {lang === 'hi' ? 'ट्रांसपोर्टर से डायरेक्ट रेट पाएं' : 'Get fast quotes from verified trucks'}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="bg-[#c5f36b] hover:bg-[#b0e550] text-[#10251f] px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                  >
                    <Plus size={15} />
                    <span>{t.postLoad}</span>
                  </button>
                </div>
              )}

              {/* Load Cards List */}
              <div className="space-y-3">
                {filteredLoads.map(load => {
                  const hasWinner = load.bids.some(b => b.status === 'Winner');
                  return (
                    <div
                      key={load.id}
                      onClick={() => {
                        setSelectedLoadId(load.id);
                        setShowDetailModal(true);
                      }}
                      className="bg-white rounded-2xl border border-[#e2e8e2] p-3.5 shadow-xs hover:border-[#a4c997] transition cursor-pointer active:scale-[0.99]"
                    >
                      {/* Top Row: ID & Status */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f0]">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[11px] text-[#346b3b] bg-[#eef7ea] px-2 py-0.5 rounded-md">
                            {load.id}
                          </span>
                          <span className="text-[10px] text-[#6d7f73] font-medium">
                            {load.pickupDate}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            load.status === 'Assigned'
                              ? 'bg-[#e7f1fc] text-[#2263b3]'
                              : 'bg-[#eaf6e4] text-[#3e7d2b]'
                          }`}
                        >
                          {load.status === 'Assigned' ? t.assigned : t.biddingOpen}
                        </span>
                      </div>

                      {/* Route Row */}
                      <div className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#468235]" />
                            <span className="w-0.5 h-6 bg-[#d1ddd1]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#d97732]" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="text-xs font-bold text-[#182921] truncate">{load.from}</div>
                            <div className="text-xs font-bold text-[#182921] truncate">{load.to}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-extrabold text-[#1a2d24]">
                              {load.distance} km
                            </div>
                            <div className="text-[10px] text-[#718477]">
                              {load.deadline}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cargo & Truck Spec */}
                      <div className="bg-[#f8faf8] p-2.5 rounded-xl border border-[#ebf0eb] flex items-center justify-between text-xs mt-1">
                        <div>
                          <div className="font-bold text-[#1a2d24] text-[11px]">
                            {lang === 'hi' ? load.cargoHi : load.cargo}
                          </div>
                          <div className="text-[10px] text-[#65776a] mt-0.5">
                            {load.weight.toLocaleString('en-IN')} kg • {load.dimensions}
                          </div>
                        </div>
                        <div className="text-right font-medium text-[10px] text-[#4d6a57] bg-white px-2 py-1 rounded-md border border-[#e1e9e0]">
                          {load.truckTypeRequired}
                        </div>
                      </div>

                      {/* Card Bottom: Quotes count & Action */}
                      <div className="mt-3 pt-2.5 border-t border-[#f0f4f0] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[#526659]">
                          <Gavel size={14} className="text-[#457c39]" />
                          <span className="font-semibold">{load.bids.length} quotes</span>
                          {role === 'Admin' && (
                            <span className="text-[10px] text-[#2c6534] font-bold ml-1">
                              (Target: {money(load.estimate)})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {canBid && load.status === 'Bidding open' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedLoadId(load.id);
                                setShowBidSheet(true);
                              }}
                              className="px-3 py-1.5 bg-[#c5f36b] hover:bg-[#b0e550] text-[#10251f] font-extrabold text-[11px] rounded-lg shadow-2xs transition active:scale-95 flex items-center gap-1"
                            >
                              <Send size={11} />
                              <span>{t.bidNow}</span>
                            </button>
                          )}

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedLoadId(load.id);
                              setShowDetailModal(true);
                            }}
                            className="px-2.5 py-1.5 bg-white border border-[#d6e0d6] text-[#2b4235] text-[11px] font-bold rounded-lg hover:bg-[#f6faf5]"
                          >
                            {t.details}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredLoads.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8e2] p-6">
                    <Package size={34} className="mx-auto text-[#9fb3a6] mb-2" />
                    <div className="text-xs font-bold text-[#2d4236]">No matching loads found</div>
                    <p className="text-[11px] text-[#768a7c] mt-1">
                      Try searching for other routes or clear filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FREIGHT CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="p-4 space-y-3.5">
              <div className="bg-white p-4 rounded-2xl border border-[#e2e8e2] shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f0]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#ecf7e4] text-[#3e7e2c] flex items-center justify-center font-bold">
                      <Calculator size={17} />
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-[#1a2d24]">
                        {lang === 'hi' ? 'मोबाइल भाड़ा कैलकुलेटर' : 'Freight Rate Estimator'}
                      </h2>
                      <div className="text-[10px] text-[#6d8073]">
                        {lang === 'hi' ? 'रूट और माल के अनुसार बजट निकालें' : 'Instant benchmark rate calculation'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#3d7034] bg-[#eef7ea] px-2 py-0.5 rounded-full">
                    Formula v1.2
                  </span>
                </div>

                {/* Preset Lane Chips */}
                <div>
                  <div className="text-[10px] font-bold text-[#627768] uppercase mb-1.5">
                    {lang === 'hi' ? 'मशहूर लेन (त्वरित चयन)' : 'Popular Freight Corridors'}
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {[
                      { from: 'Jaipur, Rajasthan', to: 'Ahmedabad, Gujarat', km: 675 },
                      { from: 'Delhi, NCR', to: 'Mumbai, Maharashtra', km: 1420 },
                      { from: 'Indore, MP', to: 'Surat, Gujarat', km: 460 },
                      { from: 'Kota, Rajasthan', to: 'Kanpur, UP', km: 520 }
                    ].map(corridor => (
                      <button
                        key={corridor.from + corridor.to}
                        onClick={() =>
                          setCalcForm({
                            ...calcForm,
                            from: corridor.from,
                            to: corridor.to,
                            distance: corridor.km
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#f4f8f3] border border-[#d8e3d7] text-[10px] font-semibold text-[#273d30] whitespace-nowrap active:bg-[#c5f36b]"
                      >
                        {corridor.from.split(',')[0]} → {corridor.to.split(',')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-[#556b5d] mb-1">
                      {t.origin}
                    </label>
                    <input
                      type="text"
                      value={calcForm.from}
                      onChange={e => setCalcForm({ ...calcForm, from: e.target.value })}
                      className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-xs font-medium focus:outline-none focus:border-[#4d8b39]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#556b5d] mb-1">
                      {t.destination}
                    </label>
                    <input
                      type="text"
                      value={calcForm.to}
                      onChange={e => setCalcForm({ ...calcForm, to: e.target.value })}
                      className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-xs font-medium focus:outline-none focus:border-[#4d8b39]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#556b5d] mb-1">
                        {t.weight}
                      </label>
                      <input
                        type="number"
                        value={calcForm.weight}
                        onChange={e => setCalcForm({ ...calcForm, weight: e.target.value })}
                        className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#556b5d] mb-1">
                        {t.distance}
                      </label>
                      <input
                        type="number"
                        value={calcForm.distance}
                        onChange={e => setCalcForm({ ...calcForm, distance: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Volumetric Dimensions */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#556b5d] mb-1">
                      <span>Dimensions (cm): L × W × H</span>
                      <span className="text-[#3b792b]">{volumeM3.toFixed(2)} m³ Volumetric</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={calcForm.length}
                        onChange={e => setCalcForm({ ...calcForm, length: e.target.value })}
                        placeholder="Length"
                        className="w-full px-2 py-1.5 bg-[#f8faf8] border border-[#d6e0d5] rounded-lg text-center text-xs"
                      />
                      <input
                        type="number"
                        value={calcForm.breadth}
                        onChange={e => setCalcForm({ ...calcForm, breadth: e.target.value })}
                        placeholder="Width"
                        className="w-full px-2 py-1.5 bg-[#f8faf8] border border-[#d6e0d5] rounded-lg text-center text-xs"
                      />
                      <input
                        type="number"
                        value={calcForm.height}
                        onChange={e => setCalcForm({ ...calcForm, height: e.target.value })}
                        placeholder="Height"
                        className="w-full px-2 py-1.5 bg-[#f8faf8] border border-[#d6e0d5] rounded-lg text-center text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Tuning Mode */}
                {role === 'Admin' && (
                  <div className="p-3 bg-[#eef6eb] rounded-xl border border-[#d3e5cf] space-y-2">
                    <div className="text-[10px] font-bold text-[#326927] uppercase">
                      Admin Rate Calibration
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[9px] text-[#556959]">₹ / km</span>
                        <input
                          type="number"
                          value={truckRateKm}
                          onChange={e => setTruckRateKm(Math.max(0, Number(e.target.value)))}
                          className="w-full bg-white border border-[#cbd8c9] rounded p-1 text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-[#556959]">Tolls (₹)</span>
                        <input
                          type="number"
                          value={otherTolls}
                          onChange={e => setOtherTolls(Math.max(0, Number(e.target.value)))}
                          className="w-full bg-white border border-[#cbd8c9] rounded p-1 text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-[#556959]">Margin %</span>
                        <input
                          type="number"
                          value={adminMargin}
                          onChange={e => setAdminMargin(Math.max(0, Number(e.target.value)))}
                          className="w-full bg-white border border-[#cbd8c9] rounded p-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Output Banner */}
                <div className="bg-[#10251f] rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-[#a5bea9]">
                      {t.estBudget}
                    </div>
                    <div className="text-2xl font-black text-[#c5f36b] mt-0.5">
                      {money(calculatedEstimate)}
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-[#8ea794]">
                    <div>₹{(calculatedEstimate / Math.max(1, calcForm.distance)).toFixed(1)} / km</div>
                    <div>Estimated Transit: 2 days</div>
                  </div>
                </div>

                {/* Post Order Action */}
                {role === 'Party' ? (
                  <button
                    onClick={handleCreateOrder}
                    className="w-full py-3 bg-[#c5f36b] hover:bg-[#b0e550] text-[#10251f] font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
                  >
                    <Plus size={16} />
                    <span>{t.createOrderBtn}</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-[#6b7e72] bg-[#f8faf8] p-2 rounded-lg border border-[#e8eee8]">
                    {lang === 'hi'
                      ? 'नया लोड पोस्ट करने के लिए पार्टी (Shipper) रोल चुनें।'
                      : 'Switch to Party role to post this calculated order to live marketplace.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MY BIDS & ORDERS */}
          {activeTab === 'bids' && (
            <div className="p-4 space-y-3">
              <div className="bg-white p-3.5 rounded-2xl border border-[#e2e8e2] shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#ecf7e4] text-[#3e7e2c] flex items-center justify-center font-bold">
                      <Gavel size={17} />
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-[#1a2d24]">
                        {role === 'Party'
                          ? lang === 'hi'
                            ? 'मेरे पोस्ट किए गए ऑर्डर्स'
                            : 'Shipper Order Postings'
                          : lang === 'hi'
                          ? 'मेरी लगाई गई बोलियां'
                          : 'My Submitted Bids'}
                      </h2>
                      <div className="text-[10px] text-[#6d8073]">
                        {role === 'Party' ? 'Sealed quote protection active' : 'Direct feedback on awarded loads'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                {loads.map(load => {
                  const myBids = load.bids;
                  const winningBid = load.bids.find(b => b.status === 'Winner');
                  return (
                    <div
                      key={load.id}
                      className="bg-white p-3.5 rounded-2xl border border-[#e2e8e2] shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[11px] text-[#2c6534] bg-[#eef7ea] px-2 py-0.5 rounded">
                          {load.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            load.status === 'Assigned'
                              ? 'bg-[#e7f1fc] text-[#2263b3]'
                              : 'bg-[#eaf6e4] text-[#3e7d2b]'
                          }`}
                        >
                          {load.status}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-[#182921]">
                        {load.from} → {load.to}
                      </div>

                      <div className="text-[11px] text-[#617466] flex items-center justify-between bg-[#f8faf8] p-2 rounded-lg border border-[#eaf0ea]">
                        <span>Cargo: {lang === 'hi' ? load.cargoHi : load.cargo}</span>
                        <span className="font-bold text-[#182921]">{load.weight} kg</span>
                      </div>

                      {/* Bids status box */}
                      {role === 'Party' && load.status !== 'Assigned' ? (
                        <div className="p-2.5 bg-[#f6faf5] rounded-xl border border-[#e2ece0] flex items-start gap-2 text-xs">
                          <EyeOff size={15} className="text-[#3c7230] shrink-0 mt-0.5" />
                          <div className="text-[11px] text-[#55695a]">
                            <strong className="text-[#1a2d24]">Quotes Confidential:</strong> {load.bids.length} quotes submitted. RouteFlow admin is reviewing competitive bids.
                          </div>
                        </div>
                      ) : load.status === 'Assigned' && winningBid ? (
                        <div className="p-2.5 bg-[#eaf4fe] rounded-xl border border-[#d2e4f7] text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#23589b]">AWARDED TRANSPORTER</span>
                            <span className="font-black text-[#1a2d24]">{money(winningBid.amount)}</span>
                          </div>
                          <div className="font-bold text-xs text-[#1c2e26] mt-1">
                            {winningBid.transporter}
                          </div>
                          <div className="text-[10px] text-[#516b7f] mt-0.5 flex items-center gap-2">
                            <span>{winningBid.truck}</span>
                            <span>•</span>
                            <span>Driver: {load.driverName || 'Rameshwar G.'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs space-y-1.5">
                          {myBids.map(b => (
                            <div
                              key={b.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-[#fafbfa] border border-[#eff3ef]"
                            >
                              <div>
                                <div className="font-semibold text-xs text-[#1a2d24]">{b.transporter}</div>
                                <div className="text-[10px] text-[#718476]">{b.truck} • {b.days} days</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-xs text-[#1a2d24]">{money(b.amount)}</div>
                                <div
                                  className={`text-[9px] font-bold ${
                                    b.status === 'Winner'
                                      ? 'text-[#2e7428]'
                                      : b.status === 'Not selected'
                                      ? 'text-[#9aa59d]'
                                      : 'text-[#946c21]'
                                  }`}
                                >
                                  {b.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-1 flex items-center justify-end">
                        <button
                          onClick={() => {
                            setSelectedLoadId(load.id);
                            setShowDetailModal(true);
                          }}
                          className="text-[11px] font-bold text-[#346b3b] hover:underline flex items-center gap-1"
                        >
                          <span>View Full Order Log</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE GPS TRACKING */}
          {activeTab === 'tracking' && (
            <div className="p-4 space-y-3.5">
              <div className="bg-white p-4 rounded-2xl border border-[#e2e8e2] shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f0]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#ecf7e4] text-[#3e7e2c] flex items-center justify-center font-bold">
                      <Navigation size={17} />
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-[#1a2d24]">
                        {lang === 'hi' ? 'लाइव गाड़ी ट्रैकिंग (GPS)' : 'Live Highway Convoy Tracking'}
                      </h2>
                      <div className="text-[10px] text-[#6d8073]">
                        {lang === 'hi' ? 'गाड़ी की लोकेशन और रूट स्थिति' : 'Active vehicle telemetry & ETA updates'}
                      </div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#346b3b] bg-[#eef7ea] px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#498835] animate-ping" />
                    <span>Live GPS</span>
                  </span>
                </div>

                {/* Simulated Map View Card */}
                <div className="relative h-44 rounded-xl bg-gradient-to-br from-[#10251f] via-[#1b3b30] to-[#142820] text-white p-3.5 overflow-hidden border border-[#2e5443] flex flex-col justify-between">
                  {/* Subtle highway grid lines */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <svg width="100%" height="100%">
                      <line x1="10%" y1="90%" x2="90%" y2="20%" stroke="#c5f36b" strokeWidth="4" strokeDasharray="6 4" />
                      <circle cx="10%" cy="90%" r="6" fill="#c5f36b" />
                      <circle cx="48%" cy="57%" r="8" fill="#ffffff" />
                      <circle cx="90%" cy="20%" r="6" fill="#c5f36b" />
                    </svg>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5f36b]">
                        Active Route: RF-1024
                      </span>
                      <div className="text-xs font-bold text-white mt-0.5">
                        NH-48 Golden Quadrilateral
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-[#c5f36b]">62 km/h</div>
                      <div className="text-[9px] text-[#9bb0a2]">Speed Telemetry</div>
                    </div>
                  </div>

                  {/* Truck status pin in center */}
                  <div className="relative z-10 bg-[#16382c]/90 backdrop-blur-xs p-2.5 rounded-xl border border-[#2d5c49] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#c5f36b] text-[#10251f] flex items-center justify-center font-bold shrink-0">
                      <Truck size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        Current: Udaipur Bypass, Rajasthan
                      </div>
                      <div className="text-[10px] text-[#a4baa9] truncate">
                        ETA Ahmedabad: ~11 hrs • Next Toll: Kherwara Plaza
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver & Truck Details */}
                <div className="bg-[#f8faf8] p-3 rounded-xl border border-[#e4ede3] space-y-2">
                  <div className="text-[10px] font-bold text-[#627768] uppercase">
                    Assigned Fleet & Driver
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#10251f] text-[#c5f36b] flex items-center justify-center font-bold text-xs">
                        RG
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1a2d24]">
                          {activeLoad.driverName || 'Rameshwar Gurjar'}
                        </div>
                        <div className="text-[10px] text-[#6d7e73]">
                          Truck: RJ-14-GA-8821 (14 ft Covered Container)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => notify(`Calling ${activeLoad.driverName || 'Driver'}... (Demo Simulator)`)}
                        className="p-2 rounded-xl bg-[#ecf7e4] text-[#3b792b] hover:bg-[#dff2d4] transition"
                        title="Call Driver"
                      >
                        <Phone size={15} />
                      </button>
                      <button
                        onClick={() => notify('Sharing live GPS tracking link via WhatsApp... (Demo Simulator)')}
                        className="p-2 rounded-xl bg-[#ecf7e4] text-[#3b792b] hover:bg-[#dff2d4] transition"
                        title="Share Tracking"
                      >
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Waypoints Timeline */}
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-bold text-[#627768] uppercase">
                    Trip Milestones
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#3b792b] shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-[#1a2d24]">Jaipur Industrial Yard</span>
                        <div className="text-[10px] text-[#718476]">Loaded & Dispatched • Yesterday 4:00 PM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#3b792b] shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-[#1a2d24]">Ajmer Highway Junction</span>
                        <div className="text-[10px] text-[#718476]">Checkpoint Passed • Last night 11:30 PM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border-2 border-[#3b792b] bg-white flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#3b792b] animate-ping" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-[#1a2d24]">Udaipur Bypass (In Transit)</span>
                        <div className="text-[10px] text-[#3b792b] font-medium">Currently crossing toll corridor</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 opacity-60">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-[#1a2d24]">Ahmedabad Consignee Warehouse</span>
                        <div className="text-[10px] text-[#718476]">Scheduled Delivery • Tomorrow 2:00 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT & ROLE SWITCHER */}
          {activeTab === 'profile' && (
            <div className="p-4 space-y-3.5">
              {/* Profile Card */}
              <div className="bg-white p-4 rounded-2xl border border-[#e2e8e2] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#10251f] text-[#c5f36b] flex items-center justify-center font-extrabold text-base shadow-sm">
                    {role.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-[#182921]">
                      {role} Account
                    </div>
                    <div className="text-xs text-[#63796c]">
                      {roleLabels[role][lang]}
                    </div>
                    <div className="text-[10px] text-[#346b3b] font-semibold mt-0.5">
                      ● Verified Logistics Session
                    </div>
                  </div>
                </div>

                {/* Role Switcher Matrix */}
                <div className="pt-2 border-t border-[#f0f4f0]">
                  <div className="text-[10px] font-bold text-[#627768] uppercase mb-2">
                    {lang === 'hi' ? 'रोल बदलें (Switch User Persona)' : 'Switch User Workspace'}
                  </div>
                  <div className="space-y-1.5">
                    {(Object.keys(roleLabels) as Role[]).map(r => {
                      const isCur = role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            setRole(r);
                            notify(`Switched to ${r} workspace`);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs ${
                            isCur
                              ? 'bg-[#10251f] text-white border-[#10251f] font-bold shadow-xs'
                              : 'bg-[#f8faf8] text-[#2c4033] border-[#e1e9e0] hover:bg-[#edf5ec]'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{roleLabels[r][lang]}</div>
                            <div className={`text-[10px] ${isCur ? 'text-[#a2baa8]' : 'text-[#738578]'}`}>
                              {roleLabels[r].subtitle}
                            </div>
                          </div>
                          {isCur && <Check size={16} className="text-[#c5f36b]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* PWA & Mobile App Settings */}
              <div className="bg-white p-4 rounded-2xl border border-[#e2e8e2] shadow-xs space-y-2.5">
                <div className="text-[10px] font-bold text-[#627768] uppercase">
                  {lang === 'hi' ? 'मोबाइल ऐप सेटिंग्स' : 'Mobile App Preferences'}
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="text-xs font-semibold text-[#1a2d24]">
                    {lang === 'hi' ? 'भाषा (Language)' : 'Language'}
                  </div>
                  <div className="flex bg-[#f0f4f0] p-1 rounded-lg text-xs">
                    <button
                      onClick={() => setLang('en')}
                      className={`px-2.5 py-1 rounded-md font-bold transition ${
                        lang === 'en' ? 'bg-white shadow-2xs text-[#10251f]' : 'text-[#627768]'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLang('hi')}
                      className={`px-2.5 py-1 rounded-md font-bold transition ${
                        lang === 'hi' ? 'bg-white shadow-2xs text-[#10251f]' : 'text-[#627768]'
                      }`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </div>

                {isInstallable && (
                  <button
                    onClick={install}
                    className="w-full py-2.5 bg-[#c5f36b] hover:bg-[#b0e550] text-[#10251f] font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition"
                  >
                    <Download size={15} />
                    <span>{t.installApp} (Home Screen)</span>
                  </button>
                )}

                <div className="pt-2 border-t border-[#f0f4f0] text-[10px] text-[#7d9183] text-center">
                  RouteFlow Transport Network • Progressive Web App v0.2
                </div>
              </div>
            </div>
          )}
        </div>

        {/* NATIVE MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="fixed bottom-0 inset-x-0 sm:relative bg-white border-t border-[#e2e8e2] px-2 py-2 flex items-center justify-around z-30 shadow-lg">
          <button
            onClick={() => setActiveTab('loads')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
              activeTab === 'loads' ? 'text-[#10251f] font-bold' : 'text-[#7d9183]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition ${
                activeTab === 'loads' ? 'bg-[#c5f36b] text-[#10251f]' : ''
              }`}
            >
              <Package size={18} />
            </div>
            <span className="text-[10px]">{t.loadsTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
              activeTab === 'calculator' ? 'text-[#10251f] font-bold' : 'text-[#7d9183]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition ${
                activeTab === 'calculator' ? 'bg-[#c5f36b] text-[#10251f]' : ''
              }`}
            >
              <Calculator size={18} />
            </div>
            <span className="text-[10px]">{t.calcTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('bids')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
              activeTab === 'bids' ? 'text-[#10251f] font-bold' : 'text-[#7d9183]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition ${
                activeTab === 'bids' ? 'bg-[#c5f36b] text-[#10251f]' : ''
              }`}
            >
              <Gavel size={18} />
            </div>
            <span className="text-[10px]">{t.bidsTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
              activeTab === 'tracking' ? 'text-[#10251f] font-bold' : 'text-[#7d9183]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition ${
                activeTab === 'tracking' ? 'bg-[#c5f36b] text-[#10251f]' : ''
              }`}
            >
              <Navigation size={18} />
            </div>
            <span className="text-[10px]">{t.trackTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
              activeTab === 'profile' ? 'text-[#10251f] font-bold' : 'text-[#7d9183]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition ${
                activeTab === 'profile' ? 'bg-[#c5f36b] text-[#10251f]' : ''
              }`}
            >
              <Building2 size={18} />
            </div>
            <span className="text-[10px]">{t.profileTab}</span>
          </button>
        </nav>

        {/* MODAL 1: LOAD DETAILS & BID INSPECTION */}
        {showDetailModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto no-scrollbar p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#edf1ed]">
                <div>
                  <div className="text-[10px] font-bold text-[#3d7034] uppercase tracking-wider">
                    {lang === 'hi' ? 'लोड विवरण' : 'Order Specifications'}
                  </div>
                  <h3 className="text-base font-black text-[#1a2d24]">
                    {activeLoad.id} • {lang === 'hi' ? activeLoad.cargoHi : activeLoad.cargo}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 text-gray-400 hover:text-black rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Route */}
              <div className="bg-[#f7faf6] p-3 rounded-xl border border-[#e4ede3] space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#182921] font-bold">
                  <MapPin size={15} className="text-[#3b792b]" />
                  <span>{activeLoad.from}</span>
                  <ArrowRight size={13} className="text-gray-400" />
                  <span>{activeLoad.to}</span>
                </div>
                <div className="text-[11px] text-[#63796c] flex items-center justify-between">
                  <span>Lane Distance: {activeLoad.distance} km</span>
                  <span>Target: {activeLoad.deadline}</span>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#f8faf8] p-2.5 rounded-xl border border-[#ebf0eb]">
                  <div className="text-[10px] text-[#718476]">Total Weight</div>
                  <div className="font-bold text-[#1a2d24] mt-0.5">
                    {activeLoad.weight.toLocaleString('en-IN')} kg
                  </div>
                </div>
                <div className="bg-[#f8faf8] p-2.5 rounded-xl border border-[#ebf0eb]">
                  <div className="text-[10px] text-[#718476]">Dimensions</div>
                  <div className="font-bold text-[#1a2d24] mt-0.5">{activeLoad.dimensions}</div>
                </div>
              </div>

              {/* Admin Confidential Cost */}
              {role === 'Admin' && (
                <div className="bg-[#10251f] text-white p-3.5 rounded-xl">
                  <div className="text-[10px] font-bold text-[#c5f36b] uppercase">
                    Admin Confidential Benchmark
                  </div>
                  <div className="text-xl font-black text-[#c5f36b] mt-0.5">
                    {money(activeLoad.estimate)}
                  </div>
                  <div className="text-[10px] text-[#a1b8a8]">
                    Internal pricing estimate for award evaluation.
                  </div>
                </div>
              )}

              {/* Sealed Quotes Review */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#1a2d24]">
                  <span>{lang === 'hi' ? 'कोटेशन स्थिति' : 'Transporter Quotations'}</span>
                  <span className="text-[10px] text-[#6d8073]">
                    {activeLoad.bids.length} quotes logged
                  </span>
                </div>

                {role === 'Party' && activeLoad.status !== 'Assigned' ? (
                  <div className="p-3 bg-[#f6faf5] rounded-xl border border-[#e2ece0] flex items-start gap-2.5 text-xs">
                    <EyeOff size={16} className="text-[#3b792b] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#55695a]">
                      {t.sealedInfo}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                    {activeLoad.bids.map(bid => {
                      const isWinner = bid.status === 'Winner';
                      return (
                        <div
                          key={bid.id}
                          className="p-2.5 bg-[#f8faf8] rounded-xl border border-[#ebf0eb] flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#1a2d24]">{bid.transporter}</div>
                            <div className="text-[10px] text-[#718476]">
                              {bid.truck} • {bid.days} days
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="font-black text-[#1a2d24]">{money(bid.amount)}</div>
                              <div className="text-[9px] font-bold text-[#516b7f]">{bid.status}</div>
                            </div>
                            {role === 'Admin' && activeLoad.status !== 'Assigned' && bid.status === 'Pending' && (
                              <button
                                onClick={() => {
                                  handleAward(activeLoad.id, bid.id);
                                  setShowDetailModal(false);
                                }}
                                className="px-2.5 py-1 bg-[#10251f] hover:bg-[#204033] text-white text-[10px] font-bold rounded-lg"
                              >
                                Award
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action */}
              {canBid && activeLoad.status === 'Bidding open' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowBidSheet(true);
                  }}
                  className="w-full py-3 bg-[#c5f36b] hover:bg-[#b0e550] text-[#10251f] font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Send size={15} />
                  <span>{t.bidNow}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: QUICK BID DRAWER */}
        {showBidSheet && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
            <div className="w-full sm:max-w-md bg-white rounded-t-3xl p-5 space-y-3.5 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#edf1ed]">
                <div>
                  <div className="text-[10px] font-bold text-[#3d7034] uppercase tracking-wider">
                    {lang === 'hi' ? 'कोटेशन सबमिट करें' : 'Fast Bid Submission'}
                  </div>
                  <h3 className="text-sm font-black text-[#1a2d24]">
                    {activeLoad.id} • {activeLoad.from} → {activeLoad.to}
                  </h3>
                </div>
                <button
                  onClick={() => setShowBidSheet(false)}
                  className="p-1 text-gray-400 hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#556959] mb-1">
                    {lang === 'hi' ? 'बोली राशि (₹ में)' : 'Quotation Amount (in INR)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 23500"
                      value={bidAmountInput}
                      onChange={e => setBidAmountInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-sm font-bold focus:outline-none focus:border-[#4d8b39]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#556959] mb-1">
                    {lang === 'hi' ? 'गाड़ी का प्रकार' : 'Vehicle Configuration'}
                  </label>
                  <select
                    value={chosenTruckType}
                    onChange={e => setChosenTruckType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-xs font-medium"
                  >
                    <option value="14 ft truck">14 ft truck (3-5T)</option>
                    <option value="17 ft truck">17 ft truck (5-7T)</option>
                    <option value="19 ft truck">19 ft truck (7-9T)</option>
                    <option value="22 ft truck">22 ft multi-axle</option>
                    <option value="32 ft container">32 ft container</option>
                  </select>
                </div>
              </div>

              <div className="text-[10px] text-[#718476] bg-[#f8faf8] p-2 rounded-lg border border-[#e4ede3] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#3b792b]" />
                <span>Sealed quote: other transporters cannot see your price.</span>
              </div>

              <button
                onClick={handlePlaceBid}
                className="w-full py-3 bg-[#c5f36b] hover:bg-[#b0e550] text-[#10251f] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
              >
                <Send size={15} />
                <span>Confirm & Place Bid</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL 3: CREATE ORDER (PARTY) */}
        {showOrderModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-3.5 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#edf1ed]">
                <div>
                  <div className="text-[10px] font-bold text-[#3d7034] uppercase tracking-wider">
                    {lang === 'hi' ? 'नया लोड पोस्ट करें' : 'Create Freight Post'}
                  </div>
                  <h3 className="text-sm font-black text-[#1a2d24]">
                    Shipper Freight Requirements
                  </h3>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-1 text-gray-400 hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#556959] mb-1">
                    Pickup Origin
                  </label>
                  <input
                    type="text"
                    value={calcForm.from}
                    onChange={e => setCalcForm({ ...calcForm, from: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#556959] mb-1">
                    Delivery Destination
                  </label>
                  <input
                    type="text"
                    value={calcForm.to}
                    onChange={e => setCalcForm({ ...calcForm, to: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-xs font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#556959] mb-1">
                      Cargo Type
                    </label>
                    <input
                      type="text"
                      value={calcForm.cargo}
                      onChange={e => setCalcForm({ ...calcForm, cargo: e.target.value })}
                      className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#556959] mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={calcForm.weight}
                      onChange={e => setCalcForm({ ...calcForm, weight: e.target.value })}
                      className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d6e0d5] rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                className="w-full py-3 bg-[#c5f36b] hover:bg-[#b0e550] text-[#10251f] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
              >
                <Plus size={16} />
                <span>Post Order to Marketplace</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL 4: QUICK ROLE PICKER */}
        {showRoleModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#edf1ed]">
                <h3 className="text-sm font-black text-[#1a2d24]">
                  {lang === 'hi' ? 'रोल चुनें' : 'Choose Workspace Persona'}
                </h3>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-1 text-gray-400 hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1.5">
                {(Object.keys(roleLabels) as Role[]).map(r => {
                  const isCur = role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setShowRoleModal(false);
                        notify(`Switched to ${r} mode`);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs ${
                        isCur
                          ? 'bg-[#10251f] text-white border-[#10251f] font-bold shadow-xs'
                          : 'bg-[#f8faf8] text-[#2c4033] border-[#e1e9e0] hover:bg-[#edf5ec]'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{roleLabels[r][lang]}</div>
                        <div className={`text-[10px] ${isCur ? 'text-[#a2baa8]' : 'text-[#738578]'}`}>
                          {roleLabels[r].subtitle}
                        </div>
                      </div>
                      {isCur && <Check size={16} className="text-[#c5f36b]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 5: iOS PWA INSTALL GUIDE */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-5 space-y-3 shadow-xl">
              <h3 className="text-base font-bold text-[#10251f]">Install on iPhone / Safari</h3>
              <p className="text-xs text-[#526859] leading-relaxed">
                1. Tap the <strong>Share</strong> button <Share2 size={13} className="inline mx-1" /> at the bottom of Safari.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                3. Open RouteFlow directly from your home screen like a native app.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-[#10251f] text-white rounded-xl text-xs font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-8 z-50 bg-[#10251f] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs border border-[#2d5242] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 size={15} className="text-[#c5f36b]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
