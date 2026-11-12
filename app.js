(()=>{'use strict';const items=window.WISHPORT_ITEMS || [];const DISALLOWED_CODES=new Set(['35DB','10DB','10DC','10DD']);const isDIY=x=>x&&x.category==='Recipes';const orderCode=x=>isDIY(x)?String(x.orderHex||(/^0000[0-9A-F]{4}000016A2$/i.test(String(x.hex||''))?x.hex:'')):String(x.hex||'');const validItemCode=x=>isDIY(x)?/^0000[0-9A-F]{4}000016A2$/i.test(orderCode(x)): /^(?:[0-9A-F]{4}|[0-9A-F]{16})$/i.test(orderCode(x));const disallowedOrderEntry=x=>!x||x.variantOrderSafe===false||x.recipeStatus==='blocked'||!validItemCode(x)||DISALLOWED_CODES.has(String(x.hex||'').toUpperCase())||['magic bag','communicator','communicator part'].includes(String(x.name||'').toLowerCase());if(!items.length){document.getElementById('summary').textContent='Catalog data could not load. Check that catalog-data.js is uploaded alongside index.html.';return;}const $=id=>document.getElementById(id);const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));const addedStyles=document.createElement('style');addedStyles.textContent='\n.item.wishSelected{border-color:#8a44c1 !important;box-shadow:0 0 0 1px rgba(169,95,223,.55);}\n.item .art.picture{position:relative;overflow:hidden;}\n.wishAddedBadge{position:absolute;left:10px;top:10px;background:#159953;color:white;border-radius:10px;padding:6px 10px;font-size:12px;font-weight:800;letter-spacing:.09em;box-shadow:0 3px 8px #0004;z-index:2;white-space:nowrap}\n.wishQtyOverlay{position:absolute;right:8px;bottom:8px;display:flex;align-items:center;gap:5px;background:rgba(16,13,22,.90);border-radius:11px;padding:5px;color:#d9c2fc;z-index:2}\n.wishQtyOverlay button{border:0;background:#9632e0;color:#fff;border-radius:9px;min-width:35px;min-height:36px;font-size:25px;font-weight:700;line-height:1;cursor:pointer}\n.wishQtyOverlay [data-selected-minus]{background:#d31a85}\n.wishQtyOverlay output{min-width:20px;text-align:center;font-size:18px;font-weight:800}\n.wishQtyOverlay button:disabled{opacity:.4;cursor:not-allowed}\n.item .add[hidden]{display:none !important}\n';document.head.appendChild(addedStyles);let page=0,filtered=[],chosen=null,pocket=[],fav=new Set();let fillMode='default';try{fillMode=localStorage.getItem('wishport_fill')||'default'}catch(e){}let chosenVillager=null;try{const savedVillager=JSON.parse(localStorage.getItem("wishport_villager")||"null");if(savedVillager&&/^[A-Za-z0-9]{3,12}$/.test(savedVillager.id))chosenVillager=savedVillager;}catch(e){}try{const saved=JSON.parse(localStorage.getItem('wishport_pocket')||'[]');if(Array.isArray(saved))pocket=saved.slice(0,40);}catch(e){}try{fav=new Set(JSON.parse(localStorage.getItem('wishport_favorites')||'[]'));}catch(e){}// Drop cached pocket items that are no longer eligible for the order builder.
const eligibleKeys=new Set(items.map(x=>x.name+'|'+x.category));
const presetCodes=new Set((window.WISHPORT_PRESETS||[]).flatMap(p=>p.codes||[]));
const beforePrune=pocket.length;
pocket=pocket.filter(x=>!disallowedOrderEntry(x) && (presetCodes.has(x.hex) || eligibleKeys.has(x.name+'|'+(x.category||'')) || (!x.category && items.some(it=>it.name===x.name)))).slice(0,40);
if(pocket.length!==beforePrune){try{localStorage.setItem('wishport_pocket',JSON.stringify(pocket))}catch(e){}}
const exactMaterials=new Set(['wood','softwood','hardwood','iron nugget','gold nugget','clay','stone','bamboo piece','young spring bamboo','bamboo shoot','tree branch','acorn','pine cone','pearl','vine','glowing moss','star fragment','large star fragment','snowflake','large snowflake','cherry-blossom petal','maple leaf','round mushroom','flat mushroom','skinny mushroom','rare mushroom','elegant mushroom','blue ornament','red ornament','gold ornament','earth egg','leaf egg','sky egg','stone egg','water egg','wood egg','conch','coral','cowrie','giant clam','sand dollar','sea snail','venus comb','summer shell','fish bait','customization kit','rusted part','clump of weeds','green pumpkin','orange pumpkin','white pumpkin','yellow pumpkin','carrot','potato','tomato','sugarcane','wheat','flour','whole-wheat flour','sugar','brown sugar','apple','cherry','peach','pear','orange','coconut','heart crystal','manila clam','aquarius fragment','aries fragment','cancer fragment','capricorn fragment','gemini fragment','leo fragment','libra fragment','pisces fragment','sagittarius fragment','scorpius fragment','taurus fragment','virgo fragment','feather','red feather','blue feather','green feather','purple feather','rainbow feather']);
const isMaterial=x=>x.category==='Other'&&exactMaterials.has(String(x.name).toLowerCase());
const categoryIcon=c=>/housewares|miscellaneous|interior|wall-mounted|ceiling/i.test(c)?'🛋️':/dress|top|bottom|headwear|accessor|shoe|sock|bag|clothing|umbrella/i.test(c)?'👗':/plant|fenc|construction/i.test(c)?'🌳':/recipe/i.test(c)?'📜':/music/i.test(c)?'🎵':/fish|sea creature/i.test(c)?'🐠':/insect/i.test(c)?'🦋':/fossil/i.test(c)?'🦴':/artwork|poster|photo/i.test(c)?'🖼️':/tool|material/i.test(c)?'🧰':/rug|wallpaper|floor/i.test(c)?'🏡':/gyroid/i.test(c)?'🪇':'🎁';
// Full-stack controls are offered only for names with documented pocket stack limits.
// Each selection still uses ONE item ID in the Discord command per inventory slot.
const stackLimits=Object.freeze({
 'wood':30,'softwood':30,'hardwood':30,'iron nugget':30,'gold nugget':30,'clay':30,'stone':30,
 'bamboo piece':30,'young spring bamboo':30,'tree branch':30,'acorn':30,'pine cone':30,
 'pearl':30,'vine':30,'glowing moss':30,'nook miles ticket':10,'fish bait':10,
 'customization kit':50,'star fragment':10,'large star fragment':10,
 'snowflake':10,'large snowflake':10,'cherry-blossom petal':10,'maple leaf':10,
 'rusted part':10,'orange':10,'apple':10,'pear':10,'peach':10,'cherry':10,'coconut':10
});
const stackSize=item=>item&&item.category==='Other'?(stackLimits[String(item.name).toLowerCase()]||0):0;
const stackSelections=new Map();
const stackKey=item=>item.name+'|'+item.category;
const selectedStacks=item=>stackSelections.get(stackKey(item))||1;
function setStackSelection(item,n){stackSelections.set(stackKey(item),Math.max(1,Math.min(40,Math.floor(n))));}
// Keep exact item/variation images. Prefer the updated catalogue mirror for
// 3.0 item URLs; some 3.0 files are absent from the original ACNH CDN.
// This changes images only; order IDs, stack sizes and safety rules are untouched.
const legacyImagePrefix='https://acnhcdn.com/latest/';
const mirrorImagePrefix='https://nh-cdn.catalogue.ac/';
const v3ImageURLs=new Set();
for(const item of items){
 if(!String(item.version||'').startsWith('3.'))continue;
 if(item.image)v3ImageURLs.add(item.image);
 if(item.images)for(const u of Object.values(item.images))if(u)v3ImageURLs.add(u);
}
// New images remain matched to their precise item and color variation.
// The updated mirror is preferred for 3.0; all other images use it only if
// the regular CDN fails. A failed second source shows an honest placeholder.
const imageURL=u=>{
 if(!u)return '';
 return v3ImageURLs.has(u)&&u.startsWith(legacyImagePrefix)
  ?u.replace(legacyImagePrefix,mirrorImagePrefix):u;
};
window.wishportImageError=function(img){
 if(!img||!img.dataset)return;
 const original=img.dataset.original||img.src;
 if(img.dataset.failover!=='yes'){
   img.dataset.failover='yes';
   // Try the alternate host if either is missing this particular asset.
   const primary=img.src;
   const alternate=primary.startsWith(mirrorImagePrefix)
    ? original.startsWith(legacyImagePrefix)?original:primary.replace(mirrorImagePrefix,legacyImagePrefix)
    : original.startsWith(legacyImagePrefix)?original.replace(legacyImagePrefix,mirrorImagePrefix):'';
   if(alternate&&alternate!==primary){img.src=alternate;return;}
 }
 const missing=document.createElement('span');
 missing.className='noPhotoLabel';missing.textContent='Image unavailable';
 img.replaceWith(missing);
};
// WishPort explorer v4: filters are intentional suggestions, not authoritative gameplay classifications.
const filterCatalog=window.WISHPORT_FILTER_METADATA||{base:{},variations:{},options:{}};
const filterOpts=filterCatalog.options||{};
const filterKey=x=>String(x.name||'').toLowerCase()+'|'+String(x.category||'').toLowerCase();
const filterData=x=>{const b=filterCatalog.base?.[filterKey(x)]||{};const v=filterCatalog.variations?.[filterKey(x)+'|'+String(x.variationPreset||'').toLowerCase()]||{};return {g:b.g||[],t:v.t||b.t||[],s:v.s||b.s||[],i:v.i||b.i||[],c:x.variationPreset?(v.c||b.c||[]):(b.c||[])}};
const hasFilter=(arr,v)=>!v||(arr||[]).some(s=>String(s).toLowerCase()===String(v).toLowerCase());
const categoryFor=x=>filterData(x).g[0]||({'Housewares':'Housewares','Miscellaneous':'Miscellaneous','Wallpaper':'Wallpaper','Rugs':'Rugs','Recipes':'Recipes','Plants':'Plants','Gyroids':'Gyroids','Fencing':'Fencing','Artwork':'Artwork','Sea Creatures':'Sea Creatures','Fossils':'Fossils','Interior Structures':'Interior Structures','Other':'Other','Insects':'Bugs','Ceiling Decor':'Ceiling','Accessories':'Clothing - Accessories','Bags':'Clothing - Bags','Bottoms':'Clothing - Bottoms','Dress-Up':'Clothing - Dress-Up','Headwear':'Clothing - Headwear','Shoes':'Clothing - Shoes','Socks':'Clothing - Socks','Tops':'Clothing - Tops','Umbrellas':'Clothing - Umbrella','Clothing Other':'Clothing - Wet Suits','Fish':'Fishing','Floors':'Flooring','Music':'K.K. Music','Photos':'Villager Photos','Posters':'Villager Posters','ToolsGoods':'Tools','Wall-mounted':'Wall-Mounted'}[x.category]||'Other');
for(const [id,key,all] of [['themeSelect','theme','All Themes'],['seriesSelect','series','All Series'],['interactionSelect','interaction','All Interactions'],['colorSelect','color','All Colours']]){
 $(id).innerHTML='<option value="">'+all+'</option>'+(filterOpts[key]||[]).map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
}
const extraFilterIds=['themeSelect','seriesSelect','interactionSelect','colorSelect'];let pageSize=50;
const matchesNamed=(x,name,groups)=>!name||groups.find(y=>y[0]===name)?.[1].test(x.name);
const cats=filterOpts.category||[];
$('category').innerHTML='<option value="">All Categories</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
$('pills').innerHTML=['All items','🪵 Materials','📜 DIY Recipes','3.0 items','Furniture','Clothing','Favorites'].map((x,i)=>`<button class="pill ${i===0?'active':''}" data-pill="${i}">${x}</button>`).join('');let quick='all';
$('pills').onclick=e=>{let b=e.target.closest('[data-pill]');if(!b)return;quick=['all','materials','diy','3','furniture','clothing','favorites'][+b.dataset.pill];$('pills').querySelectorAll('.pill').forEach(x=>x.classList.toggle('active',x===b));$('category').value='';$('version').value='';page=0;apply();};
function apply(){const q=$('search').value.trim().toLowerCase(),cat=$('category').value,v=$('version').value;filtered=items.filter(x=>{if(q&&!(x.name.toLowerCase().includes(q)||x.category.toLowerCase().includes(q)))return false;if(cat&&cat.startsWith('group:')){const group=cat.slice(6);if(group==='Materials'&&!isMaterial(x))return false;if(group==='DIY Recipes'&&x.category!=='Recipes')return false;if(group==='Furniture'&&!['Housewares','Miscellaneous','Wall-mounted','Ceiling Decor'].includes(x.category))return false;if(group==='Clothing'&&!['Tops','Bottoms','Dress-Up','Headwear','Shoes','Socks','Accessories','Bags','Clothing Other'].includes(x.category))return false;if(group==='3.0 items'&&x.version!=='3.0.0')return false;if(group==='Favorites'&&!fav.has(x.name+'|'+x.category))return false;}else if(cat&&categoryFor(x)!==cat)return false;if(v&&x.version!==v)return false;if(quick==='materials'&&!isMaterial(x))return false;if(quick==='3'&&x.version!=='3.0.0')return false;if(quick==='furniture'&&!['Housewares','Miscellaneous','Wall-mounted','Ceiling Decor'].includes(x.category))return false;if(quick==='clothing'&&!['Tops','Bottoms','Dress-Up','Headwear','Shoes','Socks','Accessories','Bags','Clothing Other'].includes(x.category))return false;if(quick==='diy'&&x.category!=='Recipes')return false;if(quick==='favorites'&&!fav.has(x.name+'|'+x.category))return false;if(!hasFilter(filterData(x).t,$('themeSelect').value))return false;if(!hasFilter(filterData(x).s,$('seriesSelect').value))return false;if(!hasFilter(filterData(x).i,$('interactionSelect').value))return false;if(!hasFilter(filterData(x).c,$('colorSelect').value))return false;return true});if($('hideVariants')?.checked){const seen=new Set();filtered=filtered.filter(x=>{const key=x.name+'|'+x.category;if(seen.has(key))return false;seen.add(key);return true;});}filtered.sort((a,b)=>$('sort').value==='za'?b.name.localeCompare(a.name):a.name.localeCompare(b.name)||String(a.variationLabel||'').localeCompare(String(b.variationLabel||'')));render()}
// Counts exactly the catalog listing selected, including its stored color/pattern code.
function selectedCardMatch(entry,item){
 if(!entry||entry.name!==item.name)return false;
 if(entry.category&&entry.category!==item.category)return false;
 const selectedCode=String(entry.hex||'').toUpperCase();
 const listingCode=String(orderCode(item)||'').toUpperCase();
 if(selectedCode!==listingCode)return false;
 if(item.variationPreset&&entry.variation&&item.variationPreset!==entry.variation)return false;
 if(item.patternPreset&&entry.pattern&&item.patternPreset!==entry.pattern)return false;
 return true;
}
function selectedCardCount(item){return pocket.reduce((n,entry)=>n+(selectedCardMatch(entry,item)?1:0),0)}
function refreshPocketCardUI(){render();$('qty').textContent=pocket.length}
function render(){const limit=pageSize,max=Math.max(1,Math.ceil(filtered.length/limit));page=Math.min(page,max-1);$('summary').textContent=filtered.length.toLocaleString()+' matching listings · '+items.length.toLocaleString()+' variation listings ('+(window.WISHPORT_BASE_ITEM_COUNT||items.length).toLocaleString()+' item names)';$('currentPage').textContent='Page '+(page+1)+' of '+max;const slice=filtered.slice(page*limit,(page+1)*limit);$('grid').innerHTML=slice.length?slice.map((x,i)=>{let key=x.name+'|'+x.category,on=fav.has(key),count=selectedCardCount(x),selected=count>0;return `<article class="item ${selected?'wishSelected':''}"><div class="art picture" role="img" aria-label="${esc(x.name)} item picture">${x.image?`<img src="${esc(imageURL(x.image))}" data-original="${esc(x.image)}" alt="${esc(x.name)}" loading="lazy" decoding="async" onerror="window.wishportImageError(this)"/>`: `<span class="noPhotoLabel">Image unavailable</span>`}${selected?`<span class="wishAddedBadge">✓ ADDED</span><div class="wishQtyOverlay"><button type="button" data-selected-minus="${i}" aria-label="Remove one ${esc(x.name)}">−</button><output aria-label="Selected quantity">${count}</output><button type="button" data-selected-plus="${i}" aria-label="Add another ${esc(x.name)}" ${pocket.length>=40?'disabled':''}>+</button></div>`:''}</div><h3>${esc(x.name)}</h3>${x.variationLabel?`<div class="variationCaption">${esc(x.variationLabel)}</div>`:''}<div class="meta">${esc(x.category)}${x.version?.startsWith('3.')?' · <span class="version">✨ 3.0</span>':''}${$('showVariants').checked&&x.variants?.length?' · '+x.variants.slice(0,3).map(esc).join(', ')+(x.variants.length>3?'…':''):''}${isDIY(x)?(x.recipeStatus==='blocked'?' · ⛔ Unavailable':' · 📜 DIY card (verify with bot)'):''}</div>${stackSize(x)&&!selected?`<div class="stackPicker"><span class="stackHint">Full stacks · ${stackSize(x)} per slot</span><div class="stackStepper"><button type="button" data-stack-minus="${i}" aria-label="Fewer stacks of ${esc(x.name)}" ${selectedStacks(x)===1?'disabled':''}>−</button><output aria-label="Number of stacks">${selectedStacks(x)}</output><button type="button" data-stack-plus="${i}" aria-label="More stacks of ${esc(x.name)}" ${selectedStacks(x)>=40?'disabled':''}>+</button><small>${selectedStacks(x)*stackSize(x)} pieces · ${selectedStacks(x)} slots</small></div></div>`:''}<div class="bottom"><button class="add" data-add="${i}" ${selected?'hidden':''} ${x.recipeStatus==='blocked'||x.variantOrderSafe===false?'disabled title="This listing requires verified metadata before ordering"':''}>${x.recipeStatus==='blocked'||x.variantOrderSafe===false?'Preview only':'+ Add item'}</button>${!x.variationLabel&&(x.variants?.length||x.patterns?.length)?`<button class="options" data-options="${i}" aria-label="Choose variation for ${esc(x.name)}">Options</button>`:""}<button class="fav ${on?'on':''}" data-fav="${i}" aria-label="Favorite ${esc(x.name)}">${on?'♥':'♡'}</button></div></article>`}).join(''):'<div class="empty">No matching items. Try a different search.</div>';$('pages').innerHTML=filtered.length>pageSize?`<button class="secondary" id="first" ${page===0?'disabled':''} aria-label="First page">«</button><button class="secondary" id="prev" ${page===0?'disabled':''} aria-label="Previous page">‹</button><span class="status">${page+1} / ${max}</span><button class="secondary" id="next" ${page+1>=max?'disabled':''} aria-label="Next page">›</button><button class="secondary" id="last" ${page+1>=max?'disabled':''} aria-label="Last page">»</button>`:'';$('pagesTop').innerHTML=$('pages').innerHTML.replace(/id="(first|prev|next|last)"/g,(_,id)=>'id="'+id+'Top"');
const bindTop=(id,toPage)=>{const b=$(id+'Top');if(b)b.onclick=()=>{page=toPage();render();$('pagesTop').scrollIntoView({block:'start'})}};
bindTop('first',()=>0);bindTop('prev',()=>Math.max(0,page-1));bindTop('next',()=>Math.min(max-1,page+1));bindTop('last',()=>max-1);
const first=$('first'),last=$('last');if(first)first.onclick=()=>{page=0;render();$('search').scrollIntoView({block:'start'})};if(last)last.onclick=()=>{page=Math.max(0,Math.ceil(filtered.length/pageSize)-1);render();$('search').scrollIntoView({block:'start'})};$('jumpPage').max=max;$('jumpPage').value=page+1;const prev=$('prev'),next=$('next');if(prev)prev.onclick=()=>{page--;render();$('search').scrollIntoView({block:'start'})};if(next)next.onclick=()=>{page++;render();$('search').scrollIntoView({block:'start'})}}
$('grid').onclick=e=>{const selectedButton=e.target.closest('[data-selected-plus],[data-selected-minus]');
 if(selectedButton){
  const ix=Number(selectedButton.dataset.selectedPlus??selectedButton.dataset.selectedMinus);
  const item=filtered[page*pageSize+ix];if(!item)return;
  if(selectedButton.hasAttribute('data-selected-minus')){
   const where=pocket.findIndex(entry=>selectedCardMatch(entry,item));
   if(where!==-1){pocket.splice(where,1);savePocket();refreshPocketCardUI()}
  }else{
   if(pocket.length>=40){alert('Your pocket is full (40/40). Remove an item before adding another.');return;}
   addDirectOne(item);savePocket();refreshPocketCardUI();
  }
  return;
 }
 const inc=e.target.closest('[data-stack-plus],[data-stack-minus]');if(inc){const idx=Number(inc.dataset.stackPlus??inc.dataset.stackMinus);const item=filtered[page*pageSize+idx];if(!item)return;setStackSelection(item,selectedStacks(item)+(inc.hasAttribute('data-stack-plus')?1:-1));render();return;}let a=e.target.closest('[data-add]'),f=e.target.closest('[data-fav]');if(a){const item=filtered[page*pageSize+Number(a.dataset.add)];addDirect(item,a);return;}let opt=e.target.closest('[data-options]');if(opt){chosen=filtered[page*pageSize+Number(opt.dataset.options)];showChoose();return;}if(f){let it=filtered[page*pageSize+Number(f.dataset.fav)],k=it.name+'|'+it.category;fav.has(k)?fav.delete(k):fav.add(k);try{localStorage.setItem('wishport_favorites',JSON.stringify([...fav]))}catch(e){}if(quick==='favorites')apply();else render();}};

