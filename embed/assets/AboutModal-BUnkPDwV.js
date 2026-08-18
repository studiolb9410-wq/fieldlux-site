import{r as p,j as e}from"./r3f-D6fmtK_Y.js";import{c as o,u as s,a8 as u,X as h,S as m}from"./index-q5spvyXu.js";import"./three-core-BMWLQXGG.js";import"./jspdf-vendor-BiK-KV4l.js";import"./three-bvh-Ctn6wH7V.js";/**
 * @license lucide-react v0.370.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=o("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.370.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=o("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]),b=`FieldLux exists to make projection-mapping planning faster, more visual, and easier to defend before the team reaches site.

We believe:
— Projection planning should start with the real geometry, not a spreadsheet guess.
— A confident first-pass decision comes from optical numbers plus on-site verification.
— The best tool helps engineers see tradeoffs clearly, without pretending to replace their judgment.

What FieldLux does well today:
— FieldLux lux heatmaps based on projector optics, surface sampling, and blended surface lux
— Per-projector and composite brightness distribution so weak areas are visible before installation
— 13-point and probe workflows anchored to model surfaces, not just screen-space estimates
— Coverage, spill, pixel density, brightness reserve, and edge-blend planning cues
— Projector Library and custom projector setup for fast equipment comparison
— PDF reports and handoff data for communicating the current setup clearly

What FieldLux is not:
— A playback tool. For live show control use Resolume / MadMapper / Disguise.
— A replacement for a calibrated photometer and a seasoned AV engineer.
— A final certification. It's a planning aid — your knowledge of the site closes the loop.

Our aim: give you a clear, honest read on the projected field so you can spend your time solving the hard problems, not re-deriving throw, lux, and coverage by hand. FieldLux should make the conversation sharper; you still own the final call.`,f=`How to get the most out of FieldLux — and what this software is designed to help with.

RESPONSIBLE USE
— Treat FieldLux results as predictions based on optical models and the scene data you provide. They help you plan and compare options, but they are not direct measurements.
— Before final installation, verify key results on site using appropriate measurement tools, including a calibrated photometer where relevant.
— Use FieldLux together with professional installation practice, projector manufacturer guidance, and any project-specific safety or compliance requirements that apply to your site.
— FieldLux supports planning and decision-making, but the final go / no-go decision remains with the installation team and project owner.

WHAT THE SIMULATION MAY NOT FULLY CAPTURE
FieldLux may not fully capture every real-world variable, including ambient-light fluctuation, unusual surface-reflectance behavior, projector warm-up drift, lens manufacturing tolerance, environmental temperature and humidity, vibration, power quality, or workmanship differences during installation. Simulation and analysis results are useful planning estimates, not guarantees of site performance.

BETA STATUS
FieldLux Beta v.2 is still evolving. Features, calculations, and data formats may change as the product improves. We publish important updates in release notes whenever practical.

SOFTWARE ROLE
FieldLux is a planning and analysis tool. It does not by itself certify code compliance, laser safety, electrical safety, structural suitability, or venue approval. Those checks remain part of the project's installation and review workflow.

LIABILITY AND LEGAL RIGHTS
FieldLux is intended to help teams make better planning decisions, but project outcomes also depend on site conditions, hardware condition, measurements, content choices, and installation execution. Except where responsibility cannot be limited under applicable law, [Company Legal Name] is not responsible for losses caused by decisions made without appropriate on-site verification or by factors outside the software's reasonable control. Nothing in this notice limits any rights or remedies that cannot be excluded under applicable law.

In plain language: we build the best planning tool we can, you verify on site, and both sides should treat simulation output as guidance rather than a final field measurement.`,j=()=>{const r=s(t=>t.aboutModalOpen),a=s(t=>t.setAboutModalOpen),[i,l]=p.useState("philosophy");return r?e.jsx("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm",onClick:()=>a(!1),children:e.jsxs("div",{className:"w-[640px] max-w-[92vw] max-h-[86vh] rounded-lg border border-white/15 bg-[#0B0B0B] shadow-2xl overflow-hidden flex flex-col",onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0",children:[e.jsx(u,{size:"modal",showBeta:!0,wordClassName:"text-ink-primary"}),e.jsx("button",{type:"button",onClick:()=>a(!1),className:"text-ink-tertiary hover:text-ink-primary transition-colors",title:"Close",children:e.jsx(h,{size:16})})]}),e.jsx("div",{className:"flex border-b border-white/10 flex-shrink-0",children:[{id:"philosophy",label:"Our Philosophy",Icon:m},{id:"precautions",label:"Precautions",Icon:n}].map(({id:t,label:d,Icon:c})=>e.jsxs("button",{type:"button",onClick:()=>l(t),className:`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold transition-colors border-b-2 ${i===t?"text-ink-primary border-brand bg-white/2":"text-ink-tertiary border-transparent hover:text-ink-secondary"}`,children:[e.jsx(c,{size:12})," ",d]},t))}),e.jsxs("div",{className:"flex-1 overflow-auto px-5 py-4",children:[i==="philosophy"&&e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-start gap-2 mb-3",children:[e.jsx(x,{size:12,className:"text-brand mt-0.5 flex-shrink-0"}),e.jsx("p",{className:"text-[11px] text-ink-secondary leading-relaxed",children:"A projection-mapping planning and photometric simulation tool built for AV planners and field engineers who want clearer pre-installation decisions grounded in optics."})]}),e.jsx("pre",{className:"text-[11px] text-ink-secondary font-sans whitespace-pre-wrap leading-relaxed",children:b})]}),i==="precautions"&&e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-start gap-2 mb-3 p-2.5 rounded bg-brand-muted border border-brand/20",children:[e.jsx(n,{size:12,className:"text-brand mt-0.5 flex-shrink-0"}),e.jsx("p",{className:"text-[11px] text-ink-secondary leading-relaxed",children:"FieldLux is built to support on-site planning — not replace on-site verification. Use it to predict, compare, and communicate likely outcomes before installation. Final approval should always be based on site conditions, calibrated measurements, and professional judgment."})]}),e.jsx("pre",{className:"text-[11px] text-ink-secondary font-sans whitespace-pre-wrap leading-relaxed",children:f})]})]}),e.jsxs("div",{className:"px-5 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between flex-shrink-0",children:[e.jsx("div",{className:"text-[9px] text-ink-tertiary",children:"(c) 2026 FieldLux - BETA V.2"}),e.jsx("button",{type:"button",onClick:()=>a(!1),className:"px-3 py-1.5 rounded text-[11px] text-ink-secondary hover:text-ink-primary hover:bg-white/5 transition-colors",children:"Close"})]})]})}):null};export{j as default};
