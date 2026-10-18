import React, { useState } from 'react';
import { useTechVerseStore } from '../lib/store';
import { 
  Award, 
  Trophy, 
  Calendar, 
  Info, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

interface LeaderboardViewProps {
  onSelectAuthor: (authorId: string) => void;
  onSelectArticle: (articleId: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  onSelectAuthor,
  onSelectArticle,
}) => {
  const { getMonthlyLeaderboard, articles } = useTechVerseStore();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  const monthOptions = [
    { label: 'October 2026 (Active Cycle)', value: '2026-10' },
    { label: 'September 2026 (Archived)', value: '2026-09' },
    { label: 'August 2026 (Archived)', value: '2026-08' },
  ];

  const rankings = getMonthlyLeaderboard(selectedMonth);
  const topThree = rankings.slice(0, 3);
  const remainingRankings = rankings.slice(3);

  // Filter articles published in this selected month for preview
  const monthArticles = articles.filter(
    (a) => a.status === 'published' && a.publishedAt && a.publishedAt.startsWith(selectedMonth)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Title & Month Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-900 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Collegiate Technical Recognition</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            Monthly Contributor Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Recognizing undergraduate engineering researchers by peer-reviewed technical manuscripts approved and published within the evaluation cycle.
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-stone-300 rounded-md text-slate-900 shadow-2xs focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      {topThree.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((item, idx) => {
            const podiumStyles = [
              {
                rankBadge: 'bg-amber-400 text-amber-950 ring-4 ring-amber-100',
                cardBorder: 'border-amber-300 bg-amber-50/30',
                titleColor: 'text-amber-900',
                label: 'Gold Contributor',
              },
              {
                rankBadge: 'bg-slate-300 text-slate-900 ring-4 ring-slate-100',
                cardBorder: 'border-slate-300 bg-slate-50/50',
                titleColor: 'text-slate-800',
                label: 'Silver Contributor',
              },
              {
                rankBadge: 'bg-amber-700 text-amber-50 ring-4 ring-amber-900/10',
                cardBorder: 'border-stone-300 bg-stone-50/50',
                titleColor: 'text-amber-950',
                label: 'Bronze Contributor',
              },
            ][idx];

            return (
              <div
                key={item.authorId}
                onClick={() => onSelectAuthor(item.authorId)}
                className={`relative p-6 rounded-xl border ${podiumStyles.cardBorder} hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-sm ${podiumStyles.rankBadge}`}>
                    #{item.rank}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    {podiumStyles.label}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {item.author.avatarUrl ? (
                      <img
                        src={item.author.avatarUrl}
                        alt={item.author.fullName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif font-bold">
                        {item.author.fullName.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1 font-serif text-base font-bold text-slate-900 truncate">
                        <span>{item.author.fullName}</span>
                        {item.author.verificationStatus === 'verified' && (
                          <CheckCircle className="w-4 h-4 text-blue-700 shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {item.author.department}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.author.bio || 'Undergraduate student researcher at DY Patil College of Engineering.'}
                  </p>
                </div>

                {/* Score stats */}
                <div className="mt-6 pt-4 border-t border-stone-200/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Eligible Papers:</span>
                    <span className="font-serif text-lg font-bold text-slate-900 tabular-nums">
                      {item.eligibleArticleCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Active Pub Days:</span>
                    <span className="font-serif text-lg font-bold text-slate-700 tabular-nums">
                      {item.distinctPublicationDays} days
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-stone-300 rounded-xl bg-white p-8">
          <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="font-serif text-base font-bold text-slate-900">
            No Published Papers Recorded for {selectedMonth}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Articles must be approved and published by faculty moderators within this calendar month to count toward the leaderboard.
          </p>
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-slate-900">
          Complete Author Rankings ({rankings.length})
        </h2>

        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 border-b border-stone-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="p-3.5 w-16 text-center">Rank</th>
                <th className="p-3.5">Author</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5 text-center">Eligible Articles</th>
                <th className="p-3.5 text-center">Tie-Breaker: Active Days</th>
                <th className="p-3.5 text-right">Earliest Publication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rankings.map((entry) => (
                <tr
                  key={entry.authorId}
                  onClick={() => onSelectAuthor(entry.authorId)}
                  className="hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 text-center font-serif font-bold text-slate-900">
                    #{entry.rank}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      {entry.author.avatarUrl ? (
                        <img
                          src={entry.author.avatarUrl}
                          alt={entry.author.fullName}
                          className="w-7 h-7 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {entry.author.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1">
                          <span>{entry.author.fullName}</span>
                          {entry.author.verificationStatus === 'verified' && (
                            <CheckCircle className="w-3.5 h-3.5 text-blue-700" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {entry.author.studentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {entry.author.department}
                  </td>
                  <td className="p-3.5 text-center font-serif font-bold text-blue-900 tabular-nums text-sm">
                    {entry.eligibleArticleCount}
                  </td>
                  <td className="p-3.5 text-center font-mono text-slate-600 tabular-nums">
                    {entry.distinctPublicationDays} days
                  </td>
                  <td className="p-3.5 text-right text-slate-500 text-[11px]">
                    {new Date(entry.earliestPublicationTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tie-Breaker and Academic Integrity Policy Card */}
      <div className="p-6 bg-stone-100 border border-stone-200 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs uppercase tracking-wider">
          <Info className="w-4 h-4 text-blue-900" />
          <span>Official Evaluation Methodology & Tie-Breaker Protocol</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
          Authors are ranked primarily by the count of <strong>eligible technical articles first published</strong> during the calendar month. Only articles that have received faculty editorial approval and remain published under community guidelines are tallied. Drafts, revisions, rejected manuscripts, and unpublished content are excluded.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-600">
          <div className="p-3 bg-white rounded border border-stone-200">
            <strong className="text-slate-900 block mb-0.5">Primary Tie-Breaker: Distinct Publication Days</strong>
            If multiple authors publish the same number of eligible articles, rank is awarded to the contributor whose publications span a greater number of distinct calendar days (rewarding steady, sustained inquiry over burst submissions).
          </div>
          <div className="p-3 bg-white rounded border border-stone-200">
            <strong className="text-slate-900 block mb-0.5">Secondary Tie-Breaker: Chronological Earliest Achievement</strong>
            If authors remain tied in both article count and distinct days, precedence is assigned to the author whose earliest publication in the cycle occurred first.
          </div>
        </div>
      </div>

    </div>
  );
};
