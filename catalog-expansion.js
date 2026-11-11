// Converts separate ACNH variation image records to browseable catalog listings.
// IMPORTANT: only a one-axis variant can be encoded here with independently
// documented variant-index metadata. Two-axis pattern codes require validation.
(function(){
 const source=window.WISHPORT_ITEMS || [];
 const expanded=[];
 const hex4=/^[0-9A-F]{4}$/i;
 for(const base of source){
   const pictures=base.images && typeof base.images==='object' ? Object.entries(base.images) : [];
   if(pictures.length<=1){ expanded.push(base); continue; }
   const colors=base.variants || [];
   const patterns=base.patterns || [];
   for(const [key,url] of pictures){
     const pieces=key.split('|');const variation=pieces[0]||'';const pattern=pieces[1]||'';
     const colorIdx=colors.indexOf(variation);const patIdx=patterns.indexOf(pattern);
     const hasTwoAxes=patterns.length>0 && colors.length>0;
     const baseHex=String(base.hex||'').toUpperCase();
     let code=baseHex; let variantOrderSafe=true;let reason='';
     if(hex4.test(baseHex) && !hasTwoAxes && colorIdx>=0){
       code=colorIdx.toString(16).toUpperCase().padStart(8,'0')+'0000'+baseHex;
     }else if(hasTwoAxes){
       // Base variation can safely use the standard item code; different patterns
       // are browse-only until a validated metadata mapping is available.
       variantOrderSafe=colorIdx===0 && patIdx===0;
       if(!variantOrderSafe){reason='This color/pattern needs verified customization metadata before it can be ordered safely.';}
     }
     expanded.push({...base,image:url,variationPreset:variation,patternPreset:pattern,
       variationLabel:[variation,pattern].filter(Boolean).join(' · '),
       hex:code, orderHex:base.orderHex,variantOrderSafe,unsafeReason:reason,
       variantKey:key,variants:[],patterns:[]});
   }
 }
 window.WISHPORT_ITEMS=expanded;
 window.WISHPORT_BASE_ITEM_COUNT=source.length;
})();
