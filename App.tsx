
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Settings, LogOut, Kanban as KanbanIcon,
  Search, QrCode, Send, MoreVertical, Smile, 
  TrendingUp, AlertCircle, CheckCircle, MessageCircle
} from 'lucide-react';
import { Contact, KanbanStatus } from './types';

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'João Silva', phone: '5511912345678', avatar: 'https://i.pravatar.cc/150?u=1', status: 'NOVO', lastMessage: 'Quero saber sobre os planos.', lastMessageTime: '10:30', assignedTo: 'Bot AI' },
  { id: '2', name: 'Maria Oliveira', phone: '5511988888888', avatar: 'https://i.pravatar.cc/150?u=2', status: 'AGUARDANDO', lastMessage: 'Preciso de ajuda humana.', lastMessageTime: '09:15', assignedTo: 'Livre' },
  { id: '3', name: 'Suporte Técnico', phone: '5511977777777', avatar: 'https://i.pravatar.cc/150?u=3', status: 'ATENDIMENTO', lastMessage: 'Aguardando confirmação.', lastMessageTime: 'Ontem', assignedTo: 'Admin' },
  { id: '4', name: 'Carlos Tech', phone: '5511955554444', avatar: 'https://i.pravatar.cc/150?u=4', status: 'RESOLVIDO', lastMessage: 'Obrigado!', lastMessageTime: '11:20', assignedTo: 'Admin' },
];

export default function App() {
  const [tab, setTab] = useState('chats');
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [st, setSt] = useState({ auto: true, robin: false });

  const activeContact = contacts.find(c => c.id === activeId);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-50">
        <header className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-emerald-500 p-2 rounded-lg"><MessageCircle size={24} /></div>
          <h1 className="text-xl font-black hidden lg:block italic">WPP CRM</h1>
        </header>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'chats', icon: MessageSquare, label: 'Mensagens' },
            { id: 'kanban', icon: KanbanIcon, label: 'Dashboard' },
            { id: 'conn', icon: QrCode, label: 'WhatsApp' },
            { id: 'set', icon: Settings, label: 'Ajustes' },
          ].map(i => (
            <button key={i.id} onClick={() => setTab(i.id)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all font-bold text-sm ${tab === i.id ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <i.icon size={20} /> <span className="hidden lg:block">{i.label}</span>
            </button>
          ))}
        </nav>
        <footer className="p-6 border-t border-slate-800">
          <button className="flex items-center gap-4 text-slate-500 hover:text-rose-400 w-full text-sm font-bold"><LogOut size={20} /> <span className="hidden lg:block">Sair</span></button>
        </footer>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Painel / <span className="text-slate-800">{tab}</span></h2>
          <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-700 uppercase">WPP Online</span>
          </div>
        </header>

        <section className="flex-1 overflow-hidden relative">
          {tab === 'chats' && (
            <div className="flex h-full animate-in fade-in">
              <nav className="w-80 lg:w-96 bg-white border-r flex flex-col">
                <div className="p-4 bg-slate-50 border-b"><div className="bg-white border rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm"><Search size={14} className="text-slate-400" /><input type="text" placeholder="Buscar..." className="bg-transparent text-xs outline-none w-full" /></div></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {contacts.map(c => (
                    <article key={c.id} onClick={() => setActiveId(c.id)} className={`p-4 border-b border-slate-50 cursor-pointer flex gap-3 transition-all ${activeId === c.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}>
                      <img src={c.avatar} className="w-12 h-12 rounded-full border shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center"><h4 className="font-bold text-xs truncate text-slate-800">{c.name}</h4><span className="text-[9px] text-slate-400 font-bold">{c.lastMessageTime}</span></div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </nav>
              <div className="flex-1 bg-white">
                {activeId ? (
                  <ChatView contact={activeContact!} onBack={() => setActiveId(null)} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300"><MessageCircle size={80} strokeWidth={1} className="opacity-20 mb-4" /><p className="text-[10px] font-black uppercase tracking-tighter">Selecione um atendimento</p></div>
                )}
              </div>
            </div>
          )}

          {tab === 'kanban' && (
            <div className="h-full p-8 overflow-x-auto flex gap-8 bg-slate-50/50">
              {['NOVO', 'AGUARDANDO', 'ATENDIMENTO', 'RESOLVIDO'].map(s => (
                <div key={s} className="w-80 flex-shrink-0 flex flex-col">
                  <header className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex justify-between px-2">{s} <span>{contacts.filter(c => c.status === s).length}</span></header>
                  <div className="space-y-4 custom-scrollbar overflow-y-auto pr-2">
                    {contacts.filter(c => c.status === s).map(c => (
                      <div key={c.id} className="bg-white p-5 rounded-2xl border shadow-sm hover:border-emerald-500 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3 mb-4"><img src={c.avatar} className="w-8 h-8 rounded-full border shadow-sm" /><h4 className="font-bold text-[11px] text-slate-800 group-hover:text-emerald-600">{c.name}</h4></div>
                        <p className="text-[11px] text-slate-500 italic mb-4 line-clamp-2">"{c.lastMessage}"</p>
                        <div className="pt-3 border-t flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase"><span>{c.assignedTo}</span><span>{c.lastMessageTime}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'conn' && (
            <div className="h-full flex items-center justify-center p-12 bg-slate-50">
              <div className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-2xl text-center max-w-sm w-full animate-in zoom-in-95">
                <h3 className="text-xl font-black text-slate-800 mb-2">Parear Telefone</h3>
                <p className="text-[11px] text-slate-400 mb-10 leading-relaxed uppercase font-bold tracking-wider">WPPConnect Integration Layer</p>
                <div className="w-64 h-64 bg-slate-50 border-2 border-dashed rounded-[40px] mx-auto mb-10 flex items-center justify-center overflow-hidden">
                  {qr ? <img src={qr} className="w-full h-full p-6 object-contain" /> : <button onClick={() => setQr("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=WPPCONNECT")} className="px-8 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 active:scale-95 transition-all">Gerar QR Code</button>}
                </div>
                {qr && <p className="text-[9px] font-black text-emerald-600 uppercase animate-pulse">Aguardando escaneamento do worker...</p>}
              </div>
            </div>
          )}

          {tab === 'set' && (
            <div className="p-12 max-w-2xl mx-auto"><div className="bg-white p-10 rounded-3xl border shadow-sm"><h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-10 border-b pb-4">Configurações Ativas</h3><div className="space-y-6">
              {[ { k: 'auto', l: 'Triagem Bot', d: 'O robô atende novos contatos primeiro.' }, { k: 'robin', l: 'Round-Robin', d: 'Distribuição justa de leads entre agentes.' } ].map(i => (
                <div key={i.k} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100"><div><h4 className="text-sm font-bold text-slate-700">{i.l}</h4><p className="text-[10px] text-slate-400 mt-0.5">{i.d}</p></div><button onClick={() => setSt(s => ({...s, [i.k]: !s[i.k]}))} className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${st[i.k] ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${st[i.k] ? 'translate-x-6' : 'translate-x-0'}`}></div></button></div>
              ))}
            </div></div></div>
          )}
        </section>
      </main>
    </div>
  );
}

