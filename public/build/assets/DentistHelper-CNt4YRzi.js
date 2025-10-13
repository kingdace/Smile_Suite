const a=r=>!r||!r.name?"N/A":r.name.startsWith("Dr.")?r.name:r.role==="dentist"?`Dr. ${r.name}`:r.name;export{a as g};
