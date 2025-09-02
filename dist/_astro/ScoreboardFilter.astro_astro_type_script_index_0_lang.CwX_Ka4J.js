const A=e=>{if(!e)return"";const t={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",t)},I=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",d=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;"),Q=e=>{if(!e)return new Date(NaN);if(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?$/.test(e)){const n=e.replace(" ","T"),u=e.length===16?`${n}:00Z`:`${n}Z`;return new Date(u)}return new Date(e)},O=e=>{const t=Q(e);return isNaN(t.getTime())?String(e||""):t.toLocaleTimeString("en-US",{timeZone:"America/Chicago",hour:"numeric",minute:"2-digit"})},G=e=>{e.querySelectorAll(".game-card[data-game-id]").forEach(t=>{const n=t,u=n.getAttribute("data-game-id"),c=n.querySelector(".updates-details");if(!c||!u)return;const l=n.querySelector(".updates-list"),r=n.querySelector(".updates-heading");c.addEventListener("toggle",async()=>{if(c.open&&c.getAttribute("data-loaded")!=="true")try{const o=await fetch(`/api/games/${u}/updates`),i=o.ok?await o.json():[];if(r&&(r.textContent=i.length>0?`Recent Updates (${i.length})`:"Recent Updates (0)"),!l)return;const m=n.querySelectorAll(".team .team-name"),h=m[0]?.textContent?.trim()||"EHS",$=m[1]?.textContent?.trim()||"Opponent";!i||i.length===0?l.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>':l.innerHTML=i.map(s=>{const g=s.qtr||s.ehs_score!=null||s.opp_score!=null?`<div class="update-meta">${d(s.qtr||"")}${s.qtr?": ":""}${d(h)} ${d(String(s.ehs_score??""))}, ${d($)} ${d(String(s.opp_score??""))}</div>`:"";return`<li class="update-item">
                <div class="update-row">
                  <span class="update-text" title="${d(s.update_text)}">${d(s.update_text)}</span>
                  <span class="update-timestamp">${d(O(s.created_at))}</span>
                </div>
                ${g}
              </li>`}).join(""),c.setAttribute("data-loaded","true")}catch{r&&(r.textContent="Recent Updates (0)"),l&&(l.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>'),c.setAttribute("data-loaded","true")}})})},k=document.querySelector('[data-page="admin"]')!==null,Z=e=>{if(k)return`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${A(e.gameDate)}</span>
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
            <span class="game-date">${A(e.gameDate)}</span>
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
      `}};document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),t=document.querySelector(".scoreboard-container");if(!e||!t)return;const n=r=>{document.cookie="auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;",localStorage.removeItem("authToken"),window.location.href=`/login?returnTo=${encodeURIComponent(window.location.pathname)}`},u=()=>{const o=document.cookie.split("; ").find(i=>i.startsWith("auth="));return o?decodeURIComponent(o.split("=")[1]):localStorage.getItem("authToken")};async function c(){const r=new FormData(e),o=new URLSearchParams,i=r.get("team"),m=r.get("teams"),h=r.get("gameDate");i&&o.append("team",i),m&&o.append("teams",m),h&&o.append("gameDate",h);const s=await(await fetch(`/api/games?${o.toString()}`)).json();if(s&&s.length>0&&t){const g=s.map(Z).join("");t.innerHTML=`<div class="scoreboard-grid">${g}</div>`,G(t),k&&t.querySelectorAll(".update-button").forEach(E=>{E.addEventListener("click",async U=>{const a=U.target,p=a.closest(".game-card");if(!p)return;const D=p.dataset.gameId,S=p.querySelectorAll(".team-score-input"),f=p.querySelector(".update-text-input"),b=p.querySelector(".quarter-select"),H=b instanceof HTMLSelectElement?b:null,q=p.querySelector(".time-input"),M=q instanceof HTMLInputElement?q:null,N=p.querySelector(".game-over-checkbox"),F=f?.value.trim()||"",R=H?.value||"",_=M?.value.trim()||"",j=!!N?.checked,T=S[0]?.value??"0",C=S[1]?.value??"0",x=u();if(!x){n();return}const w=a.textContent;a.textContent="Updating...",a.setAttribute("disabled","true");try{const v={ehsScore:parseInt(T,10),oppScore:parseInt(C,10),updateText:F,qtr:R,timeInqtr:_};j&&(v.final=1,v.ehsFinal=parseInt(T,10),v.oppFinal=parseInt(C,10));const y=await fetch(`/api/games/${D}`,{method:"PATCH",credentials:"include",headers:{"Content-Type":"application/json",Authorization:`Bearer ${x.trim()}`},body:JSON.stringify(v)});let L={};try{L=await y.json()}catch{}if(!y.ok){if(y.status===401){a.textContent="Auth Error",a.style.backgroundColor="#d9534f",setTimeout(()=>n("Session expired"),500);return}throw new Error(L?.error||"Failed to update score")}f&&(f.value=""),a.textContent="Updated!",setTimeout(()=>{a.textContent=w||"Update Score",a.removeAttribute("disabled"),a.style.backgroundColor=""},2e3)}catch{a.textContent="Error!",a.style.backgroundColor="#d9534f",setTimeout(()=>{a.textContent=w||"Update Score",a.removeAttribute("disabled"),a.style.backgroundColor=""},3e3)}})})}else t.innerHTML="<p>No games found matching your criteria.</p>"}let l;e.addEventListener("input",()=>{clearTimeout(l),l=window.setTimeout(c,300)}),e.addEventListener("reset",()=>{setTimeout(c,0)})});
