
/**
 * Local RAG & Bot Logic Service - Edição Telecom CRM
 */

interface Document {
  keywords: string[];
  content: string;
}

export const BOT_MENU = `👋 Olá! Bem-vindo ao nosso atendimento centralizado.
Como posso te ajudar hoje? Digite o número da opção:

1️⃣ Planos TIM (Controle e Black)
2️⃣ Planos CLARO (Flex e Fibra)
3️⃣ Planos VIVO (Controle e Fibra)
4️⃣ Portabilidade (Ganhe bônus)
5️⃣ Falar com um Atendente Humano`;

export const KNOWLEDGE_BASE: Document[] = [
  {
    keywords: ['1', 'tim'],
    content: '💎 TIM: Temos o Plano Controle 25GB por R$ 49,99/mês. Deseja falar com um consultor para contratar?'
  },
  {
    keywords: ['2', 'claro'],
    content: '🔴 CLARO: Planos Flex a partir de R$ 39,99. Fibra 500 Mega por R$ 99,90. Deseja falar com um consultor?'
  },
  {
    keywords: ['3', 'vivo'],
    content: '🍇 VIVO: Vivo Controle 20GB por R$ 52,00. Fibra 500 Mega por R$ 120,00. Deseja falar com um consultor?'
  },
  {
    keywords: ['4', 'portabilidade'],
    content: '🔄 PORTABILIDADE: Traga seu número e ganhe até 10GB de bônus por 12 meses. Qual operadora você tem interesse?'
  },
  {
    keywords: ['5', 'atendente', 'humano', 'pessoa', 'ajuda'],
    content: 'Entendido! Estou transferindo você para um de nossos atendentes. Por favor, aguarde um instante... ⏳'
  }
];

export const QUICK_RESPONSES = [
  { label: "Boas-vindas Humano", text: "Olá! Recebi sua solicitação do bot. Sou o atendente humano, como posso finalizar sua contratação?" },
  { label: "Pedir Documentos", text: "Para prosseguir, preciso de uma foto do seu RG (frente e verso) e seu CPF, por favor." },
  { label: "Confirmar Endereço", text: "Pode me informar seu CEP e o número da residência para verificarmos a viabilidade da fibra?" },
  { label: "Venda Concluída", text: "Parabéns! Seu plano foi ativado com sucesso. Você receberá o contrato por e-mail em instantes." },
  { label: "Finalizar Ticket", text: "Fico feliz em ajudar! Posso auxiliar em algo mais antes de encerrarmos este atendimento?" }
];

export const processBotLogic = (message: string): { response: string, shouldTransfer: boolean } => {
  const input = message.trim().toLowerCase();
  
  // Se for a opção de falar com atendente
  if (input === '5' || input.includes('atendente') || input.includes('humano')) {
    const doc = KNOWLEDGE_BASE.find(d => d.keywords.includes('5'));
    return { response: doc!.content, shouldTransfer: true };
  }

  // Busca nas opções numéricas ou palavras-chave
  const match = KNOWLEDGE_BASE.find(doc => 
    doc.keywords.some(k => input.includes(k))
  );

  if (match) {
    return { response: match.content, shouldTransfer: false };
  }

  return { 
    response: "Desculpe, não entendi. Escolha uma opção de 1 a 5 ou digite 'atendente'.", 
    shouldTransfer: false 
  };
};

export const getRagResponse = (query: string): string => {
  const normalizedQuery = query.toLowerCase();
  let bestMatch: Document | null = null;
  let maxHits = 0;

  for (const doc of KNOWLEDGE_BASE) {
    let hits = 0;
    for (const keyword of doc.keywords) {
      if (normalizedQuery.includes(keyword)) hits++;
    }
    if (hits > maxHits) {
      maxHits = hits;
      bestMatch = doc;
    }
  }

  if (bestMatch && maxHits > 0) return bestMatch.content;
  return "Consulte nossas ofertas especiais de portabilidade para TIM, Claro e Vivo. Qual operadora você usa atualmente?";
};

export const detectUrgency = (message: string): 'LOW' | 'MEDIUM' | 'HIGH' => {
  const urgentWords = ['urgente', 'agora', 'reclamacao', 'erro', 'ruim', 'parou'];
  const normalized = message.toLowerCase();
  const count = urgentWords.filter(word => normalized.includes(word)).length;
  if (count >= 2) return 'HIGH';
  if (count === 1) return 'MEDIUM';
  return 'LOW';
};
