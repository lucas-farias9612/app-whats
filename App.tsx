
import React, { useState } from 'react';
import { MessageSquare, Kanban as KB, QrCode, Settings, LogOut, Search, Send, MessageCircle } from 'lucide-react';
import { Contact } from './types';

const DB: Contact[] = [
  { id: '1', name: 'João Silva', phone: '5511912345678', avatar: 'https://i.pravatar.cc/150?u=1', status: 'NOVO', lastMessage: 'Olá, gostaria de saber os preços.', lastMessageTime: '10:30', assignedTo: 'Bot' },
  { id: '2', name: 'Maria Oliveira', phone: '5511988888888', avatar: 'https://i.pravatar.cc/150?u=2', status: 'AGUARDANDO', lastMessage: 'Aguardo retorno.', lastMessageTime: 'Ontem', assignedTo: 'Admin' },
  { id: '3', name: 'Carlos Tech', phone: '5511955554444', avatar: 'https://i.pravatar.cc/150?u=4', status: 'RESOLVIDO', lastMessage: 'Obrigado!', lastMessageTime: '11:20', assignedTo: 'Admin' },
];

export default function App() {
  const [t, setT] = useState('c'), [act, setAct] = useState<string|null>(null), [qr, setQr] = useState<string|null>(null);
  const c = DB.find(i => i.id === act);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900 text-xs">
      <aside className="w-64 bg-slate-950 text-white flex flex-col p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-10"><div className="bg-emerald-500 p-2 rounded-xl"><MessageCircle size={20}/></div><b className="text-lg italic tracking-tighter">WPP CRM</b></div>
        <nav className="flex-1 space-y-1">
          {[{ id: 'c', i: MessageSquare, l: 'Chats' }, { id: 'k', i: KB, l: 'Kanban' }, { id: 'q', i: QrCode, l: 'WhatsApp' }, { id: 's', i: Settings, l: 'Ajustes' }].map(v => (
            <button key={v.id} onClick={() => setT(v.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold ${t === v.id ? 'bg-emerald-500' : 'text-slate-500 hover:text-white'}`}><v.i size={18}/>{v.l}</button>
          ))}
        </nav>
        <button className="flex items-center gap-4 text-slate-500 font-bold p-4 hover:text-rose-400"><LogOut size={18}/>Sair</button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between"><h2 className="font-black uppercase tracking-[.3em] text-slate-400">Panel / {t}</h2><div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 text-[10px] font-black text-emerald-600 animate-pulse">ONLINE</div></header>
        <div className="flex-1 overflow-hidden">
          {t === 'c' && (
            <div className="flex h-full">
              <div className="w-80 bg-white border-r flex flex-col">
                <div className="p-4"><div className="bg-slate-50 border rounded-xl px-3 py-2 flex items-center gap-2"><Search size={14}/><input placeholder="Buscar..." className="bg-transparent outline-none w-full" /></div></div>
                {DB.map(v => (
                  <div key={v.id} onClick={() => setAct(v.id)} className={`p-4 border-b flex gap-4 cursor-pointer ${act === v.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}><img src={v.avatar} className="w-10 h-10 rounded-xl shadow-sm"/><div className="min-w-0 flex-1"><div className="flex justify-between font-bold"><span>{v.name}</span><span className="text-[10px] text-slate-400">{v.lastMessageTime}</span></div><p className="truncate text-slate-500">{v.lastMessage}</p></div></div>
                ))}
              </div>
              <div className="flex-1 bg-slate-50 flex flex-col">{act ? <ChatView contact={c!} /> : <div className="h-full flex items-center justify-center opacity-5"><MessageCircle size={100}/></div>}</div>
            </div>
          )}
          {t === 'k' && (
            <div className="h-full p-8 flex gap-8 overflow-x-auto">
              {['NOVO', 'AGUARDANDO', 'ATENDIMENTO', 'RESOLVIDO'].map(s => (
                <div key={s} className="w-72 flex-shrink-0"><h3 className="text-[10px] font-black text-slate-400 mb-6 px-2">{s}</h3>
                  <div className="space-y-4">{DB.filter(v => v.status === s).map(v => (
                    <div key={v.id} className="bg-white p-5 rounded-3xl border shadow-sm"><div className="flex items-center gap-3 mb-3"><img src={v.avatar} className="w-7 h-7 rounded-full"/><h4 className="font-bold">{v.name}</h4></div><p className="text-slate-400 italic">"{v.lastMessage}"</p></div>
                  ))}</div>
                </div>
              ))}
            </div>
          )}
          {t === 'q' && <div className="h-full flex items-center justify-center"><div className="bg-white p-12 rounded-[50px] shadow-2xl text-center border w-80"><h3 className="text-xl font-black mb-6">Conectar</h3><div className="aspect-square bg-slate-50 border-2 border-dashed rounded-[30px] mb-6 flex items-center justify-center">{qr ? <img src={qr} className="p-6"/> : <button onClick={() => setQr("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=WPP")} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-black shadow-lg">Gerar QR</button>}</div><p className="text-[10px] text-slate-400 font-bold uppercase">WPPConnect Layer 5.0</p></div></div>}
          {t === 's' && <div className="p-12 max-w-xl mx-auto bg-white m-10 rounded-[40px] border shadow-sm"><h3 className="font-black text-slate-400 mb-8 pb-4 border-b">CONFIGURAÇÃO</h3><div className="space-y-4"><div className="flex justify-between p-4 bg-slate-50 rounded-2xl border"><div><h4 className="font-bold">IA Auto-Triagem</h4><p className="text-slate-400">Gemini 3 ativo.</p></div><div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center px-1"><div className="w-3 h-3 bg-white rounded-full translate-x-5"></div></div></div></div></div>}
        </div>
      </main>
    </div>
  );
}

function ChatView({ contact }: { contact: Contact }) {
  return (
    <div className="flex flex-col h-full bg-white shadow-xl"><header className="h-16 border-b px-6 flex items-center gap-4"><img src={contact.avatar} className="w-10 h-10 rounded-xl"/><div className="font-bold"><h4>{contact.name}</h4><p className="text-[10px] text-emerald-500 uppercase">{contact.phone}</p></div></header><div className="flex-1 p-8 overflow-y-auto bg-slate-50/50"><div className="flex justify-start"><div className="max-w-[70%] bg-white p-5 rounded-[25px] rounded-tl-none border"><p className="text-slate-700">{contact.lastMessage}</p></div></div></div><footer className="p-6 border-t"><div className="bg-slate-50 rounded-3xl p-3 flex gap-4 border"><input placeholder="Sua resposta..." className="flex-1 bg-transparent px-3 outline-none"/><button className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg"><Send size={18}/></button></div></footer></div>
  );
}