function addDirectOne(item){
 if(disallowedOrderEntry(item)||pocket.length>=40)return false;
 pocket.push({name:item.name,category:item.category,variation:item.variationPreset||'',pattern:item.patternPreset||'',hex:orderCode(item),orderType:item.orderType,recipeId:item.recipeId,stackSize:stackSize(item)||undefined});
 return true;
}
function addDirect(item,button){if(disallowedOrderEntry(item)){alert(item.unsafeReason||"This item is not available for safe orders. Choose another item.");return;}
 if(isDIY(item)){let seen=false;try{seen=sessionStorage.getItem('wishport_diy_notice')==='1'}catch(e){}if(!seen){alert('DIY recipe cards use special metadata codes. Some recipes cannot be carried off an island. Test a small DIY order first and keep the bot safety checks enabled.');try{sessionStorage.setItem('wishport_diy_notice','1')}catch(e){}}}
 const qty=stackSize(item)?selectedStacks(item):1;
 const available=40-pocket.length;
 if(qty>available){alert(`You selected ${qty} full stacks, but only ${available} pocket slot${available===1?' is':'s are'} available. Reduce the stack amount or remove another item.`);return;}
 if(!validItemCode(item)){
   alert('No 4-character item code is available for this item yet. It cannot be added to a working $order.');return;
 }
 for(let k=0;k<qty;k++)pocket.push({name:item.name,category:item.category,variation:item.variationPreset||'',pattern:item.patternPreset||'',hex:orderCode(item),orderType:item.orderType,recipeId:item.recipeId,stackSize:stackSize(item)||undefined});
 savePocket();$('qty').textContent=pocket.length;
 refreshPocketCardUI();
}

