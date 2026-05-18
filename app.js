// === PROGRESS BAR ===
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
});

// === NAV TOGGLE ===
document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.remove('open');
}));

// === VALORES ===
const valueInfo = {
  v1: { label: '🦾 Compromiso', desc: 'El equipo se compromete a alcanzar sus metas y apoyarse mutuamente para lograrlo.' },
  v2: { label: '🌟 Foco', desc: 'El equipo se concentra en el Sprint Goal y en crear valor en cada iteración.' },
  v3: { label: '🌊 Apertura', desc: 'El equipo es transparente sobre su trabajo, sus retos y los impedimentos que enfrenta.' },
  v4: { label: '🫶 Respeto', desc: 'Los miembros del equipo se respetan mutuamente como personas capaces e independientes.' },
  v5: { label: '🔥 Coraje', desc: 'El equipo tiene el coraje de hacer lo correcto y trabajar en problemas difíciles.' }
};
function toggleValue(el) {
  document.querySelectorAll('.value-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const d = valueInfo[el.id];
  const box = document.getElementById('valueDesc');
  box.style.opacity = 0;
  setTimeout(() => { box.innerHTML = `<strong>${d.label}</strong><br>${d.desc}`; box.style.opacity = 1; }, 150);
}

// === MODAL DATA ===
const modals = {
  sprint: { title: '🚀 Sprint', badge: '1–4 Semanas', desc: 'El Sprint es el corazón de Scrum. Es un ciclo de tiempo fijo donde se crea un incremento del producto.', points: ['Duración constante de 1 a 4 semanas', 'Inicia inmediatamente después del anterior', 'No se realizan cambios que pongan en riesgo el Sprint Goal', 'El alcance puede clarificarse con el Product Owner', 'Solo el Product Owner puede cancelar un Sprint'] },
  planning: { title: '🗺️ Sprint Planning', badge: 'Máx. 8h para Sprint de 1 mes', desc: 'El equipo planifica el trabajo a realizar durante el Sprint.', points: ['¿Por qué es valioso este Sprint? (Sprint Goal)', '¿Qué puede hacerse en este Sprint?', '¿Cómo se realizará el trabajo elegido?', 'Participan todos los miembros del Scrum Team', 'El resultado es el Sprint Backlog'] },
  daily: { title: '🌅 Daily Scrum', badge: '15 Minutos · Cada día', desc: 'Reunión diaria de 15 minutos para los Developers. Se sincroniza el progreso y se adapta el plan.', points: ['Siempre a la misma hora y lugar', 'Sólo para los Developers (Scrum Master puede asistir)', '¿Qué hice ayer?', '¿Qué haré hoy?', '¿Hay algún impedimento?'] },
  review: { title: '🔬 Sprint Review', badge: 'Máx. 4h para Sprint de 1 mes', desc: 'Se presenta el Incremento completado a los stakeholders y se adapta el Product Backlog.', points: ['El equipo demuestra el trabajo completado', 'Se recibe retroalimentación de stakeholders', 'Se actualiza el Product Backlog', 'Se inspecciona el progreso hacia el Product Goal', 'No es una reunión de estatus'] },
  retro: { title: '🌱 Retrospectiva', badge: 'Máx. 3h para Sprint de 1 mes', desc: 'El equipo reflexiona sobre el proceso y planifica mejoras para el próximo Sprint.', points: ['¿Qué salió bien?', '¿Qué puede mejorar?', '¿Qué haremos diferente?', 'Se identifican mejoras accionables', 'Fortalece la colaboración del equipo'] }
};
function openModal(key) {
  const d = modals[key];
  document.getElementById('modalContent').innerHTML = `
    <span class="modal-badge">${d.badge}</span>
    <h3>${d.title}</h3>
    <p>${d.desc}</p>
    <ul>${d.points.map(p => `<li>${p}</li>`).join('')}</ul>`;
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

// === MATCH GAME ===
let draggingItem = null;
function dragStart(e) { draggingItem = e.target; e.target.classList.add('dragging'); }
function dragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function dropItem(e) {
  e.preventDefault();
  const zone = e.currentTarget;
  zone.classList.remove('drag-over');
  if (draggingItem) {
    zone.querySelector('.zone-drop').appendChild(draggingItem);
    draggingItem.classList.remove('dragging');
    draggingItem = null;
  }
}
function checkMatch() {
  let score = 0, total = 0;
  document.querySelectorAll('.match-zone').forEach(zone => {
    const role = zone.dataset.role;
    zone.querySelectorAll('.match-item').forEach(item => {
      total++;
      if (item.dataset.ans === role) { item.classList.add('correct'); item.classList.remove('wrong'); score++; }
      else { item.classList.add('wrong'); item.classList.remove('correct'); }
    });
  });
  const r = document.getElementById('matchResult');
  if (score === 6) {
    r.innerHTML = '🥳 ¡Perfecto! Todas correctas';
    r.style.color = '#4ade80';
    saveScore('relacionar_columnas', 1, 1);
  }
  else { r.innerHTML = `🎯 ${score}/6 correctas. Revisa las marcadas en rojo.`; r.style.color = '#f59e0b'; }
}
function resetMatch() {
  document.querySelectorAll('.match-item').forEach(i => {
    i.classList.remove('correct', 'wrong');
    document.querySelector('.match-items').appendChild(i);
  });
  document.getElementById('matchResult').innerHTML = '';
}

// === QUIZ ===
const quizData = [
  { q: '¿Cuánto dura como máximo un Sprint?', opts: ['1 semana', '2 semanas', '4 semanas', '6 semanas'], ans: 2 },
  { q: '¿Cuánto dura el Daily Scrum?', opts: ['30 minutos', '15 minutos', '1 hora', '10 minutos'], ans: 1 },
  { q: '¿Quién puede cancelar un Sprint?', opts: ['Scrum Master', 'Los Developers', 'El Product Owner', 'El cliente'], ans: 2 },
  { q: '¿Cuál es el compromiso del Sprint Backlog?', opts: ['Product Goal', 'Sprint Goal', 'Definition of Done', 'Incremento'], ans: 1 },
  { q: '¿Qué evento ocurre al final de cada Sprint para revisar el proceso?', opts: ['Sprint Review', 'Sprint Planning', 'Daily Scrum', 'Retrospectiva'], ans: 3 },
  { q: '¿Cuántas personas puede tener máximo un Scrum Team?', opts: ['5', '10', '15', '20'], ans: 1 },
];
let qIdx = 0, qScore = 0, qAnswered = false;
function renderQuiz() {
  if (qIdx >= quizData.length) {
    document.getElementById('quizQ').textContent = '¡Quiz completado!';
    document.getElementById('quizOpts').innerHTML = '';
    document.getElementById('quizScore').textContent = `Puntuación final: ${qScore}/${quizData.length}`;
    document.getElementById('quizProg').style.width = '100%';
    saveScore('quiz_scrum', qScore, quizData.length);
    return;
  }
  const q = quizData[qIdx];
  document.getElementById('quizQ').textContent = `${qIdx + 1}/${quizData.length}. ${q.q}`;
  document.getElementById('quizFb').textContent = '';
  document.getElementById('quizScore').textContent = `Puntos: ${qScore}`;
  document.getElementById('quizProg').style.width = `${(qIdx / quizData.length) * 100}%`;
  document.getElementById('quizOpts').innerHTML = q.opts.map((o, i) =>
    `<div class="quiz-option" onclick="selectQuiz(${i})">${o}</div>`).join('');
  qAnswered = false;
}
function selectQuiz(i) {
  if (qAnswered) return;
  qAnswered = true;
  const q = quizData[qIdx];
  const opts = document.querySelectorAll('.quiz-option');
  opts.forEach((o, idx) => {
    o.classList.add('selected');
    if (idx === q.ans) o.classList.add('correct');
    else if (idx === i) o.classList.add('wrong');
  });
  const fb = document.getElementById('quizFb');
  if (i === q.ans) { fb.textContent = '🌟 ¡Correcto!'; fb.style.color = '#4ade80'; qScore++; }
  else { fb.textContent = '🚫 Incorrecto. La respuesta era: ' + q.opts[q.ans]; fb.style.color = '#f87171'; }
  document.getElementById('quizScore').textContent = `Puntos: ${qScore}`;
}
function nextQuiz() { if (!qAnswered && qIdx < quizData.length) return; qIdx++; renderQuiz(); }
function resetQuiz() { qIdx = 0; qScore = 0; qAnswered = false; renderQuiz(); }
renderQuiz();

// === TRUE/FALSE ===
const tfData = [
  { q: 'El Product Owner puede cancelar un Sprint.', ans: true, exp: 'Correcto. El Product Owner es el único que puede cancelar un Sprint.' },
  { q: 'El Daily Scrum dura 30 minutos.', ans: false, exp: 'Falso. El Daily Scrum dura exactamente 15 minutos.' },
  { q: 'Scrum solo se usa para desarrollo de software.', ans: false, exp: 'Falso. Scrum puede aplicarse a cualquier trabajo complejo y creativo.' },
  { q: 'El Scrum Master es el jefe del equipo de desarrollo.', ans: false, exp: 'Falso. El Scrum Master es un servidor-líder, no el jefe del equipo.' },
  { q: 'El Incremento debe cumplir la Definition of Done.', ans: true, exp: 'Correcto. Todo Incremento debe cumplir la DoD para ser válido.' },
  { q: 'El Product Backlog nunca está completamente terminado.', ans: true, exp: 'Correcto. El Product Backlog evoluciona mientras el producto y el mercado existen.' },
  { q: 'Un Sprint puede durar más de 4 semanas.', ans: false, exp: 'Falso. La duración máxima de un Sprint es de 4 semanas.' },
  { q: 'El equipo de desarrollo debe ser multifuncional.', ans: true, exp: 'Correcto. Los Developers tienen todas las habilidades necesarias para crear el Incremento.' },
];
let tfIdx = 0, tfScore = 0;
function renderTF() {
  if (tfIdx >= tfData.length) {
    document.getElementById('tfQ').textContent = '¡Completado!';
    document.getElementById('tfFb').textContent = '';
    document.getElementById('tfScore').textContent = `Puntuación: ${tfScore}/${tfData.length}`;
    document.getElementById('tfProg').style.width = '100%';
    saveScore('verdad_falso', tfScore, tfData.length);
    return;
  }
  document.getElementById('tfQ').textContent = `${tfIdx + 1}/${tfData.length}. ${tfData[tfIdx].q}`;
  document.getElementById('tfFb').textContent = '';
  document.getElementById('tfScore').textContent = `Puntos: ${tfScore}`;
  document.getElementById('tfProg').style.width = `${(tfIdx / tfData.length) * 100}%`;
}
function tfAnswer(val) {
  const d = tfData[tfIdx];
  const fb = document.getElementById('tfFb');
  if (val === d.ans) { fb.textContent = '🌟 ' + d.exp; fb.style.color = '#4ade80'; tfScore++; }
  else { fb.textContent = '🚫 ' + d.exp; fb.style.color = '#f87171'; }
  document.getElementById('tfScore').textContent = `Puntos: ${tfScore}`;
  setTimeout(() => { tfIdx++; renderTF(); }, 1800);
}
function resetTF() { tfIdx = 0; tfScore = 0; renderTF(); }
renderTF();

// === SORT GAME ===
let sortDragging = null;
function sortDrag(e) { sortDragging = e.target; }
function sortOver(e) { e.preventDefault(); document.querySelectorAll('.sort-item').forEach(i => i.classList.remove('drag-over-top')); e.currentTarget.classList.add('drag-over-top'); }
function sortDrop(e) {
  e.preventDefault();
  const target = e.currentTarget;
  document.querySelectorAll('.sort-item').forEach(i => i.classList.remove('drag-over-top'));
  if (sortDragging && sortDragging !== target) {
    const container = document.getElementById('sortGame');
    const items = [...container.children];
    const fromIdx = items.indexOf(sortDragging);
    const toIdx = items.indexOf(target);
    if (fromIdx < toIdx) container.insertBefore(sortDragging, target.nextSibling);
    else container.insertBefore(sortDragging, target);
  }
  sortDragging = null;
}
function checkSort() {
  const items = [...document.querySelectorAll('.sort-item')];
  let correct = 0;
  items.forEach((item, idx) => {
    item.classList.remove('correct-pos', 'wrong-pos');
    if (parseInt(item.dataset.order) === idx + 1) { item.classList.add('correct-pos'); correct++; }
    else item.classList.add('wrong-pos');
  });
  const r = document.getElementById('sortResult');
  if (correct === 5) {
    r.innerHTML = '🥳 ¡Orden perfecto!';
    r.style.color = '#4ade80';
    saveScore('ordenar_sprint', 1, 1);
  }
  else { r.innerHTML = `🎯 ${correct}/5 en la posición correcta`; r.style.color = '#f59e0b'; }
}
function resetSort() {
  const c = document.getElementById('sortGame');
  const items = [...c.children];
  items.sort(() => Math.random() - .5).forEach(i => {
    i.classList.remove('correct-pos', 'wrong-pos');
    c.appendChild(i);
  });
  document.getElementById('sortResult').innerHTML = '';
}

// === FILL GAME ===
const fillData = [
  { q: 'El ___ es responsable de gestionar el Product Backlog.', opts: ['Scrum Master', 'Product Owner', 'Developer', 'Stakeholder'], ans: 1 },
  { q: 'El Daily Scrum es una reunión de ___ minutos.', opts: ['30', '60', '15', '45'], ans: 2 },
  { q: 'Los ___ representan el trabajo en Scrum.', opts: ['Roles', 'Artefactos', 'Valores', 'Principios'], ans: 1 },
  { q: 'La ___ asegura que el Incremento es de calidad.', opts: ['Sprint Review', 'Daily Scrum', 'Definition of Done', 'Retrospectiva'], ans: 2 },
  { q: 'El ___ protege al equipo de interrupciones externas.', opts: ['Product Owner', 'Developer', 'Scrum Master', 'Stakeholder'], ans: 2 },
];
let fillIdx = 0, fillScore = 0, fillAnswered = false;
function renderFill() {
  if (fillIdx >= fillData.length) {
    document.getElementById('fillQ').textContent = '¡Juego completado!';
    document.getElementById('fillOpts').innerHTML = '';
    document.getElementById('fillScore').textContent = `Puntuación: ${fillScore}/${fillData.length}`;
    saveScore('completar_frase', fillScore, fillData.length);
    return;
  }
  const d = fillData[fillIdx];
  document.getElementById('fillQ').innerHTML = d.q.replace('___', '<span style="background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:700">___</span>');
  document.getElementById('fillFb').textContent = '';
  document.getElementById('fillScore').textContent = `Puntos: ${fillScore}`;
  document.getElementById('fillOpts').innerHTML = d.opts.map((o, i) =>
    `<div class="fill-option" onclick="fillAnswer(${i})">${o}</div>`).join('');
  fillAnswered = false;
}
function fillAnswer(i) {
  if (fillAnswered) return;
  fillAnswered = true;
  const d = fillData[fillIdx];
  const opts = document.querySelectorAll('.fill-option');
  opts.forEach((o, idx) => {
    o.classList.add('disabled');
    if (idx === d.ans) o.classList.add('correct');
    else if (idx === i) o.classList.add('wrong');
  });
  const fb = document.getElementById('fillFb');
  if (i === d.ans) { fb.textContent = '🌟 ¡Correcto!'; fb.style.color = '#4ade80'; fillScore++; }
  else { fb.textContent = '🚫 La respuesta era: ' + d.opts[d.ans]; fb.style.color = '#f87171'; }
  document.getElementById('fillScore').textContent = `Puntos: ${fillScore}`;
  setTimeout(() => { fillIdx++; renderFill(); }, 1600);
}
function resetFill() { fillIdx = 0; fillScore = 0; fillAnswered = false; renderFill(); }
renderFill();


// === INIT SORT ===
resetSort();

// === AUTH LOGIC ===
let authMode = 'login'; // 'login' o 'signup'

function openAuthModal() {
  document.getElementById('authModalOverlay').classList.add('open');
}

function closeAuthModal() {
  document.getElementById('authModalOverlay').classList.remove('open');
}

function toggleAuthMode(e) {
  e.preventDefault();
  authMode = authMode === 'login' ? 'signup' : 'login';

  const title = document.getElementById('authTitle');
  const subtitle = document.getElementById('authSubtitle');
  const btn = document.getElementById('authBtn');
  const toggleText = document.getElementById('toggleText');
  const signupFields = document.querySelectorAll('.signup-only');

  if (authMode === 'signup') {
    title.textContent = 'Crea tu cuenta';
    subtitle.textContent = 'Únete a la comunidad y domina Scrum';
    btn.textContent = 'Registrarse';
    signupFields.forEach(f => f.style.display = 'block');
    toggleText.innerHTML = '¿Ya tienes cuenta? <a href="#" onclick="toggleAuthMode(event)">Inicia sesión</a>';
  } else {
    title.textContent = 'Bienvenido de nuevo';
    subtitle.textContent = 'Ingresa tus credenciales para continuar aprendiendo';
    btn.textContent = 'Entrar';
    signupFields.forEach(f => f.style.display = 'none');
    toggleText.innerHTML = '¿No tienes cuenta? <a href="#" onclick="toggleAuthMode(event)">Regístrate aquí</a>';
  }
}

function getFriendlyErrorMessage(error) {
  if (!error) return 'Ocurrió un error inesperado.';
  const code = error.code || '';
  const msg = error.message || '';
  
  if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
    return 'El correo electrónico ya está registrado. Si el registro falló anteriormente a mitad de camino, intenta iniciar sesión directamente con esta cuenta.';
  }
  if (code === 'auth/weak-password' || msg.includes('weak-password')) {
    return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
  }
  if (code === 'auth/invalid-email' || msg.includes('invalid-email')) {
    return 'El formato del correo electrónico no es válido.';
  }
  if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
    return 'El inicio de sesión por Correo y Contraseña está desactivado en tu consola de Firebase. Debes activarlo en Authentication > Sign-in method.';
  }
  if (code === 'auth/user-not-found' || msg.includes('user-not-found')) {
    return 'No se encontró ningún usuario con este correo electrónico.';
  }
  if (code === 'auth/wrong-password' || msg.includes('wrong-password')) {
    return 'La contraseña es incorrecta.';
  }
  if (code === 'auth/invalid-credential' || msg.includes('invalid-credential')) {
    return 'Credenciales inválidas. Por favor verifica tu correo y contraseña.';
  }
  if (msg.includes('permission_denied') || code.includes('PERMISSION_DENIED')) {
    return 'Error de permisos en Firebase Realtime Database. Debes configurar las Reglas de Seguridad en tu consola de Firebase para permitir lecturas y escrituras.';
  }
  return error.message || 'Ocurrió un error inesperado.';
}