function ChatView({ contact, onBack }: { contact: Contact, onBack: () => void }) {
  const [msg, setMsg] = useState('');
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => { scroll.current?.scrollTo(0, scroll.current.scrollHeight); }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b px-8 flex items-center justify-between bg-white shadow-sm z-10"><div className="flex items-center gap-4"><img src={contact.avatar} className="w-10 h-10 rounded-full border shadow-sm" /><div><h4 className="font-bold text-sm text-slate-800">{contact.name}</h4><p className="text-[10px] text-emerald-500 font-black uppercase">{contact.phone}</p></div></div><button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl"><MoreVertical size={20}/></button></header>
      <div ref={scroll} className="flex-1 overflow-y-auto p-8 bg-slate-50/50 custom-scrollbar"><div className="flex justify-start"><div className="max-w-[70%] p-4 rounded-2xl text-sm bg-white border border-slate-100 shadow-sm rounded-tl-none"><p className="leading-relaxed text-slate-700">{contact.lastMessage}</p><span className="block text-[8px] mt-2 text-right opacity-40 font-bold uppercase">{contact.lastMessageTime}</span></div></div></div>
      <footer className="p-6 bg-white border-t border-slate-100"><div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-5 py-3 border border-transparent focus-within:bg-white focus-within:border-emerald-500 transition-all shadow-sm"><button className="text-slate-400 hover:text-emerald-500"><Smile size={20}/></button><input type="text" value={msg} onChange={e => setMsg(e.target.value)} placeholder="Responda ao cliente..." className="flex-1 bg-transparent py-1 text-sm outline-none text-slate-800" /><button className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"><Send size={18}/></button></div></footer>
    </div>
  );
}
