
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Kanban as KanbanIcon, QrCode, Settings,
  LogOut, Search, Send, MessageCircle, MoreVertical
} from 'lucide-react';
import { Contact } from './types';

const DATA: Contact[] = [
  { id: '1', name: 'João Silva', phone: '5511912345678', avatar: 'https://i.pravatar.cc/150?u=1', status: 'NOVO', lastMessage: 'Quero saber sobre os planos.', lastMessageTime: '10:30', assignedTo: 'Bot AI' },
  { id: '2', name: 'Maria Oliveira', phone: '5511988888888', avatar: 'https://i.pravatar.cc/150?u=2', status: 'AGUARDANDO', lastMessage: 'Preciso de ajuda humana.', lastMessageTime: '09:15', assignedTo: 'Livre' },
  { id: '3', name: 'Suporte VIP', phone: '5511977777777', avatar: 'https://i.pravatar.cc/150?u=3', status: 'ATENDIMENTO', lastMessage: 'Contrato enviado.', lastMessageTime: 'Ontem', assignedTo: 'Admin' },
  { id: '4', name: 'Carlos Tech', phone: '5511955554444', avatar: 'https://i.pravatar.cc/150?u=4', status: 'RESOLVIDO', lastMessage: 'Obrigado!', lastMessageTime: '11:20', assignedTo: 'Admin' },
];

