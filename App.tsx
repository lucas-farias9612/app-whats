
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  MessageSquare, Settings, LogOut, Kanban as KanbanIcon,
  Search, QrCode, Send, MoreVertical, Smile, Headphones,
  Bot, CheckCircle2, TrendingUp, AlertCircle, CheckCircle,
  Zap, UserCheck, MessageCircle, Smartphone, RefreshCw, Loader2
} from 'lucide-react';
import { Contact, KanbanStatus, Message } from './types';
import { processBotLogic, QUICK_RESPONSES, BOT_MENU } from './services/ragService';

// --- Dados Iniciais (Mock) ---
const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'João Silva', phone: '5511912345678', avatar: 'https://i.pravatar.cc/150?u=1', status: 'NOVO', lastMessage: 'Quero saber sobre os planos.', lastMessageTime: '10:30', assignedTo: 'Bot AI' },
  { id: '2', name: 'Maria Oliveira', phone: '5511988888888', avatar: 'https://i.pravatar.cc/150?u=2', status: 'AGUARDANDO', lastMessage: 'Preciso de ajuda humana.', lastMessageTime: '09:15', assignedTo: 'Livre' },
  { id: '3', name: 'Empresa XPTO', phone: '5511977777777', avatar: 'https://i.pravatar.cc/150?u=3', status: 'ATENDIMENTO', lastMessage: 'Contrato enviado.', lastMessageTime: 'Ontem', assignedTo: 'Admin' },
  { id: '4', name: 'Carlos Tech', phone: '5511955554444', avatar: 'https://i.pravatar.cc/150?u=4', status: 'RESOLVIDO', lastMessage: 'Obrigado!', lastMessageTime: '11:20', assignedTo: 'Admin' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('chats');
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [{ id: 'b1', senderId: 'bot', senderName: 'Bot', text: BOT_MENU, timestamp: '10:30', fromMe: true }],
  });
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  
  // Estados das Configurações (Toggles)
  const [settings, setSettings] = useState({ autoTriagem: true, roundRobin: false });
  const [connStatus, setConnStatus] = useState<'DISCONNECTED' | 'PAIRING' | 'CONNECTED'>('CONNECTED');
  const [qrCode, setQrCode] = useState<string | null>(null);

  // --- Lógica de Ações ---
  const toggleSetting = (key: 'autoTriagem' | 'roundRobin') => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateStatus = (id: string, status: KanbanStatus) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status, assignedTo: status === 'ATENDIMENTO' ? 'Admin' : c.assignedTo } : c));
  };

  const handleSendMessage = (text: string) => {
    if (!activeContactId) return;
    const newMsg = { id: Date.now().toString(), senderId: 'me', senderName: 'Atendente', text, timestamp: 'Agora', fromMe: true };
    setMessages(prev => ({ ...prev, [activeContactId]: [...(prev[activeContactId] || []), newMsg] }));
    updateStatus(activeContactId, 'ATENDIMENTO');
  };

  const activeContact = contacts.find(c => c.id === activeContactId);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden">
      
      {/* MENU LATERAL (Aside) */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col shadow-xl z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-emerald-500 p-2 rounded-lg text-white"><MessageCircle size={24} /></div>
          <h1 className="text-xl font-bold hidden lg:block italic">WPP CRM</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'chats', icon: MessageSquare, label: 'Atendimento' },
            { id: 'kanban', icon: KanbanIcon, label: 'Dashboard' },
            { id: 'connection', icon: QrCode, label: 'WhatsApp' },
            { id: 'settings', icon: Settings, label: 'Ajustes' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <item.icon size={20} />
              <span className="hidden lg:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <footer className="p-6 border-t border-slate-800">
          <button className="flex items-center gap-4 text-slate-500 hover:text-rose-400 w-full transition-colors">
            <LogOut size={20} /> <span className="hidden lg:block font-medium">Sair</span>
          </button>
        </footer>
      </aside>

      {/* CONTEÚDO PRINCIPAL (Main) */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* CABEÇALHO (Header) */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-40">
          <h2 className="text-lg font-bold text-slate-700 capitalize">
            {activeTab === 'chats' ? 'Painel de Mensagens' : activeTab === 'kanban' ? 'Gestão de Tickets' : activeTab}
          </h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${connStatus === 'CONNECTED' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
            <span className={`w-2 h-2 rounded-full ${connStatus === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            {connStatus === 'CONNECTED' ? 'WPP Online' : 'Desconectado'}
          </div>
        </header>

        {/* ÁREA DINÂMICA (Section) */}
        <section className="flex-1 overflow-hidden relative">
          
          {/* ABA CHATS */}
          {activeTab === 'chats' && (
            <div className="flex h-full animate-in fade-in">
              <aside className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b bg-slate-50/30">
                  <div className="bg-white border rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
                    <Search size={14} className="text-slate-400" />
                    <input type="text" placeholder="Buscar conversa..." className="bg-transparent text-xs w-full outline-none" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {contacts.map(c => (
                    <article 
                      key={c.id} 
                      onClick={() => setActiveContactId(c.id)}
                      className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-all flex gap-3 ${activeContactId === c.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}
                    >
                      <img src={c.avatar} className="w-12 h-12 rounded-full border bg-white" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-xs truncate">{c.name}</h4>
                          <time className="text-[9px] text-slate-400">{c.lastMessageTime}</time>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{c.lastMessage}</p>
                        <span className={`inline-block mt-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${c.status === 'NOVO' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                          {c.status}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </aside>
              
              <section className="flex-1 flex flex-col bg-white">
                {activeContact ? (
                  <ChatWindow contact={activeContact} messages={messages[activeContact.id] || []} onSend={handleSendMessage} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                    <MessageSquare size={64} className="mb-4 opacity-10" />
                    <p className="font-bold text-sm uppercase tracking-widest opacity-30">Selecione uma conversa</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ABA DASHBOARD (KANBAN) */}
          {activeTab === 'kanban' && (
            <div className="h-full p-6 space-y-6 overflow-y-auto bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard icon={TrendingUp} label="Total de Tickets" value={contacts.length} color="indigo" />
                <MetricCard icon={AlertCircle} label="Aguardando Humano" value={contacts.filter(c => c.status === 'AGUARDANDO').length} color="rose" />
                <MetricCard icon={CheckCircle} label="Finalizados" value={contacts.filter(c => c.status === 'RESOLVIDO').length} color="emerald" />
              </div>

              <div className="flex gap-6 overflow-x-auto pb-10">
                {['NOVO', 'AGUARDANDO', 'ATENDIMENTO', 'RESOLVIDO'].map(status => (
                  <div key={status} className="w-80 flex-shrink-0">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 px-2 tracking-widest flex items-center justify-between">
                      {status} <span>{contacts.filter(c => c.status === status).length}</span>
                    </h3>
                    <div className="space-y-3">
                      {contacts.filter(c => c.status === status).map(c => (
                        <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-3 mb-2">
                            <img src={c.avatar} className="w-8 h-8 rounded-full" />
                            <p className="font-bold text-xs truncate">{c.name}</p>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1 italic mb-2">"{c.lastMessage}"</p>
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 border-t pt-2 mt-2">
                             <span>{c.assignedTo}</span>
                             <span>{c.lastMessageTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA AJUSTES (Settings) */}
          {activeTab === 'settings' && (
            <div className="p-10 max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <header className="flex items-center gap-2 mb-8 border-b pb-4">
                  <Settings size={20} className="text-slate-400" />
                  <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Regras de Negócio</h3>
                </header>
                
                <div className="space-y-6">
                  <ConfigRow 
                    label="Fluxo de Triagem Automática" 
                    desc="Novas conversas passam primeiro pelo Bot." 
                    active={settings.autoTriagem} 
                    onToggle={() => toggleSetting('autoTriagem')} 
                  />
                  <ConfigRow 
                    label="Distribuição Round-Robin" 
                    desc="Divide os tickets igualmente entre a equipe." 
                    active={settings.roundRobin} 
                    onToggle={() => toggleSetting('roundRobin')} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABA WHATSAPP (QR Code) */}
          {activeTab === 'connection' && (
             <div className="h-full flex flex-col items-center justify-center p-10 bg-slate-50/50">
                <div className="bg-white p-12 rounded-[40px] border border-slate-200 shadow-2xl text-center max-w-md w-full animate-in zoom-in-95">
                   {connStatus === 'CONNECTED' ? (
                     <>
                       <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600"><QrCode size={40}/></div>
                       <h3 className="text-2xl font-black text-slate-800 mb-2">Conectado</h3>
                       <p className="text-sm text-slate-400 mb-8">Worker WPP-1 ativo e sincronizando mensagens.</p>
                       <button onClick={() => setConnStatus('DISCONNECTED')} className="text-xs font-black text-rose-500 hover:underline uppercase tracking-widest">Desconectar</button>
                     </>
                   ) : (
                     <>
                       <h3 className="text-xl font-black mb-2">Pareamento WhatsApp</h3>
                       <p className="text-sm text-slate-400 mb-8">Escaneie para iniciar o atendimento.</p>
                       <div className="w-64 h-64 bg-slate-50 border-2 border-dashed rounded-3xl mx-auto mb-8 flex items-center justify-center">
                          {qrCode ? <img src={qrCode} className="p-4" /> : <button onClick={() => setQrCode("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WPPCONNECT")} className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase">Gerar QR</button>}
                       </div>
                       {qrCode && <button onClick={() => setConnStatus('CONNECTED')} className="text-xs font-bold text-emerald-600 hover:underline">Já escaneei!</button>}
                     </>
                   )}
                </div>
             </div>
          )}

        </section>
      </main>
    </div>
  );
}

// --- Componentes Auxiliares Estilo HTML ---

function MetricCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
      <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600`}><Icon size={24} /></div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function ConfigRow({ label, desc, active, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div>
        <p className="text-sm font-bold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 shadow-inner ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );
}

function ChatWindow({ contact, messages, onSend }: any) {
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 border-b px-6 flex items-center justify-between bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src={contact.avatar} className="w-10 h-10 rounded-full border" />
          <div>
            <h4 className="font-bold text-sm">{contact.name}</h4>
            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">{contact.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreVertical size={20}/></button>
        </div>
      </header>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3.5 rounded-2xl text-sm shadow-sm ${m.fromMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'}`}>
              {m.senderId === 'bot' && <span className="block text-[8px] font-black uppercase opacity-60 mb-1">Bot AI</span>}
              <p className="leading-relaxed">{m.text}</p>
              <time className="block text-[8px] mt-1 text-right opacity-40">{m.timestamp}</time>
            </div>
          </div>
        ))}
      </div>

      <footer className="p-4 bg-white border-t">
        <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-1.5 border border-transparent focus-within:bg-white focus-within:border-emerald-500 transition-all">
          <button className="text-slate-400"><Smile size={20}/></button>
          <input 
            type="text" 
            value={text} 
            onChange={e => setText(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && (onSend(text), setText(''))}
            placeholder="Digite sua resposta..." 
            className="flex-1 bg-transparent py-2 text-sm outline-none" 
          />
          <button onClick={() => { onSend(text); setText(''); }} className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"><Send size={18}/></button>
        </div>
      </footer>
    </div>
  );
}
