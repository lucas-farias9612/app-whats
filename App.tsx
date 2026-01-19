
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  MessageSquare, Settings, LogOut, Kanban as KanbanIcon,
  Search, QrCode, Send, MoreVertical, Smile, Headphones,
  Bot, CheckCircle2, TrendingUp, AlertCircle, CheckCircle,
  Zap, UserCheck, MessageCircle, Smartphone
} from 'lucide-react';
import { Contact, KanbanStatus, Message } from './types';
import { processBotLogic, QUICK_RESPONSES, BOT_MENU } from './services/ragService';

// Mock de dados
const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'João Silva', phone: '5511912345678', avatar: 'https://i.pravatar.cc/150?u=1', status: 'NOVO', lastMessage: 'Quero saber sobre os planos.', lastMessageTime: '10:30', assignedTo: 'Bot AI' },
  { id: '2', name: 'Maria Oliveira', phone: '5511988888888', avatar: 'https://i.pravatar.cc/150?u=2', status: 'AGUARDANDO', lastMessage: 'Preciso de ajuda humana.', lastMessageTime: '09:15', assignedTo: 'Livre' },
  { id: '3', name: 'Empresa XPTO', phone: '5511977777777', avatar: 'https://i.pravatar.cc/150?u=3', status: 'ATENDIMENTO', lastMessage: 'Contrato enviado.', lastMessageTime: 'Ontem', assignedTo: 'Admin' },
  { id: '4', name: 'Carlos Tech', phone: '5511955554444', avatar: 'https://i.pravatar.cc/150?u=4', status: 'RESOLVIDO', lastMessage: 'Obrigado!', lastMessageTime: '11:20', assignedTo: 'Admin' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('chats');
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, any>>({ '1': [{ id: '1', text: BOT_MENU, fromMe: true, timestamp: '10:30' }] });
  const [settings, setSettings] = useState({ autoTriagem: true, roundRobin: false });
  const [qrCode, setQrCode] = useState<string | null>(null);

  const sendMessage = (text: string) => {
    if (!activeId || !text.trim()) return;
    const msg = { id: Date.now().toString(), text, fromMe: true, timestamp: 'Agora' };
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), msg] }));
    setContacts(prev => prev.map(c => c.id === activeId ? { ...c, status: 'ATENDIMENTO' as KanbanStatus } : c));
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
      
      {/* NAVEGAÇÃO LATERAL - HTML ESTRUTURADO */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-50">
        <header className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-emerald-500 p-2 rounded-lg"><MessageCircle size={24} /></div>
          <h1 className="text-xl font-black hidden lg:block tracking-tighter italic">WPP CRM</h1>
        </header>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'chats', icon: MessageSquare, label: 'Mensagens' },
            { id: 'kanban', icon: KanbanIcon, label: 'Dashboard' },
            { id: 'connection', icon: QrCode, label: 'Conexão' },
            { id: 'settings', icon: Settings, label: 'Ajustes' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <item.icon size={20} /> <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <footer className="p-6 border-t border-slate-800">
          <button className="flex items-center gap-4 text-slate-500 hover:text-rose-400 w-full transition-colors text-sm font-bold">
            <LogOut size={20} /> <span className="hidden lg:block">Sair do Sistema</span>
          </button>
        </footer>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER SUPERIOR */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-40">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Painel Principal / <span className="text-slate-800">{activeTab}</span>
          </h2>
          <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-700 uppercase">WhatsApp Ativo</span>
          </div>
        </header>

        {/* CONTEÚDO DINÂMICO */}
        <section className="flex-1 overflow-hidden">
          
          {/* VISÃO DE CHAT */}
          {activeTab === 'chats' && (
            <div className="flex h-full">
              <nav className="w-80 lg:w-96 bg-white border-r flex flex-col">
                <div className="p-4 bg-slate-50 border-b">
                  <div className="bg-white border rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
                    <Search size={14} className="text-slate-400" />
                    <input type="text" placeholder="Pesquisar..." className="bg-transparent text-xs outline-none w-full" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {contacts.map(c => (
                    <article 
                      key={c.id} 
                      onClick={() => setActiveId(c.id)}
                      className={`p-4 border-b border-slate-50 cursor-pointer flex gap-3 ${activeId === c.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}
                    >
                      <img src={c.avatar} className="w-12 h-12 rounded-full border" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-xs truncate text-slate-800">{c.name}</h4>
                          <span className="text-[9px] text-slate-400 font-bold">{c.lastMessageTime}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                        <span className="inline-block mt-2 px-1.5 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 rounded uppercase">{c.status}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </nav>
              
              <section className="flex-1 flex flex-col bg-white">
                {activeId ? (
                  <ChatWindow 
                    contact={contacts.find(c => c.id === activeId)!} 
                    messages={messages[activeId] || []} 
                    onSend={sendMessage} 
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-200">
                    <MessageCircle size={100} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="text-sm font-black uppercase tracking-tighter opacity-40 text-slate-400">Selecione um atendimento para começar</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* VISÃO DASHBOARD */}
          {activeTab === 'kanban' && (
            <div className="h-full p-8 overflow-y-auto bg-slate-50">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={24}/></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase">Total Tickets</p><p className="text-2xl font-black">{contacts.length}</p></div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle size={24}/></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase">Aguardando</p><p className="text-2xl font-black text-rose-600">{contacts.filter(c => c.status === 'AGUARDANDO').length}</p></div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={24}/></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase">Resolvidos</p><p className="text-2xl font-black text-emerald-600">{contacts.filter(c => c.status === 'RESOLVIDO').length}</p></div>
                  </div>
               </div>

               <div className="flex gap-6 overflow-x-auto pb-10">
                  {['NOVO', 'AGUARDANDO', 'ATENDIMENTO', 'RESOLVIDO'].map(status => (
                    <div key={status} className="w-80 flex-shrink-0">
                      <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 flex justify-between px-2">
                        {status} <span>{contacts.filter(c => c.status === status).length}</span>
                      </h3>
                      <div className="space-y-3">
                        {contacts.filter(c => c.status === status).map(c => (
                          <div key={c.id} onClick={() => { setActiveId(c.id); setActiveTab('chats'); }} className="bg-white p-4 rounded-xl border shadow-sm hover:border-emerald-500 transition-all cursor-pointer">
                            <div className="flex items-center gap-3 mb-3">
                              <img src={c.avatar} className="w-8 h-8 rounded-full" />
                              <h4 className="font-bold text-xs text-slate-800">{c.name}</h4>
                            </div>
                            <p className="text-[10px] text-slate-500 italic">"{c.lastMessage}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* VISÃO AJUSTES */}
          {activeTab === 'settings' && (
            <div className="p-12 max-w-2xl mx-auto">
               <div className="bg-white p-10 rounded-3xl border shadow-sm">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-8 border-b pb-4">Configurações do Robô</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div><h4 className="text-sm font-bold text-slate-700">Triagem Automática</h4><p className="text-[10px] text-slate-400">Novos leads falam primeiro com a IA.</p></div>
                      <button onClick={() => setSettings(s => ({ ...s, autoTriagem: !s.autoTriagem }))} className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${settings.autoTriagem ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.autoTriagem ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div><h4 className="text-sm font-bold text-slate-700">Fila Round-Robin</h4><p className="text-[10px] text-slate-400">Distribui clientes entre atendentes ativos.</p></div>
                      <button onClick={() => setSettings(s => ({ ...s, roundRobin: !s.roundRobin }))} className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${settings.roundRobin ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.roundRobin ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* VISÃO CONEXÃO */}
          {activeTab === 'connection' && (
            <div className="h-full flex items-center justify-center bg-slate-50">
               <div className="bg-white p-12 rounded-[50px] border shadow-2xl text-center max-w-md w-full">
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Conectar Zap</h3>
                  <p className="text-sm text-slate-400 mb-8">Escaneie o QR Code para ativar o CRM.</p>
                  <div className="w-64 h-64 bg-slate-50 border-2 border-dashed rounded-[40px] mx-auto mb-8 flex items-center justify-center overflow-hidden">
                    {qrCode ? <img src={qrCode} className="w-full h-full object-contain p-4" /> : <button onClick={() => setQrCode("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=WPPCONNECT")} className="px-8 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">Gerar Código</button>}
                  </div>
                  {qrCode && <p className="text-[10px] font-black text-emerald-600 uppercase">Aguardando leitura do sensor...</p>}
               </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}

// Subcomponente de Chat (Estrutura Simples)
function ChatWindow({ contact, messages, onSend }: { contact: any, messages: any[], onSend: (t: string) => void }) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b px-6 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <img src={contact.avatar} className="w-10 h-10 rounded-full border shadow-sm" />
          <div>
            <h4 className="font-bold text-sm text-slate-800">{contact.name}</h4>
            <p className="text-[10px] text-emerald-500 font-bold">{contact.phone}</p>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl"><MoreVertical size={20}/></button>
      </header>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-4 rounded-2xl text-sm shadow-sm ${m.fromMe ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-200' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              <span className="block text-[8px] mt-2 text-right opacity-40 font-bold uppercase tracking-tighter">{m.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      <footer className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-emerald-500 transition-all shadow-sm">
          <button className="text-slate-400 hover:text-emerald-500"><Smile size={20}/></button>
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (onSend(input), setInput(''))}
            placeholder="Digite sua mensagem aqui..." 
            className="flex-1 bg-transparent py-2 text-sm outline-none text-slate-800" 
          />
          <button onClick={() => { onSend(input); setInput(''); }} className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"><Send size={18}/></button>
        </div>
      </footer>
    </div>
  );
}
