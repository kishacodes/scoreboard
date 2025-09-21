const $=e=>{if(!e)return"";const t={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",t)},y=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",d=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;"),b=e=>{if(!e)return new Date(NaN);if(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?$/.test(e)){const n=e.replace(" ","T"),c=e.length===16?`${n}:00Z`:`${n}Z`;return new Date(c)}return new Date(e)},q=e=>{const t=b(e);return isNaN(t.getTime())?String(e||""):t.toLocaleTimeString("en-US",{timeZone:"America/Chicago",hour:"numeric",minute:"2-digit"})},x=e=>{e.querySelectorAll(".game-card[data-game-id]").forEach(t=>{const n=t,c=n.getAttribute("data-game-id"),r=n.querySelector(".updates-details");if(!r||!c)return;const s=n.querySelector(".updates-list"),l=n.querySelector(".updates-heading");r.addEventListener("toggle",async()=>{if(r.open&&r.getAttribute("data-loaded")!=="true")try{const p=await fetch(`/api/games/${c}/updates`),o=p.ok?await p.json():[];if(l&&(l.textContent=o.length>0?`Recent Updates (${o.length})`:"Recent Updates (0)"),!s)return;const v=n.querySelectorAll(".team .team-name"),m=v[0]?.textContent?.trim()||"EHS",g=v[1]?.textContent?.trim()||"Opponent";!o||o.length===0?s.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>':s.innerHTML=o.map(i=>{const f=i.qtr||i.ehs_score!=null||i.opp_score!=null?`<div class="update-meta">${d(i.qtr||"")}${i.qtr?": ":""}${d(m)} ${d(String(i.ehs_score??""))}, ${d(g)} ${d(String(i.opp_score??""))}</div>`:"";return`<li class="update-item">
                <div class="update-row">
                  <span class="update-text" title="${d(i.update_text)}">${d(i.update_text)}</span>
                  <span class="update-timestamp">${d(q(i.created_at))}</span>
                </div>
                ${f}
              </li>`}).join(""),s&&s.querySelectorAll(".update-text").forEach(f=>{const a=f;a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-expanded","false"),a.style.cursor="pointer";const h=()=>{const u=a.classList.toggle("expanded");a.setAttribute("aria-expanded",u?"true":"false")};a.addEventListener("click",h),a.addEventListener("keydown",u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),h())}),requestAnimationFrame(()=>{a.scrollHeight>a.clientHeight||(a.removeAttribute("role"),a.removeAttribute("tabindex"),a.removeAttribute("aria-expanded"),a.style.cursor="")})}),r.setAttribute("data-loaded","true")}catch{l&&(l.textContent="Recent Updates (0)"),s&&(s.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>'),r.setAttribute("data-loaded","true")}})})},L=document.querySelector('[data-page="admin"]')!==null,A=e=>{if(L)return`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${$(e.gameDate)}</span>
            <span class="game-level">${y(e.teams)}</span>
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
            <span class="game-date">${$(e.gameDate)}</span>
            <span class="game-level">${y(e.teams)}</span>
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
      `}};document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),t=document.querySelector(".scoreboard-container");if(!e||!t)return;async function n(){const r=new FormData(e),s=new URLSearchParams,l=r.get("team"),p=r.get("teams"),o=r.get("gameDate");l&&s.append("team",l),p&&s.append("teams",p),o&&s.append("gameDate",o);const m=await(await fetch(`/api/games?${s.toString()}`)).json();if(m&&m.length>0&&t){const g=m.map(A).join("");t.innerHTML=`<div class="scoreboard-grid">${g}</div>`,x(t)}else t.innerHTML="<p>No games found matching your criteria.</p>"}let c;e.addEventListener("input",()=>{clearTimeout(c),c=window.setTimeout(n,300)}),e.addEventListener("reset",()=>{setTimeout(n,0)})});