function showChoose(){if(disallowedOrderEntry(chosen)){alert("This item is not available for safe orders.");return;}if(pocket.length>=40){alert('Your pocket is full!');return} $('modalTitle').textContent=chosen.name;let variants=chosen.variants||[],patterns=chosen.patterns||[];$('variantContent').innerHTML=`${chosen.image?`<div class="selectionPicture"><img id="selectedItemImage" src="${esc(imageURL(chosen.image))}" data-original="${esc(chosen.image)}" onerror="window.wishportImageError(this)" alt="${esc(chosen.name)}"></div>`:''}<p class="hint">${esc(chosen.category)}${chosen.version?' · Version '+esc(chosen.version):''}</p>${variants.length?`<label class="field">Color / variation<select id="itemVariant"><option value="">Any / default</option>${variants.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label>`:''}${patterns.length?`<label class="field">Pattern<select id="itemPattern"><option value="">Any / default</option>${patterns.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label>`:''}${stackSize(chosen)?`<label class="field">Number of full stacks (${stackSize(chosen)} pieces per slot)<input id="modalStackCount" type="number" min="1" max="40" value="${selectedStacks(chosen)}" inputmode="numeric" /></label>`:''}<p class="hint">WishPort uses hexadecimal item IDs. Exact color or pattern may require an NHI file.</p><button class="cta" style="width:100%;margin-top:8px" id="confirmAdd">Add to pocket</button>`;const changePreview=()=>{const v=$('itemVariant')?.value||'',p=$('itemPattern')?.value||'';const u=chosen.images?.[v+'|'+p]||chosen.images?.[v+'|']||chosen.image;const im=$('selectedItemImage');if(im&&u){im.dataset.failover='';im.dataset.original=u;im.src=imageURL(u)}};if($('itemVariant'))$('itemVariant').onchange=changePreview;if($('itemPattern'))$('itemPattern').onchange=changePreview;
$('confirmAdd').onclick=()=>{const qty=stackSize(chosen)?Number($('modalStackCount')?.value||1):1;if(!Number.isInteger(qty)||qty<1||qty>40){alert('Choose between 1 and 40 full stacks.');return;}if(pocket.length+qty>40){alert('That exceeds 40 pocket slots. You have '+(40-pocket.length)+' left.');return;}const variation=$('itemVariant')?.value||'',pattern=$('itemPattern')?.value||'';const matchedListing=(variation||pattern)?items.find(it=>it.name===chosen.name&&it.category===chosen.category&&(!variation||it.variationPreset===variation)&&(!pattern||it.patternPreset===pattern)&&it.variantOrderSafe!==false&&validItemCode(it)):null;
 const exactVariantCode=chosen.variantHex?.[variation+'|'+pattern]||chosen.variantHex?.[variation+'|']||matchedListing?.hex||'';
 if((variation||pattern)&&!exactVariantCode){alert('This color or pattern has no verified order code in the catalog. Please select its separate item listing or choose another variation. WishPort will not substitute the default color.');return;}
 const hex=isDIY(chosen)?orderCode(chosen):((variation||pattern)?exactVariantCode:chosen.hex||'');if(!validItemCode({...chosen,hex,orderHex:hex})){alert('This item does not have a valid order code.');return;}for(let k=0;k<qty;k++)pocket.push({name:chosen.name,category:chosen.category,variation,pattern,hex,orderType:chosen.orderType,recipeId:chosen.recipeId,stackSize:stackSize(chosen)||undefined});$('qty').textContent=pocket.length;if($('explorerCartCount'))$('explorerCartCount').textContent=pocket.length+' / 40';savePocket();hide('modal');};show('modal')}
function show(id){if(id==='cartModal'){const cart=$('cartModal');cart.hidden=false;document.querySelector('main').hidden=true;document.querySelector('.dock').hidden=true;window.scrollTo(0,0);return;}$(id).classList.add('show')}
function hide(id){if(id==='cartModal'){const cart=$('cartModal');cart.hidden=true;document.querySelector('main').hidden=false;document.querySelector('.dock').hidden=false;return;}$(id).classList.remove('show')};document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>hide(b.dataset.close));['modal','cartModal'].forEach(id=>$(id).addEventListener('click',e=>{if(e.target===$(id))hide(id)}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){hide('modal');hide('cartModal')}});
const savePocket=()=>{try{localStorage.setItem('wishport_pocket',JSON.stringify(pocket))}catch(e){}};
const lookupItem=x=>items.find(it=>it.name===x.name&&(it.category===x.category||!x.category)&&(!x.variation||it.variationPreset===x.variation)&&(!x.pattern||it.patternPreset===x.pattern))||items.find(it=>it.name===x.name&&(it.category===x.category||!x.category));
const codeFor=x=>{if(x.hex && /^(?:[0-9A-F]{4}|[0-9A-F]{16}|0000[0-9A-F]{4}000016A2)$/i.test(x.hex))return x.hex;const entry=lookupItem(x);const v=x.variation||'',p=x.pattern||'';return isDIY(entry||x)?(entry?.orderHex||x.hex||''):(entry?.variantHex?.[v+'|'+p]||entry?.variantHex?.[v+'|']||x.hex||entry?.hex||'');};
// Diagnostic only: never weakens the existing disallowedOrderEntry/makeCodes safety checks.
const issueForItem=x=>{
 if(!x)return 'Missing item information';
 if(x.variantOrderSafe===false)return 'Preview-only variation (unverified order metadata)';
 if(x.recipeStatus==='blocked')return 'Blocked DIY recipe';
 if(!validItemCode(x))return 'Missing or invalid item/recipe code';
 if(DISALLOWED_CODES.has(String(x.hex||'').toUpperCase()))return 'Blocked item code';
 if(['magic bag','communicator','communicator part'].includes(String(x.name||'').toLowerCase()))return 'Non-transferable item';
 const resolved=String(codeFor(x)||'');
 if(!(/^[0-9A-F]{4}$/i.test(resolved)||/^[0-9A-F]{16}$/i.test(resolved)))return 'Generated code has an invalid format';
 if(DISALLOWED_CODES.has(resolved.toUpperCase()))return 'Generated code is blocked';
 return '';
};
const failedOrderItems=entries=>(entries||[]).map((x,i)=>({x,slot:i+1,reason:issueForItem(x)})).filter(x=>x.reason);
const issueSummary=(entries,limit=5)=>{
 const issues=failedOrderItems(entries);
 if(!issues.length)return 'An order code could not be generated. Check your selected items and filler options.';
 return issues.slice(0,limit).map(o=>'Slot '+o.slot+': '+(o.x?.name||'Unknown item')+' ['+String(o.x?.hex||'no code')+'] — '+o.reason).join('; ')+(issues.length>limit?'; plus '+(issues.length-limit)+' more.':'');
};
const makeCodes=()=>{if(pocket.some(x=>disallowedOrderEntry(x)))return null;const codes=pocket.map(codeFor);if(codes.some(c=>!(/^[0-9A-F]{4}$/i.test(c)||/^(?:[0-9A-F]{16}|0000[0-9A-F]{4}000016A2)$/i.test(c))||DISALLOWED_CODES.has(String(c).toUpperCase())))return null;
 const remain=40-codes.length;
 if(fillMode==='nmt')codes.push(...Array(remain).fill('0EF8'));
 if(fillMode==='crowns')codes.push(...Array(remain).fill('14BB'));
 if(fillMode==='bells')codes.push(...Array(remain).fill('08A4'));
 if(!codes.length&&chosenVillager)return null; // Choose at least one item before villager orders
 return codes;
};
const cmd=()=>{const codes=makeCodes();if(!codes)return '';return codes.length?'$order '+codes.join(' ')+(chosenVillager?' villager:'+chosenVillager.id:''):'';};
$('remainingOptions').onchange=e=>{if(!e.target.matches('input[name="fill"]'))return;fillMode=e.target.value;try{localStorage.setItem('wishport_fill',fillMode)}catch(e){}cart();};
function cart(){ $('cartVillager').innerHTML=chosenVillager?`<div class="villagerCartRow">🏡 <strong>${esc(chosenVillager.name)}</strong> <span>villager:${esc(chosenVillager.id)}</span><button class="remove" id="removeVillager">Remove</button></div>`:'<p class="hint">No villager selected. Use the Villagers tab to add one.</p>';const rv=$('removeVillager');if(rv)rv.onclick=()=>{chosenVillager=null;saveVillager();cart();renderSelectedVillager();renderVillagers()}; $('slots').innerHTML=Array.from({length:40},(_,i)=>{const fillIcon={nmt:'🎫',crowns:'👑',bells:'💰'}[fillMode];return `<div class="slot ${pocket[i]?'filled':fillIcon?'filled filler':''}" title="${pocket[i]?esc(pocket[i].name):fillIcon?'Auto-filled slot '+(i+1):'Empty slot '+(i+1)}">${pocket[i]?'🎁':fillIcon||i+1}</div>`}).join('');$('cartCount').textContent='Items '+pocket.length+'/40';$('cartProgressBar').style.width=(pocket.length/40*100)+'%';$('villagerCount').textContent='Villager requested '+(chosenVillager?1:0)+'/1';
 const groups=[];const groupMap=new Map();pocket.forEach(x=>{const code=codeFor(x);const key=[x.name,x.category||'',x.variation||'',x.pattern||'',code].join('|');let g=groupMap.get(key);if(!g){g={x,count:0,key};groups.push(g);groupMap.set(key,g)}g.count++});
 $('cartList').innerHTML=groups.length?groups.map((g,i)=>{const x=g.x;const source=lookupItem(x);const img=source?.images?.[(x.variation||'')+'|'+(x.pattern||'')]||source?.images?.[(x.variation||'')+'|']||source?.image;const picture=img?`<img loading="lazy" alt="${esc(x.name)}" src="${esc(imageURL(img))}" onerror="window.wishportImageError(this)">`:'<span>Image unavailable</span>';return `<article class="requestedCard"><div class="requestedTop"><div class="requestedPicture">${picture}</div><div class="requestedDetails"><h4>${esc(x.name)}</h4><p>#${esc(codeFor(x))}</p>${x.variation||x.pattern?`<small>${esc([x.variation,x.pattern].filter(Boolean).join(' · '))}</small>`:''}${x.stackSize?`<small>${x.stackSize} per stack · ${g.count*x.stackSize} total</small>`:''}</div></div><div class="requestedControls"><div class="quantityStepper"><button type="button" data-cart-minus="${i}" aria-label="Decrease ${esc(x.name)}">−</button><output aria-label="Quantity">${g.count}</output><button type="button" data-cart-plus="${i}" aria-label="Increase ${esc(x.name)}" ${pocket.length>=40?'disabled':''}>+</button></div><button type="button" class="remove" data-cart-trash="${i}" aria-label="Remove ${esc(x.name)}">🗑️ Remove</button></div></article>`}).join(''):'<p class="hint">No items selected yet. Tap Add more items to start your order.</p>';window.wishportCartGroups=groups;$('remainingHeading').textContent=pocket.length===40?'Your pocket is full (40 / 40)':`You have room for ${40-pocket.length} more items`;const fillers={nmt:'🎫',crowns:'👑',bells:'💰'};const fillLabel={nmt:'Nook Miles Tickets',crowns:'Royal Crowns',bells:'99,000 Bells'};const remain=40-pocket.length;$('fillPreview').textContent=remain>0&&fillers[fillMode]?`Your ${pocket.length} selected item${pocket.length===1?'':'s'} stay first. The remaining ${remain} slot${remain===1?'':'s'} will be filled with ${fillLabel[fillMode]}. Total: 40 items.`:fillMode==='default'?`Only your ${pocket.length} selected item${pocket.length===1?'':'s'} will appear in the command. The bot will use its default handling for the other ${remain} slots.`:'All 40 slots are already occupied by your selected items; no filler will be added.';document.querySelectorAll('input[name=fill]').forEach(r=>r.checked=r.value===fillMode);$('command').value=pocket.length||chosenVillager?cmd():'';$('copyMsg').textContent=!cmd()&&(pocket.length||chosenVillager)?'Cannot copy: '+issueSummary(pocket):'Ready to copy your hexadecimal $order command.';$('qty').textContent=pocket.length};$('openCart').onclick=()=>{cart();show('cartModal')};$('cartList').onclick=e=>{const plus=e.target.closest('[data-cart-plus]'),minus=e.target.closest('[data-cart-minus]'),trash=e.target.closest('[data-cart-trash]');const el=plus||minus||trash;if(!el)return;const ix=Number(el.dataset.cartPlus??el.dataset.cartMinus??el.dataset.cartTrash),group=window.wishportCartGroups?.[ix];if(!group)return;const match=x=>[x.name,x.category||'',x.variation||'',x.pattern||'',codeFor(x)].join('|')===group.key;const pos=pocket.findIndex(match);if(trash)pocket=pocket.filter(x=>!match(x));else if(minus&&pos>=0)pocket.splice(pos,1);else if(plus&&pocket.length<40)pocket.push({...group.x});savePocket();cart();};
 $('backShopping').onclick=()=>{hide('cartModal');render()};$('addMoreCart').onclick=()=>{hide('cartModal');activateTab('database');document.querySelector('.browseTabs').scrollIntoView({block:'start'})};$('addVillagerCart').onclick=()=>{hide('cartModal');activateTab('villagers');document.querySelector('.browseTabs').scrollIntoView({block:'start'})};// Order tools: clear entire order, named saved orders, and direct copy with diagnostics.
