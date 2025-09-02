const w=e=>{if(!e)return"";const t={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",t)},L=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",g=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;"),Q=e=>{if(!e)return new Date(NaN);if(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?$/.test(e)){const n=e.replace(" ","T"),l=e.length===16?`${n}:00Z`:`${n}Z`;return new Date(l)}return new Date(e)},G=e=>{const t=Q(e);return isNaN(t.getTime())?String(e||""):t.toLocaleTimeString("en-US",{timeZone:"America/Chicago",hour:"numeric",minute:"2-digit"})},O=e=>{e.querySelectorAll(".game-card[data-game-id]").forEach(t=>{const n=t,l=n.getAttribute("data-game-id"),i=n.querySelector(".updates-details");if(!i||!l)return;const c=n.querySelector(".updates-list"),o=n.querySelector(".updates-heading");i.addEventListener("toggle",async()=>{if(i.open&&i.getAttribute("data-loaded")!=="true")try{const s=await fetch(`/api/games/${l}/updates`),r=s.ok?await s.json():[];if(o&&(o.textContent=r.length>0?`Recent Updates (${r.length})`:"Recent Updates (0)"),!c)return;!r||r.length===0?c.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>':c.innerHTML=r.map(p=>`<li class="update-item"><div class="update-row"><span class="update-text" title="${g(p.update_text)}">${g(p.update_text)}</span><span class="update-timestamp">${g(G(p.created_at))}</span></div></li>`).join(""),i.setAttribute("data-loaded","true")}catch{o&&(o.textContent="Recent Updates (0)"),c&&(c.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>'),i.setAttribute("data-loaded","true")}})})},I=document.querySelector('[data-page="admin"]')!==null,Z=e=>{if(I)return`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${w(e.gameDate)}</span>
            <span class="game-level">${L(e.teams)}</span>
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
      `;{let t="";return e.final===1?t=`
          <div class="game-status">
            <span class="game-final">FINAL</span>
          </div>
        `:(e.qtr||e.timeInqtr)&&(t=`
          <div class="game-status">
            ${e.qtr?`<span class="game-quarter">${e.qtr}</span>`:""}
            ${e.timeInqtr?`<span class="game-time">${e.timeInqtr}</span>`:""}
          </div>
        `),`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${w(e.gameDate)}</span>
            <span class="game-level">${L(e.teams)}</span>
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
            ${t}
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
      `}};document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),t=document.querySelector(".scoreboard-container");if(!e||!t)return;const n=o=>{document.cookie="auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;",localStorage.removeItem("authToken"),window.location.href=`/login?returnTo=${encodeURIComponent(window.location.pathname)}`},l=()=>{const s=document.cookie.split("; ").find(r=>r.startsWith("auth="));return s?decodeURIComponent(s.split("=")[1]):localStorage.getItem("authToken")};async function i(){const o=new FormData(e),s=new URLSearchParams,r=o.get("team"),p=o.get("teams"),f=o.get("gameDate");r&&s.append("team",r),p&&s.append("teams",p),f&&s.append("gameDate",f);const m=await(await fetch(`/api/games?${s.toString()}`)).json();if(m&&m.length>0&&t){const k=m.map(Z).join("");t.innerHTML=`<div class="scoreboard-grid">${k}</div>`,O(t),I&&t.querySelectorAll(".update-button").forEach(A=>{A.addEventListener("click",async E=>{const a=E.target,d=a.closest(".game-card");if(!d)return;const U=d.dataset.gameId,y=d.querySelectorAll(".team-score-input"),v=d.querySelector(".update-text-input"),b=d.querySelector(".quarter-select"),D=b instanceof HTMLSelectElement?b:null,$=d.querySelector(".time-input"),H=$ instanceof HTMLInputElement?$:null,M=d.querySelector(".game-over-checkbox"),F=v?.value.trim()||"",N=D?.value||"",R=H?.value.trim()||"",j=!!M?.checked,S=y[0]?.value??"0",T=y[1]?.value??"0",q=l();if(!q){n();return}const C=a.textContent;a.textContent="Updating...",a.setAttribute("disabled","true");try{const u={ehsScore:parseInt(S,10),oppScore:parseInt(T,10),updateText:F,qtr:N,timeInqtr:R};j&&(u.final=1,u.ehsFinal=parseInt(S,10),u.oppFinal=parseInt(T,10));const h=await fetch(`/api/games/${U}`,{method:"PATCH",credentials:"include",headers:{"Content-Type":"application/json",Authorization:`Bearer ${q.trim()}`},body:JSON.stringify(u)});let x={};try{x=await h.json()}catch{}if(!h.ok){if(h.status===401){a.textContent="Auth Error",a.style.backgroundColor="#d9534f",setTimeout(()=>n("Session expired"),500);return}throw new Error(x?.error||"Failed to update score")}v&&(v.value=""),a.textContent="Updated!",setTimeout(()=>{a.textContent=C||"Update Score",a.removeAttribute("disabled"),a.style.backgroundColor=""},2e3)}catch{a.textContent="Error!",a.style.backgroundColor="#d9534f",setTimeout(()=>{a.textContent=C||"Update Score",a.removeAttribute("disabled"),a.style.backgroundColor=""},3e3)}})})}else t.innerHTML="<p>No games found matching your criteria.</p>"}let c;e.addEventListener("input",()=>{clearTimeout(c),c=window.setTimeout(i,300)}),e.addEventListener("reset",()=>{setTimeout(i,0)})});
