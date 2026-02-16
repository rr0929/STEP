import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, LayoutDashboard, Briefcase, 
  BarChart2, Settings, Bell, Search, Menu, 
  ArrowUpRight, ArrowDownLeft, Wallet, 
  User, LogOut, Activity, Globe, MapPin, Bitcoin, Coins,
  Mail, Phone, Shield, Eye, Database, ChevronRight, Check, Info, Loader, Sparkles, X, MessageSquare
} from 'lucide-react';

// --- GEMINI API CONFIGURATION ---
const apiKey = ""; // The execution environment provides this key automatically

// --- MOCK DATABASE ---
const USERS_DB = {
  "user_001": {
    uid: "user_001",
    accountType: "Gold Member",
    profile: {
      firstName: "Alex",
      lastName: "Trader",
      email: "alex.t@marketpulse.io",
      phone: "+91 98765 43210",
      avatarUrl: "https://ui-avatars.com/api/?name=Alex+Trader",
      memberSince: "2023-11-15T10:30:00Z",
      kycStatus: "VERIFIED"
    },
    settings: {
      general: {
        baseCurrency: "INR",
        language: "English (US)",
        region: "India (Chennai)",
        theme: "dark"
      },
      security: {
        twoFactorEnabled: true,
        lastLogin: new Date().toISOString()
      },
      notifications: {
        emailAlerts: true,
        pushNotifications: true,
        volatilityAlerts: false
      }
    },
    portfolio: {
      summary: {
        totalValue: 1245000.00,
        cashBalance: 450000.00,
        currency: "INR"
      },
      holdings: [
        {
          assetId: "101",
          symbol: "RELIANCE",
          quantity: 150,
          averageBuyPrice: 2450.00,
          currentPrice: 2945.60,
          sector: "Energy"
        },
        {
          assetId: "102",
          symbol: "HDFCBANK",
          quantity: 200,
          averageBuyPrice: 1500.00,
          currentPrice: 1680.15,
          sector: "Banking"
        },
        {
          assetId: "201",
          symbol: "BTC/INR",
          quantity: 0.05,
          averageBuyPrice: 4800000.00,
          currentPrice: 5345000.00,
          sector: "Crypto"
        }
      ]
    },
    activity: {
      watchlist: ["101", "102", "201", "205", "110"],
      transactions: [
        {
          id: "tx_889900",
          type: "BUY",
          assetSymbol: "RELIANCE",
          quantity: 10,
          executionPrice: 2940.50,
          totalAmount: 29405.00,
          timestamp: "2024-05-20T10:00:00Z",
          status: "COMPLETED"
        }
      ]
    }
  }
};

// --- MOCK MARKET DATA ---
const generateChartData = (points = 30) => {
  let base = 150 + Math.random() * 100;
  return Array.from({ length: points }, (_, i) => {
    base = base + (Math.random() * 10 - 5);
    return { time: `${i}:00`, price: parseFloat(base.toFixed(2)) };
  });
};

const MARKET_DATA = [
  { id: 101, symbol: 'RELIANCE', name: 'Reliance Industries', price: 2945.60, change: 1.2, status: 'up', category: 'NSE' },
  { id: 102, symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1680.15, change: -0.4, status: 'down', category: 'NSE' },
  { id: 103, symbol: 'TCS', name: 'Tata Consultancy', price: 4120.40, change: 0.7, status: 'up', category: 'NSE' },
  { id: 104, symbol: 'INFY', name: 'Infosys Ltd', price: 1540.30, change: -2.1, status: 'down', category: 'NSE' },
  { id: 201, symbol: 'BTC/INR', name: 'Bitcoin (India)', price: 5345000.00, change: 2.1, status: 'up', category: 'Crypto' },
  { id: 203, symbol: 'ETH/USD', name: 'Ethereum', price: 3450.20, change: 1.8, status: 'up', category: 'Crypto' },
  { id: 5, symbol: 'NVDA', name: 'NVIDIA Corp', price: 890.10, change: 5.2, status: 'up', category: 'Stock' },
];

const SECTOR_PERFORMANCE = [
  { name: 'Banking', change: 1.4 },
  { name: 'IT', change: -0.8 },
  { name: 'Auto', change: 2.1 },
  { name: 'Pharma', change: 0.5 },
  { name: 'Energy', change: 1.2 },
];

// --- COMPONENTS ---

