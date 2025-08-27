const I=e=>{if(!e)return"";const a={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",a)},L=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",g=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;"),Q=e=>{e.querySelectorAll(".game-card[data-game-id]").forEach(a=>{const c=a,u=c.getAttribute("data-game-id"),r=c.querySelector(".updates-details");if(!r||!u)return;const i=c.querySelector(".updates-list"),n=c.querySelector(".updates-heading");r.addEventListener("toggle",async()=>{if(r.open&&r.getAttribute("data-loaded")!=="true")try{const s=await fetch(`/api/games/${u}/updates`),o=s.ok?await s.json():[];if(n&&(n.textContent=o.length>0?`Recent Updates (${o.length})`:"Recent Updates (0)"),!i)return;!o||o.length===0?i.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>':i.innerHTML=o.map(l=>`<li class="update-item"><div class="update-row"><span class="update-text" title="${g(l.update_text)}">${g(l.update_text)}</span><span class="update-timestamp">${g(l.created_at)}</span></div></li>`).join(""),r.setAttribute("data-loaded","true")}catch{n&&(n.textContent="Recent Updates (0)"),i&&(i.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>'),r.setAttribute("data-loaded","true")}})})},k=document.querySelector('[data-page="admin"]')!==null,G=e=>{if(k)return`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${I(e.gameDate)}</span>
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
            <span class="game-date">${I(e.gameDate)}</span>
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
      `}};document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),a=document.querySelector(".scoreboard-container");if(!e||!a)return;const c=n=>{document.cookie="auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;",localStorage.removeItem("authToken"),window.location.href=`/login?returnTo=${encodeURIComponent(window.location.pathname)}`},u=()=>{const s=document.cookie.split("; ").find(o=>o.startsWith("auth="));return s?decodeURIComponent(s.split("=")[1]):localStorage.getItem("authToken")};async function r(){const n=new FormData(e),s=new URLSearchParams,o=n.get("team"),l=n.get("teams"),f=n.get("gameDate");o&&s.append("team",o),l&&s.append("teams",l),f&&s.append("gameDate",f);const m=await(await fetch(`/api/games?${s.toString()}`)).json();if(m&&m.length>0&&a){const w=m.map(G).join("");a.innerHTML=`<div class="scoreboard-grid">${w}</div>`,Q(a),k&&a.querySelectorAll(".update-button").forEach(A=>{A.addEventListener("click",async E=>{const t=E.target,d=t.closest(".game-card");if(!d)return;const U=d.dataset.gameId,y=d.querySelectorAll(".team-score-input"),v=d.querySelector(".update-text-input"),b=d.querySelector(".quarter-select"),H=b instanceof HTMLSelectElement?b:null,S=d.querySelector(".time-input"),M=S instanceof HTMLInputElement?S:null,D=d.querySelector(".game-over-checkbox"),F=v?.value.trim()||"",R=H?.value||"",j=M?.value.trim()||"",N=!!D?.checked,$=y[0]?.value??"0",q=y[1]?.value??"0",T=u();if(!T){c();return}const x=t.textContent;t.textContent="Updating...",t.setAttribute("disabled","true");try{const p={ehsScore:parseInt($,10),oppScore:parseInt(q,10),updateText:F,qtr:R,timeInqtr:j};N&&(p.final=1,p.ehsFinal=parseInt($,10),p.oppFinal=parseInt(q,10));const h=await fetch(`/api/games/${U}`,{method:"PATCH",credentials:"include",headers:{"Content-Type":"application/json",Authorization:`Bearer ${T.trim()}`},body:JSON.stringify(p)});let C={};try{C=await h.json()}catch{}if(!h.ok){if(h.status===401){t.textContent="Auth Error",t.style.backgroundColor="#d9534f",setTimeout(()=>c("Session expired"),500);return}throw new Error(C?.error||"Failed to update score")}v&&(v.value=""),t.textContent="Updated!",setTimeout(()=>{t.textContent=x||"Update Score",t.removeAttribute("disabled"),t.style.backgroundColor=""},2e3)}catch{t.textContent="Error!",t.style.backgroundColor="#d9534f",setTimeout(()=>{t.textContent=x||"Update Score",t.removeAttribute("disabled"),t.style.backgroundColor=""},3e3)}})})}else a.innerHTML="<p>No games found matching your criteria.</p>"}let i;e.addEventListener("input",()=>{clearTimeout(i),i=window.setTimeout(r,300)}),e.addEventListener("reset",()=>{setTimeout(r,0)})});
