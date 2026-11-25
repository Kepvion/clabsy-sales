import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Star, Phone, Mail, TrendingUp } from 'lucide-react';
import { formatLakhs } from '../../utils/formatters';

export function AgentLeaderboard() {
  const { agents } = useApp();

  return (
    <div className="enterprise-card p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Sales Consultant Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-500">Q3 Deal conversion velocity and gross revenue attribution.</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {agents.map((agent, index) => {
          let rankBadge = null;
          if (index === 0) {
            rankBadge = (
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center border border-amber-300">
                1
              </span>
            );
          } else if (index === 1) {
            rankBadge = (
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                2
              </span>
            );
          } else if (index === 2) {
            rankBadge = (
              <span className="w-5 h-5 rounded-full bg-amber-700/10 text-amber-800 font-bold text-[10px] flex items-center justify-center">
                3
              </span>
            );
          } else {
            rankBadge = (
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px] flex items-center justify-center">
                {index + 1}
              </span>
            );
          }

          return (
            <div key={agent.id} className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition">
              {/* Agent info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="absolute -top-1 -left-1">{rankBadge}</div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900 truncate">
                      {agent.name}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-sm border border-amber-100">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                      {agent.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-500 truncate">{agent.role}</p>
                    {index === 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-xs bg-amber-50 text-amber-700 border border-amber-200">
                        Top Closer 🏆
                      </span>
                    )}
                    {index === 1 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-xs bg-blue-50 text-blue-700 border border-blue-200">
                        Elite Win Rate 🎯
                      </span>
                    )}
                    {index === 2 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-xs bg-purple-50 text-purple-700 border border-purple-200">
                        Luxury Specialist 💎
                      </span>
                    )}
                    {index === 3 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Fast Converter ⚡
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-4 text-right shrink-0">
                <div className="hidden sm:block">
                  <span className="text-[11px] text-slate-400 block">Closed</span>
                  <span className="text-xs font-semibold text-slate-700">{agent.dealsClosed} Plots</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Deals Value</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {formatLakhs(agent.totalRevenueLakhs)}
                  </span>
                </div>

                <div className="w-16 text-right">
                  <span className="text-[11px] text-slate-400 block">Win Rate</span>
                  <span className="text-xs font-semibold text-emerald-600">
                    {agent.conversionRate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
