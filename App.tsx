
import React, { useState } from 'react';
import { MessageSquare, Kanban as KB, QrCode, Settings, LogOut, Search, Send, MessageCircle } from 'lucide-react';
import { Contact } from './types';

const DB: Contact[] = [
  { id: '1', name: 'João Silva', phone: '5511912345678', avatar: 'https://i.pravatar.cc/150?u=1', status: 'NOVO', lastMessage: 'Olá, gostaria de saber os preços.', lastMessageTime: '10:30', assignedTo: 'Bot' },
  { id: '2', name: 'Maria Oliveira', phone: '5511988888888', avatar: 'https://i.pravatar.cc/150?u=2', status: 'AGUARDANDO', lastMessage: 'Aguardo retorno sobre a proposta.', lastMessageTime: 'Ontem', assignedTo: 'Admin' },
  { id: '3', name: 'Carlos Tech', phone: '5511955554444', avatar: 'https://i.pravatar.cc/150?u=4', status: 'RESOLVIDO', lastMessage: 'Tudo certo, obrigado!', lastMessageTime: '11:20', assignedTo: 'Admin' },
];

export default function App() {
  const [t, setT] = useState('c');
  const [act, setAct] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  const contact = DB.find(c => c.id === act);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col shadow-2xl">
        <header className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl"><MessageCircle size={22}/></div>
          <span className="text-xl font-black italic tracking-tighter">WPP CRM</span>
        </header>
        <nav className="p-4 space-y-1">
          {[
            { id: 'c', i: MessageSquare, l: 'Chats' },
            { id: 'k', i: KB, l: 'Kanban' },
            { id: 'q', i: QrCode, l: 'WhatsApp' },
            { id: 's', i: Settings, l: 'Ajustes' }
          ].map(i => (
            <button key={i.id} onClick={() => setT(i.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${t === i.id ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:text-white'}`}>
              <i.i size={20}/><span className="hidden lg:block">{i.l}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-6"><button className="flex items-center gap-4 text-slate-500 hover:text-rose-400 font-bold text-sm"><LogOut size={20}/> Sair</button></div>
      </aside>

      {/* VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Panel / {t === 'c' ? 'Atendimento' : t === 'k' ? 'Kanban' : 'Conexão'}</h2>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 text-[10px] font-black text-emerald-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> ONLINE
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {t === 'c' && (
            <div className="flex h-full">
              <div className="w-80 lg:w-96 bg-white border-r flex flex-col">
                <div className="p-4"><div className="bg-slate-50 border rounded-xl px-3 py-2 flex items-center gap-2"><Search size={14} className="text-slate-400"/><input placeholder="Buscar..." className="bg-transparent text-xs outline-none w-full" /></div></div>
                {DB.map(c => (
                  <div key={c.id} onClick={() => setAct(c.id)} className={`p-4 border-b flex gap-4 cursor-pointer transition-all ${act === c.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}>
                    <img src={c.avatar} className="w-12 h-12 rounded-2xl border"/>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center"><h4 className="font-bold text-xs truncate">{c.name}</h4><span className="text-[9px] text-slate-400">{c.lastMessageTime}</span></div>
                      <p className="text-[11px] text-slate-500 truncate">{c.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-1 bg-slate-50 flex flex-col">
                {act ? <ChatView contact={contact!} /> : <div className="h-full flex items-center justify-center opacity-10"><MessageCircle size={120}/></div>}
              </div>
            </div>
          )}

          {t === 'k' && (
            <div className="h-full p-8 flex gap-8 overflow-x-auto">
              {['NOVO', 'AGUARDANDO', 'ATENDIMENTO', 'RESOLVIDO'].map(s => (
                <div key={s} className="w-80 flex-shrink-0">
                  <h3 className="text-[10px] font-black text-slate-400 tracking-widest mb-6 px-2">{s}</h3>
                  <div className="space-y-4">
                    {DB.filter(c => c.status === s).map(c => (
                      <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-4"><img src={c.avatar} className="w-8 h-8 rounded-full border"/><h4 className="font-bold text-[11px]">{c.name}</h4></div>
                        <p className="text-[10px] text-slate-400 italic">"{c.lastMessage}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {t === 'q' && (
            <div className="h-full flex items-center justify-center">
              <div className="bg-white p-12 rounded-[60px] shadow-2xl text-center border">
                <h3 className="text-2xl font-black mb-8 italic tracking-tighter">Parear WhatsApp</h3>
                <div className="w-64 h-64 bg-slate-50 border-2 border-dashed rounded-[40px] mb-8 flex items-center justify-center mx-auto overflow-hidden">
                  {qr ? <img src={qr} className="p-8"/> : <button onClick={() => setQr("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=WPP")} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl">Gerar QR</button>}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">WPPConnect Layer v4.0 Active</p>
              </div>
            </div>
          )}

          {t === 's' && (
            <div className="p-12 max-w-xl mx-auto"><div className="bg-white p-10 rounded-[40px] border shadow-sm"><h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-10">Configurações Ativas</h3><div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border"><div><h4 className="text-sm font-bold">Auto-Triagem IA</h4><p className="text-[10px] text-slate-400">Robô atende novos contatos.</p></div><div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full translate-x-6"></div></div></div>
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border opacity-50"><div><h4 className="text-sm font-bold">Distribuição Round-Robin</h4><p className="text-[10px] text-slate-400">Fila entre agentes ativos.</p></div><div className="w-12 h-6 bg-slate-200 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full"></div></div></div>
            </div></div></div>
          )}
        </div>
      </main>
    </div>
  );
}

function ChatView({ contact }: { contact: Contact }) {
  return (
    <div className="flex flex-col h-full bg-white shadow-xl">
      <header className="h-20 border-b px-8 flex items-center gap-4"><img src={contact.avatar} className="w-12 h-12 rounded-2xl border shadow-sm"/><div><h4 className="font-bold text-sm">{contact.name}</h4><p className="text-[10px] text-emerald-500 font-black uppercase">{contact.phone}</p></div></header>
      <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-slate-50/50"><div className="flex justify-start"><div className="max-w-[70%] bg-white p-6 rounded-[30px] rounded-tl-none shadow-sm border border-slate-100"><p className="text-sm text-slate-700">{contact.lastMessage}</p></div></div></div>
      <footer className="p-8 border-t"><div className="bg-slate-50 rounded-[30px] p-4 flex gap-4 border focus-within:bg-white focus-within:border-emerald-500 transition-all"><input placeholder="Sua resposta..." className="flex-1 bg-transparent text-sm outline-none px-4" /><button className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg"><Send size={20}/></button></div></footer>
    </div>
  );
}
