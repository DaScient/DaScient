#!/usr/bin/env python3
"""
Kalman2D Trading Output Visualization (JSON -> Plots)

This script visualizes the provided JSON output (price, Kalman mean `mu`, velocity `v`,
innovations, z-scores, confidence, qScore, and regime labels).

It also derives entry, exit, and hold points from `nodeSide` transitions and overlays
them on the price chart.

Usage:
  1) Paste JSON into RAW_JSON below, OR save JSON to a file and pass --json path.json
  2) Run:
       python kalman_k2d_viz.py --json tsla.json
     or:
       python kalman_k2d_viz.py

Notes:
- series.t is treated as UNIX seconds and converted to timezone-aware datetimes (UTC).
- nodeSide is assumed to represent the recommended position state: LONG, SHORT, or HOLD.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, Optional

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


# Optional interactive plots
try:
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots

    HAS_PLOTLY = True
except Exception:
    HAS_PLOTLY = False


plt.rcParams["figure.dpi"] = 130
pd.set_option("display.max_columns", 100)


import requests

DATA_URL = "https://stocks.aristocles24.workers.dev/api/ta-enhanced?symbol=TSLA&range=3mo&interval=1h"

resp = requests.get(DATA_URL, timeout=30)
resp.raise_for_status()
RAW_JSON = resp.text

REQUIRED_SERIES_KEYS = [
    "t",
    "close",
    "mu",
    "v",
    "innovation",
    "innovationPct",
    "gain",
    "dtHours",
    "rEff",
    "nis",
    "nuZ",
    "vZ",
    "sigmaMuPct",
    "confidence",
    "qScore",
    "nodeType",
    "nodeSide",
]


def load_payload(raw_json: str) -> Dict[str, Any]:
    raw_json = raw_json.strip()
    try:
        return json.loads(raw_json)
    except json.JSONDecodeError as e:
        raise ValueError(
            "RAW_JSON is not valid JSON. Paste the full JSON string into RAW_JSON or use --json file."
        ) from e


def payload_to_frame(payload: Dict[str, Any]) -> pd.DataFrame:
    if not payload.get("ok", False):
        raise ValueError("payload.ok is false, refusing to plot.")

    series = payload.get("series", {})
    missing = [k for k in REQUIRED_SERIES_KEYS if k not in series]
    if missing:
        raise KeyError(f"Missing keys in series: {missing}")

    df = pd.DataFrame({k: series[k] for k in REQUIRED_SERIES_KEYS})

    lens = {k: len(series[k]) for k in REQUIRED_SERIES_KEYS}
    if len(set(lens.values())) != 1:
        raise ValueError(f"Series lengths differ: {lens}")

    df["ts"] = pd.to_datetime(df["t"], unit="s", utc=True)
    df = df.sort_values("ts").reset_index(drop=True)

    df["symbol"] = payload.get("symbol", "")
    df["range"] = payload.get("range", "")
    df["interval"] = payload.get("interval", "")
    return df


def derive_trade_events(df: pd.DataFrame) -> pd.DataFrame:
    side = df["nodeSide"].astype(str).str.upper()
    prev = side.shift(1)

    events = pd.Series("", index=df.index, dtype="object")
    events[(prev != "LONG") & (side == "LONG")] = "ENTRY_LONG"
    events[(prev == "LONG") & (side != "LONG")] = "EXIT_LONG"
    events[(prev != "SHORT") & (side == "SHORT")] = "ENTRY_SHORT"
    events[(prev == "SHORT") & (side != "SHORT")] = "EXIT_SHORT"
    events[events == ""] = "HOLD"

    out = df.copy()
    out["event"] = events
    out["eventLabel"] = out["event"].replace(
        {
            "ENTRY_LONG": "L+",
            "EXIT_LONG": "L-",
            "ENTRY_SHORT": "S+",
            "EXIT_SHORT": "S-",
            "HOLD": "",
        }
    )
    return out


def summarize_regimes(df: pd.DataFrame) -> pd.DataFrame:
    d = df.copy()
    d["nodeType"] = d["nodeType"].astype(str)
    d["nodeSide"] = d["nodeSide"].astype(str)

    boundary = d["nodeType"].ne(d["nodeType"].shift(1)) | d["nodeSide"].ne(d["nodeSide"].shift(1))
    grp = boundary.cumsum()

    out = (
        d.groupby(grp)
        .agg(
            start=("ts", "min"),
            end=("ts", "max"),
            nodeType=("nodeType", "first"),
            nodeSide=("nodeSide", "first"),
            n=("ts", "size"),
            close_start=("close", "first"),
            close_end=("close", "last"),
            qScore_mean=("qScore", "mean"),
            conf_mean=("confidence", "mean"),
            v_mean=("v", "mean"),
        )
        .reset_index(drop=True)
    )
    out["duration_hours_approx"] = out["n"].astype(float)
    out["return_pct"] = (out["close_end"] / out["close_start"] - 1.0) * 100.0
    return out


def plot_price_mu_band(df: pd.DataFrame, title: Optional[str] = None) -> None:
    d = df.copy()
    mu = d["mu"].astype(float)
    sigma = (d["sigmaMuPct"].astype(float) * mu).abs()
    upper = mu + sigma
    lower = mu - sigma

    fig, ax = plt.subplots(figsize=(12, 5))
    ax.plot(d["ts"], d["close"], label="close", linewidth=1.4)
    ax.plot(d["ts"], mu, label="mu (Kalman)", linewidth=1.4)
    ax.fill_between(d["ts"].values, lower.values, upper.values, alpha=0.18, label="mu ± 1σ (approx)")

    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("price")
    ax.set_title(title or f"{d['symbol'].iloc[0]} close vs mu (with uncertainty band)")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()


def plot_entries_exits(df: pd.DataFrame, title: Optional[str] = None) -> None:
    d = df.copy()
    fig, ax = plt.subplots(figsize=(12, 5))

    ax.plot(d["ts"], d["close"], label="close", linewidth=1.6)
    ax.plot(d["ts"], d["mu"], label="mu", linewidth=1.2, alpha=0.9)

    m_el = d["event"] == "ENTRY_LONG"
    m_xl = d["event"] == "EXIT_LONG"
    m_es = d["event"] == "ENTRY_SHORT"
    m_xs = d["event"] == "EXIT_SHORT"

    ax.scatter(d.loc[m_el, "ts"], d.loc[m_el, "close"], marker="^", s=70, label="ENTRY_LONG")
    ax.scatter(d.loc[m_xl, "ts"], d.loc[m_xl, "close"], marker="v", s=70, label="EXIT_LONG")
    ax.scatter(d.loc[m_es, "ts"], d.loc[m_es, "close"], marker="^", s=70, label="ENTRY_SHORT")
    ax.scatter(d.loc[m_xs, "ts"], d.loc[m_xs, "close"], marker="v", s=70, label="EXIT_SHORT")

    for _, row in d.loc[m_el | m_xl | m_es | m_xs].iterrows():
        ax.annotate(
            row["eventLabel"],
            (row["ts"], row["close"]),
            textcoords="offset points",
            xytext=(0, 9),
            ha="center",
            fontsize=9,
        )

    ax.set_title(title or f"{d['symbol'].iloc[0]} close with entry/exit markers")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("price")
    ax.grid(True, alpha=0.25)
    ax.legend(loc="best")
    plt.show()


def _shade_regimes(ax, regimes_df: pd.DataFrame) -> None:
    for _, r in regimes_df.iterrows():
        side = str(r["nodeSide"]).upper()
        alpha = 0.12 if side in {"LONG", "SHORT"} else 0.06
        ax.axvspan(r["start"], r["end"], alpha=alpha)


def plot_with_regime_shading(df: pd.DataFrame, regimes_df: pd.DataFrame, title: Optional[str] = None) -> None:
    d = df.copy()
    fig, ax = plt.subplots(figsize=(12, 5))

    _shade_regimes(ax, regimes_df)
    ax.plot(d["ts"], d["close"], label="close", linewidth=1.6)
    ax.plot(d["ts"], d["mu"], label="mu", linewidth=1.2, alpha=0.9)

    ax.set_title(title or f"{d['symbol'].iloc[0]} close (shaded by nodeSide)")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("price")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()


def plot_velocity_zscores(df: pd.DataFrame) -> None:
    d = df.copy()

    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(d["ts"], d["v"], label="v (price per hour)", linewidth=1.4)
    ax.axhline(0, linewidth=1)
    ax.set_title("Velocity (v)")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("price per hour")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()

    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(d["ts"], d["vZ"], label="vZ", linewidth=1.3)
    ax.plot(d["ts"], d["nuZ"], label="nuZ", linewidth=1.3)
    ax.axhline(0, linewidth=1)
    ax.set_title("z-scores (vZ and nuZ)")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("z-score")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()


def plot_innovation_diagnostics(df: pd.DataFrame) -> None:
    d = df.copy()

    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(d["ts"], d["innovation"], label="innovation", linewidth=1.3)
    ax.axhline(0, linewidth=1)
    ax.set_title("Innovation (price units)")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("price")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()

    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(d["ts"], d["innovationPct"], label="innovationPct", linewidth=1.3)
    ax.axhline(0, linewidth=1)
    ax.set_title("Innovation percent")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("percent")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()

    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(d["ts"], d["nis"], label="nis", linewidth=1.3)
    ax.set_title("NIS (normalized innovation statistic)")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("nis")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()

    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(d["ts"], d["gain"], label="gain", linewidth=1.3)
    ax.set_title("Kalman gain")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("gain")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()

    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(d["ts"], d["rEff"], label="rEff", linewidth=1.3)
    ax.set_title("Effective measurement noise (rEff)")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("rEff")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()


def plot_confidence_qscore(df: pd.DataFrame) -> None:
    d = df.copy()

    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(d["ts"], d["confidence"], label="confidence", linewidth=1.3)
    ax.set_title("Confidence")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("confidence")
    ax.set_ylim(0, 1)
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()

    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(d["ts"], d["qScore"], label="qScore", linewidth=1.3)
    ax.axhline(50, linewidth=1)
    ax.set_title("qScore (neutral baseline at 50)")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("qScore")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()


def plot_dashboard(df: pd.DataFrame) -> None:
    d = df.copy()

    fig, axes = plt.subplots(4, 1, figsize=(13, 10), sharex=True)

    ax = axes[0]
    ax.plot(d["ts"], d["close"], label="close", linewidth=1.6)
    ax.plot(d["ts"], d["mu"], label="mu", linewidth=1.2, alpha=0.95)

    m_el = d["event"] == "ENTRY_LONG"
    m_xl = d["event"] == "EXIT_LONG"
    m_es = d["event"] == "ENTRY_SHORT"
    m_xs = d["event"] == "EXIT_SHORT"

    ax.scatter(d.loc[m_el, "ts"], d.loc[m_el, "close"], marker="^", s=55, label="ENTRY_LONG")
    ax.scatter(d.loc[m_xl, "ts"], d.loc[m_xl, "close"], marker="v", s=55, label="EXIT_LONG")
    ax.scatter(d.loc[m_es, "ts"], d.loc[m_es, "close"], marker="^", s=55, label="ENTRY_SHORT")
    ax.scatter(d.loc[m_xs, "ts"], d.loc[m_xs, "close"], marker="v", s=55, label="EXIT_SHORT")

    for _, row in d.loc[m_el | m_xl | m_es | m_xs].iterrows():
        ax.annotate(
            row["eventLabel"],
            (row["ts"], row["close"]),
            textcoords="offset points",
            xytext=(0, 7),
            ha="center",
            fontsize=8,
        )

    ax.set_title(f"{d['symbol'].iloc[0]} dashboard")
    ax.set_ylabel("price")
    ax.grid(True, alpha=0.25)
    ax.legend(loc="upper left", ncol=4, fontsize=8)

    ax = axes[1]
    ax.plot(d["ts"], d["v"], label="v", linewidth=1.2)
    ax.axhline(0, linewidth=1)
    ax.set_ylabel("v")
    ax.grid(True, alpha=0.25)
    ax.legend(loc="upper left", fontsize=8)

    ax = axes[2]
    ax.plot(d["ts"], d["nuZ"], label="nuZ", linewidth=1.2)
    ax.plot(d["ts"], d["vZ"], label="vZ", linewidth=1.2)
    ax.axhline(0, linewidth=1)
    ax.set_ylabel("z")
    ax.grid(True, alpha=0.25)
    ax.legend(loc="upper left", ncol=2, fontsize=8)

    ax = axes[3]
    ax.plot(d["ts"], d["qScore"], label="qScore", linewidth=1.2)
    ax.axhline(50, linewidth=1)
    ax.set_ylabel("qScore")
    ax.grid(True, alpha=0.25)

    ax2 = ax.twinx()
    ax2.plot(d["ts"], d["confidence"], label="confidence", linewidth=1.1)
    ax2.set_ylabel("confidence")
    ax2.set_ylim(0, 1)

    lines, labels = ax.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax2.legend(lines + lines2, labels + labels2, loc="upper left", fontsize=8)

    axes[-1].set_xlabel("time (UTC)")
    plt.tight_layout()
    plt.show()


def plot_forecast_levels(df: pd.DataFrame, payload: Dict[str, Any]) -> None:
    d = df.copy()
    last = payload.get("last", {})
    y_lin = last.get("target24hLinear")
    y_dmp = last.get("target24hDamped")

    fig, ax = plt.subplots(figsize=(12, 5))
    ax.plot(d["ts"], d["close"], label="close", linewidth=1.6)

    if y_lin is not None:
        ax.axhline(float(y_lin), linewidth=1.2, label="target24hLinear")
    if y_dmp is not None:
        ax.axhline(float(y_dmp), linewidth=1.2, label="target24hDamped")

    ax.set_title(f"{d['symbol'].iloc[0]} close with 24h forecast levels")
    ax.set_xlabel("time (UTC)")
    ax.set_ylabel("price")
    ax.grid(True, alpha=0.25)
    ax.legend()
    plt.show()


def plotly_dashboard(df: pd.DataFrame, payload: Dict[str, Any]) -> None:
    if not HAS_PLOTLY:
        print("Plotly not available. Install with: pip install plotly")
        return

    d = df.copy()

    fig = make_subplots(
        rows=4,
        cols=1,
        shared_xaxes=True,
        vertical_spacing=0.04,
        row_heights=[0.45, 0.18, 0.18, 0.19],
        subplot_titles=[
            "close and mu (with entry/exit markers)",
            "velocity",
            "z-scores",
            "qScore and confidence",
        ],
    )

    fig.add_trace(go.Scatter(x=d["ts"], y=d["close"], name="close", mode="lines"), row=1, col=1)
    fig.add_trace(go.Scatter(x=d["ts"], y=d["mu"], name="mu", mode="lines"), row=1, col=1)

    marker_map = {
        "ENTRY_LONG": dict(symbol="triangle-up", size=10),
        "EXIT_LONG": dict(symbol="triangle-down", size=10),
        "ENTRY_SHORT": dict(symbol="triangle-up", size=10),
        "EXIT_SHORT": dict(symbol="triangle-down", size=10),
    }
    for evt, m in marker_map.items():
        sub = d[d["event"] == evt]
        if len(sub) == 0:
            continue
        fig.add_trace(
            go.Scatter(
                x=sub["ts"],
                y=sub["close"],
                mode="markers+text",
                text=sub["eventLabel"],
                textposition="top center",
                name=evt,
                marker=m,
            ),
            row=1,
            col=1,
        )

    fig.add_trace(go.Scatter(x=d["ts"], y=d["v"], name="v", mode="lines"), row=2, col=1)
    fig.add_trace(go.Scatter(x=d["ts"], y=d["nuZ"], name="nuZ", mode="lines"), row=3, col=1)
    fig.add_trace(go.Scatter(x=d["ts"], y=d["vZ"], name="vZ", mode="lines"), row=3, col=1)
    fig.add_trace(go.Scatter(x=d["ts"], y=d["qScore"], name="qScore", mode="lines"), row=4, col=1)
    fig.add_trace(go.Scatter(x=d["ts"], y=d["confidence"], name="confidence", mode="lines"), row=4, col=1)

    last = payload.get("last", {})
    y_lin = last.get("target24hLinear")
    y_dmp = last.get("target24hDamped")
    if y_lin is not None:
        fig.add_hline(y=float(y_lin), line_width=1, row=1, col=1)
    if y_dmp is not None:
        fig.add_hline(y=float(y_dmp), line_width=1, row=1, col=1)

    fig.update_layout(
        height=950,
        title=f"{d['symbol'].iloc[0]} interactive dashboard",
        hovermode="x unified",
    )
    fig.show()


def validate_payload(payload: Dict[str, Any], df: pd.DataFrame) -> None:
    assert payload.get("ok") is True
    points = payload.get("meta", {}).get("points")
    if points is not None:
        assert df.shape[0] == int(points)
    assert df["ts"].is_monotonic_increasing
    assert df["close"].notna().all()
    assert set(df["nodeSide"].astype(str).str.upper().unique()).issubset({"LONG", "SHORT", "HOLD"})


def read_json_from_file(path: Path) -> Dict[str, Any]:
    txt = path.read_text(encoding="utf-8")
    return load_payload(txt)


def main() -> None:
    parser = argparse.ArgumentParser(description="Visualize Kalman2D trading JSON output.")
    parser.add_argument("--json", type=str, default=None, help="Path to JSON file (overrides RAW_JSON).")
    parser.add_argument("--no-plotly", action="store_true", help="Skip plotly even if installed.")
    parser.add_argument("--export-csv", action="store_true", help="Export parsed dataframe to ./out/*.csv")
    args = parser.parse_args()

    if args.json:
        payload = read_json_from_file(Path(args.json))
    else:
        payload = load_payload(RAW_JSON)

    df = payload_to_frame(payload)
    df2 = derive_trade_events(df)
    regimes = summarize_regimes(df2)

    meta = payload.get("meta", {})
    last = payload.get("last", {})

    print("Symbol:", payload.get("symbol"))
    print("Range:", payload.get("range"), "| Interval:", payload.get("interval"))
    print("Estimator:", meta.get("estimator"))
    print("Points:", meta.get("points"))
    print("Forecast 24h (target24h):", last.get("target24h"))
    print("Forecast 24h (damped):", last.get("target24hDamped"))
    print()

    validate_payload(payload, df2)
    print("Validation passed.\n")

    print("Regimes summary:")
    print(regimes.to_string(index=False))
    print()

    # Plots
    #plot_price_mu_band(df2)
    plot_entries_exits(df2)
    #plot_with_regime_shading(df2, regimes)
    #plot_velocity_zscores(df2)
    #plot_innovation_diagnostics(df2)
    #plot_confidence_qscore(df2)
    #plot_dashboard(df2)
    #plot_forecast_levels(df2, payload)

    if HAS_PLOTLY and (not args.no_plotly):
        plotly_dashboard(df2, payload)
    elif not HAS_PLOTLY:
        print("Plotly not installed; skipping interactive dashboard.")
    elif args.no_plotly:
        print("Plotly disabled by --no-plotly; skipping interactive dashboard.")

    if args.export_csv:
        out_dir = Path("out")
        out_dir.mkdir(exist_ok=True)

        csv_path = out_dir / f"{df2['symbol'].iloc[0]}_{df2['range'].iloc[0]}_{df2['interval'].iloc[0]}_kalman_viz.csv"
        df2.to_csv(csv_path, index=False)
        print("Wrote:", csv_path.resolve())


if __name__ == "__main__":
    main()