async function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value;
  const name = document.getElementById('regName').value.trim();
  const code = document.getElementById('regCode').value.trim();

  if (!window.firebaseAuth) {
    alert("Error: Firebase no se ha inicializado correctamente. Revisa tu configuración en index.html");
    return;
  }

  const { auth, db, ref, set, createUserWithEmailAndPassword, signInWithEmailAndPassword } = window.firebaseAuth;

  try {
    if (authMode === 'login') {
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        alert('¡Bienvenido de nuevo!');
      } catch (loginError) {
        throw new Error(getFriendlyErrorMessage(loginError));
      }
    } else {
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      } catch (signUpError) {
        throw new Error(getFriendlyErrorMessage(signUpError));
      }
      
      const user = userCredential.user;

      // GUARDAR PERFIL EN LA DB (si falla por permisos de base de datos, no bloqueamos la sesión del usuario)
      try {
        await set(ref(db, 'users/' + user.uid + '/profile'), {
          name: name,
          code: code,
          email: email,
          createdAt: new Date().toISOString()
        });
        alert('¡Cuenta creada y datos guardados exitosamente!');
      } catch (dbError) {
        console.error("Error al guardar perfil en la base de datos:", dbError);
        alert('¡Cuenta creada con éxito! Sin embargo, tus datos de perfil no se pudieron guardar en la base de datos debido a que las Reglas de Seguridad de Firebase Realtime Database están configuradas para denegar escritura. Tu sesión se iniciará de todos modos.');
      }
    }
    closeAuthModal();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Escuchar cambios en la sesión de forma robusta con polling para evitar condiciones de carrera en la carga de Firebase
