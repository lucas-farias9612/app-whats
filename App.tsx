
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MessageSquare, 
  Settings, 
  LogOut, 
  Kanban as KanbanIcon,
  Search,
  QrCode, 
  ShieldCheck,
  Send,
  MoreVertical,
  Paperclip,
  Smile,
  User as UserIcon,
  CheckCircle2,
  Headphones,
  Bot,
  Database,
  SearchCode,
  ChevronDown,
  Zap,
  Clock,
  UserCheck,
  MessageCircle,
  RefreshCw,
  Loader2,
  Smartphone,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Contact, KanbanStatus, Message } from './types';
import { processBotLogic, getRagResponse, detectUrgency, QUICK_RESPONSES, BOT_MENU } from './services/ragService';

// --- Mock Initial State ---
const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Novo Cliente', phone: '5511912345678', avatar: 'https://picsum.photos/seed/n1/200', status: 'NOVO', lastMessage: 'Oi, bom dia!', lastMessageTime: 'Agora', tags: ['Bot Ativo'], assignedTo: 'Bot AI' },
  { id: '2', name: 'Maria Souza', phone: '5511988888888', avatar: 'https://picsum.photos/seed/maria/200', status: 'AGUARDANDO', lastMessage: 'Quero falar com um atendente.', lastMessageTime: '09:45', tags: ['Suporte'], assignedTo: 'Livre' },
  { id: '3', name: 'Pedro Santos', phone: '5511977777777', avatar: 'https://picsum.photos/seed/pedro/200', status: 'ATENDIMENTO', lastMessage: 'Ok, vou aguardar o e-mail.', lastMessageTime: 'Ontem', tags: ['Vendas'], assignedTo: 'Admin' },
  { id: '4', name: 'Julia Lima', phone: '5511955554444', avatar: 'https://picsum.photos/seed/j4/200', status: 'RESOLVIDO', lastMessage: 'Obrigada pelo suporte!', lastMessageTime: '11:20', tags: ['Finalizado'], assignedTo: 'Admin' },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'bot-1', senderId: 'bot', senderName: 'Bot AI', text: BOT_MENU, timestamp: '10:28', fromMe: true },
  ],
  '2': [
    { id: 'm2', senderId: '2', senderName: 'Maria', text: '5', timestamp: '09:40', fromMe: false },
    { id: 'm3', senderId: 'bot', senderName: 'Bot AI', text: 'Entendido! Estou transferindo você para um de nossos atendentes. Por favor, aguarde um instante... ⏳', timestamp: '09:41', fromMe: true },
  ]
};

// --- Sub-components ---

