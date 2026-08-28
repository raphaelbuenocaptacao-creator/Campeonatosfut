const tournaments=[
 {name:'Copa Foot Night',tag:'ELIMINAÇÃO DIRETA',players:'12/16',entry:'GRÁTIS',prize:'3.000 créditos',time:'Hoje • 22:00'},
 {name:'Liga Weekend',tag:'FASE DE GRUPOS',players:'24/32',entry:'500 créditos',prize:'10.000 créditos',time:'Sáb • 19:00'},
 {name:'Elite 1x1',tag:'RANQUEADO',players:'6/8',entry:'1.000 créditos',prize:'5.500 créditos',time:'Dom • 21:00'}
];
const ranking=[['01','RP','RafaPro','18V • 3D','1842'],['02','NX','NeyX','16V • 4D','1790'],['03','LK','Lukinhas','15V • 5D','1714'],['04','JM','JotaMaster','14V • 6D','1651'],['05','BR','Bruno10','13V • 6D','1598']];
const state=JSON.parse(localStorage.getItem('cf_state')||'{}');
state.room=state.room||{id:'CF-92841',myCheck:false,opCheck:false,result:null,opponentResult:null,status:'Pré-jogo'};
state.history=state.history||[];
state.disputes=state.disputes||[];
const save=()=>localStorage.setItem('cf_state',JSON.stringify(state));

const grid=document.querySelector('#tournamentGrid');
tournaments.forEach((t,i)=>grid.insertAdjacentHTML('beforeend',`<article class="tournament-card"><span class="tag">${t.tag}</span><h3>${t.name}</h3><p>${t.time}. Confirmação de resultado obrigatória pelos dois jogadores.</p><div class="meta"><span>JOGADORES<br><b>${t.players}</b></span><span>ENTRADA<br><b>${t.entry}</b></span><span>PRÊMIO<br><b>${t.prize}</b></span></div><button class="primary full join-btn" data-i="${i}">PARTICIPAR</button></article>`));
const rank=document.querySelector('#rankingList');
ranking.forEach(r=>rank.insertAdjacentHTML('beforeend',`<div class="rank-row"><div class="rank-pos">${r[0]}</div><div class="rank-avatar">${r[1]}</div><div class="rank-info"><b>${r[2]}</b><small>${r[3]}</small></div><div class="rank-points">${r[4]}</div></div>`));

const modal=document.querySelector('#modal'),content=document.querySelector('#modalContent');
const openModal=html=>{content.innerHTML=html;modal.showModal()};
document.querySelector('#modalClose').onclick=()=>modal.close();
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
function tournamentModal(t){openModal(`<div class="modal-section"><span class="eyebrow">INSCRIÇÃO</span><h2>${t.name}</h2><p>Ao participar, você aceita as regras de fair play e validação de resultado.</p><div class="proof-box">Sala criada pelo Campeonato Foot<br><b>ID liberado no horário do confronto</b></div><button class="primary full" onclick="alert('Inscrição registrada no MVP!')">CONFIRMAR PARTICIPAÇÃO</button></div>`)}

document.addEventListener('click',e=>{
 if(e.target.matches('.join-btn')) tournamentModal(tournaments[+e.target.dataset.i]);
 if(e.target.dataset.action==='join-featured') tournamentModal(tournaments[0]);
 if(e.target.dataset.scroll) document.querySelector(e.target.dataset.scroll)?.scrollIntoView({behavior:'smooth'});
 if(e.target.dataset.adminDecision){resolveDispute(e.target.dataset.adminDecision)}
});

document.querySelector('#profileBtn').onclick=()=>openModal(`<div class="modal-section"><span class="eyebrow">MEU PERFIL</span><h2>RafaPro</h2><p>ID do jogo: <b>RAFA-88421</b><br>Plataforma: Mobile<br>Cidade: Campos do Jordão/SP<br>Nível: Ouro II</p><div class="meta"><span>VITÓRIAS<br><b>18</b></span><span>DERROTAS<br><b>3</b></span><span>FAIR PLAY<br><b>100%</b></span></div></div>`);
document.querySelector('#walletBtn').onclick=()=>openModal(`<div class="modal-section"><span class="eyebrow">CARTEIRA VIRTUAL</span><h2>1.250 créditos</h2><p>Créditos virtuais para inscrições e recompensas do MVP.</p><div class="proof-box">Dinheiro real desativado. Pagamentos e apostas exigem validação jurídica, idade/KYC e provedor compatível.</div></div>`);

document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));c.classList.add('active')});
document.querySelector('#findOpponent').onclick=()=>{const level=document.querySelector('.chip.active').textContent;const box=document.querySelector('#matchFound');box.classList.remove('hidden');box.innerHTML=`<b>Adversário encontrado!</b><br><span style="color:var(--muted)">PaulistaX • São Paulo/SP • ${level}</span><br><small style="color:var(--green)">Sala CF-92841 pronta para iniciar</small>`;document.querySelector('#sala').scrollIntoView({behavior:'smooth'});};

