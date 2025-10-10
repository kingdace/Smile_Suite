import{j as t,$ as f,m as u}from"./app-COgprWRc.js";import{B as s}from"./button-C4x32toX.js";import{A as j}from"./arrow-left-DzZXBTf1.js";import{D as w}from"./download-mwibhPi9.js";import{P as N}from"./printer-DOee2xkj.js";import{S as v,P as k}from"./scissors-sHvigQVN.js";import{S as P}from"./stethoscope-CbVKrnQ4.js";import{D}from"./dollar-sign-DezZlbBG.js";import{f as d}from"./format-CYZdy3_o.js";import"./index-kSaTWtOi.js";import"./createLucideIcon-D0PSxBrC.js";function H({clinic:n,payment:e}){const a=r=>new Intl.NumberFormat("en-US",{style:"currency",currency:"PHP"}).format(r),l=r=>d(new Date(r),"MMM dd, yyyy"),c=r=>d(new Date(r),"MMM dd, yyyy 'at' h:mm a"),x=r=>r.replace("_"," ").replace(/\b\w/g,i=>i.toUpperCase()),h=()=>{window.print()},g=()=>{const r=window.open("","_blank"),i=document.querySelector(".receipt-container").innerHTML;r.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Receipt - ${e.reference_number}</title>
                <style>
                    @page { size: 80mm 200mm; margin: 0mm; }
                    * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; }
                    html, body { margin: 0 !important; padding: 0 !important; background: white !important; font-size: 9px !important; line-height: 1.1 !important; font-family: "Courier New", monospace !important; width: 100% !important; height: 100% !important; color: black !important; }
                    .receipt-container { position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; margin: 0 !important; padding: 0 !important; }
                    .receipt-container * { margin-top: 0 !important; padding-top: 0 !important; }
                    .receipt-container > div:first-child { margin-top: 0 !important; padding-top: 0 !important; }
                    .print\\:hidden { display: none !important; }
                    * { visibility: visible !important; opacity: 1 !important; }
                    div, p, h1, h2, h3, h4, h5, h6, span, strong, em { display: block !important; visibility: visible !important; opacity: 1 !important; }
                    .bg-white { background: white !important; }
                    .rounded-lg { border-radius: 0 !important; }
                    .bg-gradient-to-r { background: white !important; }
                    .shadow-lg { box-shadow: none !important; }
                    .border { border: 1px solid #d1d5db !important; }
                    .border-t { border-top: 1px solid #d1d5db !important; }
                    .border-b { border-bottom: 1px solid #d1d5db !important; }
                    .text-center { text-align: center !important; }
                    .text-right { text-align: right !important; }
                    .font-bold { font-weight: bold !important; }
                    .font-semibold { font-weight: 600 !important; }
                    .text-gray-600 { color: #4b5563 !important; }
                    .text-gray-500 { color: #6b7280 !important; }
                    .text-green-600 { color: #059669 !important; }
                    .flex { display: flex !important; }
                    .justify-between { justify-content: space-between !important; }
                    .items-center { align-items: center !important; }
                    .space-y-1 > * + * { margin-top: 0.25rem !important; }
                    .space-y-2 > * + * { margin-top: 0.5rem !important; }
                    .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
                    .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
                    .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
                    .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
                    .pt-1 { padding-top: 0.25rem !important; }
                    .pt-2 { padding-top: 0.5rem !important; }
                    .my-1 { margin-top: 0.25rem !important; margin-bottom: 0.25rem !important; }
                    .my-2 { margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; }
                    .mt-1 { margin-top: 0.25rem !important; }
                    .text-sm { font-size: 8px !important; }
                    .text-xs { font-size: 7px !important; }
                    .text-lg { font-size: 10px !important; }
                    .text-2xl { font-size: 11px !important; }
                    .h-3 { height: 0.5rem !important; }
                    .w-3 { width: 0.5rem !important; }
                    .h-4 { height: 0.75rem !important; }
                    .w-4 { width: 0.75rem !important; }
                    .h-6 { height: 1rem !important; }
                    .w-6 { width: 1rem !important; }
                    .w-12 { width: 3rem !important; }
                    .h-12 { height: 3rem !important; }
                    .gap-2 { gap: 0.5rem !important; }
                    .gap-3 { gap: 0.75rem !important; }
                    .space-y-1 { margin-top: 0.25rem !important; }
                    .space-y-2 { margin-top: 0.5rem !important; }
                    .p-6 { padding: 1rem !important; }
                    .pt-4 { padding-top: 0.75rem !important; }
                    .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
                    .mt-1 { margin-top: 0.25rem !important; }
                </style>
            </head>
            <body>
                ${i}
            </body>
            </html>
        `),r.document.close(),r.print()},b=()=>{u.visit(`/clinic/${n.id}/payments/${e.id}`)},p=(()=>{var i;const r=[];return e.treatment&&(e.treatment.service?r.push({type:"service",name:e.treatment.service.name,description:"Dental Service",amount:parseFloat(e.treatment.service.price),icon:t.jsx(v,{className:"h-3 w-3 text-blue-500"})}):r.push({type:"treatment",name:e.treatment.name,description:"Treatment Cost",amount:parseFloat(e.treatment.cost),icon:t.jsx(P,{className:"h-3 w-3 text-green-500"})})),(i=e.treatment)!=null&&i.inventory_items&&e.treatment.inventory_items.length>0&&e.treatment.inventory_items.forEach((o,C)=>{var m;r.push({type:"inventory",name:((m=o.inventory)==null?void 0:m.name)||"Unknown Item",description:`${o.quantity_used} units × ${a(o.unit_cost)}`,amount:parseFloat(o.total_cost),icon:t.jsx(k,{className:"h-3 w-3 text-orange-500"})})}),r.length===0&&r.push({type:"total",name:"Payment Amount",description:"Total Payment",amount:parseFloat(e.amount),icon:t.jsx(D,{className:"h-3 w-3 text-green-500"})}),r})(),y=p.reduce((r,i)=>r+i.amount,0);return t.jsxs(t.Fragment,{children:[t.jsx(f,{title:`Payment Receipt - ${e.reference_number}`}),t.jsx("div",{className:"print:hidden bg-gray-50 p-6",children:t.jsx("div",{className:"max-w-2xl mx-auto",children:t.jsxs("div",{className:"flex items-center justify-between mb-6",children:[t.jsxs(s,{onClick:b,variant:"outline",className:"gap-2",children:[t.jsx(j,{className:"h-4 w-4"}),"Back to Payment"]}),t.jsxs("div",{className:"flex gap-2",children:[t.jsxs(s,{onClick:g,variant:"outline",className:"gap-2",children:[t.jsx(w,{className:"h-4 w-4"}),"Download PDF"]}),t.jsxs(s,{onClick:h,className:"gap-2",children:[t.jsx(N,{className:"h-4 w-4"}),"Print Receipt"]})]})]})})}),t.jsx("div",{className:"max-w-sm mx-auto p-2 print:max-w-none print:p-0 print:mt-0 print:absolute print:top-0 print:left-0 print:right-0 receipt-container",children:t.jsxs("div",{className:"bg-white print:bg-white overflow-hidden print:shadow-none print:rounded-none print:absolute print:top-0 print:left-0 print:right-0 border border-gray-300 print:border-0",children:[t.jsxs("div",{className:"text-center py-2 print:py-1 border-b border-gray-300 print:border-b-0",children:[t.jsx("h1",{className:"text-lg font-bold print:text-sm",children:n.name||"Dental Clinic"}),t.jsx("p",{className:"text-xs print:text-xs text-gray-600",children:"Payment Receipt"}),t.jsx("div",{className:"border-t border-gray-300 my-2 print:my-1"})]}),t.jsxs("div",{className:"px-4 py-2 print:px-2 print:py-1 space-y-2 print:space-y-1",children:[t.jsxs("div",{className:"text-xs print:text-xs space-y-1 print:space-y-0",children:[t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Receipt #:"}),t.jsx("span",{className:"font-mono font-semibold",children:e.reference_number||"N/A"})]}),t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Date:"}),t.jsx("span",{className:"font-semibold",children:l(e.payment_date)})]}),t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Status:"}),t.jsx("span",{className:"font-semibold",children:e.status.toUpperCase()})]}),t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Method:"}),t.jsx("span",{className:"font-semibold",children:x(e.payment_method)})]})]}),e.patient&&t.jsx("div",{className:"border-t border-gray-300 pt-2 print:pt-1",children:t.jsxs("div",{className:"text-xs print:text-xs space-y-1 print:space-y-0",children:[t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Patient:"}),t.jsxs("span",{className:"font-semibold",children:[e.patient.first_name," ",e.patient.last_name]})]}),e.patient.phone&&t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Phone:"}),t.jsx("span",{className:"font-semibold",children:e.patient.phone})]})]})}),e.treatment&&t.jsx("div",{className:"border-t border-gray-300 pt-2 print:pt-1",children:t.jsxs("div",{className:"text-xs print:text-xs space-y-1 print:space-y-0",children:[t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Treatment:"}),t.jsx("span",{className:"font-semibold",children:e.treatment.name})]}),e.treatment.service&&t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Service:"}),t.jsx("span",{className:"font-semibold",children:e.treatment.service.name})]})]})}),t.jsx("div",{className:"border-t border-gray-300 pt-2 print:pt-1",children:t.jsx("div",{className:"text-xs print:text-xs space-y-1 print:space-y-0",children:p.map((r,i)=>t.jsxs("div",{className:"flex justify-between",children:[t.jsxs("span",{className:"text-gray-600",children:[r.name,":"]}),t.jsx("span",{className:"font-semibold",children:a(r.amount)})]},i))})}),t.jsx("div",{className:"border-t border-gray-300 pt-2 print:pt-1",children:t.jsxs("div",{className:"text-xs print:text-xs space-y-1 print:space-y-0",children:[t.jsxs("div",{className:"flex justify-between",children:[t.jsx("span",{className:"text-gray-600",children:"Subtotal:"}),t.jsx("span",{className:"font-semibold",children:a(y)})]}),0>0,t.jsxs("div",{className:"flex justify-between font-bold border-t border-gray-300 pt-1 print:pt-0",children:[t.jsx("span",{children:"TOTAL:"}),t.jsx("span",{className:"text-lg print:text-sm",children:a(e.amount)})]})]})}),e.notes&&t.jsxs("div",{className:"border-t pt-4",children:[t.jsx("h3",{className:"font-semibold text-gray-900 mb-2",children:"Notes"}),t.jsx("p",{className:"text-sm text-gray-600",children:e.notes})]}),t.jsx("div",{className:"border-t border-gray-300 pt-2 print:pt-1 text-center border-b border-gray-300 print:border-b-0",children:t.jsxs("div",{className:"text-xs print:text-xs text-gray-600 space-y-1 print:space-y-0",children:[t.jsx("p",{className:"font-semibold",children:"Thank you for your payment!"}),t.jsxs("p",{children:["Generated: ",c(new Date)]}),n.phone&&t.jsxs("p",{children:["Contact: ",n.phone]})]})})]})]})}),t.jsx("style",{jsx:!0,children:`
                @media print {
                    @page {
                        size: 80mm 200mm;
                        margin: 0mm;
                    }

                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    html,
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        font-size: 9px !important;
                        line-height: 1.1 !important;
                        font-family: "Courier New", monospace !important;
                        width: 100% !important;
                        height: 100% !important;
                        color: black !important;
                        position: relative !important;
                    }

                    /* Ensure receipt content starts at top */
                    .receipt-container {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 1 !important;
                    }

                    /* Override any parent container margins/padding */
                    .receipt-container * {
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                    }

                    /* Ensure the first element starts at the very top */
                    .receipt-container > div:first-child {
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                    }

                    /* Hide print controls when printing */
                    .print\\:hidden {
                        display: none !important;
                    }

                    /* Ensure all content is visible when printing */
                    * {
                        visibility: visible !important;
                        opacity: 1 !important;
                    }

                    .print\\:hidden {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                    }

                    .print\\:block {
                        display: block !important;
                    }

                    .print\\:visible {
                        visibility: visible !important;
                    }

                    .print\\:opacity-100 {
                        opacity: 1 !important;
                    }

                    /* Ensure main content is visible */
                    .max-w-2xl {
                        max-width: 100% !important;
                    }

                    .mx-auto {
                        margin-left: auto !important;
                        margin-right: auto !important;
                    }

                    /* Force visibility for all content */
                    div,
                    p,
                    h1,
                    h2,
                    h3,
                    h4,
                    h5,
                    h6,
                    span,
                    strong,
                    em {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }

                    /* Specific styles for receipt content */
                    .bg-white {
                        background: white !important;
                        color: black !important;
                        box-shadow: none !important;
                    }

                    .rounded-lg {
                        border-radius: 0 !important;
                    }

                    .bg-gradient-to-r {
                        background: #2563eb !important;
                    }

                    .text-white {
                        color: white !important;
                    }

                    .text-blue-100 {
                        color: #dbeafe !important;
                    }

                    .border-t {
                        border-top: 1px solid #e5e7eb !important;
                    }

                    .border-b {
                        border-bottom: 1px solid #e5e7eb !important;
                    }

                    .border-gray-100 {
                        border-color: #f3f4f6 !important;
                    }

                    .text-gray-500 {
                        color: #6b7280 !important;
                    }

                    .text-gray-600 {
                        color: #4b5563 !important;
                    }

                    .text-gray-900 {
                        color: #111827 !important;
                    }

                    .text-green-600 {
                        color: #059669 !important;
                    }

                    .font-semibold {
                        font-weight: 600 !important;
                    }

                    .font-bold {
                        font-weight: 700 !important;
                    }

                    .font-mono {
                        font-family: monospace !important;
                    }

                    .space-y-3 > * + * {
                        margin-top: 0.375rem !important;
                    }

                    .space-y-2 > * + * {
                        margin-top: 0.2rem !important;
                    }

                    .space-y-6 > * + * {
                        margin-top: 0.5rem !important;
                    }

                    .gap-2 {
                        gap: 0.25rem !important;
                    }

                    .gap-3 {
                        gap: 0.5rem !important;
                    }

                    .gap-4 {
                        gap: 0.75rem !important;
                    }

                    .p-6 {
                        padding: 0.5rem !important;
                    }

                    .pt-4 {
                        padding-top: 0.375rem !important;
                    }

                    .mb-3 {
                        margin-bottom: 0.5rem !important;
                    }

                    .mb-1 {
                        margin-bottom: 0.25rem !important;
                    }

                    .mt-1 {
                        margin-top: 0.25rem !important;
                    }

                    .text-sm {
                        font-size: 8px !important;
                    }

                    .text-xs {
                        font-size: 7px !important;
                    }

                    .text-lg {
                        font-size: 10px !important;
                    }

                    .text-2xl {
                        font-size: 11px !important;
                    }

                    .h-3 {
                        height: 0.5rem !important;
                    }

                    .w-3 {
                        width: 0.5rem !important;
                    }

                    .h-4 {
                        height: 0.75rem !important;
                    }

                    .w-4 {
                        width: 0.75rem !important;
                    }

                    .h-6 {
                        height: 1rem !important;
                    }

                    .w-6 {
                        width: 1rem !important;
                    }

                    .w-12 {
                        width: 2rem !important;
                    }

                    .h-12 {
                        height: 2rem !important;
                    }

                    .flex {
                        display: flex !important;
                    }

                    .grid {
                        display: grid !important;
                    }

                    .grid-cols-2 {
                        grid-template-columns: repeat(
                            2,
                            minmax(0, 1fr)
                        ) !important;
                    }

                    .items-center {
                        align-items: center !important;
                    }

                    .justify-between {
                        justify-content: space-between !important;
                    }

                    .justify-center {
                        justify-content: center !important;
                    }

                    .text-center {
                        text-align: center !important;
                    }

                    .font-medium {
                        font-weight: 500 !important;
                    }

                    .py-2 {
                        padding-top: 0.25rem !important;
                        padding-bottom: 0.25rem !important;
                    }

                    .last\\:border-b-0:last-child {
                        border-bottom: none !important;
                    }

                    .border-t {
                        border-top: 1px solid #e5e7eb !important;
                    }

                    .pt-2 {
                        padding-top: 0.25rem !important;
                    }

                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }

                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                }
            `})]})}export{H as default};