const Sidebar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const menuItems = [
    { id: 'chats', icon: MessageSquare, label: 'Atendimento' },
    { id: 'kanban', icon: KanbanIcon, label: 'Tickets' },
    { id: 'connection', icon: QrCode, label: 'WhatsApp' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-900 text-white h-screen flex flex-col transition-all duration-300 shadow-2xl z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <MessageCircle size={24} />
        </div>
        <span className="text-xl font-bold hidden lg:block tracking-tight italic">WPP CRM</span>
      </div>
      <nav className="flex-1 mt-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-emerald-500 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800">
        <button className="w-full flex items-center gap-4 p-3 text-slate-400 hover:text-rose-400 transition-colors">
          <LogOut size={20} />
          <span className="hidden lg:block font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};

const KanbanBoard = ({ contacts, onSelectTicket }: { contacts: Contact[], onSelectTicket: (id: string) => void }) => {
  const columns: { title: string, status: KanbanStatus, color: string, icon: any }[] = [
    { title: 'Triagem Bot', status: 'NOVO', color: 'bg-indigo-500', icon: Bot },
    { title: 'Aguardando Resposta', status: 'AGUARDANDO', color: 'bg-rose-500', icon: AlertCircle },
    { title: 'Em Atendimento', status: 'ATENDIMENTO', color: 'bg-emerald-500', icon: Headphones },
    { title: 'Finalizados', status: 'RESOLVIDO', color: 'bg-slate-400', icon: CheckCircle },
  ];

  const totalTickets = contacts.length;
  const waitingCount = contacts.filter(c => c.status === 'AGUARDANDO').length;
  const resolvedCount = contacts.filter(c => c.status === 'RESOLVIDO').length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total de Tickets</p>
            <p className="text-xl font-bold text-slate-800">{totalTickets}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aguardando Humano</p>
            <p className="text-xl font-bold text-rose-600">{waitingCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolvidos Hoje</p>
            <p className="text-xl font-bold text-emerald-600">{resolvedCount}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6 pt-0 flex gap-6 pb-12">
        {columns.map((col) => (
          <div key={col.status} className="flex-shrink-0 w-80 flex flex-col group">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <col.icon size={16} className={col.status === 'AGUARDANDO' ? 'text-rose-500' : 'text-slate-400'} />
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">{col.title}</h3>
              </div>
              <span className="bg-white border text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                {contacts.filter(c => c.status === col.status).length}
              </span>
            </div>
            
            <div className="kanban-column space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {contacts.filter(c => c.status === col.status).length > 0 ? (
                contacts.filter(c => c.status === col.status).map(contact => (
                  <div 
                    key={contact.id} 
                    onClick={() => onSelectTicket(contact.id)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group/card"
                  >
                    <div className="flex gap-3 mb-3">
                      <img src={contact.avatar} className="w-8 h-8 rounded-full shadow-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-xs truncate group-hover/card:text-emerald-600">{contact.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{contact.phone}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 italic border-l-2 border-slate-100 pl-2 mb-3 bg-slate-50/50 p-2 rounded">
                      "{contact.lastMessage}"
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                       <div className="flex items-center gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase">{contact.assignedTo}</span>
                       </div>
                       <span className="text-[9px] text-slate-400 font-bold">{contact.lastMessageTime}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                  Vazio
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatWindow = ({ 
  contact, 
  messages, 
  onSendMessage, 
  onStatusChange,
  onIncomingSim 
}: { 
  contact: Contact, 
  messages: Message[], 
  onSendMessage: (text: string) => void,
  onStatusChange: (id: string, status: KanbanStatus) => void,
  onIncomingSim: (id: string) => void
}) => {
  const [inputText, setInputText] = useState('');
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      setShowQuickResponses(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src={contact.avatar} className="w-10 h-10 rounded-full border" />
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{contact.name}</h3>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              {contact.status === 'NOVO' ? (
                <span className="text-indigo-500 font-bold flex items-center gap-1"><Bot size={10}/> Bot em Triagem</span>
              ) : (
                <span className="text-emerald-500 font-bold flex items-center gap-1"><UserCheck size={10}/> Atribuído a {contact.assignedTo}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {contact.status === 'NOVO' && (
             <button 
                onClick={() => onStatusChange(contact.id, 'ATENDIMENTO')}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-all shadow-md"
             >
                <Headphones size={14} /> Assumir do Bot
             </button>
          )}
          {contact.status !== 'RESOLVIDO' && contact.status !== 'NOVO' && (
            <button 
              onClick={() => onStatusChange(contact.id, 'RESOLVIDO')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all border border-slate-200"
            >
              <CheckCircle2 size={14} /> Finalizar Atendimento
            </button>
          )}
          <button onClick={() => onIncomingSim(contact.id)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><Smile size={20} /></button>
          <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm text-sm relative ${
              msg.fromMe ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-200' : 'bg-white border border-slate-200 rounded-tl-none text-slate-700'
            }`}>
              {msg.senderId === 'bot' && (
                <div className="flex items-center gap-1 mb-1 text-[9px] font-black uppercase text-indigo-500/70">
                   <Bot size={10}/> Sistema / Auto-Atendimento
                </div>
              )}
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <p className="text-[9px] mt-1.5 opacity-40 text-right font-bold uppercase tracking-tighter">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white relative">
        {showQuickResponses && (
          <div className="absolute bottom-full left-4 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl mb-2 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="p-3 bg-slate-50 border-b text-[10px] font-black uppercase text-slate-500">Respostas Rápidas</div>
            <div className="max-h-60 overflow-y-auto">
              {QUICK_RESPONSES.map((r, i) => (
                <button 
                  key={i} 
                  onClick={() => { setInputText(r.text); setShowQuickResponses(false); }}
                  className="w-full text-left p-3 hover:bg-emerald-50 border-b border-slate-50 last:border-none group transition-all"
                >
                  <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">{r.label}</p>
                  <p className="text-[10px] text-slate-400 truncate italic">{r.text}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-3 max-w-6xl mx-auto">
          <button onClick={() => setShowQuickResponses(!showQuickResponses)} className={`p-2.5 rounded-lg transition-all ${showQuickResponses ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-100 border border-slate-200'}`}>
            <Zap size={20} />
          </button>
          
          <div className="flex-1 bg-slate-100 rounded-xl px-4 py-2 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={contact.status === 'NOVO' ? "Interromper bot e responder..." : "Digite uma mensagem..."}
              rows={1}
              className="w-full bg-transparent border-none focus:outline-none text-sm resize-none"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
          </div>
          
          <button onClick={handleSend} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600 transition-all active:scale-95">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  
  // App Settings State
  const [appSettings, setAppSettings] = useState({
    autoTriagem: true,
    roundRobin: false,
  });

  // Connection State
  const [connStatus, setConnStatus] = useState<'DISCONNECTED' | 'PAIRING' | 'CONNECTED'>('CONNECTED');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const updateStatus = useCallback((id: string, newStatus: KanbanStatus, lastMsg?: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { 
      ...c, 
      status: newStatus,
      assignedTo: newStatus === 'ATENDIMENTO' ? 'Admin' : (newStatus === 'NOVO' ? 'Bot AI' : 'Livre'),
      lastMessage: lastMsg || c.lastMessage,
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : c));
  }, []);

  const handleSendMessage = (text: string) => {
    if (!activeContactId) return;
    const newMsg = { id: Date.now().toString(), senderId: 'me', senderName: 'Atendente', text, timestamp: 'Agora', fromMe: true };
    setMessages(prev => ({ ...prev, [activeContactId]: [...(prev[activeContactId] || []), newMsg] }));
    updateStatus(activeContactId, 'ATENDIMENTO', text);
  };

  const simulateIncoming = (id: string, userText?: string) => {
    const texts = ["Quero o plano 1", "Como funciona a portabilidade?", "Me ajude por favor", "Falar com atendente"];
    const text = userText || texts[Math.floor(Math.random() * texts.length)];
    const contact = contacts.find(c => c.id === id);
    const newMsg = { id: Date.now().toString(), senderId: id, senderName: 'Cliente', text, timestamp: 'Agora', fromMe: false };
    setMessages(prev => ({ ...prev, [id]: [...(prev[id] || []), newMsg] }));

    if (contact?.status === 'NOVO' && appSettings.autoTriagem) {
      setTimeout(() => {
        const botResult = processBotLogic(text);
        const botMsg = { id: 'bot-' + Date.now(), senderId: 'bot', senderName: 'Bot AI', text: botResult.response, timestamp: 'Agora', fromMe: true };
        setMessages(prev => ({ ...prev, [id]: [...(prev[id] || []), botMsg] }));
        if (botResult.shouldTransfer) updateStatus(id, 'AGUARDANDO', botResult.response);
        else updateStatus(id, 'NOVO', botResult.response);
      }, 1000);
    } else {
      updateStatus(id, 'AGUARDANDO', text);
    }
  };

  const handleTicketSelect = (id: string) => {
    setActiveContactId(id);
    setActiveTab('chats');
  };

  const generateQRCode = () => {
    setConnStatus('PAIRING');
    setTimeout(() => {
      setQrCodeData("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=WPPCONNECT-TOKEN-" + Date.now());
    }, 1500);
  };

  const activeContact = contacts.find(c => c.id === activeContactId);

  // Toggle Component Helper
  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors shadow-inner duration-200 ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}
    >
      <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${active ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-40">
           <h2 className="text-lg font-bold text-slate-800 tracking-tight">
             {activeTab === 'chats' ? 'Atendimento em Tempo Real' : 
              activeTab === 'kanban' ? 'Fluxo de Atendimento (CRM)' : 
              activeTab === 'connection' ? 'Conexão WPPConnect' : 'Configurações'}
           </h2>
           <div className={`flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all ${
             connStatus === 'CONNECTED' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
           }`}>
              <div className={`w-2 h-2 rounded-full ${connStatus === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${connStatus === 'CONNECTED' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {connStatus === 'CONNECTED' ? 'Sistema Online' : 'Desconectado'}
              </span>
           </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'chats' && (
            <div className="flex h-full animate-in fade-in duration-300">
              <div className="w-80 lg:w-96 border-r border-slate-200 bg-white flex flex-col">
                <div className="p-4 bg-slate-50/50 border-b">
                   <div className="flex items-center gap-2 bg-white border p-2 rounded-lg shadow-sm">
                      <Search size={16} className="text-slate-400" />
                      <input type="text" placeholder="Pesquisar chat..." className="bg-transparent text-xs w-full focus:outline-none" />
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {contacts.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setActiveContactId(c.id)}
                      className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 flex gap-3 transition-colors ${activeContactId === c.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}
                    >
                      <div className="relative flex-shrink-0">
                        <img src={c.avatar} className="w-12 h-12 rounded-full border shadow-sm" />
                        {c.status === 'AGUARDANDO' && <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></div>}
                        {c.status === 'NOVO' && <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 border-2 border-white rounded-full"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-slate-800 text-xs truncate">{c.name}</h4>
                          <span className="text-[9px] text-slate-400 font-medium">{c.lastMessageTime}</span>
                        </div>
                        <p className={`text-[11px] truncate ${c.status === 'AGUARDANDO' ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>{c.lastMessage}</p>
                        <div className="flex gap-1 mt-2">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest ${
                             c.status === 'NOVO' ? 'bg-indigo-100 text-indigo-600' :
                             c.status === 'AGUARDANDO' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                          }`}>{c.status === 'NOVO' ? 'Bot' : c.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                {activeContact ? (
                  <ChatWindow 
                    contact={activeContact} 
                    messages={messages[activeContact.id] || []} 
                    onSendMessage={handleSendMessage}
                    onStatusChange={updateStatus}
                    onIncomingSim={simulateIncoming}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 p-10 text-center">
                    <div className="w-24 h-24 bg-white rounded-[40px] shadow-sm flex items-center justify-center mb-8 border">
                      <MessageSquare size={48} className="opacity-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Atendimento CRM</h3>
                    <p className="text-slate-400 mt-4 max-w-xs text-sm leading-relaxed">Clique em um ticket na lista ao lado para iniciar o atendimento humanizado.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'kanban' && (
            <div className="h-full bg-slate-50/50 animate-in fade-in duration-300">
              <KanbanBoard contacts={contacts} onSelectTicket={handleTicketSelect} />
            </div>
          )}

          {activeTab === 'connection' && (
            <div className="p-10 flex flex-col items-center justify-center h-full bg-slate-50/50 animate-in fade-in duration-300">
               {connStatus === 'CONNECTED' ? (
                 <div className="bg-white p-12 rounded-[40px] shadow-2xl border text-center max-w-lg w-full">
                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                       <QrCode size={40} className="text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-slate-800 tracking-tight">Pareamento Ativo</h3>
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">O WPPConnect está sincronizado e enviando dados para o banco de dados do CRM em tempo real.</p>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-left mb-8 space-y-3">
                       <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Worker ID</span>
                         <span className="text-[10px] font-black text-emerald-500 uppercase">WPP-1-NATIVO</span>
                       </div>
                       <p className="text-xs text-slate-600 font-bold flex justify-between"><span>Status:</span> <span className="text-emerald-600">Sincronizado</span></p>
                    </div>
                    <button onClick={() => setConnStatus('DISCONNECTED')} className="text-xs font-black text-rose-500 uppercase tracking-widest hover:underline transition-all">Encerrar Sessão</button>
                 </div>
               ) : (
                 <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 text-center max-w-xl w-full">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Conectar Instância</h3>
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">Gerencie seus canais de atendimento vinculando um novo número.</p>
                    <div className="relative mx-auto w-[280px] h-[280px] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden mb-8">
                      {qrCodeData ? (
                        <img src={qrCodeData} alt="QR Code" className="w-full h-full object-contain p-4 animate-in zoom-in-95" />
                      ) : (
                        <button onClick={generateQRCode} className="px-8 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-500/20">Gerar QR Code</button>
                      )}
                    </div>
                    {qrCodeData && (
                      <button onClick={() => setConnStatus('CONNECTED')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Clique aqui após escanear</button>
                    )}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-10 max-w-2xl mx-auto animate-in fade-in duration-300">
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-700 uppercase tracking-widest text-xs"><Settings size={18}/> Regras de Negócio e Bot</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                           <p className="text-sm font-bold text-slate-700">Fluxo de Triagem Automática</p>
                           <p className="text-[10px] text-slate-400 mt-1">O bot atende novas conversas antes de ir para a fila humana.</p>
                        </div>
                        <Toggle 
                          active={appSettings.autoTriagem} 
                          onClick={() => setAppSettings(prev => ({ ...prev, autoTriagem: !prev.autoTriagem }))} 
                        />
                     </div>
                     <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                           <p className="text-sm font-bold text-slate-700">Distribuição Round-Robin</p>
                           <p className="text-[10px] text-slate-400 mt-1">Distribui tickets igualmente entre atendentes disponíveis.</p>
                        </div>
                        <Toggle 
                          active={appSettings.roundRobin} 
                          onClick={() => setAppSettings(prev => ({ ...prev, roundRobin: !prev.roundRobin }))} 
                        />
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
