import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Category, FinancialInsight } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize without the key initially, check before use
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const analyzeFinancials = async (transactions: Transaction[]): Promise<FinancialInsight> => {
  if (!ai || transactions.length === 0) {
    return {
      summary: "Adicione transações e configure sua API Key para receber insights.",
      savingsTip: "Tente reduzir gastos supérfluos.",
      unusualSpending: null,
      projectedSavings: "Dados insuficientes."
    };
  }

  // Summarize data for the prompt to save tokens
  const simplifiedData = transactions.slice(0, 50).map(t => ({
    d: t.date.split('T')[0],
    a: t.amount,
    t: t.type,
    c: t.category,
    desc: t.description
  }));

  const prompt = `Analise estes dados financeiros (JSON simplificado). Forneça um resumo curto, uma dica de economia prática, identifique gastos incomuns (se houver) e uma projeção simples. Responda em Português.
  Dados: ${JSON.stringify(simplifiedData)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            savingsTip: { type: Type.STRING },
            unusualSpending: { type: Type.STRING, nullable: true },
            projectedSavings: { type: Type.STRING },
          },
          required: ["summary", "savingsTip", "projectedSavings"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FinancialInsight;
    }
    throw new Error("Resposta vazia do modelo");
  } catch (error) {
    console.error("Erro ao analisar finanças:", error);
    return {
      summary: "Não foi possível gerar análise no momento.",
      savingsTip: "Verifique sua conexão ou chave de API.",
      unusualSpending: null,
      projectedSavings: "--"
    };
  }
};

export const suggestCategory = async (description: string): Promise<Category | null> => {
  if (!ai || !description) return null;

  try {
    const categoriesList = Object.values(Category).join(', ');
    const prompt = `Classifique a descrição de transação: "${description}" em uma destas categorias: [${categoriesList}]. Retorne apenas o nome da categoria exata.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text && Object.values(Category).includes(text as Category)) {
      return text as Category;
    }
    return null;
  } catch (e) {
    console.error("Erro ao sugerir categoria:", e);
    return null;
  }
};