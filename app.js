const tournaments=[
 {name:'Copa Foot Night',tag:'ELIMINAÇÃO DIRETA',players:'12/16',entry:'GRÁTIS',prize:'3.000 créditos',time:'Hoje • 22:00'},
 {name:'Liga Weekend',tag:'FASE DE GRUPOS',players:'24/32',entry:'500 créditos',prize:'10.000 créditos',time:'Sáb • 19:00'},
 {name:'Elite 1x1',tag:'RANQUEADO',players:'6/8',entry:'1.000 créditos',prize:'5.500 créditos',time:'Dom • 21:00'}
];
const ranking=[
 ['01','RP','RafaPro','18V • 3D','1842'],['02','NX','NeyX','16V • 4D','1790'],['03','LK','Lukinhas','15V • 5D','1714'],['04','JM','JotaMaster','14V • 6D','1651'],['05','BR','Bruno10','13V • 6D','1598']
];
const grid=document.querySelector('#tournamentGrid');
tournaments.forEach((t,i)=>grid.insertAdjacentHTML('beforeend',`<article class="tournament-card"><span class="tag">${t.tag}</span><h3>${t.name}</h3><p>${t.time}. Confirmação de resultado obrigatória pelos dois jogadores.</p><div class="meta"><span>JOGADORES<br><b>${t.players}</b></span><span>ENTRADA<br><b>${t.entry}</b></span><span>PRÊMIO<br><b>${t.prize}</b></span></div><button class="primary full join-btn" data-i="${i}">PARTICIPAR</button></article>`));
const rank=document.querySelector('#rankingList');
ranking.forEach(r=>rank.insertAdjacentHTML('beforeend',`<div class="rank-row"><div class="rank-pos">${r[0]}</div><div class="rank-avatar">${r[1]}</div><div class="rank-info"><b>${r[2]}</b><small>${r[3]}</small></div><div class="rank-points">${r[4]}</div></div>`));
const modal=document.querySelector('#modal'), content=document.querySelector('#modalContent');
const openModal=html=>{content.innerHTML=html;modal.showModal()};
document.querySelector('#modalClose').onclick=()=>modal.close();
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
function tournamentModal(t){openModal(`<div class="modal-section"><span class="eyebrow">INSCRIÇÃO</span><h2>${t.name}</h2><p>Ao participar, você aceita as regras de fair play e validação de resultado.</p><div class="proof-box">Sala criada pelo Campeonato Foot<br><b>ID da partida liberado no horário do confronto</b></div><button class="primary full" onclick="alert('Inscrição registrada no protótipo!')">CONFIRMAR PARTICIPAÇÃO</button></div>`)}
document.addEventListener('click',e=>{
 if(e.target.matches('.join-btn')) tournamentModal(tournaments[+e.target.dataset.i]);
 if(e.target.dataset.action==='join-featured') tournamentModal(tournaments[0]);
 if(e.target.dataset.scroll) document.querySelector(e.target.dataset.scroll)?.scrollIntoView({behavior:'smooth'});
});
document.querySelector('#profileBtn').onclick=()=>openModal(`<div class="modal-section"><span class="eyebrow">MEU PERFIL</span><h2>RafaPro</h2><p>ID do jogo: <b>RAFA-88421</b><br>Plataforma: Mobile<br>Cidade: Campos do Jordão/SP<br>Nível: Ouro II</p><div class="meta"><span>VITÓRIAS<br><b>18</b></span><span>DERROTAS<br><b>3</b></span><span>FAIR PLAY<br><b>100%</b></span></div><button class="secondary full">EDITAR PERFIL</button></div>`);
document.querySelector('#walletBtn').onclick=()=>openModal(`<div class="modal-section"><span class="eyebrow">CARTEIRA VIRTUAL</span><h2>1.250 créditos</h2><p>Os créditos deste MVP são virtuais e servem para inscrições, recompensas e testes de economia interna.</p><div class="proof-box">Dinheiro real desativado no MVP<br>Pagamentos só devem ser ativados após validação jurídica, KYC/idade e provedor compatível.</div></div>`);
document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));c.classList.add('active')});
document.querySelector('#findOpponent').onclick=()=>{const level=document.querySelector('.chip.active').textContent;const box=document.querySelector('#matchFound');box.classList.remove('hidden');box.innerHTML=`<b>Adversário encontrado!</b><br><span style="color:var(--muted)">PaulistaX • São Paulo/SP • ${level}</span><br><small style="color:var(--green)">Sala CF-92841 pronta para iniciar</small>`};
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});