function setupFirebaseListeners() {
  const { auth, db, ref, onValue, onAuthStateChanged } = window.firebaseAuth;

  onAuthStateChanged(auth, (user) => {
    const navItem = document.getElementById('authNavItem');
    const heroTitle = document.getElementById('heroTitle');

    if (user) {
      // Sincronizar logros guardados localmente a la base de datos
      syncLocalScoresToFirebase(user);

      // 1. Actualización inmediata con datos locales
      const initialName = user.displayName || user.email.split('@')[0];
      renderUserNavbar(initialName);
      heroTitle.innerHTML = `¡Hola, <span class="gradient-text">${initialName.split(' ')[0]}</span>! 👋<br>Aprende Scrum de forma divertida`;

      // 2. Sincronización con la Base de Datos
      const profileRef = ref(db, 'users/' + user.uid + '/profile');
      onValue(profileRef, (snapshot) => {
        const data = snapshot.val();

        // Verificar si falta el código de grupo
        if (!data || !data.code) {
          document.getElementById('completeProfileOverlay').classList.add('open');
        } else {
          document.getElementById('completeProfileOverlay').classList.remove('open');
        }

        if (data && data.name) {
          renderUserNavbar(data.name);
          document.getElementById('heroTitle').innerHTML = `¡Hola, <span class="gradient-text">${data.name.split(' ')[0]}</span>! 👋<br>Aprende Scrum de forma divertida`;
        }
      }, (error) => {
        console.error("Error al leer perfil:", error);
      });
    } else {
      // Usuario deslogueado
      document.getElementById('heroTitle').innerHTML = `Aprende <span class="gradient-text">Scrum</span><br>de forma divertida`;
      navItem.innerHTML = `<button class="nav-auth-btn" onclick="openAuthModal()">Iniciar Sesión</button>`;
    }
  });

  function renderUserNavbar(name) {
    const navItem = document.getElementById('authNavItem');
    const initial = name.charAt(0).toUpperCase();
    navItem.innerHTML = `
      <div class="user-profile" onclick="openProfileModal()" style="cursor:pointer">
        <div class="user-avatar">${initial}</div>
        <span style="font-size:.85rem; font-weight:500">${name}</span>
        <button onclick="event.stopPropagation(); window.firebaseAuth.signOut(window.firebaseAuth.auth)" title="Cerrar Sesión" style="background:none; border:none; color:var(--pink); cursor:pointer; font-size:1.2rem; margin-left:.5rem">✕</button>
      </div>
    `;
  }
}

