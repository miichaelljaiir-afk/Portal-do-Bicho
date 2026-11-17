const animals=[
["Avestruz","01, 02, 03, 04","🪶"],["Águia","05, 06, 07, 08","🦅"],["Burro","09, 10, 11, 12","🐴"],["Borboleta","13, 14, 15, 16","🦋"],["Cachorro","17, 18, 19, 20","🐕"],["Cabra","21, 22, 23, 24","🐐"],["Carneiro","25, 26, 27, 28","🐏"],["Camelo","29, 30, 31, 32","🐪"],["Cobra","33, 34, 35, 36","🐍"],["Coelho","37, 38, 39, 40","🐇"],["Cavalo","41, 42, 43, 44","🐎"],["Elefante","45, 46, 47, 48","🐘"],["Galo","49, 50, 51, 52","🐓"],["Gato","53, 54, 55, 56","🐈"],["Jacaré","57, 58, 59, 60","🐊"],["Leão","61, 62, 63, 64","🦁"],["Macaco","65, 66, 67, 68","🐒"],[" porco","69, 70, 71, 72","🐖"],["Pavão","73, 74, 75, 76","🦚"],["Peru","77, 78, 79, 80","🦃"],["Touro","81, 82, 83, 84","🐂"],["Tigre","85, 86, 87, 88","🐅"],["Urso","89, 90, 91, 92","🐻"],["Veado","93, 94, 95, 96","🦌"],["Vaca","97, 98, 99, 00","🐄"]
];
const regions={
 rio:{name:"Rio de Janeiro",times:["PTM · 11h","PT · 14h","PTV · 16h","PTN · 18h","COR · 21h"]},
 "sao-paulo":{name:"São Paulo",times:["PTM · 11h","PT · 14h","PTV · 16h","PTN · 18h"]},
 bahia:{name:"Bahia",times:["PTM · 10h","PT · 12h","PTV · 15h","PTN · 19h"]},
 goias:{name:"Goiás",times:["PTM · 11h","PT · 14h","PTV · 17h","PTN · 20h"]},
 nacional:{name:"Nacional",times:["PTM · 11h","PT · 14h","PTV · 16h","PTN · 18h"]},
 federal:{name:"Federal",times:["FED · 19h"]}
};
const demoNumbers=["4827","1394","7602","2518","9036","6145","3281"];
const demoAnimals=["Águia","Gato","Leão","Borboleta","Cobra","Macaco","Avestruz"];
let selectedRegion="rio",selectedTime=0;
const $=s=>document.querySelector(s);
const today=new Date();
const dateISO=d=>{const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,10)};
$("#today-label").textContent=today.toLocaleDateString("pt-BR");
$("#result-date").value=dateISO(today);
$("#result-date").max=dateISO(today);
$("#year").textContent=today.getFullYear();
function renderTimes(){const list=$("#time-list");list.innerHTML="";regions[selectedRegion].times.forEach((t,i)=>{const b=document.createElement("button");b.className="time-btn"+(i===selectedTime?" active":"");b.textContent=t;b.onclick=()=>{selectedTime=i;renderTimes();renderResults()};list.append(b)});$("#result-heading").innerHTML=regions[selectedRegion].name+" <span>·</span> "+regions[selectedRegion].times[selectedTime].split(" · ")[0]}
function renderResults(){const date=$("#result-date").value;$("#result-heading").innerHTML=regions[selectedRegion].name+" <span>·</span> "+regions[selectedRegion].times[selectedTime].split(" · ")[0];$("#results-grid").innerHTML=demoNumbers.map((n,i)=>{const offset=(selectedTime*3+i*7+Object.keys(regions).indexOf(selectedRegion)*5+(date?Number(date.slice(-2)):0))%10000;const number=String((Number(n)+offset)%10000).padStart(4,"0");return '<article class="prize-card"><div class="prize-rank">'+(i+1)+'º</div><div class="prize-info"><div class="prize-label">'+(i+1)+'º PRÊMIO</div><div class="prize-number">'+number+'</div><div class="prize-animal">Grupo <strong>'+String(Math.floor((Number(number.slice(-2))-1)/4)+1).padStart(2,"0")+'</strong> · '+demoAnimals[(i+selectedTime)%demoAnimals.length]+'</div></div><button class="copy-btn" data-copy="'+number+'" aria-label="Copiar milhar '+number+'">Copiar</button></article>'}).join("");$("#updated-note").textContent="Demonstração fictícia · "+$("#result-date").value.split("-").reverse().join("/")+" · Nenhuma fonte oficial conectada"}
$("#region-list").addEventListener("click",e=>{const b=e.target.closest("[data-region]");if(!b)return;selectedRegion=b.dataset.region;selectedTime=0;document.querySelectorAll(".region").forEach(x=>x.classList.toggle("active",x===b));renderTimes();renderResults()});
$("#result-date").addEventListener("change",renderResults);
$("#results-grid").addEventListener("click",async e=>{const b=e.target.closest("[data-copy]");if(!b)return;await copyText(b.dataset.copy);toast("Milhar copiada!")});
function copyText(t){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(t);const el=document.createElement("textarea");el.value=t;document.body.append(el);el.select();document.execCommand("copy");el.remove();return Promise.resolve()}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2100)}
document.querySelector(".tabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));["results","cercar","animals"].forEach(v=>$("#"+v+"-view").classList.toggle("hidden",v!==b.dataset.tab))});
function renderAnimals(q=""){const filtered=animals.filter((a,i)=>(a[0]+(i+1)+" "+a[1]).toLowerCase().includes(q.toLowerCase()));$("#animals-grid").innerHTML=filtered.map((a)=>'<article class="animal-card"><span class="animal-emoji">'+a[2]+'</span><div><strong>'+a[0].trim()+'</strong><small>Grupo '+String(animals.indexOf(a)+1).padStart(2,"0")+' · '+a[1]+'</small></div></article>').join("")||'<p class="muted">Nenhum bicho encontrado.</p>'}
$("#animal-search").addEventListener("input",e=>renderAnimals(e.target.value));
$("#cercar-btn").addEventListener("click",()=>{const v=$("#milhar-input").value.replace(/\D/g,"").slice(0,4);const out=$("#cercar-output");if(v.length!==4){out.innerHTML="<p>Digite uma milhar com exatamente quatro algarismos.</p>";return}const rev=v.split("").reverse().join("");const pairs=[v,rev,v.slice(0,2)+v.slice(2),v.slice(2)+v.slice(0,2),v[1]+v[0]+v[3]+v[2]];out.innerHTML="<p style='width:100%;margin:0 0 4px'>Combinações demonstrativas para <strong>"+v+"</strong>:</p>"+[...new Set(pairs)].map(n=>'<span class="combo">'+n+'</span>').join("")+"<p style='width:100%;margin:5px 0 0'>Combinações ilustrativas, sem previsão de resultados.</p>"});
$("#milhar-input").addEventListener("input",e=>e.target.value=e.target.value.replace(/\D/g,"").slice(0,4));
renderTimes();renderResults();renderAnimals();