function showCopySuccess(){let n=document.getElementById('wishportCopySuccess');if(!n){n=document.createElement('div');n.id='wishportCopySuccess';n.setAttribute('role','status');n.setAttribute('aria-live','polite');n.style.cssText='position:fixed;z-index:999999;top:50%;left:50%;transform:translate(-50%,-50%);max-width:80vw;width:300px;padding:30px 22px;text-align:center;background:#fff;color:#2b2138;border:2px solid #d4b6ef;border-radius:20px;box-shadow:0 10px 60px #0009;font-weight:900;font-size:20px;line-height:1.5;letter-spacing:.10em;display:none';n.textContent='ORDER COMMAND COPIED!';document.body.appendChild(n)}n.style.display='block';clearTimeout(window.wishportCopyTimer);window.wishportCopyTimer=setTimeout(()=>n.style.display='none',2800)}
const SAVE_KEY='wishport_named_orders_v1';
const readSavedOrders=()=>{try{const o=JSON.parse(localStorage.getItem(SAVE_KEY)||'[]');return Array.isArray(o)?o.slice(0,20):[]}catch(e){return []}};
let namedOrders=readSavedOrders();
const persistNamed=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(namedOrders))}catch(e){$('saveOrderNotice').textContent='Could not save. Browser storage may be full or disabled.';return false}return true};
const renderSaved=()=>{const sel=$('savedOrderList'),current=sel.value;sel.innerHTML='<option value="">Choose a saved order…</option>'+namedOrders.map((o,i)=>'<option value="'+i+'">'+esc(o.name)+' ('+o.pocket.length+'/40)</option>').join('');if(current&&Number(current)<namedOrders.length)sel.value=current};
$('saveNamedOrder').onclick=()=>{const name=$('saveOrderName').value.trim();if(!name){$('saveOrderNotice').textContent='Enter a name for your order.';return}if(!pocket.length){$('saveOrderNotice').textContent='Add at least one item before saving.';return}const idx=namedOrders.findIndex(o=>o.name.toLowerCase()===name.toLowerCase());if(idx!==-1&&!confirm('Replace your saved order named "'+name+'"?'))return;const record={name,pocket:JSON.parse(JSON.stringify(pocket)),fill:fillMode,villager:chosenVillager?{...chosenVillager}:null};if(idx!==-1)namedOrders.splice(idx,1);namedOrders.unshift(record);namedOrders=namedOrders.slice(0,20);if(persistNamed())$('saveOrderNotice').textContent='Saved "'+name+'" on this device.';renderSaved()};
$('restoreSavedOrder').onclick=()=>{const n=$('savedOrderList').value;if(n==='')return;const o=namedOrders[Number(n)];if(!o)return;if(pocket.length&&!confirm('Replace your current order with "'+o.name+'"?'))return;const safe=o.pocket.filter(x=>!disallowedOrderEntry(x)).slice(0,40);if(safe.length!==o.pocket.length){$('saveOrderNotice').textContent='Some saved items are no longer orderable and were not loaded.'}else $('saveOrderNotice').textContent='Loaded "'+o.name+'".';pocket=safe;fillMode=['default','nmt','crowns','bells'].includes(o.fill)?o.fill:'default';chosenVillager=o.villager&&/^[A-Za-z0-9]{3,12}$/.test(o.villager.id)?o.villager:null;savePocket();saveVillager();try{localStorage.setItem('wishport_fill',fillMode)}catch(e){}cart();renderSelectedVillager();renderVillagers()};
$('deleteSavedOrder').onclick=()=>{const n=$('savedOrderList').value;if(n==='')return;const o=namedOrders[Number(n)];if(!o||!confirm('Delete saved order "'+o.name+'" from this device?'))return;namedOrders.splice(Number(n),1);persistNamed();renderSaved();$('saveOrderNotice').textContent='Saved order deleted.'};
renderSaved();
$('clear').onclick=()=>{if(!pocket.length&&!chosenVillager)return;if(!confirm('Clear all '+pocket.length+' selected item slots AND the requested villager? Saved named orders will not be deleted.'))return;pocket=[];chosenVillager=null;fillMode='default';savePocket();saveVillager();try{localStorage.setItem('wishport_fill','default')}catch(e){}cart();renderSelectedVillager();renderVillagers();$('copyMsg').textContent='Current order cleared. Your named saved orders are still available.'};
function openOrderReview(){
 const codes=makeCodes();const txt=cmd();const warnings=[];
 if(!pocket.length)warnings.push('Select at least one item. Villager-only orders are not supported by this builder.');
 if(pocket.length>40)warnings.push('The order exceeds the 40-slot limit.');
 if(!codes||!txt)warnings.push('An item code failed validation. Remove unsupported items before copying.');
 if(pocket.some(x=>disallowedOrderEntry(x)))warnings.push('Your order includes an item blocked by the local safety filter.');
 const remaining=40-pocket.length;const filler=fillMode==='nmt'?'Nook Miles Tickets':fillMode==='crowns'?'Royal Crowns':fillMode==='bells'?'99,000 Bells':'None (bot default)';
 $('reviewStats').innerHTML='<div><span>Selected slots</span><strong>'+pocket.length+'/40</strong></div><div><span>Extra filler slots</span><strong>'+(fillMode==='default'?0:remaining)+'</strong></div><div><span>Filler choice</span><strong>'+esc(filler)+'</strong></div><div><span>Total codes</span><strong>'+(codes?codes.length:0)+'</strong></div><div><span>Villager</span><strong>'+esc(chosenVillager?.name||'None')+'</strong></div>';
 const counts=new Map();pocket.forEach(x=>{const key=[x.name,x.variation||'',x.pattern||'',codeFor(x)].join('||');if(!counts.has(key))counts.set(key,{x,count:0});counts.get(key).count++});
 $('reviewItems').innerHTML=[...counts.values()].map(({x,count})=>'<div><strong>'+esc(x.name)+'</strong><span>'+count+' × '+esc(codeFor(x))+(x.variation?' · '+esc(x.variation):'')+(x.pattern?' · '+esc(x.pattern):'')+(x.stackSize?' · '+(count*x.stackSize)+' units total':'')+'</span></div>').join('');
 $('reviewWarnings').innerHTML=warnings.length?warnings.map(x=>'<p>⚠️ '+esc(x)+'</p>').join(''):'<p>✓ Order format check passed. Review names, variations, and quantities before copying.</p>';
 $('confirmCopy').disabled=!!warnings.length;$('reviewCopyMsg').textContent='';$('reviewModal').hidden=false;document.body.style.overflow='hidden';
}
// Large, centered confirmation after a successful clipboard write.
let wishportCopyNoticeTimer;
function showOrderCopiedNotice(){
 let notice=document.getElementById('wishportCopiedNotice');
 if(!notice){
  notice=document.createElement('div');
  notice.id='wishportCopiedNotice';
  notice.setAttribute('role','status');
  notice.setAttribute('aria-live','polite');
  notice.setAttribute('aria-atomic','true');
  notice.style.cssText='position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(28,19,45,.30);pointer-events:none';
  const card=document.createElement('div');
  card.style.cssText='width:min(82vw,380px);box-sizing:border-box;padding:30px 28px;border:2px solid #d9c5f1;border-radius:22px;background:#fff;color:#271c38;box-shadow:0 18px 60px rgba(25,12,47,.28);font:800 clamp(21px,5.2vw,29px)/1.45 system-ui,-apple-system,sans-serif;text-align:center;letter-spacing:.045em;text-transform:uppercase;';
  card.textContent='💜 ORDER COMMAND COPIED!';
  notice.appendChild(card);
  document.body.appendChild(notice);
 }
 notice.hidden=false;
 notice.style.display='flex';
 clearTimeout(wishportCopyNoticeTimer);
 wishportCopyNoticeTimer=setTimeout(()=>{notice.hidden=true;notice.style.display='none';},2700);
}
$('copy').onclick=async()=>{
 const txt=cmd();
 if(!pocket.length){$('copyMsg').textContent='Add at least one item before copying.';return;}
 if(!txt||!makeCodes()){$('copyMsg').textContent='Cannot copy: '+issueSummary(pocket);return;}
 try{
  await navigator.clipboard.writeText(txt);
  $('copyMsg').textContent='Copied! Paste your $order command into the WishPort Discord channel.';showCopySuccess();
  showOrderCopiedNotice();
 }catch(e){
  $('command').value=txt;
  $('command').focus();$('command').select();
  $('copyMsg').textContent='Safari could not copy automatically. Tap and hold the selected command above, then choose Copy.';
 }
};
$('backToOrder').onclick=()=>{$('reviewModal').hidden=true;document.body.style.overflow='';};
$('confirmCopy').onclick=async()=>{const txt=cmd();if(!txt||!makeCodes()||!pocket.length){$('reviewCopyMsg').textContent='Order failed validation. Return to the cart.';return}try{await navigator.clipboard.writeText(txt);$('reviewCopyMsg').textContent='Copied! Paste into the WishPort Discord order channel.';$('copyMsg').textContent='Order copied after review.';showCopySuccess()}catch(e){$('reviewCopyMsg').textContent='Copy was blocked by Safari. Return to cart and select the command text manually.';$('backToOrder').click();$('command').focus();$('command').select();}};