function initFirebaseSessionListener() {
  if (window.firebaseAuth) {
    setupFirebaseListeners();
    checkAdminAccess();
  } else {
    let retries = 0;
    const interval = setInterval(() => {
      retries++;
      if (window.firebaseAuth) {
        clearInterval(interval);
        setupFirebaseListeners();
        checkAdminAccess();
      } else if (retries >= 100) {
        clearInterval(interval);
        console.error("⚠️ Firebase tardó más de 10 segundos en cargarse. Inicialización abortada.");
      }
    }, 100);
  }
}

// Iniciar detector de sesión
initFirebaseSessionListener();

// === PROFILE LOGIC ===
function getLocalScores() {
  let localScores = {};
  try {
    const stored = localStorage.getItem('scrum_scores');
    if (stored) {
      if (stored === '[object Object]') {
        console.warn("⚠️ Dato corrupto '[object Object]' detectado en localStorage. Autocorrigiendo...");
        localStorage.setItem('scrum_scores', '{}');
        return {};
      }
      localScores = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error al recuperar logros locales de localStorage:", e);
    localStorage.setItem('scrum_scores', '{}');
  }
  return localScores || {};
}

function updateProfileModalUI(firebaseScores, user) {
  // Obtener logros guardados localmente de forma segura y autocorregible
  const localScores = getLocalScores();

  // Combinar puntajes: usar el puntaje más alto obtenido entre Firebase y localStorage
  const scores = {};
  const keys = ['quiz_scrum', 'verdad_falso', 'completar_frase', 'ordenar_sprint', 'relacionar_columnas'];
  keys.forEach(k => {
    const fbScore = firebaseScores[k]?.score || 0;
    const locScore = localScores[k]?.score || 0;
    const totalQuestions = k === 'quiz_scrum' ? 6 : (k === 'verdad_falso' ? 8 : (k === 'completar_frase' ? 5 : 1));
    
    scores[k] = {
      score: Math.max(fbScore, locScore),
      total: totalQuestions
    };
  });

  // CALCULAR NIVELES Y PROGRESO DE MAESTRÍA
  const perfectScores = [
    (scores.quiz_scrum?.score || 0) >= 6,
    (scores.verdad_falso?.score || 0) >= 8,
    (scores.completar_frase?.score || 0) >= 5,
    (scores.ordenar_sprint?.score || 0) >= 1,
    (scores.relacionar_columnas?.score || 0) >= 1
  ].filter(Boolean).length;

  let level = "Novato de Scrum";
  let progress = (perfectScores / 5) * 100;

  if (perfectScores === 1) level = "Aprendiz Ágil";
  if (perfectScores === 2) level = "Practicante Pro";
  if (perfectScores === 3) level = "Experto de Roles";
  if (perfectScores === 4) level = "Experto en Eventos";
  if (perfectScores === 5) level = "👑 SCRUM MASTER";

  document.getElementById('pLevelBadge').textContent = `Rango: ${level}`;
  document.getElementById('pProgressText').textContent = `${Math.round(progress)}%`;
  document.getElementById('pProgressBar').style.width = `${progress}%`;

  // Efecto Maestro
  const modalBox = document.querySelector('.profile-modal');
  if (perfectScores === 5) modalBox.classList.add('master-mode');
  else modalBox.classList.remove('master-mode');

  // Mostrar puntajes detallados
  document.getElementById('pStats').innerHTML = `
    <div class="stat-item"><span>Relacionar Columnas:</span> <strong>${scores.relacionar_columnas?.score || 0}/1 ${scores.relacionar_columnas?.score >= 1 ? '⭐' : ''}</strong></div>
    <div class="stat-item"><span>Quiz Scrum:</span> <strong>${scores.quiz_scrum?.score || 0}/6 ${scores.quiz_scrum?.score >= 6 ? '⭐' : ''}</strong></div>
    <div class="stat-item"><span>Verdadero/Falso:</span> <strong>${scores.verdad_falso?.score || 0}/8 ${scores.verdad_falso?.score >= 8 ? '⭐' : ''}</strong></div>
    <div class="stat-item"><span>Completar Frase:</span> <strong>${scores.completar_frase?.score || 0}/5 ${scores.completar_frase?.score >= 5 ? '⭐' : ''}</strong></div>
    <div class="stat-item"><span>Ordenar Sprint:</span> <strong>${scores.ordenar_sprint?.score || 0}/1 ${scores.ordenar_sprint?.score >= 1 ? '⭐' : ''}</strong></div>
  `;
}

function openProfileModal() {
  if (!window.firebaseAuth) return;
  const { auth, db, ref, onValue } = window.firebaseAuth;
  const user = auth.currentUser;
  if (!user) return;

  // Cargar datos de perfil y puntajes
  const userRef = ref(db, 'users/' + user.uid);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val() || {};
    const profile = data.profile || {};
    const firebaseScores = data.scores || {};
    const name = profile.name || user.displayName || user.email.split('@')[0];

    document.getElementById('pName').textContent = name;
    document.getElementById('pAvatar').textContent = name.charAt(0).toUpperCase();

    updateProfileModalUI(firebaseScores, user);
  }, (error) => {
    console.error("Error al leer de Firebase en openProfileModal:", error);
    // Usar datos locales si hay error de base de datos o de permisos
    const name = user.displayName || user.email.split('@')[0];
    document.getElementById('pName').textContent = name;
    document.getElementById('pAvatar').textContent = name.charAt(0).toUpperCase();
    
    updateProfileModalUI({}, user);
  });
  document.getElementById('profileModalOverlay').classList.add('open');
}

