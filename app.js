// === PROGRESS BAR ===
window.addEventListener('scroll',()=>{
  const h=document.documentElement;
  const pct=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100;
  document.getElementById('progressBar').style.width=pct+'%';
});

// === NAV TOGGLE ===
document.getElementById('navToggle').addEventListener('click',()=>{
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{
  document.querySelector('.nav-links').classList.remove('open');
}));

// === VALORES ===
const valueInfo={
  v1:{label:'🦾 Compromiso',desc:'El equipo se compromete a alcanzar sus metas y apoyarse mutuamente para lograrlo.'},
  v2:{label:'🌟 Foco',desc:'El equipo se concentra en el Sprint Goal y en crear valor en cada iteración.'},
  v3:{label:'🌊 Apertura',desc:'El equipo es transparente sobre su trabajo, sus retos y los impedimentos que enfrenta.'},
  v4:{label:'🫶 Respeto',desc:'Los miembros del equipo se respetan mutuamente como personas capaces e independientes.'},
  v5:{label:'🔥 Coraje',desc:'El equipo tiene el coraje de hacer lo correcto y trabajar en problemas difíciles.'}
};
function toggleValue(el){
  document.querySelectorAll('.value-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  const d=valueInfo[el.id];
  const box=document.getElementById('valueDesc');
  box.style.opacity=0;
  setTimeout(()=>{box.innerHTML=`<strong>${d.label}</strong><br>${d.desc}`;box.style.opacity=1;},150);
}

// === MODAL DATA ===
const modals={
  sprint:{title:'🚀 Sprint',badge:'1–4 Semanas',desc:'El Sprint es el corazón de Scrum. Es un ciclo de tiempo fijo donde se crea un incremento del producto.',points:['Duración constante de 1 a 4 semanas','Inicia inmediatamente después del anterior','No se realizan cambios que pongan en riesgo el Sprint Goal','El alcance puede clarificarse con el Product Owner','Solo el Product Owner puede cancelar un Sprint']},
  planning:{title:'🗺️ Sprint Planning',badge:'Máx. 8h para Sprint de 1 mes',desc:'El equipo planifica el trabajo a realizar durante el Sprint.',points:['¿Por qué es valioso este Sprint? (Sprint Goal)','¿Qué puede hacerse en este Sprint?','¿Cómo se realizará el trabajo elegido?','Participan todos los miembros del Scrum Team','El resultado es el Sprint Backlog']},
  daily:{title:'🌅 Daily Scrum',badge:'15 Minutos · Cada día',desc:'Reunión diaria de 15 minutos para los Developers. Se sincroniza el progreso y se adapta el plan.',points:['Siempre a la misma hora y lugar','Sólo para los Developers (Scrum Master puede asistir)','¿Qué hice ayer?','¿Qué haré hoy?','¿Hay algún impedimento?']},
  review:{title:'🔬 Sprint Review',badge:'Máx. 4h para Sprint de 1 mes',desc:'Se presenta el Incremento completado a los stakeholders y se adapta el Product Backlog.',points:['El equipo demuestra el trabajo completado','Se recibe retroalimentación de stakeholders','Se actualiza el Product Backlog','Se inspecciona el progreso hacia el Product Goal','No es una reunión de estatus']},
  retro:{title:'🌱 Retrospectiva',badge:'Máx. 3h para Sprint de 1 mes',desc:'El equipo reflexiona sobre el proceso y planifica mejoras para el próximo Sprint.',points:['¿Qué salió bien?','¿Qué puede mejorar?','¿Qué haremos diferente?','Se identifican mejoras accionables','Fortalece la colaboración del equipo']}
};
function openModal(key){
  const d=modals[key];
  document.getElementById('modalContent').innerHTML=`
    <span class="modal-badge">${d.badge}</span>
    <h3>${d.title}</h3>
    <p>${d.desc}</p>
    <ul>${d.points.map(p=>`<li>${p}</li>`).join('')}</ul>`;
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(){document.getElementById('modalOverlay').classList.remove('open');}

// === MATCH GAME ===
let draggingItem=null;
function dragStart(e){draggingItem=e.target;e.target.classList.add('dragging');}
function dragOver(e){e.preventDefault();e.currentTarget.classList.add('drag-over');}
function dropItem(e){
  e.preventDefault();
  const zone=e.currentTarget;
  zone.classList.remove('drag-over');
  if(draggingItem){
    zone.querySelector('.zone-drop').appendChild(draggingItem);
    draggingItem.classList.remove('dragging');
    draggingItem=null;
  }
}
function checkMatch(){
  let score=0,total=0;
  document.querySelectorAll('.match-zone').forEach(zone=>{
    const role=zone.dataset.role;
    zone.querySelectorAll('.match-item').forEach(item=>{
      total++;
      if(item.dataset.ans===role){item.classList.add('correct');item.classList.remove('wrong');score++;}
      else{item.classList.add('wrong');item.classList.remove('correct');}
    });
  });
  const r=document.getElementById('matchResult');
  if(score===6){r.innerHTML='🥳 ¡Perfecto! Todas correctas';r.style.color='#4ade80';}
  else{r.innerHTML=`🎯 ${score}/6 correctas. Revisa las marcadas en rojo.`;r.style.color='#f59e0b';}
}
function resetMatch(){
  document.querySelectorAll('.match-item').forEach(i=>{
    i.classList.remove('correct','wrong');
    document.querySelector('.match-items').appendChild(i);
  });
  document.getElementById('matchResult').innerHTML='';
}

// === QUIZ ===
const quizData=[
  {q:'¿Cuánto dura como máximo un Sprint?',opts:['1 semana','2 semanas','4 semanas','6 semanas'],ans:2},
  {q:'¿Cuánto dura el Daily Scrum?',opts:['30 minutos','15 minutos','1 hora','10 minutos'],ans:1},
  {q:'¿Quién puede cancelar un Sprint?',opts:['Scrum Master','Los Developers','El Product Owner','El cliente'],ans:2},
  {q:'¿Cuál es el compromiso del Sprint Backlog?',opts:['Product Goal','Sprint Goal','Definition of Done','Incremento'],ans:1},
  {q:'¿Qué evento ocurre al final de cada Sprint para revisar el proceso?',opts:['Sprint Review','Sprint Planning','Daily Scrum','Retrospectiva'],ans:3},
  {q:'¿Cuántas personas puede tener máximo un Scrum Team?',opts:['5','10','15','20'],ans:1},
];
let qIdx=0,qScore=0,qAnswered=false;
function renderQuiz(){
  if(qIdx>=quizData.length){
    document.getElementById('quizQ').textContent='¡Quiz completado!';
    document.getElementById('quizOpts').innerHTML='';
    document.getElementById('quizScore').textContent=`Puntuación final: ${qScore}/${quizData.length}`;
    document.getElementById('quizProg').style.width='100%';
    return;
  }
  const q=quizData[qIdx];
  document.getElementById('quizQ').textContent=`${qIdx+1}/${quizData.length}. ${q.q}`;
  document.getElementById('quizFb').textContent='';
  document.getElementById('quizScore').textContent=`Puntos: ${qScore}`;
  document.getElementById('quizProg').style.width=`${(qIdx/quizData.length)*100}%`;
  document.getElementById('quizOpts').innerHTML=q.opts.map((o,i)=>
    `<div class="quiz-option" onclick="selectQuiz(${i})">${o}</div>`).join('');
  qAnswered=false;
}
function selectQuiz(i){
  if(qAnswered)return;
  qAnswered=true;
  const q=quizData[qIdx];
  const opts=document.querySelectorAll('.quiz-option');
  opts.forEach((o,idx)=>{
    o.classList.add('selected');
    if(idx===q.ans)o.classList.add('correct');
    else if(idx===i)o.classList.add('wrong');
  });
  const fb=document.getElementById('quizFb');
  if(i===q.ans){fb.textContent='🌟 ¡Correcto!';fb.style.color='#4ade80';qScore++;}
  else{fb.textContent='🚫 Incorrecto. La respuesta era: '+q.opts[q.ans];fb.style.color='#f87171';}
  document.getElementById('quizScore').textContent=`Puntos: ${qScore}`;
}
function nextQuiz(){if(!qAnswered&&qIdx<quizData.length)return;qIdx++;renderQuiz();}
function resetQuiz(){qIdx=0;qScore=0;qAnswered=false;renderQuiz();}
renderQuiz();

// === TRUE/FALSE ===
const tfData=[
  {q:'El Product Owner puede cancelar un Sprint.',ans:true,exp:'Correcto. El Product Owner es el único que puede cancelar un Sprint.'},
  {q:'El Daily Scrum dura 30 minutos.',ans:false,exp:'Falso. El Daily Scrum dura exactamente 15 minutos.'},
  {q:'Scrum solo se usa para desarrollo de software.',ans:false,exp:'Falso. Scrum puede aplicarse a cualquier trabajo complejo y creativo.'},
  {q:'El Scrum Master es el jefe del equipo de desarrollo.',ans:false,exp:'Falso. El Scrum Master es un servidor-líder, no el jefe del equipo.'},
  {q:'El Incremento debe cumplir la Definition of Done.',ans:true,exp:'Correcto. Todo Incremento debe cumplir la DoD para ser válido.'},
  {q:'El Product Backlog nunca está completamente terminado.',ans:true,exp:'Correcto. El Product Backlog evoluciona mientras el producto y el mercado existen.'},
  {q:'Un Sprint puede durar más de 4 semanas.',ans:false,exp:'Falso. La duración máxima de un Sprint es de 4 semanas.'},
  {q:'El equipo de desarrollo debe ser multifuncional.',ans:true,exp:'Correcto. Los Developers tienen todas las habilidades necesarias para crear el Incremento.'},
];
let tfIdx=0,tfScore=0;
function renderTF(){
  if(tfIdx>=tfData.length){
    document.getElementById('tfQ').textContent='¡Completado!';
    document.getElementById('tfFb').textContent='';
    document.getElementById('tfScore').textContent=`Puntuación: ${tfScore}/${tfData.length}`;
    document.getElementById('tfProg').style.width='100%';
    return;
  }
  document.getElementById('tfQ').textContent=`${tfIdx+1}/${tfData.length}. ${tfData[tfIdx].q}`;
  document.getElementById('tfFb').textContent='';
  document.getElementById('tfScore').textContent=`Puntos: ${tfScore}`;
  document.getElementById('tfProg').style.width=`${(tfIdx/tfData.length)*100}%`;
}
function tfAnswer(val){
  const d=tfData[tfIdx];
  const fb=document.getElementById('tfFb');
  if(val===d.ans){fb.textContent='🌟 '+d.exp;fb.style.color='#4ade80';tfScore++;}
  else{fb.textContent='🚫 '+d.exp;fb.style.color='#f87171';}
  document.getElementById('tfScore').textContent=`Puntos: ${tfScore}`;
  setTimeout(()=>{tfIdx++;renderTF();},1800);
}
function resetTF(){tfIdx=0;tfScore=0;renderTF();}
renderTF();

// === SORT GAME ===
let sortDragging=null;
function sortDrag(e){sortDragging=e.target;}
function sortOver(e){e.preventDefault();document.querySelectorAll('.sort-item').forEach(i=>i.classList.remove('drag-over-top'));e.currentTarget.classList.add('drag-over-top');}
function sortDrop(e){
  e.preventDefault();
  const target=e.currentTarget;
  document.querySelectorAll('.sort-item').forEach(i=>i.classList.remove('drag-over-top'));
  if(sortDragging&&sortDragging!==target){
    const container=document.getElementById('sortGame');
    const items=[...container.children];
    const fromIdx=items.indexOf(sortDragging);
    const toIdx=items.indexOf(target);
    if(fromIdx<toIdx)container.insertBefore(sortDragging,target.nextSibling);
    else container.insertBefore(sortDragging,target);
  }
  sortDragging=null;
}
function checkSort(){
  const items=[...document.querySelectorAll('.sort-item')];
  let correct=0;
  items.forEach((item,idx)=>{
    item.classList.remove('correct-pos','wrong-pos');
    if(parseInt(item.dataset.order)===idx+1){item.classList.add('correct-pos');correct++;}
    else item.classList.add('wrong-pos');
  });
  const r=document.getElementById('sortResult');
  if(correct===5){r.innerHTML='🥳 ¡Orden perfecto!';r.style.color='#4ade80';}
  else{r.innerHTML=`🎯 ${correct}/5 en la posición correcta`;r.style.color='#f59e0b';}
}
function resetSort(){
  const c=document.getElementById('sortGame');
  const items=[...c.children];
  items.sort(()=>Math.random()-.5).forEach(i=>{
    i.classList.remove('correct-pos','wrong-pos');
    c.appendChild(i);
  });
  document.getElementById('sortResult').innerHTML='';
}

// === FILL GAME ===
const fillData=[
  {q:'El ___ es responsable de gestionar el Product Backlog.',opts:['Scrum Master','Product Owner','Developer','Stakeholder'],ans:1},
  {q:'El Daily Scrum es una reunión de ___ minutos.',opts:['30','60','15','45'],ans:2},
  {q:'Los ___ representan el trabajo en Scrum.',opts:['Roles','Artefactos','Valores','Principios'],ans:1},
  {q:'La ___ asegura que el Incremento es de calidad.',opts:['Sprint Review','Daily Scrum','Definition of Done','Retrospectiva'],ans:2},
  {q:'El ___ protege al equipo de interrupciones externas.',opts:['Product Owner','Developer','Scrum Master','Stakeholder'],ans:2},
];
let fillIdx=0,fillScore=0,fillAnswered=false;
function renderFill(){
  if(fillIdx>=fillData.length){
    document.getElementById('fillQ').textContent='¡Juego completado!';
    document.getElementById('fillOpts').innerHTML='';
    document.getElementById('fillScore').textContent=`Puntuación: ${fillScore}/${fillData.length}`;
    return;
  }
  const d=fillData[fillIdx];
  document.getElementById('fillQ').innerHTML=d.q.replace('___','<span style="background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:700">___</span>');
  document.getElementById('fillFb').textContent='';
  document.getElementById('fillScore').textContent=`Puntos: ${fillScore}`;
  document.getElementById('fillOpts').innerHTML=d.opts.map((o,i)=>
    `<div class="fill-option" onclick="fillAnswer(${i})">${o}</div>`).join('');
  fillAnswered=false;
}
function fillAnswer(i){
  if(fillAnswered)return;
  fillAnswered=true;
  const d=fillData[fillIdx];
  const opts=document.querySelectorAll('.fill-option');
  opts.forEach((o,idx)=>{
    o.classList.add('disabled');
    if(idx===d.ans)o.classList.add('correct');
    else if(idx===i)o.classList.add('wrong');
  });
  const fb=document.getElementById('fillFb');
  if(i===d.ans){fb.textContent='🌟 ¡Correcto!';fb.style.color='#4ade80';fillScore++;}
  else{fb.textContent='🚫 La respuesta era: '+d.opts[d.ans];fb.style.color='#f87171';}
  document.getElementById('fillScore').textContent=`Puntos: ${fillScore}`;
  setTimeout(()=>{fillIdx++;renderFill();},1600);
}
function resetFill(){fillIdx=0;fillScore=0;fillAnswered=false;renderFill();}
renderFill();

// === INIT SORT ===
resetSort();