extraFilterIds.forEach(id=>$(id).onchange=()=>{page=0;apply()});$('showVariants').onchange=()=>render();$('hideVariants').onchange=()=>{$('showVariants').checked=!$('hideVariants').checked;render()};$('explorerCart').onclick=()=>{$('openCart').click()};$('pageSize').onchange=()=>{pageSize=Number($('pageSize').value)||50;page=0;render()};$('goPage').onclick=()=>{const max=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.min(max,Math.max(1,Number($('jumpPage').value)||1))-1;render();$('search').scrollIntoView({block:'start'})};$('resetFilters').onclick=()=>{extraFilterIds.forEach(id=>$(id).value='');$('search').value='';$('category').value='';$('version').value='';quick='all';$('pills').querySelectorAll('.pill').forEach((b,i)=>b.classList.toggle('active',i===0));page=0;apply()};
$('search').oninput=()=>{page=0;apply()};$('category').onchange=()=>{page=0;apply()};$('version').onchange=()=>{page=0;apply()};$('sort').onchange=()=>{page=0;apply()};
// New catalog sections: Database, Collections and Categories.
const tabs=document.querySelectorAll('[data-tab]');
function activateTab(tab){if(tab==='database'&&filtered.length)render();tabs.forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))});['database','collections','categories','villagers'].forEach(name=>$(name+'Panel').hidden=name!==tab);}
tabs.forEach(b=>b.addEventListener('click',()=>activateTab(b.dataset.tab)));
const catCounts=new Map();items.forEach(x=>catCounts.set(categoryFor(x),(catCounts.get(categoryFor(x))||0)+1));
$('categoryGrid').innerHTML=[...catCounts.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([c,n])=>`<button class="categoryTile" data-cat="${esc(c)}"><span class="categorySymbol" aria-hidden="true">${esc(c.slice(0,1).toUpperCase())}</span><span class="categoryLabel">${esc(c)}</span><span class="categoryCount">${n.toLocaleString()} items</span></button>`).join('');
$('shopMaterials').onclick=()=>{activateTab('database');quick='all';$('search').value='';$('category').value='group:Materials';$('version').value='';page=0;apply();document.querySelector('.browseTabs').scrollIntoView({block:'start'});};
$('categoryGrid').onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;activateTab('database');quick='all';$('pills').querySelectorAll('.pill').forEach((x,i)=>x.classList.toggle('active',i===0));$('search').value='';$('version').value='';$('category').value=b.dataset.cat;page=0;apply();document.querySelector('.browseTabs').scrollIntoView({block:'start',behavior:'smooth'});};
// Exactly twelve curated collections; original 16-character order codes are never recalculated.
const presetRows=window.WISHPORT_PRESETS||[];
const catalogByID=new Map();
for (const it of items){
 const codes=[it.hex,it.orderHex,...Object.values(it.variantHex||{})];
 for(const code of codes){if(code && !catalogByID.has(String(code).toUpperCase()))catalogByID.set(String(code).toUpperCase(),it)}
}
const collections=presetRows.map((p,id)=>({
 id,name:p.name,cover:p.cover,description:'Curated ACNH room preset',
 items:p.codes.map(hex=>{
  const original=catalogByID.get(hex)||catalogByID.get(hex.slice(-4));
  return {name:original?.name||'ACNH item #'+hex.slice(-4),category:original?.category||'',image:original?.image||'',hex,variation:original?.variationPreset||'',pattern:original?.patternPreset||''};
 })
}));
function coverMarkup(c){return `<div class="collectionCover realRoomCover"><img src="${esc(c.cover)}" loading="lazy" alt="Actual Animal Crossing New Horizons room preview: ${esc(c.name)}"><span class="roomPreviewBadge">ACTUAL ACNH ROOM</span></div>`;}
function renderCollections(){
 const q=$('collectionSearch').value.trim().toLowerCase();
 const found=collections.filter(x=>x.name.toLowerCase().includes(q));
 $('collectionsGrid').innerHTML=found.length?found.map(c=>`<article class="collectionCard">${coverMarkup(c)}<div class="collectionBody"><h3>${esc(c.name)}</h3><p>Original curated ACNH room collection</p><div class="collectionFooter"><span class="countTag">${c.items.length} ITEMS</span><button class="collectionBtn" data-collection="${c.id}">View collection</button></div><button class="cta collectionAddQuick" data-add-collection="${c.id}">Add collection</button></div></article>`).join(''):'<p class="empty">No matching collections.</p>';
}
let selectedCollection=null;
function addPreset(c){
 if(!c||!c.items.length||c.items.length>40)return;
 const invalidRaw=c.items.map((x,i)=>({slot:i+1,code:String(x.hex||'')})).filter(x=>!/^[0-9A-F]{16}$/i.test(x.code));
 if(invalidRaw.length){alert(c.name+' includes invalid preset code(s): '+invalidRaw.map(x=>'slot '+x.slot+' ('+x.code+')').join(', ')+'. The collection was not added.');return;}
 if(pocket.length&& !confirm('Replace your current pocket with this preset?'))return;
 // Preserve raw per-slot metadata. Never derive order strings from display names.
 const unsafe=c.items.filter(x=>disallowedOrderEntry(x));
 if(unsafe.length){alert('Cannot add '+c.name+' because '+unsafe.length+' item slot(s) need attention:\n'+issueSummary(c.items,8).replace(/; /g,'\n')+'\n\nNo items were added. Please report the named item if you believe this is a mistake.');return;}
 pocket=c.items.map(x=>({name:x.name,category:x.category,hex:x.hex,variation:x.variation||'',pattern:x.pattern||''}));
 savePocket();hide('collectionModal');cart();show('cartModal');
}
$('collectionsGrid').onclick=e=>{
 const add=e.target.closest('[data-add-collection]');if(add){addPreset(collections[+add.dataset.addCollection]);return;}
 const b=e.target.closest('[data-collection]');if(!b)return;
 selectedCollection=collections[+b.dataset.collection];
 $('collectionTitle').textContent=selectedCollection.name;
 $('collectionDescription').textContent='Original ACNH room photo · original provided order codes';
 $('collectionPreview').innerHTML=selectedCollection.items.map((x,i)=>`<div class="presetItem"><span>${i+1}.</span>${x.image?`<img src="${esc(imageURL(x.image))}" data-original="${esc(x.image)}" onerror="window.wishportImageError(this)" alt="" loading="lazy">`:''}<span>${esc(x.name)}</span><code>${esc(x.hex)}</code></div>`).join('');
 $('addCollection').textContent='Add collection';show('collectionModal');
};
$('collectionSearch').oninput=renderCollections;
$('addCollection').onclick=()=>addPreset(selectedCollection);
$('collectionModal').addEventListener('click',e=>{if(e.target===$('collectionModal'))hide('collectionModal')});
renderCollections();