function closeProfileModal() {
  document.getElementById('profileModalOverlay').classList.remove('open');
}

async function handleGoogleLogin() {
  if (!window.firebaseAuth) {
    alert("Error: Firebase no se ha inicializado correctamente.");
    return;
  }

  const { auth, GoogleAuthProvider, signInWithPopup } = window.firebaseAuth;
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    alert('¡Sesión iniciada con Google!');
    closeAuthModal();
  } catch (error) {
    console.error(error);
    alert('Error al iniciar sesión con Google: ' + error.message);
  }
}

// === DATABASE LOGIC ===
async function syncLocalScoresToFirebase(currentUser) {
  if (!window.firebaseAuth) return;

  const { auth, db, ref, set } = window.firebaseAuth;
  const user = currentUser || auth.currentUser;
  if (!user) return;

  try {
    const localScores = getLocalScores();

    for (const gameName in localScores) {
      try {
        const data = localScores[gameName];
        if (!data) continue;
        const userRef = ref(db, 'users/' + user.uid + '/scores/' + gameName);
        await set(userRef, {
          score: Number(data.score) || 0,
          total: Number(data.total) || 0,
          date: data.date || new Date().toISOString(),
          email: user.email || null
        });
        console.log(`Puntaje de ${gameName} sincronizado de localStorage a Firebase.`);
      } catch (itemError) {
        console.error(`Error al sincronizar puntaje individual de ${gameName}:`, itemError);
      }
    }
  } catch (error) {
    console.error("Error al sincronizar puntajes locales a Firebase:", error);
  }
}

