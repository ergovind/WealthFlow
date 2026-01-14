
import { GoogleGenAI, Type } from "@google/genai";
import { FinanceData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (data: FinanceData) => {
  try {
    const totalBalance = data.transactions.reduce((acc, t) => 
      t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
    
    const portfolioValue = data.portfolio.reduce((acc, asset) => 
      acc + (asset.quantity * asset.currentPrice), 0);

    const prompt = `
      As a world-class financial advisor, analyze this user's data and provide actionable advice.
      
      User Overview:
      - Total Cash Balance: $${totalBalance.toFixed(2)}
      - Portfolio Value: $${portfolioValue.toFixed(2)}
      - Active Savings Goals: ${data.savingsGoals.length}
      - Assets: ${data.portfolio.map(a => `${a.name} (${a.symbol})`).join(', ')}
      - Monthly Recurring Income Target: $${data.monthlyIncome}

      Recent Transactions:
      ${data.transactions.slice(-5).map(t => `- ${t.date}: ${t.description} ($${t.amount} ${t.type})`).join('\n')}

      Please provide a response with:
      1. A summary of their financial health.
      2. Specific tips to optimize their portfolio.
      3. Strategy to reach their savings goals faster.
      4. One warning or risk they should be aware of.

      Keep the tone professional, encouraging, and concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble analyzing your finances right now. Please try again later.";
  }
};