const AIAnalysisModal = ({ isOpen, onClose, title, content, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-950/50">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" /> 
            {title || "Gemini Insights"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar text-sm leading-relaxed text-slate-300 min-h-[200px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-10 space-y-4">
              <Loader size={32} className="animate-spin text-purple-500" />
              <p className="text-slate-400 animate-pulse">Analyzing market data...</p>
            </div>
          ) : (
            <div className="whitespace-pre-line">
              {content}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-950/30 text-xs text-slate-500 text-center">
          Powered by Gemini 2.5 Flash • Analysis is for informational purposes only.
        </div>
      </div>
    </div>
  );
};

const StatCard = React.memo(({ title, value, change, isPositive }) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
        {change}%
      </div>
    </div>
    <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{value}</div>
  </div>
));

const MarketRow = React.memo(({ asset, onSelect, isActive }) => (
  <div 
    onClick={() => onSelect(asset)}
    className={`flex items-center justify-between p-4 cursor-pointer border-l-2 transition-all ${
      isActive ? 'bg-blue-600/10 border-blue-500' : 'border-transparent hover:bg-slate-800/50'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${asset.category === 'Crypto' ? 'bg-amber-500/10 text-amber-500' : asset.category === 'NSE' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
        {asset.symbol.substring(0, 2)}
      </div>
      <div>
        <div className="font-bold text-white text-sm">{asset.symbol}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{asset.category}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-mono text-white">
        {asset.symbol.includes('INR') || asset.category === 'NSE' ? '₹' : '$'}{asset.price.toLocaleString()}
      </div>
      <div className={`text-[11px] font-bold ${asset.status === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {asset.status === 'up' ? '▲' : '▼'} {Math.abs(asset.change).toFixed(2)}%
      </div>
    </div>
  </div>
));

const PortfolioRow = ({ holding }) => {
  const profit = (holding.currentPrice - holding.averageBuyPrice) * holding.quantity;
  const profitPercent = ((holding.currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice) * 100;
  const isPositive = profit >= 0;

  return (
    <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors">
      <div className="col-span-1">
        <div className="font-bold text-white text-sm">{holding.symbol}</div>
        <div className="text-[10px] text-slate-500">{holding.sector}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-white font-mono">{holding.quantity}</div>
        <div className="text-[10px] text-slate-500">Qty</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-white font-mono">₹{holding.currentPrice.toLocaleString()}</div>
        <div className="text-[10px] text-slate-500">Avg: ₹{holding.averageBuyPrice.toLocaleString()}</div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? '+' : ''}₹{profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
        <div className={`text-[10px] ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {profitPercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

const Sidebar = React.memo(({ sidebarOpen, activeView, onNavigate }) => (
  <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-50`}>
    <div className="p-6 flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
        <Activity className="text-white" size={20} />
      </div>
      {sidebarOpen && <span className="font-bold text-xl text-white">MarketPulse</span>}
    </div>

    <nav className="flex-1 px-3 space-y-1 mt-4">
      {[
        { id: 'Market', icon: Globe, label: 'Markets' },
        { id: 'Portfolio', icon: Briefcase, label: 'My Portfolio' },
        { id: 'Analytics', icon: BarChart2, label: 'Analytics' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
            activeView === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          <item.icon size={18} />
          {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
        </button>
      ))}
      <div className="my-4 border-t border-slate-800/50 mx-4"></div>
      <button
        onClick={() => onNavigate('Settings')}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
          activeView === 'Settings' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-400'
        }`}
      >
        <Settings size={18} />
        {sidebarOpen && <span className="font-medium text-sm">Settings</span>}
      </button>
    </nav>
    <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-4 px-4 py-3 w-full text-slate-500 hover:text-rose-400 transition-colors">
        <LogOut size={18} />
        {sidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
      </button>
    </div>
  </aside>
));

const Header = React.memo(({ sidebarOpen, setSidebarOpen, activeView, userData, onProfileClick }) => (
  <header className="h-16 bg-slate-900/40 backdrop-blur-xl border-b border-slate-800 px-6 flex items-center justify-between">
    <div className="flex items-center gap-6">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-white">
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
          {activeView === 'Settings' ? 'Profile Management' : `Live: ${activeView}`}
        </span>
      </div>
    </div>
    
    <div className="flex items-center gap-5">
      <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-800">
        <Search size={14} className="text-slate-500" />
        <input type="text" placeholder="Search Symbols..." className="bg-transparent border-none outline-none text-xs w-32" />
      </div>

      <div className="flex items-center gap-3 cursor-pointer group" onClick={onProfileClick}>
        {userData ? (
          <>
            <div className="text-right hidden lg:block">
              <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                {userData.profile.firstName} {userData.profile.lastName}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">{userData.accountType}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              {userData.profile.firstName[0]}
            </div>
          </>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse"></div>
        )}
      </div>
    </div>
  </header>
));

// --- MAIN APP ---
const App = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedAsset, setSelectedAsset] = useState(MARKET_DATA[0]);
  const [marketPrices, setMarketPrices] = useState(MARKET_DATA);
  const [chartData, setChartData] = useState(generateChartData(40));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('Market');

  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiTitle, setAiTitle] = useState('');

  // Call Gemini API
  const callGeminiAPI = async (prompt) => {
    try {
      setAiLoading(true);
      setAiContent('');
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis generated.";
      setAiContent(generatedText);
    } catch (error) {
      setAiContent(`Error: ${error.message}. Please try again.`);
    } finally {
      setAiLoading(false);
    }
  };

  // Handler: Analyze specific asset
  const handleAnalyzeAsset = () => {
    setAiTitle(`AI Analysis: ${selectedAsset.symbol}`);
    setAiModalOpen(true);
    const prompt = `Act as a senior financial analyst. Analyze ${selectedAsset.symbol} (${selectedAsset.name}) which is currently trading at ${selectedAsset.price} with a daily change of ${selectedAsset.change}%. 
    
    1. Provide a brief sentiment analysis (Bullish/Bearish/Neutral).
    2. Identify key support and resistance levels based on typical volatility for this asset class (${selectedAsset.category}).
    3. Suggest a short-term trading strategy (e.g., "Wait for pullback", "Breakout imminent").
    
    Keep the response concise, professional, and under 150 words. use Markdown formatting.`;
    
    callGeminiAPI(prompt);
  };

  // Handler: Analyze Portfolio
  const handleAnalyzePortfolio = () => {
    if (!userData) return;
    setAiTitle(`Portfolio AI Audit`);
    setAiModalOpen(true);
    
    const holdingsSummary = userData.portfolio.holdings.map(h => 
      `${h.symbol} (${h.sector}): ${h.quantity} units @ avg ${h.averageBuyPrice}`
    ).join(', ');

    const prompt = `Act as a wealth manager. Audit the following portfolio for a ${userData.settings.general.region} investor:
    
    Holdings: ${holdingsSummary}
    Total Value: ${userData.portfolio.summary.totalValue} ${userData.portfolio.summary.currency}
    Cash Balance: ${userData.portfolio.summary.cashBalance}
    
    1. Assess the diversification risk (Sector/Asset class concentration).
    2. Identify the riskiest asset in this list.
    3. Suggest one actionable move to balance the portfolio (e.g., "Consider adding Tech/Pharma" or "Reduce exposure to Crypto").
    
    Keep it strictly professional, use bullet points, and under 200 words.`;

    callGeminiAPI(prompt);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const user = USERS_DB["user_001"];
      setUserData(user);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices(prev => prev.map(asset => ({
        ...asset,
        price: asset.price + (Math.random() - 0.5) * asset.price * 0.002,
        status: Math.random() > 0.5 ? 'up' : 'down'
      })));
      setChartData(prev => {
        const lastPrice = prev[prev.length - 1].price;
        const newPrice = lastPrice + (Math.random() * 4 - 2);
        return [...prev.slice(1), { time: 'Now', price: newPrice }];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !userData) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader size={40} className="animate-spin text-blue-500 mb-4" />
        <p className="text-sm text-slate-400">Loading MarketPulse Pro...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} activeView={activeView} onNavigate={setActiveView} />
      
      <AIAnalysisModal 
        isOpen={aiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
        title={aiTitle} 
        content={aiContent} 
        isLoading={aiLoading} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          activeView={activeView}
          userData={userData}
          onProfileClick={() => setActiveView('Settings')}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {activeView === 'Settings' ? (
             <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-500">
                    {userData.profile.firstName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{userData.profile.firstName} {userData.profile.lastName}</h2>
                    <p className="text-slate-500 text-sm">{userData.profile.email}</p>
                    <div className="mt-2 inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                      KYC: {userData.profile.kycStatus}
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h3 className="font-bold text-white text-sm uppercase tracking-widest border-b border-slate-800 pb-2">General Settings</h3>
                   <div className="space-y-3">
                     <div>
                       <label className="text-xs text-slate-500">Base Currency</label>
                       <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-medium mt-1">
                         {userData.settings.general.baseCurrency}
                       </div>
                     </div>
                     <div>
                       <label className="text-xs text-slate-500">Region</label>
                       <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-medium mt-1">
                         {userData.settings.general.region}
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-bold text-white text-sm uppercase tracking-widest border-b border-slate-800 pb-2">Security</h3>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-xl">
                       <span className="text-sm font-medium">Two-Factor Auth</span>
                       <div className={`w-3 h-3 rounded-full ${userData.settings.security.twoFactorEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                     </div>
                     <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                       <div className="text-xs text-slate-500">Last Login</div>
                       <div className="text-sm font-mono text-white mt-1">{new Date(userData.settings.security.lastLogin).toLocaleString()}</div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

          ) : activeView === 'Portfolio' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <h1 className="text-2xl font-bold text-white">My Holdings</h1>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleAnalyzePortfolio}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
                  >
                    <Sparkles size={16} /> AI Audit
                  </button>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase">Total Value</div>
                    <div className="text-xl font-mono font-bold text-emerald-400">
                      {userData.portfolio.summary.currency === 'INR' ? '₹' : '$'}{userData.portfolio.summary.totalValue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-800 bg-slate-950/50 text-xs font-bold text-slate-500 uppercase">
                  <div>Asset</div>
                  <div className="text-right">Quantity</div>
                  <div className="text-right">Current Price</div>
                  <div className="text-right">P/L</div>
                </div>
                {userData.portfolio.holdings.map((holding, i) => (
                  <PortfolioRow key={i} holding={holding} />
                ))}
              </div>
            </div>

          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard 
                  title="Portfolio Value" 
                  value={`${userData.portfolio.summary.currency === 'INR' ? '₹' : '$'}${userData.portfolio.summary.totalValue.toLocaleString()}`} 
                  change="2.4" isPositive={true} 
                />
                <StatCard 
                  title="Cash Available" 
                  value={`${userData.portfolio.summary.currency === 'INR' ? '₹' : '$'}${userData.portfolio.summary.cashBalance.toLocaleString()}`} 
                  change="0.0" isPositive={true} 
                />
                 <StatCard 
                  title="Day P/L" 
                  value="+₹12,450" 
                  change="1.2" isPositive={true} 
                />
                 <StatCard 
                  title="Active Orders" 
                  value="4" 
                  change="0.0" isPositive={false} 
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 space-y-6">
                   <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                       <div className="flex items-center gap-4">
                          <h3 className="font-bold text-white">{selectedAsset.symbol} Price Action</h3>
                          <button 
                            onClick={handleAnalyzeAsset}
                            className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 rounded-lg text-xs font-bold transition-all"
                          >
                            <Sparkles size={12} /> Gemini Insight
                          </button>
                       </div>
                       <div className="text-emerald-400 font-mono font-bold">
                         {selectedAsset.category === 'NSE' || selectedAsset.symbol.includes('INR') ? '₹' : '$'}{selectedAsset.price.toLocaleString()}
                       </div>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="time" hide />
                        <YAxis orientation="right" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} domain={['auto','auto']} />
                        <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                        <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fill="url(#grad)" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[250px]">
                      <h3 className="font-bold text-white mb-4 text-sm uppercase">Sector Performance</h3>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={SECTOR_PERFORMANCE}>
                          <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                          <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                            {SECTOR_PERFORMANCE.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.change > 0 ? '#10b981' : '#f43f5e'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                  </div>
                </div>

                <div className="xl:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-[675px] flex flex-col">
                  <div className="p-4 border-b border-slate-800 font-bold text-white flex justify-between items-center">
                    <span>Watchlist</span>
                    <span className="text-xs text-slate-500">{marketPrices.length} Assets</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {marketPrices.map(asset => (
                      <MarketRow 
                        key={asset.id} 
                        asset={asset} 
                        onSelect={setSelectedAsset} 
                        isActive={selectedAsset.id === asset.id} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }` }} />
    </div>
  );
};

export default App;