async function saveScore(gameName, score, total) {
  // 1. Guardar siempre de forma local en localStorage para que el progreso no se pierda jamás
  try {
    const localScores = getLocalScores();
    const currentBest = localScores[gameName]?.score || 0;
    
    // Guardar solo si es una mejor o igual puntuación
    if (score >= currentBest) {
      localScores[gameName] = {
        score: Number(score) || 0,
        total: Number(total) || 0,
        date: new Date().toISOString()
      };
      localStorage.setItem('scrum_scores', JSON.stringify(localScores));
      console.log(`Logro de ${gameName} guardado localmente: ${score}/${total}`);
    }
  } catch (err) {
    console.error("Error al guardar en localStorage:", err);
  }

  // 2. Si el usuario está logueado, sincronizarlo inmediatamente a Firebase
  if (!window.firebaseAuth || !window.firebaseAuth.auth.currentUser) {
    console.log("Usuario no logueado. El progreso se ha respaldado localmente.");
    return;
  }

  const { auth, db, ref, set } = window.firebaseAuth;
  const user = auth.currentUser;

  try {
    const userRef = ref(db, 'users/' + user.uid + '/scores/' + gameName);
    await set(userRef, {
      score: Number(score) || 0,
      total: Number(total) || 0,
      date: new Date().toISOString(),
      email: user.email || null
    });
    console.log(`Puntaje de ${gameName} guardado exitosamente en Firebase.`);
  } catch (error) {
    console.error("Error al guardar puntaje en Firebase:", error);
    // Mostrar un aviso informativo si Firebase deniega los permisos
    if (error.code === 'PERMISSION_DENIED' || error.message.includes('permission_denied')) {
      console.warn("⚠️ Las reglas de seguridad de Firebase impidieron la escritura directa en la base de datos.");
    }
  }
}