export default function App() {
  const [tab, setTab] = useState('chats');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  const activeContact = DATA.find(c => c.id === activeId);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* SIDEBAR - LEAN TSX */}
      <aside className="w-20 lg:w-64 bg-slate-950 text-white flex flex-col shadow-2xl">
        <header className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="bg-emerald-500 p-2 rounded-xl text-white"><MessageCircle size={22} /></div>
          <h1 className="text-xl font-black hidden lg:block tracking-tighter">WPP CRM</h1>
        </header>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'chats', icon: MessageSquare, label: 'Chats' },
            { id: 'kanban', icon: KanbanIcon, label: 'Kanban' },
            { id: 'qr', icon: QrCode, label: 'Conexão' },
            { id: 'set', icon: Settings, label: 'Config' }
          ].map(i => (
            <button key={i.id} onClick={() => setTab(i.id)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all font-bold text-sm ${tab === i.id ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <i.icon size={20} /> <span className="hidden lg:block">{i.label}</span>
            </button>
          ))}
        </nav>
        <footer className="p-6 border-t border-white/5">
          <button className="flex items-center gap-4 text-slate-500 hover:text-rose-400 w-full font-bold text-sm"><LogOut size={20} /> <span className="hidden lg:block">Logout</span></button>
        </footer>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{tab} Dashboard</h2>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Sistema Ativo
          </div>
        </header>

        <section className="flex-1 overflow-hidden">
          {tab === 'chats' && (
            <div className="flex h-full">
              <nav className="w-80 lg:w-96 bg-white border-r flex flex-col">
                <div className="p-4 bg-slate-50/50 border-b"><div className="bg-white border rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm"><Search size={14} className="text-slate-400" /><input type="text" placeholder="Buscar contatos..." className="bg-transparent text-xs outline-none w-full" /></div></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {DATA.map(c => (
                    <article key={c.id} onClick={() => setActiveId(c.id)} className={`p-4 border-b border-slate-50 cursor-pointer flex gap-4 transition-all ${activeId === c.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}>
                      <img src={c.avatar} className="w-12 h-12 rounded-2xl border shadow-sm" alt={c.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center"><h4 className="font-bold text-xs truncate text-slate-800">{c.name}</h4><span className="text-[9px] text-slate-400 font-bold">{c.lastMessageTime}</span></div>
                        <p className="text-[11px] text-slate-500 truncate mt-1">{c.lastMessage}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </nav>
              <div className="flex-1 bg-slate-50 flex items-center justify-center">
                {activeId ? <ChatView contact={activeContact!} /> : <div className="text-center opacity-20"><MessageCircle size={100} className="mx-auto mb-4" /><p className="font-black text-[10px] uppercase tracking-widest">Inicie uma conversa</p></div>}
              </div>
            </div>
          )}

          {tab === 'kanban' && (
            <div className="h-full p-8 overflow-x-auto flex gap-6">
              {['NOVO', 'AGUARDANDO', 'ATENDIMENTO', 'RESOLVIDO'].map(s => (
                <div key={s} className="w-80 flex-shrink-0 flex flex-col">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2 flex justify-between">{s} <span>{DATA.filter(c => c.status === s).length}</span></h3>
                  <div className="space-y-4 custom-scrollbar overflow-y-auto pr-2">
                    {DATA.filter(c => c.status === s).map(c => (
                      <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-4"><img src={c.avatar} className="w-8 h-8 rounded-lg border shadow-sm" /><h4 className="font-bold text-[11px] text-slate-700">{c.name}</h4></div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 italic mb-4">"{c.lastMessage}"</p>
                        <div className="pt-3 border-t flex justify-between text-[9px] font-bold text-slate-400"><span>{c.assignedTo}</span><span>{c.lastMessageTime}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'qr' && (
            <div className="h-full flex items-center justify-center p-12">
              <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-2xl text-center max-w-sm w-full">
                <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Parear WhatsApp</h3>
                <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] mb-8 flex items-center justify-center overflow-hidden">
                  {qr ? <img src={qr} className="w-full h-full p-8" alt="QR" /> : <button onClick={() => setQr("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=WPPCONNECT_DEMO")} className="px-10 py-3.5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30">Gerar Código</button>}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">Abra o WhatsApp no seu celular e escaneie o código acima.</p>
              </div>
            </div>
          )}

          {tab === 'set' && (
            <div className="p-12 max-w-2xl mx-auto"><div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-10 border-b pb-4">Ajustes do Robô</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl"><div><h4 className="text-sm font-bold text-slate-700">Auto-Triagem</h4><p className="text-[10px] text-slate-400">IA inicia atendimentos automaticamente.</p></div><div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full translate-x-6"></div></div></div>
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl opacity-50"><div><h4 className="text-sm font-bold text-slate-700">Fila Round-Robin</h4><p className="text-[10px] text-slate-400">Distribuição entre agentes ativos.</p></div><div className="w-12 h-6 bg-slate-300 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full"></div></div></div>
              </div>
            </div></div>
          )}
        </section>
      </main>
    </div>
  );
}

function ChatView({ contact }: { contact: Contact }) {
  return (
    <div className="flex flex-col h-full w-full bg-white shadow-2xl">
      <header className="h-20 border-b px-8 flex items-center justify-between bg-white z-10"><div className="flex items-center gap-4"><img src={contact.avatar} className="w-12 h-12 rounded-2xl border shadow-sm" /><div className="min-w-0"><h4 className="font-bold text-sm text-slate-800 truncate">{contact.name}</h4><p className="text-[10px] text-emerald-500 font-black uppercase">{contact.phone}</p></div></div><button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={20}/></button></header>
      <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50 custom-scrollbar flex flex-col gap-6">
        <div className="flex justify-start"><div className="max-w-[70%] p-5 rounded-3xl text-sm bg-white border border-slate-100 shadow-sm rounded-tl-none text-slate-700"><p>{contact.lastMessage}</p><span className="block text-[8px] mt-2 text-right opacity-30 font-bold uppercase">{contact.lastMessageTime}</span></div></div>
      </div>
      <footer className="p-8 bg-white border-t border-slate-100"><div className="flex items-center gap-4 bg-slate-50 rounded-[24px] px-6 py-4 border border-transparent focus-within:bg-white focus-within:border-emerald-500 transition-all shadow-sm"><input type="text" placeholder="Digite sua resposta..." className="flex-1 bg-transparent text-sm outline-none text-slate-800" /><button className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"><Send size={20}/></button></div></footer>
    </div>
  );
}
