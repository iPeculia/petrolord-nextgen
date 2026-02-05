import React from 'react';
import { Book, Calculator, Database, Activity, HelpCircle } from 'lucide-react';

const h = React.createElement;

export const helpData = {
    tabs: [
        { id: 'quickstart', label: 'Quick Start', icon: Book },
        { id: 'input', label: 'Input Methods', icon: Calculator },
        { id: 'surfaces', label: 'Surfaces & Viz', icon: Database },
        { id: 'analysis', label: 'Analysis', icon: Activity },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
    ],
    content: {
        quickstart: h("div", { className: "space-y-4" },
            h("h3", { className: "text-lg font-semibold text-[#BFFF00]" }, "Getting Started with Volumetrics Pro"),
            h("p", null, "Volumetrics Pro allows geoscientists to calculate hydrocarbon volumes using various methods, from simple parameters to complex surface-based models."),
            h("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" },
                [
                    { title: "1. Choose Input Method", text: "Select 'Simple' for quick estimates or 'Surfaces' for detailed GRV calculations using imported maps." },
                    { title: "2. Enter Parameters", text: "Fill in reservoir properties like Porosity, Water Saturation, and FVF. Hover over fields for tooltips." },
                    { title: "3. Calculate", text: "Click \"Calculate Volumes\" to generate deterministic STOIIP and Recoverable Resources." },
                    { title: "4. Analyze Risk", text: "Use the Analysis tab to run Monte Carlo simulations and quantify uncertainty (P10/P50/P90)." }
                ].map((step, i) => h("div", { key: i, className: "p-4 bg-slate-900 border border-slate-800 rounded" },
                    h("h4", { className: "font-medium text-white mb-2" }, step.title),
                    h("p", { className: "text-sm text-slate-400" }, step.text)
                ))
            )
        ),
        input: h("div", { className: "space-y-4" },
            h("h3", { className: "text-lg font-semibold text-[#BFFF00]" }, "Input Methods Explained"),
            h("div", { className: "space-y-6" },
                h("div", null,
                    h("h4", { className: "font-medium text-white border-b border-slate-800 pb-2 mb-2" }, "Simple Method"),
                    h("p", { className: "text-sm text-slate-400 mb-2" }, "Uses the standard volumetric formula with average values."),
                    h("code", { className: "block p-2 bg-slate-950 rounded text-xs font-mono text-blue-300" }, "STOIIP = (Area × Thickness × Porosity × (1 - Sw)) / Boi")
                ),
                h("div", null,
                    h("h4", { className: "font-medium text-white border-b border-slate-800 pb-2 mb-2" }, "Surface Based"),
                    h("p", { className: "text-sm text-slate-400 mb-2" }, "Calculates Gross Rock Volume (GRV) by integrating the volume between Top and Base surfaces."),
                    h("ul", { className: "list-disc list-inside text-sm text-slate-400 space-y-1" },
                        ["Supports CSV, XYZ point cloud imports.", "Automatically handles coordinate bounding boxes.", "Computes overlap volume in acre-ft or m³."].map((item, i) => h("li", { key: i }, item))
                    )
                )
            )
        ),
        surfaces: h("div", { className: "space-y-4" },
            h("h3", { className: "text-lg font-semibold text-[#BFFF00]" }, "Visualization Guide"),
            h("p", { className: "text-sm text-slate-400" }, "The Visualization tab offers both 2D map views and 3D interactions."),
            h("ul", { className: "list-disc list-inside text-sm text-slate-400 space-y-2" },
                h("li", null, h("strong", null, "2D Map:"), " Top-down view of surface extents. Useful for checking coverage."),
                h("li", null, h("strong", null, "3D View:"), " Interactive point-cloud rendering.",
                    h("ul", { className: "pl-6 mt-1 space-y-1 text-xs" },
                        h("li", null, "Left Click + Drag to Rotate"),
                        h("li", null, "Right Click + Drag to Pan"),
                        h("li", null, "Scroll to Zoom")
                    )
                ),
                h("li", null, h("strong", null, "Vertical Exaggeration:"), " Use the Z-scale slider to emphasize structural relief.")
            )
        ),
        analysis: h("div", { className: "space-y-4" },
            h("h3", { className: "text-lg font-semibold text-[#BFFF00]" }, "Risk & Sensitivity"),
            h("p", { className: "text-sm text-slate-400" }, "Quantify uncertainty using statistical methods."),
            h("div", { className: "space-y-4 mt-4" },
                h("div", { className: "border-l-2 border-blue-500 pl-4" },
                    h("h5", { className: "font-medium text-white" }, "Monte Carlo Simulation"),
                    h("p", { className: "text-xs text-slate-400" }, "Runs thousands of iterations sampling from input distributions (Normal, Triangular, etc.) to build a probability curve for volumes.")
                ),
                h("div", { className: "border-l-2 border-purple-500 pl-4" },
                    h("h5", { className: "font-medium text-white" }, "Tornado Chart"),
                    h("p", { className: "text-xs text-slate-400" }, "Visualizes which parameters have the biggest impact on the result (Sensitivity Analysis).")
                )
            )
        ),
        faq: h("div", { className: "space-y-4" },
            h("h3", { className: "text-lg font-semibold text-[#BFFF00]" }, "Frequently Asked Questions"),
            h("div", { className: "space-y-4" },
                [
                    { q: "Can I export my results?", a: "Yes, use the Export CSV button in the Results tab." },
                    { q: "Where is my data saved?", a: "Projects are saved locally in your browser. We are adding cloud sync in the next release." },
                    { q: "What file formats are supported?", a: "For surfaces, we support CSV, XYZ, and DAT plain text files with X, Y, Z columns." }
                ].map((item, i) => h("div", { key: i },
                    h("h5", { className: "font-medium text-white text-sm" }, item.q),
                    h("p", { className: "text-xs text-slate-400" }, item.a)
                ))
            )
        )
    }
};