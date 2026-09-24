const PACKAGES=[
{id:"basic",name:"Basic",price:5000,duration:5,desc:"Teks sederhana",icon:"▱"},
{id:"neon",name:"Neon",price:10000,duration:7,desc:"Gold glow",icon:"◇"},
{id:"premium",name:"Premium",price:25000,duration:10,desc:"Animated frame",icon:"✦"},
{id:"super",name:"Super",price:50000,duration:15,desc:"Special animation",icon:"⚡"},
{id:"vip",name:"VIP",price:100000,duration:20,desc:"Fullscreen takeover",icon:"♛"}
];
const KEY="maxychat_messages_v1",STOP="maxychat_stop_v1",PKG="maxychat_pkg_v1";
const money=n=>"Rp"+Number(n||0).toLocaleString("id-ID");
const getAll=()=>JSON.parse(localStorage.getItem(KEY)||"[]");
const saveAll=v=>{localStorage.setItem(KEY,JSON.stringify(v));localStorage.setItem("maxychat_ping",Date.now())};
const selectedPackage=()=>PACKAGES.find(x=>x.id===(localStorage.getItem(PKG)||"premium"))||PACKAGES[2];
const esc=s=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

function initUser(){
  const list=document.getElementById("packages"),sender=document.getElementById("sender"),message=document.getElementById("message"),status=document.getElementById("status");
  const renderPackages=()=>{
    const current=selectedPackage();
    list.innerHTML=PACKAGES.map(p=>'<button class="package '+(p.id===current.id?"selected":"")+'" data-id="'+p.id+'"><span class="pkg-icon">'+p.icon+'</span><span><strong>'+p.name+'</strong><small>'+p.desc+' • '+p.duration+' detik</small></span><span class="price">'+money(p.price)+'</span></button>').join("");
    list.querySelectorAll(".package").forEach(b=>b.onclick=()=>{localStorage.setItem(PKG,b.dataset.id);renderPackages();updatePay()});
  };
  const updatePay=()=>{const p=selectedPackage();document.getElementById("payPackage").textContent=p.name;document.getElementById("payPrice").textContent=money(p.price)};
  const preview=()=>{document.getElementById("previewName").textContent=sender.value.trim()||"Nama kamu";document.getElementById("previewMessage").textContent=message.value.trim()||"Pesan akan muncul di sini."};
  sender.oninput=preview;message.oninput=preview;renderPackages();updatePay();

  document.getElementById("pay").onclick=()=>{
    if(!sender.value.trim()||!message.value.trim())return alert("Isi nama dan pesan terlebih dahulu.");
    if(!document.getElementById("terms").checked)return alert("Setujui ketentuan penayangan terlebih dahulu.");
    const p=selectedPackage(),id="MXC-"+Date.now().toString().slice(-10),data=getAll();
    data.unshift({id,sender:sender.value.trim(),message:message.value.trim(),packageName:p.name,price:p.price,duration:p.duration,payment:"paid",status:"pending_moderation",createdAt:new Date().toISOString()});
    saveAll(data);localStorage.setItem("maxychat_current",id);
    status.innerHTML="<b>Pembayaran demo berhasil.</b><br>Order ID: "+id+"<br>Status: Sedang diperiksa moderator.";
  };

  const checkStatus=()=>{
    const id=localStorage.getItem("maxychat_current");if(!id)return;
    const x=getAll().find(m=>m.id===id);if(!x)return;
    const labels={pending_moderation:"Sedang diperiksa moderator",approved:"Disetujui — masuk antrean tayang",displaying:"Sedang tampil di videotron",completed:"Selesai ditayangkan",rejected:"Ditolak moderator — hubungi admin untuk pengajuan refund manual"};
    status.innerHTML="<b>"+esc(labels[x.status]||x.status)+"</b><br>Order ID: "+esc(x.id)+"<br>"+esc(x.sender)+" — "+esc(x.message);
  };
  setInterval(checkStatus,1000);window.addEventListener("storage",checkStatus);
}

function initAdmin(){
  const changeStatus=(id,status)=>{const d=getAll(),i=d.findIndex(x=>x.id===id);if(i>=0){d[i].status=status;saveAll(d);render()}};
  const render=()=>{
    const data=getAll(),pending=data.filter(x=>x.status==="pending_moderation"),queue=data.filter(x=>["approved","displaying"].includes(x.status));
    document.getElementById("revenue").textContent=money(data.reduce((a,b)=>a+(b.payment==="paid"?b.price:0),0));
    document.getElementById("total").textContent=data.length;
    document.getElementById("pending").textContent=pending.length;
    document.getElementById("queued").textContent=queue.length;

    const m=document.getElementById("moderation");
    m.innerHTML=pending.length?pending.map(x=>'<div class="row"><div><strong>'+esc(x.sender)+'</strong><p>'+esc(x.message)+'</p><small>'+esc(x.packageName)+' • '+money(x.price)+' • '+esc(x.id)+'</small></div><div class="actions"><button class="approve" data-a="'+x.id+'">Approve</button><button class="reject" data-r="'+x.id+'">Reject</button></div></div>').join(""):'<div class="empty">Tidak ada pesan menunggu moderasi.</div>';
    m.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>changeStatus(b.dataset.a,"approved"));
    m.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>changeStatus(b.dataset.r,"rejected"));

    const q=document.getElementById("queue");
    q.innerHTML=queue.length?queue.map((x,i)=>'<div class="queue-row"><b>'+(i+1)+'</b><div><strong>'+esc(x.sender)+'</strong><br><small>'+esc(x.message)+'</small></div><span class="price">'+esc(x.packageName)+'</span></div>').join(""):'<div class="empty">Antrean kosong.</div>';
    document.getElementById("displayState").textContent=localStorage.getItem(STOP)==="1"?"Emergency stop aktif":"Normal";
  };

  document.getElementById("emergency").onclick=()=>{localStorage.setItem(STOP,"1");render()};
  document.getElementById("resume").onclick=()=>{localStorage.setItem(STOP,"0");render()};
  document.getElementById("clear").onclick=()=>{const d=getAll();d.forEach(x=>{if(x.status==="displaying")x.status="completed"});saveAll(d);render()};
  render();setInterval(render,1000);window.addEventListener("storage",render);
}

function initDisplay(){
  let activeId=null,until=0;
  const tick=()=>{
    document.getElementById("clock").textContent=new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
    const stopped=localStorage.getItem(STOP)==="1";
    document.getElementById("stopLayer").classList.toggle("active",stopped);
    if(stopped)return;

    let d=getAll(),x=d.find(m=>m.status==="displaying");
    if(x&&activeId!==x.id){activeId=x.id;until=Date.now()+x.duration*1000}
    if(x&&Date.now()>until){x.status="completed";saveAll(d);x=null;activeId=null}
    if(!x){x=d.find(m=>m.status==="approved");if(x){x.status="displaying";saveAll(d);activeId=x.id;until=Date.now()+x.duration*1000}}

    document.getElementById("displayName").textContent=x?x.sender:"MAXY CHAT";
    document.getElementById("displayText").textContent=x?x.message:"Pesan yang disetujui moderator akan tampil di sini.";
    document.getElementById("displayMeta").textContent=x?(x.packageName+" • "+x.duration+" detik • "+x.id):"Menunggu antrean...";
  };
  tick();setInterval(tick,500);window.addEventListener("storage",tick);
}

const page=document.body.dataset.page;
if(page==="user")initUser();
if(page==="admin")initAdmin();
if(page==="display")initDisplay();