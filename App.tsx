
import React, { useState, useEffect } from 'react';
import { MessageSquare, Kanban as KB, QrCode, Settings, LogOut, Search, Send, MessageCircle } from 'lucide-react';
import { Contact } from './types';

const DB: Contact[] = [
  { id: '1', name: 'João Silva', phone: '5511912345678', avatar: 'https://i.pravatar.cc/150?u=1', status: 'NOVO', lastMessage: 'Preços?', lastMessageTime: '10:30' },
  { id: '2', name: 'Maria Oliveira', phone: '5511988888888', avatar: 'https://i.pravatar.cc/150?u=2', status: 'AGUARDANDO', lastMessage: 'Aguardo.', lastMessageTime: 'Ontem' },
  { id: '3', name: 'Carlos Tech', phone: '5511955554444', avatar: 'https://i.pravatar.cc/150?u=4', status: 'RESOLVIDO', lastMessage: 'Vlw!', lastMessageTime: '11:20' },
];

export default function App() {
  const [t, setT] = useState('c'), [act, setAct] = useState<string|null>(null), [qr, setQr] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  if (loading) return null; // Deixa o HTML do index.html aparecer

  const c = DB.find(i => i.id === act);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 text-[11px]">
      <aside className="w-64 bg-slate-950 text-white flex flex-col p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-10"><div className="bg-emerald-500 p-2 rounded-xl"><MessageCircle size={18}/></div><b className="text-base italic tracking-tighter">WPP CRM</b></div>
        <nav className="flex-1 space-y-1">
          {[{id:'c',i:MessageSquare,l:'Chats'},{id:'k',i:KB,l:'Kanban'},{id:'q',i:QrCode,l:'WhatsApp'},{id:'s',i:Settings,l:'Ajustes'}].map(v=>(
            <button key={v.id} onClick={()=>setT(v.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${t===v.id?'bg-emerald-500':'text-slate-500 hover:text-white'}`}><v.i size={16}/>{v.l}</button>
          ))}
        </nav>
        <button className="flex items-center gap-4 text-slate-500 font-bold p-4 hover:text-rose-400"><LogOut size={16}/>Sair</button>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between"><h2 className="font-black uppercase tracking-[.3em] text-slate-400">/ {t}</h2><div className="bg-emerald-50 px-4 py-1 rounded-full border border-emerald-100 text-[9px] font-black text-emerald-600 animate-pulse">LIVE</div></header>
        <div className="flex-1 overflow-hidden">
          {t==='c' && <div className="flex h-full"><div className="w-72 bg-white border-r overflow-y-auto">{DB.map(v=>(<div key={v.id} onClick={()=>setAct(v.id)} className={`p-4 border-b flex gap-3 cursor-pointer ${act===v.id?'bg-emerald-50':''}`}><img src={v.avatar} className="w-10 h-10 rounded-xl"/><div className="min-w-0 flex-1 flex flex-col justify-center"><div className="flex justify-between font-bold"><span>{v.name}</span><span className="text-[9px] text-slate-300">{v.lastMessageTime}</span></div><p className="truncate text-slate-400">{v.lastMessage}</p></div></div>))}</div><div className="flex-1 flex flex-col">{act ? <ChatView contact={c!} /> : <div className="h-full flex items-center justify-center opacity-5"><MessageCircle size={120}/></div>}</div></div>}
          {t==='k' && <div className="h-full p-8 flex gap-6 overflow-x-auto">{['NOVO','AGUARDANDO','ATENDIMENTO','RESOLVIDO'].map(s=>(<div key={s} className="w-72 flex-shrink-0"><h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">{s}</h3><div className="space-y-4">{DB.filter(v=>v.status===s).map(v=>(<div key={v.id} className="bg-white p-5 rounded-3xl border shadow-sm"><div className="flex items-center gap-2 mb-2"><img src={v.avatar} className="w-6 h-6 rounded-full"/><h4 className="font-bold">{v.name}</h4></div><p className="text-slate-400 italic">"{v.lastMessage}"</p></div>))}</div></div>))}</div>}
          {t==='q' && <div className="h-full flex items-center justify-center"><div className="bg-white p-12 rounded-[50px] shadow-2xl text-center border w-80"><h3 className="text-xl font-black mb-6">Conectar</h3><div className="aspect-square bg-slate-50 border-2 border-dashed rounded-[30px] mb-6 flex items-center justify-center">{qr ? <img src={qr} className="p-6"/> : <button onClick={()=>setQr("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=WPP")} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-black shadow-lg">QR CODE</button>}</div><p className="text-[9px] text-slate-400 font-bold uppercase">WPPConnect v6</p></div></div>}
          {t==='s' && <div className="p-12 max-w-xl mx-auto bg-white m-10 rounded-[40px] border shadow-sm"><h3 className="font-black text-slate-400 mb-8 pb-2 border-b">AJUSTES</h3><div className="space-y-4"><div className="flex justify-between p-4 bg-slate-50 rounded-2xl"><div><h4 className="font-bold">Gemini Auto-Triagem</h4><p className="text-slate-400">Ativo</p></div><div className="w-8 h-4 bg-emerald-500 rounded-full"></div></div></div></div>}
        </div>
      </main>
    </div>
  );
}

function ChatView({ contact }: { contact: Contact }) {
  return (
    <div className="flex flex-col h-full bg-white"><header className="h-16 border-b px-6 flex items-center gap-4 bg-white"><img src={contact.avatar} className="w-10 h-10 rounded-xl shadow-sm"/><div className="font-bold"><h4>{contact.name}</h4><p className="text-[9px] text-emerald-500 uppercase">{contact.phone}</p></div></header><div className="flex-1 p-8 overflow-y-auto bg-slate-50/30"><div className="flex justify-start"><div className="max-w-[70%] bg-white p-5 rounded-[25px] rounded-tl-none border shadow-sm"><p className="text-slate-700 leading-relaxed">{contact.lastMessage}</p></div></div></div><footer className="p-6 border-t"><div className="bg-slate-50 rounded-2xl p-3 flex gap-4 border"><input placeholder="Sua resposta..." className="flex-1 bg-transparent px-3 outline-none"/><button className="bg-emerald-500 text-white p-2 rounded-xl"><Send size={16}/></button></div></footer></div>
  );
}