async function saveGoogleExtraData() {
  const code = document.getElementById('googleGroupCode').value;
  if (!code) return alert("Por favor ingresa tu número de grupo");

  const { auth, db, ref, set } = window.firebaseAuth;
  const user = auth.currentUser;

  if (user) {
    try {
      await set(ref(db, 'users/' + user.uid + '/profile'), {
        name: user.displayName || user.email.split('@')[0],
        code: code,
        email: user.email,
        method: 'google',
        updatedAt: new Date().toISOString()
      });
      document.getElementById('completeProfileOverlay').classList.remove('open');
      alert('¡Perfil completado!');
    } catch (error) {
      console.error(error);
      alert('Error al guardar: ' + getFriendlyErrorMessage(error));
    }
  }
}

async function runAchievementsDiagnostic() {
  if (!window.firebaseAuth) {
    alert("❌ ERROR: Firebase no se ha cargado. Revisa tu conexión a internet.");
    return;
  }

  const { auth, db, ref, set } = window.firebaseAuth;
  const user = auth.currentUser;

  if (!user) {
    alert("❌ ERROR: No hay ningún usuario logueado en la sesión de Firebase.\n👉 SOLUCIÓN: Cierra este modal e inicia sesión con Google.");
    return;
  }

  let dbStatus = "Probando conexión...";
  try {
    const testRef = ref(db, 'users/' + user.uid + '/scores/diagnostic_test');
    await set(testRef, {
      lastTested: new Date().toISOString(),
      status: "success",
      email: user.email || null
    });
    dbStatus = "✅ ¡ESCRITURA EXITOSA! La base de datos está conectada y acepta tus logros.";
  } catch (dbErr) {
    console.error("Error en test de base de datos:", dbErr);
    dbStatus = `❌ RECHAZADO: ${dbErr.message}\n👉 DETALLE: Tus reglas de Firebase siguen bloqueadas. ¿Publicaste las reglas a "true" en tu consola?`;
  }

  let localScores = "[Vacío]";
  try {
    localScores = localStorage.getItem('scrum_scores') || "[Vacío]";
  } catch (e) {
    localScores = `Error: ${e.message}`;
  }

  const msg = `=== REPORTE DE CONEXIÓN SCRUM ===\n\n` +
              `📡 ESTADO DE BASE DE DATOS:\n${dbStatus}\n\n` +
              `👤 USUARIO: ${user.displayName || user.email} (${user.uid})\n` +
              `📊 LOGROS LOCALES: ${localScores}`;

  alert(msg);
}

// === EXPOSE FUNCTIONS TO WINDOW FOR HTML ONCLICK COMPATIBILITY ===
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.toggleAuthMode = toggleAuthMode;
window.handleGoogleLogin = handleGoogleLogin;
window.handleAuth = handleAuth;
window.saveGoogleExtraData = saveGoogleExtraData;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.toggleValue = toggleValue;
window.openModal = openModal;
window.closeModal = closeModal;
window.checkMatch = checkMatch;
window.resetMatch = resetMatch;
window.selectQuiz = selectQuiz;
window.nextQuiz = nextQuiz;
window.resetQuiz = resetQuiz;
window.tfAnswer = tfAnswer;
window.resetTF = resetTF;
window.checkSort = checkSort;
window.resetSort = resetSort;
window.fillAnswer = fillAnswer;
window.resetFill = resetFill;
window.runAchievementsDiagnostic = runAchievementsDiagnostic;
window.filterAdminTable = filterAdminTable;
window.exportAdminDataToCSV = exportAdminDataToCSV;

