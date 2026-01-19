
import React, { useState } from 'react';
import { MessageSquare, Kanban as KB, QrCode, Settings, LogOut, Search, Send, MessageCircle } from 'lucide-react';
import { Contact } from './types.ts';

const DB: Contact[] = [
  { id: '1', name: 'João Silva', phone: '5511912345678', avatar: 'https://i.pravatar.cc/150?u=1', status: 'NOVO', lastMessage: 'Preços?', lastMessageTime: '10:30' },
  { id: '2', name: 'Maria Oliveira', phone: '5511988888888', avatar: 'https://i.pravatar.cc/150?u=2', status: 'AGUARDANDO', lastMessage: 'Aguardo.', lastMessageTime: 'Ontem' },
  { id: '3', name: 'Carlos Tech', phone: '5511955554444', avatar: 'https://i.pravatar.cc/150?u=4', status: 'RESOLVIDO', lastMessage: 'Vlw!', lastMessageTime: '11:20' },
];

export default function App() {
  const [t, setT] = useState('c'), [act, setAct] = useState<string|null>(null), [qr, setQr] = useState<string|null>(null);

  const c = DB.find(i => i.id === act);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 text-[11px]">
      <aside className="w-64 bg-slate-950 text-white flex flex-col p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-emerald-500 p-2 rounded-xl"><MessageCircle size={18}/></div>
          <b className="text-base italic tracking-tighter uppercase">WPP CRM</b>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            {id:'c', i:MessageSquare, l:'Chats'},
            {id:'k', i:KB, l:'Kanban'},
            {id:'q', i:QrCode, l:'WhatsApp'},
            {id:'s', i:Settings, l:'Ajustes'}
          ].map(v => (
            <button 
              key={v.id} 
              onClick={() => setT(v.id)} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${t === v.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              <v.i size={16}/>{v.l}
            </button>
          ))}
        </nav>
        <button className="flex items-center gap-4 text-slate-500 font-bold p-4 hover:text-rose-400 transition-colors">
          <LogOut size={16}/>Sair do Sistema
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shadow-sm z-10">
          <h2 className="font-black uppercase tracking-[.3em] text-slate-400 text-[10px]">Dashboard / {t === 'c' ? 'Atendimento' : t === 'k' ? 'Pipeline' : t === 'q' ? 'Conexão' : 'Configurações'}</h2>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 text-[9px] font-black text-emerald-600 animate-pulse">
              CONEXÃO ATIVA
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-slate-400">A</div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {t === 'c' && (
            <div className="flex h-full animate-in fade-in duration-500">
              <div className="w-80 bg-white border-r flex flex-col">
                <div className="p-4 border-b bg-slate-50/50">
                  <div className="bg-white border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
                    <Search size={14} className="text-slate-400"/>
                    <input placeholder="Buscar contatos..." className="bg-transparent outline-none w-full text-xs" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {DB.map(v => (
                    <div 
                      key={v.id} 
                      onClick={() => setAct(v.id)} 
                      className={`p-4 border-b flex gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${act === v.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}
                    >
                      <img src={v.avatar} className="w-10 h-10 rounded-2xl shadow-sm border-2 border-white"/>
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <div className="flex justify-between font-bold">
                          <span className="truncate">{v.name}</span>
                          <span className="text-[9px] text-slate-300 font-medium">{v.lastMessageTime}</span>
                        </div>
                        <p className="truncate text-slate-400 text-[10px]">{v.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-slate-50 flex flex-col relative">
                {act ? <ChatView contact={c!} /> : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                    <div className="bg-white p-6 rounded-full shadow-inner border">
                       <MessageCircle size={60} className="opacity-20"/>
                    </div>
                    <p className="font-black uppercase tracking-widest text-[9px]">Selecione um chat para iniciar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {t === 'k' && (
            <div className="h-full p-8 flex gap-6 overflow-x-auto custom-scrollbar animate-in slide-in-from-right duration-500">
              {['NOVO', 'ATENDIMENTO', 'AGUARDANDO', 'RESOLVIDO'].map(s => (
                <div key={s} className="w-72 flex-shrink-0 flex flex-col">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s}</h3>
                    <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded text-[9px] font-bold">
                      {DB.filter(v => v.status === s).length}
                    </span>
                  </div>
                  <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {DB.filter(v => v.status === s).map(v => (
                      <div key={v.id} className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-move">
                        <div className="flex items-center gap-3 mb-3">
                          <img src={v.avatar} className="w-8 h-8 rounded-xl shadow-sm"/>
                          <div>
                            <h4 className="font-bold text-slate-700">{v.name}</h4>
                            <p className="text-[9px] text-slate-400">{v.phone}</p>
                          </div>
                        </div>
                        <p className="text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-dashed text-[10px]">
                          "{v.lastMessage}"
                        </p>
                        <div className="mt-4 flex gap-2">
                           <div className="h-1 flex-1 bg-emerald-400 rounded-full"></div>
                           <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {t === 'q' && (
            <div className="h-full flex items-center justify-center animate-in zoom-in duration-500">
              <div className="bg-white p-12 rounded-[60px] shadow-2xl text-center border-4 border-slate-50 w-96 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <h3 className="text-xl font-black mb-2">Pareamento WhatsApp</h3>
                <p className="text-slate-400 text-[10px] mb-8 uppercase font-bold tracking-tighter">Escaneie o QR Code abaixo</p>
                
                <div className="aspect-square bg-slate-50 border-4 border-dashed border-slate-200 rounded-[40px] mb-8 flex items-center justify-center overflow-hidden group">
                  {qr ? (
                    <img src={qr} className="p-8 w-full h-full mix-blend-multiply transition-transform group-hover:scale-110"/>
                  ) : (
                    <button 
                      onClick={() => setQr("https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=WPPCONNECT_SECURE_TOKEN")} 
                      className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-95"
                    >
                      GERAR QR CODE
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 text-emerald-500 font-black text-[9px]">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                   WA_SERVICE_LAYER_V6.0
                </div>
              </div>
            </div>
          )}

          {t === 's' && (
            <div className="p-12 max-w-2xl mx-auto bg-white m-10 rounded-[50px] border shadow-sm animate-in fade-in duration-700">
              <h3 className="font-black text-slate-800 text-base mb-8 pb-4 border-b flex items-center gap-3">
                <Settings size={20} className="text-emerald-500"/> CONFIGURAÇÕES DO SISTEMA
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[30px] border border-slate-100">
                  <div>
                    <h4 className="font-black text-slate-700 text-xs">Inteligência Artificial (Gemini)</h4>
                    <p className="text-slate-400 text-[10px]">Auto-triagem e sugestões de respostas ativas.</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1 shadow-inner cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6 transition-transform"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[30px] border border-slate-100 opacity-50">
                  <div>
                    <h4 className="font-black text-slate-700 text-xs">Relatórios por E-mail</h4>
                    <p className="text-slate-400 text-[10px]">Enviar resumo diário de leads resolvidos.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-300 rounded-full flex items-center px-1 shadow-inner">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ChatView({ contact }: { contact: Contact }) {
  return (
    <div className="flex flex-col h-full bg-white shadow-2xl z-20">
      <header className="h-16 border-b px-8 flex items-center gap-5 bg-white shrink-0">
        <img src={contact.avatar} className="w-10 h-10 rounded-2xl shadow-sm border-2 border-slate-50"/>
        <div className="font-bold flex-1">
          <h4 className="text-slate-800 text-sm">{contact.name}</h4>
          <p className="text-[9px] text-emerald-500 uppercase tracking-widest font-black">{contact.phone}</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-slate-100 p-2 rounded-xl text-slate-400"><KB size={16}/></div>
           <div className="bg-slate-100 p-2 rounded-xl text-slate-400"><Search size={16}/></div>
        </div>
      </header>

      <div className="flex-1 p-10 overflow-y-auto bg-slate-50/50 custom-scrollbar space-y-6">
        <div className="flex justify-start">
          <div className="max-w-[75%] bg-white p-6 rounded-[32px] rounded-tl-none border border-slate-100 shadow-sm relative">
            <p className="text-slate-700 leading-relaxed text-[12px]">{contact.lastMessage}</p>
            <span className="text-[8px] text-slate-300 absolute -bottom-4 left-1 font-bold">10:30 AM</span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[75%] bg-emerald-500 p-6 rounded-[32px] rounded-tr-none text-white shadow-xl shadow-emerald-500/20 relative">
            <p className="leading-relaxed text-[12px] font-medium">Olá! Como posso te ajudar hoje?</p>
            <span className="text-[8px] text-emerald-200 absolute -bottom-4 right-1 font-bold">10:32 AM</span>
          </div>
        </div>
      </div>

      <footer className="p-8 border-t bg-white shrink-0">
        <div className="bg-slate-50 rounded-[30px] p-2 pr-2 flex gap-4 border border-slate-100 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all shadow-inner">
          <input 
            placeholder="Digite sua mensagem para o cliente..." 
            className="flex-1 bg-transparent px-6 py-3 outline-none text-xs font-medium text-slate-600 placeholder:text-slate-300"
          />
          <button className="bg-emerald-500 text-white px-8 rounded-[24px] shadow-lg shadow-emerald-500/40 hover:bg-emerald-600 transition-all flex items-center justify-center">
            <Send size={16}/>
          </button>
        </div>
      </footer>
    </div>
  );
}