const myCheck=document.querySelector('#myCheck'),opCheck=document.querySelector('#opCheck'),roomStatus=document.querySelector('#roomStatus'),checkinBtn=document.querySelector('#checkinBtn');
function renderRoom(){
 myCheck.textContent=state.room.myCheck?'Confirmado':'Aguardando';
 opCheck.textContent=state.room.opCheck?'Confirmado':'Aguardando';
 roomStatus.textContent=state.room.status;
 checkinBtn.textContent=state.room.myCheck?'CHECK-IN REALIZADO':'FAZER CHECK-IN';
 renderHistory();renderDisputes();
}
renderRoom();
checkinBtn.onclick=()=>{
 state.room.myCheck=true;state.room.status='Aguardando adversário';save();renderRoom();
 setTimeout(()=>{state.room.opCheck=true;state.room.status='Liberada para jogar';save();renderRoom();},800);
};

const proofInput=document.querySelector('#proofInput'),proofName=document.querySelector('#proofName');
proofInput.onchange=()=>{proofName.textContent=proofInput.files?.[0]?.name||'Selecionar imagem ou vídeo';};
document.querySelector('#submitResult').onclick=()=>{
 const my=Number(document.querySelector('#myGoals').value),op=Number(document.querySelector('#opGoals').value);
 const validation=document.querySelector('#validationBox');
 validation.classList.remove('hidden');
 if(!state.room.myCheck||!state.room.opCheck){validation.innerHTML='<b>Partida ainda não liberada.</b><br>Os dois jogadores precisam fazer check-in.';return;}
 if(!proofInput.files?.length){validation.innerHTML='<b>Falta a prova do resultado.</b><br>Anexe um print ou vídeo antes de enviar.';return;}
 state.room.result={my,op,proofName:proofInput.files[0].name,submittedAt:new Date().toISOString()};
 state.room.status='Em validação';save();renderRoom();
 validation.innerHTML=`<b>Resultado enviado: ${my} × ${op}</b><br>Prova registrada: ${proofInput.files[0].name}<br><small>Aguardando confirmação do adversário.</small>`;
};

document.querySelector('#simulateOpponent').onclick=()=>{
 const validation=document.querySelector('#validationBox');validation.classList.remove('hidden');
 if(!state.room.result){validation.innerHTML='<b>Envie seu resultado primeiro.</b>';return;}
 const conflict=Math.random()<0.35;
 state.room.opponentResult=conflict?{my:state.room.result.op+1,op:state.room.result.my}:{my:state.room.result.op,op:state.room.result.my};
 if(state.room.result.my===state.room.opponentResult.op&&state.room.result.op===state.room.opponentResult.my){
   state.room.status='Validada';
   upsertHistory('Validada',`${state.room.result.my} × ${state.room.result.op}`);
   validation.innerHTML='<b>Resultado confirmado pelos dois jogadores.</b><br>Partida validada automaticamente e liberada para o chaveamento.';
 }else{
   state.room.status='Em disputa';
   const dispute={id:state.room.id,my:`${state.room.result.my} × ${state.room.result.op}`,op:`${state.room.opponentResult.my} × ${state.room.opponentResult.op}`,proof:state.room.result.proofName,status:'Pendente'};
   if(!state.disputes.some(d=>d.id===dispute.id)) state.disputes.push(dispute);
   upsertHistory('Em disputa',`${state.room.result.my} × ${state.room.result.op}`);
   validation.innerHTML='<b>Os placares não coincidem.</b><br>A partida foi bloqueada e enviada ao painel administrativo.';
 }
 save();renderRoom();
};

function upsertHistory(status,score){
 const found=state.history.find(h=>h.id===state.room.id);
 const item={id:state.room.id,opponent:'PaulistaX',city:'São Paulo/SP',score,status,updatedAt:new Date().toISOString()};
 if(found) Object.assign(found,item); else state.history.unshift(item);
}
function renderHistory(){
 const list=document.querySelector('#historyList'),count=document.querySelector('#historyCount');
 count.textContent=`${state.history.length} partida${state.history.length===1?'':'s'}`;
 if(!state.history.length){list.innerHTML='<p>Nenhuma partida registrada ainda.</p>';return;}
 list.innerHTML=state.history.map(h=>`<div class="rank-row"><div class="rank-avatar">CF</div><div class="rank-info"><b>${h.id} • ${h.score}</b><small>vs ${h.opponent} • ${h.city}</small></div><div class="rank-points">${h.status}</div></div>`).join('');
}
function renderDisputes(){
 const list=document.querySelector('#disputeList'),count=document.querySelector('#adminCount');
 const pending=state.disputes.filter(d=>d.status==='Pendente');count.textContent=`${pending.length} pendência${pending.length===1?'':'s'}`;
 if(!pending.length){list.innerHTML='<div class="proof-box">Nenhuma disputa aberta.</div>';return;}
 list.innerHTML=pending.map(d=>`<div class="proof-box"><b>${d.id}</b><br>RafaPro informou: ${d.my}<br>PaulistaX informou: ${d.op}<br>Prova: ${d.proof}<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px"><button class="primary" data-admin-decision="rafa">VALIDAR RAFAPRO</button><button class="secondary" data-admin-decision="repetir">MANDAR REPETIR</button></div></div>`).join('');
}
function resolveDispute(decision){
 const d=state.disputes.find(x=>x.status==='Pendente');if(!d)return;
 d.status='Resolvida';state.room.status=decision==='rafa'?'Validada pelo admin':'Repetir partida';
 upsertHistory(state.room.status,state.history.find(h=>h.id===state.room.id)?.score||'-');save();renderRoom();
 openModal(`<div class="modal-section"><span class="eyebrow">DECISÃO ADMIN</span><h2>${state.room.status}</h2><p>A decisão foi registrada no histórico da Sala CF.</p></div>`);
}

renderHistory();renderDisputes();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});