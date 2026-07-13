"use client";

import { useState } from "react";
import { Upload, Plus, X, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function VenderPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", description: "", price: "", condition: "lacrado", media: "fisica",
    city: "", state: "", shipping: false, pickup: true, acceptsTrade: false,
    paymentPix: true, paymentDinheiro: false, paymentCartao: false,
    wantedGames: "",
  });

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Anunciar Jogo</h1>
        <p className="text-gray-400">Venda ou troque seu jogo de forma rápida e segura.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { n: 1, label: "Jogo" },
          { n: 2, label: "Detalhes" },
          { n: 3, label: "Contato" },
          { n: 4, label: "Revisão" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= s.n ? "bg-purple-600 text-white" : "bg-white/10 text-gray-500"
            }`}>
              {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
            </div>
            <span className={`text-sm hidden sm:block ${step >= s.n ? "text-white" : "text-gray-500"}`}>{s.label}</span>
            {i < 3 && <div className={`flex-1 h-0.5 w-8 ${step > s.n ? "bg-purple-600" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white">Informações do Jogo</h2>

            <div>
              <label className={labelClass}>Título do Anúncio *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ex: God of War Ragnarök - Lacrado"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Fotos do Jogo *</label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Arraste fotos ou clique para selecionar</p>
                <p className="text-xs text-gray-500 mt-1">Até 8 fotos · JPG, PNG · Máx. 5MB cada</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Estado do Jogo *</label>
                <select
                  value={form.condition}
                  onChange={(e) => update("condition", e.target.value)}
                  className={inputClass}
                >
                  <option value="lacrado">Lacrado</option>
                  <option value="como novo">Como Novo</option>
                  <option value="bom estado">Bom Estado</option>
                  <option value="regular">Regular</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Mídia *</label>
                <select
                  value={form.media}
                  onChange={(e) => update("media", e.target.value)}
                  className={inputClass}
                >
                  <option value="fisica">Física</option>
                  <option value="digital">Digital</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Descrição *</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Descreva o estado do jogo, se tem arranhões, se a caixa está perfeita, etc."
                className={`${inputClass} h-28 resize-none`}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.title || !form.description}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              Próximo →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white">Preço e Negociação</h2>

            <div>
              <label className={labelClass}>Preço (R$) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="0,00"
                min="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Formas de Pagamento</label>
              <div className="space-y-2">
                {[
                  { key: "paymentPix", label: "PIX" },
                  { key: "paymentDinheiro", label: "Dinheiro" },
                  { key: "paymentCartao", label: "Cartão (combinado)" },
                ].map((p) => (
                  <label key={p.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(form as Record<string, unknown>)[p.key] as boolean}
                      onChange={(e) => update(p.key, e.target.checked)}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm text-gray-300">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-purple-900/10 border border-purple-700/20 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={form.acceptsTrade}
                  onChange={(e) => update("acceptsTrade", e.target.checked)}
                  className="w-4 h-4 accent-purple-500"
                />
                <span className="text-sm font-semibold text-purple-300">Aceitar Troca</span>
              </label>
              {form.acceptsTrade && (
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Jogos que você quer em troca:</label>
                  <input
                    type="text"
                    value={form.wantedGames}
                    onChange={(e) => update("wantedGames", e.target.value)}
                    placeholder="Ex: Spider-Man 2, Baldur's Gate 3"
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all">
                ← Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.price}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl disabled:opacity-40 hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                Próximo →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white">Localização e Entrega</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Cidade *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="São Paulo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Estado *</label>
                <select
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecione</option>
                  {["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "CE", "PE", "AM", "PA"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Modalidades de Entrega</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.pickup}
                    onChange={(e) => update("pickup", e.target.checked)}
                    className="w-4 h-4 accent-purple-500"
                  />
                  <span className="text-sm text-gray-300">Retirada em mãos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.shipping}
                    onChange={(e) => update("shipping", e.target.checked)}
                    className="w-4 h-4 accent-purple-500"
                  />
                  <span className="text-sm text-gray-300">Envio pelos Correios (a combinar)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all">
                ← Voltar
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!form.city || !form.state}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl disabled:opacity-40 hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                Revisar Anúncio →
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white">Revisar e Publicar</h2>

            <div className="bg-white/5 rounded-xl p-5 space-y-3 text-sm">
              {[
                { label: "Título", value: form.title || "—" },
                { label: "Preço", value: form.price ? `R$ ${parseFloat(form.price).toFixed(2)}` : "—" },
                { label: "Condição", value: form.condition },
                { label: "Mídia", value: form.media },
                { label: "Localização", value: form.city && form.state ? `${form.city} / ${form.state}` : "—" },
                { label: "Aceita Troca", value: form.acceptsTrade ? "Sim" : "Não" },
                { label: "Envio", value: form.shipping ? "Sim" : "Não" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-900/10 border border-blue-700/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#0072ce] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-300 mb-1">Anúncio Gratuito</p>
                  <p className="text-xs text-gray-400">O Upa que Passa não cobra comissão sobre suas vendas. A negociação é direta entre comprador e vendedor.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all">
                ← Voltar
              </button>
              <button
                onClick={() => alert("Anúncio publicado! Em um sistema real, seria enviado para moderação.")}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-500 hover:to-green-600 transition-all"
              >
                ✅ Publicar Anúncio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
