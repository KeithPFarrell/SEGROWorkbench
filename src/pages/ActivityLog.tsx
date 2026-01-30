import React, { useState } from 'react';
import { Card } from '../components/Card';
import { MarketBadge } from '../components/MarketBadge';
import { useStore } from '../store/useStore';
import { formatRelativeTime, formatDateTime } from '../utils/dateFormat';
import { Market } from '../types';

export const ActivityLog: React.FC = () => {
  const { activityLog } = useStore();
  const [filterMarket, setFilterMarket] = useState<Market | 'all'>('all');
  const [filterActor, setFilterActor] = useState<string>('all');

  const markets: Market[] = ['UK', 'CZ', 'DE', 'ES', 'FR', 'IT', 'NL', 'PL'];

  // Get unique actors (Agent and all unique usernames)
  const actors = ['all', 'Agent', ...Array.from(new Set(
    activityLog
      .filter(log => log.actor === 'Human' && log.username)
      .map(log => log.username!)
  ))];

  const filteredLogs = activityLog.filter((log) => {
    const matchesMarket = filterMarket === 'all' || log.market === filterMarket;
    const matchesActor =
      filterActor === 'all' ||
      (filterActor === 'Agent' && log.actor === 'Agent') ||
      (log.actor === 'Human' && log.username === filterActor);
    return matchesMarket && matchesActor;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-segro-charcoal mb-2">Activity Log</h1>
        <p className="text-segro-midgray">
          Chronological audit trail of all agent-generated and human-in-the-loop actions
        </p>
      </div>

      {/* Filters */}
      <Card accent="none">
        <div className="flex flex-wrap items-center gap-4">
          {/* Market Filter */}
          <div>
            <label className="block text-xs font-semibold text-segro-midgray mb-2">FILTER BY MARKET</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterMarket('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filterMarket === 'all'
                    ? 'bg-segro-red text-white'
                    : 'bg-segro-offwhite text-segro-midgray hover:bg-segro-lightgray'
                }`}
              >
                All
              </button>
              {markets.map((market) => (
                <button
                  key={market}
                  onClick={() => setFilterMarket(market)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    filterMarket === market
                      ? 'bg-segro-red text-white'
                      : 'bg-segro-offwhite text-segro-midgray hover:bg-segro-lightgray'
                  }`}
                >
                  {market}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-12 bg-segro-lightgray"></div>

          {/* Actor Filter */}
          <div>
            <label className="block text-xs font-semibold text-segro-midgray mb-2">FILTER BY ACTOR</label>
            <select
              value={filterActor}
              onChange={(e) => setFilterActor(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-segro-lightgray bg-white text-segro-charcoal focus:outline-none focus:ring-2 focus:ring-segro-red focus:border-transparent"
            >
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor === 'all' ? 'All' : actor}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Activity Log List */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <Card key={log.id} accent={log.actor === 'Agent' ? 'teal' : 'red'} hover>
              <div className="flex items-start gap-4">
                {/* Actor Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    log.actor === 'Agent' ? 'bg-segro-teal-accent' : 'bg-segro-red'
                  }`}
                >
                  {log.actor === 'Agent' ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>

                {/* Log Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <MarketBadge market={log.market} size="sm" />
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          log.actor === 'Agent'
                            ? 'bg-segro-teal-accent/10 text-segro-teal-accent'
                            : 'bg-segro-red/10 text-segro-red'
                        }`}
                      >
                        {log.actor === 'Human' && log.username ? log.username : log.actor}
                      </span>
                      <span className="text-xs text-segro-midgray">{formatRelativeTime(log.timestamp)}</span>
                    </div>
                    <span className="text-xs text-segro-midgray whitespace-nowrap ml-4">
                      {formatDateTime(log.timestamp)}
                    </span>
                  </div>
                  <h3 className="font-bold text-segro-charcoal mb-1">{log.action}</h3>
                  {log.details && <p className="text-sm text-segro-midgray">{log.details}</p>}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card accent="none">
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-segro-midgray mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-segro-midgray">No activity logs match the selected filters</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
