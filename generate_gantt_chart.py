import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

def create_gantt_chart():
    plt.rcParams['font.sans-serif'] = ['Segoe UI', 'DejaVu Sans', 'Arial']
    plt.rcParams['font.family'] = 'sans-serif'
    
    # 16:9 Widescreen dimension with 300 DPI
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    
    # Palette FinanceFlow Dark Luxury
    BG_COLOR = '#0B132B'        # Deep Slate Navy
    CARD_BG = '#141E38'         # Inner Card background
    GRID_COLOR = '#23335D'      # Gridlines
    COLOR_COMPLETED = '#10B981' # Emerald Green
    COLOR_PROGRESS = '#06B6D4'  # Vibrant Cyan
    COLOR_MILESTONE = '#F59E0B' # Amber Gold
    TEXT_WHITE = '#FFFFFF'
    TEXT_MUTED = '#94A3B8'
    TEXT_LIGHT = '#F1F5F9'

    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(CARD_BG)

    # Project Tasks Data (FinanceFlow v1.0 to v1.4)
    tasks = [
        {"name": "Sprint 1: Autenticación Segura (JWT, Bcrypt, MongoDB)", "start": 1.0, "duration": 2.0, "pct": "100%", "status": "completed"},
        {"name": "Sprint 2: Captura Transaccional & Modelos Mongoose", "start": 3.0, "duration": 2.0, "pct": "100%", "status": "completed"},
        {"name": "Sprint 3: Desactivación Lógica (Soft Delete) & Filtros", "start": 5.0, "duration": 2.0, "pct": "100%", "status": "completed"},
        {"name": "Sprint 4: Dashboard Analítico, Recharts & Alertas", "start": 7.0, "duration": 2.0, "pct": "100%", "status": "completed"},
        {"name": "Sprint 5: Reportes Avanzados & Visión Gemini OCR", "start": 9.0, "duration": 2.0, "pct": "100%", "status": "completed"},
        {"name": "Sprint 6: Planificador de Compras & Pasarelas Pago", "start": 11.0, "duration": 2.0, "pct": "100%", "status": "completed"},
        {"name": "Hito SDK: Migración Arquitectura SDK Balance (F1-F4)", "start": 11.8, "duration": 1.4, "pct": "100%", "status": "completed"},
        {"name": "Sprint 7: Hardening Post-Entrega & Tests Jest", "start": 13.0, "duration": 1.5, "pct": "70%", "status": "in_progress"},
        {"name": "Puesta en Producción Definitiva & Cierre Técnico", "start": 14.2, "duration": 0.6, "pct": "Hito", "status": "milestone"}
    ]

    n_tasks = len(tasks)
    y_positions = np.arange(n_tasks)[::-1] # Inverted: top to bottom
    bar_height = 0.54

    for idx, task in enumerate(tasks):
        y = y_positions[idx]
        start = task["start"]
        duration = task["duration"]
        status = task["status"]
        pct = task["pct"]

        if status == "completed":
            color = COLOR_COMPLETED
            edge = '#059669'
            label_text = f"{pct} Completado"
            text_color = '#06281E'
        elif status == "in_progress":
            color = COLOR_PROGRESS
            edge = '#0891B2'
            label_text = f"{pct} En Progreso"
            text_color = '#082F3B'
        else: # milestone
            color = COLOR_MILESTONE
            edge = '#D97706'
            label_text = "Hito v1.4.0"
            text_color = '#3B1F04'

        # Rounded Fancy Box Bar
        rect = patches.FancyBboxPatch(
            (start, y - bar_height / 2),
            duration,
            bar_height,
            boxstyle="round,pad=0.06,rounding_size=0.2",
            facecolor=color,
            edgecolor=edge,
            linewidth=1.6,
            alpha=0.95,
            zorder=3
        )
        ax.add_patch(rect)

        # Label inside or next to bar
        if status == "milestone":
            ax.text(start + duration / 2, y, "META", va='center', ha='center',
                    color=text_color, fontsize=10, fontweight='bold', zorder=4)
            ax.text(start + duration + 0.15, y, "Pase a Producción v1.4.0", va='center', ha='left',
                    color=COLOR_MILESTONE, fontsize=10.5, fontweight='bold', zorder=4)
        else:
            ax.text(start + duration / 2, y, label_text, va='center', ha='center',
                    color=text_color, fontsize=10, fontweight='bold', zorder=4)

    # Y-axis task labels
    ax.set_yticks(y_positions)
    ax.set_yticklabels([t["name"] for t in tasks], fontsize=11.5, color=TEXT_LIGHT, fontweight='600')
    ax.tick_params(axis='y', length=0, pad=15)

    # X-axis timeline weeks (nicely formatted)
    weeks = list(range(1, 16))
    ax.set_xticks(weeks)
    week_labels = [f"Sem {w}" for w in weeks]
    ax.set_xticklabels(week_labels, fontsize=10.5, color=TEXT_MUTED, fontweight='600')
    ax.tick_params(axis='x', colors=GRID_COLOR, length=6, pad=10)
    
    ax.set_xlim(0.4, 16.5)
    ax.set_ylim(-0.8, n_tasks - 0.2)

    # Gridlines
    ax.grid(True, axis='x', color=GRID_COLOR, linestyle='--', linewidth=1.0, alpha=0.6, zorder=1)
    ax.grid(False, axis='y')

    # Spines styling
    for spine in ax.spines.values():
        spine.set_color(GRID_COLOR)
        spine.set_linewidth(1.4)

    # Vertical line representing "HOY / Current Progress" (Semana 13.8)
    ax.axvline(x=13.8, color=COLOR_PROGRESS, linestyle='-', linewidth=2.2, alpha=0.9, zorder=2)
    ax.text(13.85, n_tasks - 0.6, "HOY: Sprint 7 (Hardening)", color=COLOR_PROGRESS,
            fontsize=10, fontweight='bold', va='center', ha='left')

    # Title & Subtitle block
    fig.text(0.06, 0.95, "FINANCEFLOW — CRONOGRAMA EJECUTIVO DEL PROYECTO", fontsize=20, fontweight='bold', color=TEXT_WHITE)
    fig.text(0.06, 0.915, "Línea de Tiempo Oficial por Sprints, Hitos de Migración SDK y Entregables (Semanas 1 a 15)", fontsize=12.5, color=COLOR_COMPLETED)

    # Custom Legend at bottom
    legend_elements = [
        patches.Patch(facecolor=COLOR_COMPLETED, edgecolor='#059669', label='100% Completado (Sprints 1 a 6 & SDK)'),
        patches.Patch(facecolor=COLOR_PROGRESS, edgecolor='#0891B2', label='70% En Progreso (Sprint 7: Hardening)'),
        patches.Patch(facecolor=COLOR_MILESTONE, edgecolor='#D97706', label='Hito: Puesta en Producción v1.4.0')
    ]
    leg = ax.legend(handles=legend_elements, loc='upper center', bbox_to_anchor=(0.5, -0.09), ncol=3,
                    facecolor='#162238', edgecolor=GRID_COLOR, fontsize=10.5, labelcolor=TEXT_LIGHT, framealpha=0.95)
    leg.get_frame().set_boxstyle("round,pad=0.5,rounding_size=0.25")

    # Save to workspace
    out_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cronograma_financeflow.png")
    plt.subplots_adjust(left=0.32, right=0.95, top=0.88, bottom=0.14)
    plt.savefig(out_file, facecolor=fig.get_facecolor(), edgecolor='none', dpi=300)
    plt.close()
    print(f"Refined chart saved successfully at: {out_file}")

if __name__ == "__main__":
    create_gantt_chart()
