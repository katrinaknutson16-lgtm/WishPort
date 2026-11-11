/* WishPort usability extras — no changes to bot, catalog, or ordering logic. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const support=$('wishportSupport'), tip=$('wpFirstTip'),top=$('wpBackTop');
const storageKey='wishport_first_tip_dismissed_v1';
try{ if(localStorage.getItem(storageKey)!=='yes')tip.hidden=false; }catch(e){tip.hidden=false;}
$('wpDismissTip')?.addEventListener('click',()=>{tip.hidden=true;try{localStorage.setItem(storageKey,'yes');}catch(e){}});
const updateTop=()=>{top.hidden=window.scrollY<480;};
window.addEventListener('scroll',updateTop,{passive:true});updateTop();
top.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
$('wpCartHelp')?.addEventListener('click',()=>{
  const back=$('backShopping');if(back)back.click();
  support.open=true;requestAnimationFrame(()=>support.scrollIntoView({block:'start',behavior:'smooth'}));
});
const form=$('wpReportForm'),status=$('wpReportStatus');
function reportText(){
 const type=$('wpIssueType').value.trim();
 const details=$('wpIssueDetails').value.trim();
 if(!type||!details){status.textContent='Choose a problem type and explain what happened first.';return null;}
 const name=$('wpIssueItem').value.trim(),code=$('wpIssueCode').value.trim();
 return ['WISHPORT PROBLEM REPORT','Issue: '+type,name?'Item/collection: '+name:null,code?'Item code: '+code:null,'Details: '+details,'Website: https://katrinaknutson16-lgtm.github.io/WishPort/','Submitted by: (add your Discord name if you wish)'].filter(Boolean).join('\n');
}
async function copyReport(txt){
 try{await navigator.clipboard.writeText(txt);status.textContent='Copied! Paste this report into the WishPort Discord support conversation or message a moderator.';return true;}
 catch(e){
  const el=document.createElement('textarea');el.value=txt;el.style.cssText='position:fixed;left:-9999px;';document.body.append(el);el.select();let ok=false;try{ok=document.execCommand('copy');}catch(err){}el.remove();
  status.textContent=ok?'Copied! Paste it into Discord.':'Copy blocked by the browser. Use Download text instead.';return ok;
 }
}
form?.addEventListener('submit',e=>{e.preventDefault();const text=reportText();if(text)copyReport(text);});
$('wpDownloadReport')?.addEventListener('click',()=>{
 const txt=reportText();if(!txt)return;
 const blob=new Blob([txt],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='WishPort_Problem_Report.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);status.textContent='Downloaded a text report. Send it to a WishPort moderator or paste the text into Discord.';
});
})();
