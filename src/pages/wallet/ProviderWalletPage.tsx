import { useEffect, useState } from "react";
import { ArrowUpRight, History, FileText, Loader2 } from "lucide-react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { toast } from "sonner";
import { walletService, type WalletBalance, type WalletStats, type WalletTransaction } from "@/services/wallet";

export function ProviderWalletPage() {
  const [filter, setFilter] = useState<"all" | "credits" | "transfers">("all");
  const [amount, setAmount] = useState("50000");
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [tx, setTx] = useState<WalletTransaction[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [b, s, t] = await Promise.all([
          walletService.balance().catch(() => null),
          walletService.stats().catch(() => null),
          walletService.transactions().catch(() => [] as WalletTransaction[]),
        ]);
        if (!alive) return;
        setBalance(b);
        setStats(s);
        setTx(t);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const transfer = parseInt(amount || "0", 10);
  const fee = Math.round(transfer * 0.01);
  const receive = transfer - fee;

  const rows = tx.filter((t) =>
    filter === "all" ? true : filter === "credits" ? t.tone === "credit" : t.tone === "transfer",
  );

  const handleWithdraw = async () => {
    if (!transfer) return;
    setSubmitting(true);
    try {
      await walletService.withdraw(transfer);
      toast.success(`Transfer of Rs. ${transfer.toLocaleString()} initiated`);
      const [b, t] = await Promise.all([
        walletService.balance().catch(() => balance),
        walletService.transactions().catch(() => tx),
      ]);
      setBalance(b);
      setTx(t);
    } catch {
      toast.error("Transfer failed");
    } finally {
      setSubmitting(false);
    }
  };

  const weeks = stats?.weeklyTrend?.length ? stats.weeklyTrend : [];
  const fmt = (n: number) => `Rs. ${Number(n || 0).toLocaleString()}`;

  return (
    <ProviderLayout active="wallet" newRequestsCount={2} reviewsCount={128}>
      <div>
        <h1 className="text-3xl font-bold">Wallet & Earnings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your income, initiate payouts and manage your financial account</p>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          {/* Hero balance */}
          <section className="mt-6 rounded-2xl bg-gradient-to-br from-amber-900 to-amber-950 p-7 text-amber-50">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Available Balance</p>
            <p className="mt-2 text-5xl font-bold">{fmt(balance?.available ?? 0)}</p>
            <p className="mt-1 text-xs opacity-80">Last updated today · Pending: {fmt(balance?.pending ?? 0)} in escrow</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-amber-950 hover:bg-amber-50">
                <ArrowUpRight className="h-3.5 w-3.5" /> Transfer to Bank
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold hover:bg-white/20">
                <History className="h-3.5 w-3.5" /> History
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold hover:bg-white/20">
                <FileText className="h-3.5 w-3.5" /> Statement
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI label="This Week" value={fmt(stats?.thisWeek ?? 0)} trend="↑ vs last week" />
            <KPI label="This Month" value={fmt(stats?.thisMonth ?? 0)} trend="↑ vs last month" />
            <KPI label="Total (YTD)" value={fmt(stats?.ytd ?? 0)} trend="↑ vs last year" />
            <KPI label="Avg. per Job" value={fmt(stats?.avgPerJob ?? 0)} trend="↑ vs last month" />
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
            {/* Chart */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold">Weekly Earnings — Last 8 Weeks</h3>
              <div className="mt-8 flex h-64 items-end gap-3">
                {weeks.length === 0 ? (
                  <p className="m-auto text-xs text-muted-foreground">No data yet</p>
                ) : weeks.map((w) => (
                  <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className={`w-full rounded-t-md ${w.active ? "bg-foreground" : "bg-amber-400/70"}`}
                      style={{ height: `${w.value}%` }}
                    />
                    <span className="text-[11px] font-semibold text-muted-foreground">{w.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">8-week avg: <span className="font-semibold text-foreground">{fmt(stats?.weekAvg ?? 0)}</span></span>
                <span className="font-semibold text-emerald-600">↑ {stats?.growthPct ?? 0}% growth trend</span>
              </div>
            </div>

            {/* Transfer panel */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-bold">Transfer to Bank</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Payout Amount (Rs.)</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Target Account</label>
                  <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <option>✓ Sampath Bank ···· 4521 (Primary)</option>
                    <option>BOC ···· 8821</option>
                  </select>
                </div>

                <div className="space-y-1 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs">
                  <Line label="Transfer Amount" value={`Rs. ${transfer.toLocaleString()}`} />
                  <Line label="Processing Fee (1%)" value={`− Rs. ${fee.toLocaleString()}`} muted />
                  <div className="my-1 border-t border-amber-200" />
                  <Line label="You Receive" value={`Rs. ${receive.toLocaleString()}`} bold />
                </div>

                <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800">⏱ Funds arrive in 1–2 business days via CEFT</p>

                <button
                  onClick={handleWithdraw}
                  disabled={submitting || !transfer}
                  className="w-full rounded-xl bg-amber-900 px-4 py-3 text-sm font-bold text-amber-50 hover:bg-amber-950 disabled:opacity-60"
                >
                  ↑ Confirm Transfer — Rs. {transfer.toLocaleString()}
                </button>
              </div>
            </div>
          </section>

          {/* Transactions */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-bold">Transaction History</h3>
              <div className="flex gap-1 rounded-full bg-muted p-1 text-xs font-semibold">
                {(["all", "credits", "transfers"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={`rounded-full px-3 py-1.5 capitalize ${filter === k ? "bg-foreground text-background" : "text-muted-foreground"}`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Ref</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-muted-foreground">No transactions yet</td></tr>
                ) : rows.map((t) => (
                  <tr key={t.ref} className="border-t border-border">
                    <td className="px-5 py-4">{t.desc}</td>
                    <td className="px-5 py-4 text-muted-foreground">{t.date}</td>
                    <td className="px-5 py-4 text-muted-foreground">{t.ref}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        t.tone === "credit" ? "bg-emerald-100 text-emerald-700"
                        : t.tone === "transfer" ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-700"
                      }`}>{t.type}</span>
                    </td>
                    <td className={`px-5 py-4 text-right font-bold ${t.tone === "credit" ? "text-emerald-700" : "text-red-700"}`}>{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </ProviderLayout>
  );
}

function KPI({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs font-semibold text-emerald-600">{trend}</p>
    </div>
  );
}

function Line({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span className={`${bold ? "text-base font-bold text-emerald-700" : "font-semibold"}`}>{value}</span>
    </div>
  );
}