// Dream villager browser: actual ACNH villagers and their internal IDs, not invented names.
const villagers=window.WISHPORT_VILLAGERS||[];
const saveVillager=()=>{try{localStorage.setItem('wishport_villager',JSON.stringify(chosenVillager))}catch(e){}};
let filteredVillagers=[],villagerPage=0;
const species=[...new Set(villagers.map(v=>v.species).filter(Boolean))].sort();
const personalities=[...new Set(villagers.map(v=>v.personality).filter(Boolean))].sort();
$('villagerSpecies').innerHTML='<option value="">All species</option>'+species.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
$('villagerPersonality').innerHTML='<option value="">All personalities</option>'+personalities.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
function renderSelectedVillager(){
 const node=$('selectedVillager');node.hidden=!chosenVillager;
 if(!chosenVillager)return;
 node.innerHTML=`<span>🏡 Selected: <strong>${esc(chosenVillager.name)}</strong> · <code>villager:${esc(chosenVillager.id)}</code></span><button class="secondary" id="clearVillager">Remove</button><p class="hint" style="width:100%;margin:8px 0 0">🏡 Villager adoption requires an open plot. Awake/asleep status depends on your island's in-game time and bot setup; WishPort cannot verify live sleep status.</p>`;
 $('clearVillager').onclick=()=>{chosenVillager=null;saveVillager();renderSelectedVillager();renderVillagers()};
}
function applyVillagers(){
 const q=$('villagerSearch').value.trim().toLowerCase(),sp=$('villagerSpecies').value,p=$('villagerPersonality').value;
 filteredVillagers=villagers.filter(v=>(!q||(v.name+' '+v.species+' '+v.personality).toLowerCase().includes(q))&&(!sp||v.species===sp)&&(!p||v.personality===p));
 filteredVillagers.sort((a,b)=>a.name.localeCompare(b.name)||String(a.variationLabel||'').localeCompare(String(b.variationLabel||'')));villagerPage=0;renderVillagers();
}
function renderVillagers(){
 const perPage=48,total=Math.max(1,Math.ceil(filteredVillagers.length/perPage));villagerPage=Math.max(0,Math.min(villagerPage,total-1));
 $('villagerSummary').textContent=filteredVillagers.length+' villagers · '+villagers.length+' in catalog';$('villagerPage').textContent='Page '+(villagerPage+1)+' of '+total;
 $('villagerGrid').innerHTML=filteredVillagers.slice(villagerPage*perPage,(villagerPage+1)*perPage).map((v,i)=>{
  const active=chosenVillager&&chosenVillager.id===v.id;
  return `<article class="villagerCard"><div class="villagerPortrait">${v.portrait?`<img src="${esc(v.portrait)}" data-original="${esc(v.portrait)}" alt="${esc(v.name)} portrait" loading="lazy" onerror="window.wishportImageError(this)">`:'<span class="noPhotoLabel">Portrait unavailable</span>'}</div><div class="villagerDetails"><h3>${esc(v.name)}</h3><p>${esc(v.species)} · ${esc(v.personality)}</p><p>🎂 ${esc(v.birthday||'Unknown')} · ${esc(v.hobby||'')}</p></div><button class="villagerPick ${active?'active':''}" data-villager="${i}" aria-pressed="${!!active}">${active?'✓ Selected':'+ Select villager'}</button></article>`;
 }).join('')||'<p class="empty">No villagers match your search.</p>';
 $('villagerPages').innerHTML=total>1?`<button class="secondary" id="villagerPrev" ${villagerPage===0?'disabled':''}>← Previous</button><span>${villagerPage+1} / ${total}</span><button class="secondary" id="villagerNext" ${villagerPage===total-1?'disabled':''}>Next →</button>`:'';
 if($('villagerPrev'))$('villagerPrev').onclick=()=>{villagerPage--;renderVillagers();$('villagerSearch').scrollIntoView({block:'start'})};
 if($('villagerNext'))$('villagerNext').onclick=()=>{villagerPage++;renderVillagers();$('villagerSearch').scrollIntoView({block:'start'})};
}
$('villagerGrid').onclick=e=>{const b=e.target.closest('[data-villager]');if(!b)return;const v=filteredVillagers[villagerPage*48+Number(b.dataset.villager)];if(!v)return;
 chosenVillager=chosenVillager?.id===v.id?null:{name:v.name,id:v.id};saveVillager();renderSelectedVillager();renderVillagers();};
['villagerSearch','villagerSpecies','villagerPersonality'].forEach(id=>$(id).addEventListener(id==='villagerSearch'?'input':'change',applyVillagers));
renderSelectedVillager();applyVillagers();

$('qty').textContent=pocket.length;const updateExplorerCount=()=>{$('explorerCartCount').textContent=$('qty').textContent+' / 40'};updateExplorerCount();new MutationObserver(updateExplorerCount).observe($('qty'),{childList:true,characterData:true,subtree:true});apply();
})();