// === SECCIÓN DE ADMINISTRACIÓN Y REPORTES ===
let allUsersList = [];

function checkAdminAccess() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('info') || urlParams.has('infose')) {
    const adminSec = document.getElementById('adminSection');
    if (adminSec) adminSec.style.display = 'block';
    loadAdminData();
  }
}

function loadAdminData() {
  if (!window.firebaseAuth) {
    setTimeout(loadAdminData, 500);
    return;
  }

  const { db, ref, onValue } = window.firebaseAuth;
  const usersRef = ref(db, 'users');

  onValue(usersRef, (snapshot) => {
    const usersData = snapshot.val() || {};
    renderAdminTable(usersData);
  }, (error) => {
    console.error("Error al cargar datos de administración:", error);
    const tbody = document.getElementById('adminTableBody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #f87171; padding: 2rem;">❌ Error al leer la base de datos: ${error.message}</td></tr>`;
    }
  });
}

function renderAdminTable(usersData) {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  allUsersList = [];
  
  for (const uid in usersData) {
    const userObj = usersData[uid];
    if (!userObj) continue;

    const profile = userObj.profile || {};
    if (!profile.email && !profile.name) continue;

    const email = profile.email || 'Sin correo';
    const name = profile.name || 'Usuario sin nombre';
    const group = profile.code || 'Sin grupo';
    const scores = userObj.scores || {};

    const columnsScore = scores.relacionar_columnas?.score || 0;
    const quizScore = scores.quiz_scrum?.score || 0;
    const vfScore = scores.verdad_falso?.score || 0;
    const fillScore = scores.completar_frase?.score || 0;
    const sortScore = scores.ordenar_sprint?.score || 0;

    const perfectScores = [
      columnsScore >= 1,
      quizScore >= 6,
      vfScore >= 8,
      fillScore >= 5,
      sortScore >= 1
    ].filter(Boolean).length;

    const masteryProgress = Math.round((perfectScores / 5) * 100);

    allUsersList.push({
      uid,
      name,
      email,
      group,
      masteryProgress,
      columnsScore,
      quizScore,
      vfScore,
      fillScore,
      sortScore
    });
  }

  allUsersList.sort((a, b) => a.name.localeCompare(b.name));
  displayFilteredUsers(allUsersList);
}

function displayFilteredUsers(list) {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text2); padding: 2rem;">No se encontraron registros de estudiantes.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(u => {
    return `
      <tr>
        <td>
          <div style="font-weight: 600; color: #fff;">${u.name}</div>
          <div style="font-size: 0.75rem; color: var(--text2);">${u.email}</div>
        </td>
        <td style="font-weight: 500; color: var(--text1);">${u.group}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 50px; background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden;">
              <div style="width: ${u.masteryProgress}%; height: 100%; background: linear-gradient(90deg, var(--purple), var(--pink));"></div>
            </div>
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--pink);">${u.masteryProgress}%</span>
          </div>
        </td>
        <td style="text-align: center;">${u.columnsScore}/1 ${u.columnsScore >= 1 ? '⭐' : ''}</td>
        <td style="text-align: center;">${u.quizScore}/6 ${u.quizScore >= 6 ? '⭐' : ''}</td>
        <td style="text-align: center;">${u.vfScore}/8 ${u.vfScore >= 8 ? '⭐' : ''}</td>
        <td style="text-align: center;">${u.fillScore}/5 ${u.fillScore >= 5 ? '⭐' : ''}</td>
        <td style="text-align: center;">${u.sortScore}/1 ${u.sortScore >= 1 ? '⭐' : ''}</td>
      </tr>
    `;
  }).join('');
}

function filterAdminTable() {
  const search = document.getElementById('adminSearchInput').value.toLowerCase().trim();
  if (!search) {
    displayFilteredUsers(allUsersList);
    return;
  }

  const filtered = allUsersList.filter(u => 
    u.name.toLowerCase().includes(search) || 
    u.email.toLowerCase().includes(search) || 
    u.group.toLowerCase().includes(search)
  );

  displayFilteredUsers(filtered);
}

function exportAdminDataToCSV() {
  if (allUsersList.length === 0) return alert("No hay datos para exportar");

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  csvContent += "Nombre,Correo,Grupo,Progreso Masteria (%),Relacionar Columnas (1),Quiz Scrum (6),Verdadero/Falso (8),Completar Frase (5),Ordenar Sprint (1)\n";

  allUsersList.forEach(u => {
    const row = [
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.group}"`,
      u.masteryProgress,
      u.columnsScore,
      u.quizScore,
      u.vfScore,
      u.fillScore,
      u.sortScore
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Reporte_Progreso_Scrum_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
