/* Modifier les informations de l'entreprise dans data.js uniquement. */
const strings={
 ja:{subtitle:"お問い合わせ・事業所案内",language:"言語",contact:"お問い合わせ",locations:"事業所一覧",phone:"電話番号",fax:"FAX",email:"メールアドレス",web:"公式サイト",call:"電話する",map:"Google マップで見る",mailAction:"メールを送る",siteAction:"公式サイトを見る",save:"連絡先を保存",foot:"伸榮産業株式会社"},
 en:{subtitle:"Contact & office locations",language:"Language",contact:"Contact",locations:"Office locations",phone:"Telephone",fax:"Fax",email:"Email",web:"Website",call:"Call",map:"View in Google Maps",mailAction:"Send email",siteAction:"Visit website",save:"Save contact",foot:"Shin-Ei Sangyo Co., Ltd."},
 fr:{subtitle:"Contacts et établissements",language:"Langue",contact:"Nous contacter",locations:"Nos établissements",phone:"Téléphone",fax:"Fax",email:"E-mail",web:"Site internet",call:"Appeler",map:"Ouvrir Google Maps",mailAction:"Envoyer un e-mail",siteAction:"Voir le site",save:"Enregistrer le contact",foot:"Shin-Ei Sangyo Co., Ltd."}
};
const data=window.COMPANY;
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function link(url,label,cls=""){const a=node("a",cls,label);a.href=url;if(url.startsWith("https://")){a.target="_blank";a.rel="noopener noreferrer"}return a}
const tel=n=>"tel:"+n.replace(/[^+0-9]/g,"");
const maps=o=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("〒"+o.postal+" "+o.addressJa);
const esc=s=>String(s).replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/[,;]/g,c=>"\\"+c);
function saveContact(){
 const lines=["BEGIN:VCARD","VERSION:3.0","FN:"+esc(data.nameJa),"ORG:"+esc(data.nameJa)];
 data.offices.forEach((o,i)=>{lines.push("TEL;TYPE=WORK,VOICE"+(i===0?",PREF":"")+":"+o.phone);lines.push("TEL;TYPE=WORK,FAX:"+o.fax);lines.push("ADR;TYPE=WORK:;;"+esc(o.addressJa)+";;;"+o.postal+";Japan")});
 lines.push("EMAIL;TYPE=INTERNET,WORK:"+data.email,"URL:"+data.website,"END:VCARD");
 const url=URL.createObjectURL(new Blob(["\ufeff"+lines.join("\r\n")+"\r\n"],{type:"text/vcard;charset=utf-8"}));const a=link(url,"");a.download="shin-ei-contact.vcf";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)
}
function render(lang){
 const t=strings[lang]||strings.ja;document.documentElement.lang=lang;document.getElementById("language").value=lang;document.getElementById("language-label").textContent=t.language;document.getElementById("subtitle").textContent=t.subtitle;document.getElementById("contact-heading").textContent=t.contact;document.getElementById("locations-heading").textContent=t.locations;document.getElementById("foot").textContent=t.foot;document.title=data.nameJa+" | "+t.contact;
 const primary=data.offices[0];const general=document.getElementById("general");general.replaceChildren();
 general.append(node("p","contact-label",t.phone));general.append(link(tel(primary.phone),primary.phone,"contact-primary"));
 const mail=node("div","detail");mail.append(node("span","key",t.email),link("mailto:"+data.email,data.email,"text-link"));general.append(mail);
 const web=node("div","detail");web.append(node("span","key",t.web),link(data.website,data.website,"text-link"));general.append(web);
 const action=node("div","buttons");action.append(link(tel(primary.phone),"☎  "+t.call,"btn primary"),link("mailto:"+data.email,"✉  "+t.mailAction,"btn"),link(data.website,"↗  "+t.siteAction,"btn"));const save=node("button","btn", "↓  "+t.save);save.type="button";save.addEventListener("click",saveContact);action.append(save);general.append(action);
 const offices=document.getElementById("offices");offices.replaceChildren();for(const o of data.offices){const c=node("section","card");c.append(node("h3","",lang==="ja"?o.titleJa:lang==="fr"?o.titleFr:o.titleEn));c.append(node("p","address","〒"+o.postal+"　"+o.addressJa));const phones=node("div","phone-row");const phone=node("div");phone.append(node("small","",t.phone),link(tel(o.phone),o.phone));const fax=node("div");fax.append(node("small","",t.fax),node("span","",o.fax));phones.append(phone,fax);c.append(phones);const buttons=node("div","buttons");buttons.append(link(tel(o.phone),"☎  "+t.call,"btn primary"),link(maps(o),"⌖  "+t.map,"btn"));c.append(buttons);offices.append(c)}
}
const preferred=(navigator.languages||[navigator.language||"ja"]).map(l=>l.toLowerCase().split("-")[0]);render(preferred.find(l=>strings[l])||"ja");document.getElementById("language").addEventListener("change",e=>render(e.target.value));
