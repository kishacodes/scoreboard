const E=e=>{if(!e)return"";const a={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",a)},I=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",p=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;"),Q=e=>{if(!e)return new Date(NaN);if(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?$/.test(e)){const o=e.replace(" ","T"),m=e.length===16?`${o}:00Z`:`${o}Z`;return new Date(m)}return new Date(e)},O=e=>{const a=Q(e);return isNaN(a.getTime())?String(e||""):a.toLocaleTimeString("en-US",{timeZone:"America/Chicago",hour:"numeric",minute:"2-digit"})},G=e=>{e.querySelectorAll(".game-card[data-game-id]").forEach(a=>{const o=a,m=o.getAttribute("data-game-id"),d=o.querySelector(".updates-details");if(!d||!m)return;const i=o.querySelector(".updates-list"),c=o.querySelector(".updates-heading");d.addEventListener("toggle",async()=>{if(d.open&&d.getAttribute("data-loaded")!=="true")try{const r=await fetch(`/api/games/${m}/updates`),l=r.ok?await r.json():[];if(c&&(c.textContent=l.length>0?`Recent Updates (${l.length})`:"Recent Updates (0)"),!i)return;const v=o.querySelectorAll(".team .team-name"),f=v[0]?.textContent?.trim()||"EHS",S=v[1]?.textContent?.trim()||"Opponent";!l||l.length===0?i.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>':i.innerHTML=l.map(n=>{const h=n.qtr||n.ehs_score!=null||n.opp_score!=null?`<div class="update-meta">${p(n.qtr||"")}${n.qtr?": ":""}${p(f)} ${p(String(n.ehs_score??""))}, ${p(S)} ${p(String(n.opp_score??""))}</div>`:"";return`<li class="update-item">
                <div class="update-row">
                  <span class="update-text" title="${p(n.update_text)}">${p(n.update_text)}</span>
                  <span class="update-timestamp">${p(O(n.created_at))}</span>
                </div>
                ${h}
              </li>`}).join(""),i&&i.querySelectorAll(".update-text").forEach(h=>{const s=h;s.setAttribute("role","button"),s.setAttribute("tabindex","0"),s.setAttribute("aria-expanded","false"),s.style.cursor="pointer";const y=()=>{const t=s.classList.toggle("expanded");s.setAttribute("aria-expanded",t?"true":"false")};s.addEventListener("click",y),s.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),y())}),requestAnimationFrame(()=>{s.scrollHeight>s.clientHeight||(s.removeAttribute("role"),s.removeAttribute("tabindex"),s.removeAttribute("aria-expanded"),s.style.cursor="")})}),d.setAttribute("data-loaded","true")}catch{c&&(c.textContent="Recent Updates (0)"),i&&(i.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>'),d.setAttribute("data-loaded","true")}})})},D=document.querySelector('[data-page="admin"]')!==null,Z=e=>{if(D)return`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${E(e.gameDate)}</span>
            <span class="game-level">${I(e.teams)}</span>
          </div>
          <div class="game-body">
            <div class="team">
              <span class="team-name">${e.ehs}</span>
              <input type="number" class="team-score-input" value="${e.ehsScore!==void 0?e.ehsScore:e.ehsFinal}" />
            </div>
            <div class="team">
              <span class="team-name">${e.opp}</span>
              <input type="number" class="team-score-input" value="${e.oppScore!==void 0?e.oppScore:e.oppFinal}" />
            </div>
            <div class="game-over-container">
              <label class="game-over-label">
                <input type="checkbox" class="game-over-checkbox" value="1" ${e.final===1?"checked":""} />
                Game Over?
              </label>
              ${e.final===1?'<span class="game-final">FINAL</span>':""}
            </div>
          </div>
          <div class="game-update-section">
            <div class="update-input-group">
              <div class="game-meta-inputs">
                <select class="quarter-select" aria-label="Quarter">
                  <option value="">-- Quarter --</option>
                  <option value="1st quarter">1st Quarter</option>
                  <option value="2nd quarter">2nd Quarter</option>
                  <option value="3rd quarter">3rd Quarter</option>
                  <option value="4th quarter">4th Quarter</option>
                </select>
                <input type="text" class="time-input" placeholder="Time (e.g. 4:30)" aria-label="Time in quarter" />
              </div>
              <input type="text" class="update-text-input" placeholder="Add update note (optional)" data-game-id="${e.id}" />
              <button class="update-button">Update Score</button>
            </div>
            <div class="update-history" id="update-history-${e.id}"></div>
          </div>
        </div>
      `;{let a="";return e.final===1?a=`
          <div class="game-status">
            <span class="game-final">FINAL</span>
          </div>
        `:(e.qtr||e.timeInqtr)&&(a=`
          <div class="game-status">
            ${e.qtr?`<span class="game-quarter">${e.qtr}</span>`:""}
            ${e.timeInqtr?`<span class="game-time">${e.timeInqtr}</span>`:""}
          </div>
        `),`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${E(e.gameDate)}</span>
            <span class="game-level">${I(e.teams)}</span>
          </div>
          <div class="game-body">
            <div class="team">
              <span class="team-name">${e.ehs}</span>
              <span class="team-score">${e.ehsScore!==void 0?e.ehsScore:e.ehsFinal}</span>
            </div>
            <div class="team">
              <span class="team-name">${e.opp}</span>
              <span class="team-score">${e.oppScore!==void 0?e.oppScore:e.oppFinal}</span>
            </div>
            ${a}
          </div>
          <div class="game-footer">
            ${e.comments?`<p class="game-comment">${e.comments}</p>`:""}
            <div class="game-updates">
              <details class="updates-details" data-loaded="false">
                <summary class="updates-heading">Recent Updates</summary>
                <ul class="updates-list" aria-live="polite"></ul>
              </details>
            </div>
          </div>
        </div>
      `}};document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),a=document.querySelector(".scoreboard-container");if(!e||!a)return;const o=c=>{document.cookie="auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;",localStorage.removeItem("authToken"),window.location.href=`/login?returnTo=${encodeURIComponent(window.location.pathname)}`},m=()=>{const r=document.cookie.split("; ").find(l=>l.startsWith("auth="));return r?decodeURIComponent(r.split("=")[1]):localStorage.getItem("authToken")};async function d(){const c=new FormData(e),r=new URLSearchParams,l=c.get("team"),v=c.get("teams"),f=c.get("gameDate");l&&r.append("team",l),v&&r.append("teams",v),f&&r.append("gameDate",f);const n=await(await fetch(`/api/games?${r.toString()}`)).json();if(n&&n.length>0&&a){const h=n.map(Z).join("");a.innerHTML=`<div class="scoreboard-grid">${h}</div>`,G(a),D&&a.querySelectorAll(".update-button").forEach(s=>{s.addEventListener("click",async y=>{const t=y.target,u=t.closest(".game-card");if(!u)return;const U=u.dataset.gameId,x=u.querySelectorAll(".team-score-input"),b=u.querySelector(".update-text-input"),q=u.querySelector(".quarter-select"),H=q instanceof HTMLSelectElement?q:null,T=u.querySelector(".time-input"),F=T instanceof HTMLInputElement?T:null,M=u.querySelector(".game-over-checkbox"),N=b?.value.trim()||"",R=H?.value||"",_=F?.value.trim()||"",j=!!M?.checked,A=x[0]?.value??"0",C=x[1]?.value??"0",L=m();if(!L){o();return}const k=t.textContent;t.textContent="Updating...",t.setAttribute("disabled","true");try{const g={ehsScore:parseInt(A,10),oppScore:parseInt(C,10),updateText:N,qtr:R,timeInqtr:_};j&&(g.final=1,g.ehsFinal=parseInt(A,10),g.oppFinal=parseInt(C,10));const $=await fetch(`/api/games/${U}`,{method:"PATCH",credentials:"include",headers:{"Content-Type":"application/json",Authorization:`Bearer ${L.trim()}`},body:JSON.stringify(g)});let w={};try{w=await $.json()}catch{}if(!$.ok){if($.status===401){t.textContent="Auth Error",t.style.backgroundColor="#d9534f",setTimeout(()=>o("Session expired"),500);return}throw new Error(w?.error||"Failed to update score")}b&&(b.value=""),t.textContent="Updated!",setTimeout(()=>{t.textContent=k||"Update Score",t.removeAttribute("disabled"),t.style.backgroundColor=""},2e3)}catch{t.textContent="Error!",t.style.backgroundColor="#d9534f",setTimeout(()=>{t.textContent=k||"Update Score",t.removeAttribute("disabled"),t.style.backgroundColor=""},3e3)}})})}else a.innerHTML="<p>No games found matching your criteria.</p>"}let i;e.addEventListener("input",()=>{clearTimeout(i),i=window.setTimeout(d,300)}),e.addEventListener("reset",()=>{setTimeout(d,0)})});
