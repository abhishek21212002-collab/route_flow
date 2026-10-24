import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Truck, Package, Building2, Gavel, Calculator, LayoutDashboard, MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, Wallet, Search, Bell, Plus, ChevronDown, Route, Boxes, CircleDollarSign, FileText, Settings, Menu, X, EyeOff, UserRound, BadgeCheck, Send, Activity, ChartNoAxesCombined } from 'lucide-react';
import './styles.css';

type Role = 'Party' | 'First Transporter' | 'Second Transporter' | 'Truck Owner' | 'Admin';
type Bid = { id: number; transporter: string; amount: number; days: number; truck: string; verified: boolean; status: 'Pending'|'Winner'|'Not selected' };
type Load = { id: string; from: string; to: string; cargo: string; weight: number; dimensions: string; deadline: string; estimate: number; status: string; bids: Bid[]; party: string; distance: number; };
const initialLoads: Load[] = [
 {id:'RF-1024',from:'Jaipur, Rajasthan',to:'Ahmedabad, Gujarat',cargo:'Industrial packaging',weight:5000,dimensions:'300 × 150 × 150 cm',deadline:'2 days',estimate:25000,status:'Bidding open',party:'Shree Industries',distance:675,bids:[{id:1,transporter:'Kamal Logistics',amount:23500,days:2,truck:'14 ft truck',verified:true,status:'Pending'},{id:2,transporter:'Rajasthan Freight Co.',amount:22800,days:2,truck:'17 ft truck',verified:true,status:'Pending'},{id:3,transporter:'Marwar Cargo',amount:24000,days:1,truck:'14 ft truck',verified:true,status:'Pending'}]},
 {id:'RF-1025',from:'Kota, Rajasthan',to:'Indore, Madhya Pradesh',cargo:'Agricultural equipment',weight:3200,dimensions:'240 × 140 × 130 cm',deadline:'3 days',estimate:18500,status:'Bidding open',party:'Kisan Machinery',distance:390,bids:[{id:4,transporter:'Shakti Roadways',amount:17200,days:3,truck:'14 ft truck',verified:true,status:'Pending'},{id:5,transporter:'Highway Cargo',amount:17900,days:2,truck:'17 ft truck',verified:false,status:'Pending'}]},
 {id:'RF-1026',from:'Ajmer, Rajasthan',to:'Delhi, NCR',cargo:'Textile rolls',weight:7000,dimensions:'350 × 180 × 160 cm',deadline:'1 day',estimate:31000,status:'Awaiting admin',party:'Aarav Textiles',distance:410,bids:[{id:6,transporter:'Northline Transport',amount:29500,days:1,truck:'19 ft truck',verified:true,status:'Pending'},{id:7,transporter:'Kamal Logistics',amount:30200,days:1,truck:'19 ft truck',verified:true,status:'Pending'}]}
];
const money = (n:number) => '₹' + Math.round(n).toLocaleString('en-IN');
function App(){
 const [role,setRole]=useState<Role>('Party');
 const [mobileNav,setMobileNav]=useState(false);
 const [loads,setLoads]=useState<Load[]>(initialLoads);
 const [selected,setSelected]=useState('RF-1024');
 const [toast,setToast]=useState('');
 const [query,setQuery]=useState('');
 const [form,setForm]=useState({from:'Jaipur, Rajasthan',to:'Ahmedabad, Gujarat',cargo:'Industrial packaging',weight:'5000',length:'300',breadth:'150',height:'150',days:'2',distance:'675',budget:'25000'});
 const [bidAmounts,setBidAmounts]=useState<Record<string,string>>({});
 const [chosenTruck,setChosenTruck]=useState('14 ft truck');
 const [margin,setMargin]=useState(10);
 const [truckRate,setTruckRate]=useState(35);
 const [otherCosts,setOtherCosts]=useState(3500);
 const active=loads.find(l=>l.id===selected) || loads[0];
 const volume=(Number(form.length)||0)*(Number(form.breadth)||0)*(Number(form.height)||0)/1000000;
 const estimate=Math.round(((Number(form.distance)||0)*truckRate+otherCosts)*(1+margin/100));
 const roleInfo:Record<Role,{title:string;desc:string;icon:any}> = {
  'Party':{title:'Party workspace',desc:'Book freight, calculate budgets and follow shipments.',icon:Building2},
  'First Transporter':{title:'Broker workspace',desc:'Bid for party orders and manage execution partners.',icon:Route},
  'Second Transporter':{title:'Execution workspace',desc:'Accept subcontracted loads and arrange trucks.',icon:Truck},
  'Truck Owner':{title:'Truck owner workspace',desc:'Find suitable loads and submit freight bids.',icon:Boxes},
  'Admin':{title:'Operations control',desc:'Review bids, select winners and oversee orders.',icon:ShieldCheck}
 };
 const nav=[{name:'Overview',icon:LayoutDashboard},{name:'Loads & orders',icon:Package},{name:'Freight calculator',icon:Calculator},{name:'Bids & assignments',icon:Gavel}];
 const filtered=useMemo(()=>loads.filter(l=>(l.from+' '+l.to+' '+l.cargo+' '+l.id).toLowerCase().includes(query.toLowerCase())),[loads,query]);
 function notify(s:string){setToast(s);window.setTimeout(()=>setToast(''),2800)}
 function createOrder(){
  if(!form.from.trim()||!form.to.trim()||Number(form.weight)<=0){notify('Please enter valid route and cargo weight.');return}
  const id='RF-'+(1027+loads.length-3);
  const load:Load={id,from:form.from,to:form.to,cargo:form.cargo||'General cargo',weight:Number(form.weight),dimensions:`${form.length} × ${form.breadth} × ${form.height} cm`,deadline:form.days+' days',estimate:estimate,status:'Bidding open',party:'Demo Party',distance:Number(form.distance)||0,bids:[]};
  setLoads(p=>[load,...p]);setSelected(id);notify('Demo order created. Bidding is now open.');
 }
 function placeBid(loadId:string){
  const amt=Number(bidAmounts[loadId]);
  if(!amt||amt<=0){notify('Enter a valid bid amount.');return}
  setLoads(p=>p.map(l=>l.id===loadId?{...l,bids:[...l.bids,{id:Date.now(),transporter:role==='Truck Owner'?'Demo Truck Owner':role==='Second Transporter'?'Demo Execution Transporter':'Demo Broker',amount:amt,days:Number(l.deadline.split(' ')[0])||2,truck:chosenTruck,verified:true,status:'Pending'}]}:l));
  setBidAmounts(p=>({...p,[loadId]:''}));notify('Bid submitted in this prototype.');
 }
 function selectWinner(loadId:string,bidId:number){
  setLoads(p=>p.map(l=>l.id===loadId?{...l,status:'Assigned',bids:l.bids.map(b=>({...b,status:b.id===bidId?'Winner':'Not selected'}))}:l));
  notify('Winning bid selected and order assigned in demo.');
 }
 const canBid=['First Transporter','Second Transporter','Truck Owner'].includes(role);
 const Icon=roleInfo[role].icon;
 return <div className="app-shell">
  <aside className={`sidebar ${mobileNav?'show':''}`}>
   <div className="brand"><div className="brand-mark"><Route size={23}/></div><div><b>RouteFlow</b><small>TRANSPORT NETWORK</small></div><button className="mobile-close icon-btn" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
   <div className="workspace-label">WORKSPACE</div>
   <div className="role-select"><div className="role-avatar"><Icon size={18}/></div><div className="role-text"><b>{role}</b><small>Demo account</small></div><ChevronDown size={16}/><select aria-label="Switch role" value={role} onChange={e=>setRole(e.target.value as Role)}>{Object.keys(roleInfo).map(r=><option key={r}>{r}</option>)}</select></div>
   <div className="nav-label">MENU</div>
   {nav.map((n,i)=><button key={n.name} className={`nav-item ${i===0?'active':''}`} onClick={()=>{setMobileNav(false); if(i===2)document.getElementById('calculator')?.scrollIntoView({behavior:'smooth'});else if(i===1)document.getElementById('loads')?.scrollIntoView({behavior:'smooth'});else if(i===3)document.getElementById('bids')?.scrollIntoView({behavior:'smooth'});else window.scrollTo({top:0,behavior:'smooth'})}}><n.icon size={18}/><span>{n.name}</span>{i===1&&<span className="nav-count">{loads.length}</span>}</button>)}
   <div className="sidebar-spacer"/>
   <div className="help-card"><div className="help-icon"><ShieldCheck size={18}/></div><b>Built for trusted freight</b><p>Demo data only. Real verification and payments require backend integration.</p></div>
   <button className="nav-item"><Settings size={18}/><span>Settings</span></button>
   <div className="profile"><div className="profile-avatar">RC</div><div><b>RouteFlow Demo</b><small>Prototype workspace</small></div><ChevronDown size={16}/></div>
  </aside>
  {mobileNav&&<div className="scrim" onClick={()=>setMobileNav(false)} />}
  <main className="main">
   <header className="topbar"><button className="icon-btn menu-btn" onClick={()=>setMobileNav(true)}><Menu size={21}/></button><div className="breadcrumbs">Workspace <span>/</span> <b>{roleInfo[role].title}</b></div><div className="top-actions"><div className="demo-pill"><span/> Demo environment</div><button className="icon-btn notification" onClick={()=>notify('No new notifications in demo.')}><Bell size={19}/><i/></button><div className="top-avatar">RC</div></div></header>
   <div className="content">
    <section className="welcome-row"><div><div className="eyebrow">TRANSPORT MARKETPLACE <span>•</span> PROTOTYPE 0.1</div><h1>{roleInfo[role].title}</h1><p>{roleInfo[role].desc}</p></div>{role==='Party'&&<button className="primary-btn" onClick={()=>document.getElementById('new-order')?.scrollIntoView({behavior:'smooth'})}><Plus size={18}/> Create an order</button>}</section>
    <section className="stat-grid">
     <div className="stat-card"><div className="stat-top"><span>Active loads</span><div className="stat-icon green"><Package size={18}/></div></div><strong>{loads.filter(l=>l.status==='Bidding open').length}</strong><small><span className="positive">Live demo</span> across sample routes</small></div>
     <div className="stat-card"><div className="stat-top"><span>{role==='Admin'?'Bids to review':'Total bids'}</span><div className="stat-icon amber"><Gavel size={18}/></div></div><strong>{loads.reduce((a,l)=>a+l.bids.filter(b=>b.status==='Pending').length,0)}</strong><small>Across all sample orders</small></div>
     <div className="stat-card"><div className="stat-top"><span>Assigned orders</span><div className="stat-icon blue"><Truck size={18}/></div></div><strong>{loads.filter(l=>l.status==='Assigned').length}</strong><small>Winner selected by admin</small></div>
     <div className="stat-card"><div className="stat-top"><span>Internal estimate</span><div className="stat-icon purple"><EyeOff size={18}/></div></div><strong>{role==='Admin'?money(active.estimate):'Hidden'}</strong><small>{role==='Admin'?'Admin-only pricing reference':'Not visible to transporters'}</small></div>
    </section>
    <section className="panel" id="loads">
     <div className="panel-head"><div><h2>{role==='Party'?'Recent freight orders':role==='Admin'?'Order & bid control':role==='Truck Owner'?'Available loads':'Loads marketplace'}</h2><p>Search routes, review order requirements and inspect bidding status.</p></div><div className="panel-tools"><div className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search loads"/></div><span className="count-pill">{filtered.length} loads</span></div></div>
     <div className="table-wrap"><table><thead><tr><th>LOAD / ROUTE</th><th>CARGO</th><th>DELIVERY</th><th>STATUS</th><th>BIDS</th><th></th></tr></thead><tbody>
      {filtered.map(l=><tr key={l.id} className={selected===l.id?'selected-row':''} onClick={()=>setSelected(l.id)}><td><div className="load-id">{l.id}</div><div className="route-cell"><span>{l.from}</span><ArrowRight size={13}/><span>{l.to}</span></div><div className="muted tiny">{l.distance} km route estimate</div></td><td><b>{l.cargo}</b><div className="muted tiny">{l.weight.toLocaleString('en-IN')} kg · {l.dimensions}</div></td><td><span className="delivery"><Clock size={14}/>{l.deadline}</span></td><td><span className={`status ${l.status==='Assigned'?'assigned':l.status==='Awaiting admin'?'review':'open'}`}>{l.status}</span></td><td><b>{l.bids.length}</b><div className="muted tiny">quotes</div></td><td><button className="row-action" onClick={e=>{e.stopPropagation();setSelected(l.id);document.getElementById('bids')?.scrollIntoView({behavior:'smooth'})}}>View <ArrowRight size={14}/></button></td></tr>)}
     </tbody></table></div>
     {filtered.length===0&&<div className="empty">No matching loads. Try another route or cargo keyword.</div>}
    </section>
    <div className="two-col">
     <section className="panel detail-panel" id="bids"><div className="panel-head"><div><div className="eyebrow">SELECTED LOAD</div><h2>{active.id} · Bid review</h2><p>{active.from} → {active.to}</p></div><span className={`status ${active.status==='Assigned'?'assigned':'open'}`}>{active.status}</span></div>
      <div className="load-summary"><div><span>Cargo</span><b>{active.cargo}</b></div><div><span>Weight</span><b>{active.weight.toLocaleString('en-IN')} kg</b></div><div><span>Dimensions</span><b>{active.dimensions}</b></div><div><span>Delivery target</span><b>{active.deadline}</b></div></div>
      {role==='Admin'&&<div className="private-estimate"><div><EyeOff size={17}/><span>Confidential company estimate</span></div><strong>{money(active.estimate)}</strong><small>Visible to authorized admin only. Not included in transporter-facing load data.</small></div>}
      {canBid&&active.status==='Bidding open'&&<div className="bid-form"><div><b>Submit your freight quote</b><p>Company estimate and competing bids are hidden.</p></div><div className="bid-input-row"><div className="amount-input"><span>₹</span><input type="number" placeholder="Enter your amount" value={bidAmounts[active.id]||''} onChange={e=>setBidAmounts(p=>({...p,[active.id]:e.target.value}))}/></div><select value={chosenTruck} onChange={e=>setChosenTruck(e.target.value)}><option>14 ft truck</option><option>17 ft truck</option><option>19 ft truck</option><option>32 ft container</option><option>Open truck</option></select><button className="primary-btn" onClick={()=>placeBid(active.id)}><Send size={16}/> Place bid</button></div></div>}
      <div className="bids-title"><b>{role==='Party'&&active.status!=='Assigned'?'Bid status':role==='Party'?'Selected transporter':'Transporter quotes'}</b><span>{role==='Party'&&active.status!=='Assigned'?'Amounts hidden until winner is selected':`${active.bids.length} submitted`}</span></div>
      {role==='Party'&&active.status!=='Assigned'?<div className="privacy-note"><EyeOff size={20}/><div><b>Bids are confidential</b><p>Transporter quotes and identities remain hidden until an admin selects the winning bid.</p></div></div>:active.bids.length===0?<div className="empty compact">No bids yet for this load.</div>:<div className="bid-list">{active.bids.map(b=><div className="bid-row" key={b.id}><div className="bid-avatar">{b.transporter.slice(0,1)}</div><div className="bid-main"><b>{role==='Party'&&active.status==='Assigned'&&b.status!=='Winner'?'Other bid':b.transporter}</b><small>{b.truck} · {b.days} day(s) {b.verified&&<span className="verified"><BadgeCheck size={12}/> Verified demo</span>}</small></div><div className="bid-price"><b>{role==='Party'&&b.status!=='Winner'?'Hidden':money(b.amount)}</b><small>{b.status}</small></div>{role==='Admin'&&active.status!=='Assigned'&&b.status==='Pending'&&<button className="select-btn" onClick={()=>selectWinner(active.id,b.id)}>Select winner</button>}{role==='Party'&&b.status==='Winner'&&<span className="winner-chip"><CheckCircle2 size={14}/> Selected</span>}</div>)}</div>}
     </section>
     <section className="panel calculator-panel" id="calculator"><div className="panel-head"><div><div className="eyebrow">PARTY TOOL</div><h2><Calculator size={20}/> Freight calculator</h2><p>Estimate a freight budget before posting a load.</p></div></div>
      <div className="form-grid">
       <label>Pickup location<input value={form.from} onChange={e=>setForm({...form,from:e.target.value})} placeholder="e.g. Jaipur, Rajasthan"/></label>
       <label>Delivery destination<input value={form.to} onChange={e=>setForm({...form,to:e.target.value})} placeholder="e.g. Ahmedabad, Gujarat"/></label>
       <label>Cargo description<input value={form.cargo} onChange={e=>setForm({...form,cargo:e.target.value})}/></label>
       <label>Weight (kg)<input type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/></label>
       <label>Distance (km)<input type="number" value={form.distance} onChange={e=>setForm({...form,distance:e.target.value})}/></label>
       <label>Delivery deadline<select value={form.days} onChange={e=>setForm({...form,days:e.target.value})}><option value="1">Within 1 day</option><option value="2">Within 2 days</option><option value="3">3 days or more</option></select></label>
       <label>Length (cm)<input type="number" value={form.length} onChange={e=>setForm({...form,length:e.target.value})}/></label>
       <label>Breadth (cm)<input type="number" value={form.breadth} onChange={e=>setForm({...form,breadth:e.target.value})}/></label>
       <label>Height (cm)<input type="number" value={form.height} onChange={e=>setForm({...form,height:e.target.value})}/></label>
      </div>
      <div className="calc-volume"><Boxes size={17}/><span>Cargo volume</span><b>{volume.toFixed(2)} m³</b></div>
      <div className="estimate-box"><div><span>Illustrative budget estimate</span><small>Demo formula · not a live freight quote</small></div><strong>{money(estimate)}</strong></div>
      {role==='Admin'&&<div className="admin-controls"><label>Demo truck rate per km (₹)<input type="number" value={truckRate} onChange={e=>setTruckRate(Math.max(0,Number(e.target.value)||0))}/></label><label>Other costs (₹)<input type="number" value={otherCosts} onChange={e=>setOtherCosts(Math.max(0,Number(e.target.value)||0))}/></label><label>Margin (%)<input type="number" value={margin} onChange={e=>setMargin(Math.max(0,Number(e.target.value)||0))}/></label></div>}
      {role==='Party'&&<button className="primary-btn full-btn" onClick={createOrder}><Plus size={17}/> Create order with these details</button>}
      {role!=='Party'&&<div className="privacy-note small-note"><EyeOff size={17}/><div><b>{role==='Admin'?'Admin pricing controls':'Company estimate hidden'}</b><p>{role==='Admin'?'Adjust the demo pricing inputs to explore the internal estimate.':'The calculator preview is illustrative; internal company estimates are not exposed in your load view.'}</p></div></div>}
     </section>
    </div>
    <section className="bottom-banner"><div className="banner-icon"><Activity size={22}/></div><div><b>Prototype mode</b><p>Actions update local demo state only. No real orders, bids, payments, or notifications are sent.</p></div><span className="banner-tag">NOT CONNECTED TO BACKEND</span></section>
    <footer>RouteFlow Transport Network <span>Prototype v0.1 · Sample data only</span></footer>
   </div>
  </main>
  {toast&&<div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
 </div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
