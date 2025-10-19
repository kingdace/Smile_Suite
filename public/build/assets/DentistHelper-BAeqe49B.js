const a=r=>{if(!r||!r.name)return"N/A";const e=r.name.trim(),t=e.toLowerCase();return t.startsWith("dr.")||t.startsWith("dr ")?e:r.role==="dentist"?`Dr. ${e}`:e};export{a as g};
