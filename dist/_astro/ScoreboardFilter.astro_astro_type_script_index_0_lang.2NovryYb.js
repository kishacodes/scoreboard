const g=e=>{if(!e)return"";const t={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",t)},f=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",m=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;"),w=e=>{e.querySelectorAll(".game-card[data-game-id]").forEach(t=>{const d=t,c=d.getAttribute("data-game-id"),s=d.querySelector(".updates-details");if(!s||!c)return;const n=d.querySelector(".updates-list"),o=d.querySelector(".updates-heading");s.addEventListener("toggle",async()=>{if(s.open&&s.getAttribute("data-loaded")!=="true")try{const r=await fetch(`/api/games/${c}/updates`),i=r.ok?await r.json():[];if(o&&(o.textContent=i.length>0?`Recent Updates (${i.length})`:"Recent Updates (0)"),!n)return;!i||i.length===0?n.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>':n.innerHTML=i.map(p=>`<li class="update-item"><div class="update-row"><span class="update-text" title="${m(p.update_text)}">${m(p.update_text)}</span><span class="update-timestamp">${m(p.created_at)}</span></div></li>`).join(""),s.setAttribute("data-loaded","true")}catch{o&&(o.textContent="Recent Updates (0)"),n&&(n.innerHTML='<li class="update-item"><div class="update-row"><span class="update-text">No updates yet</span><span class="update-timestamp"></span></div></li>'),s.setAttribute("data-loaded","true")}})})},h=document.body.dataset.page==="admin",q=e=>{if(h)return`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${g(e.gameDate)}</span>
            <span class="game-level">${f(e.teams)}</span>
          </div>
          <div class="game-body">
            <div class="team">
              <span class="team-name">${e.ehs}</span>
              <input type="number" class="team-score-input" value="${e.ehsFinal}" />
            </div>
            <div class="team">
              <span class="team-name">${e.opp}</span>
              <input type="number" class="team-score-input" value="${e.oppFinal}" />
            </div>
          </div>
          <div class="game-footer">
            <button class="update-button">Update Score</button>
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
            <span class="game-date">${g(e.gameDate)}</span>
            <span class="game-level">${f(e.teams)}</span>
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
      `}};document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),t=document.querySelector(".scoreboard-container");if(!e||!t)return;async function d(){const s=new FormData(e),n=new URLSearchParams,o=s.get("team"),r=s.get("teams"),i=s.get("gameDate");o&&n.append("team",o),r&&n.append("teams",r),i&&n.append("gameDate",i);const l=await(await fetch(`/api/games?${n.toString()}`)).json();if(l&&l.length>0&&t){const y=l.map(q).join("");t.innerHTML=`<div class="scoreboard-grid">${y}</div>`,w(t),h&&t.querySelectorAll(".update-button").forEach($=>{$.addEventListener("click",async b=>{const a=b.target,u=a.closest(".game-card"),L=u.dataset.gameId,v=u.querySelectorAll(".team-score-input"),S=v[0].value,C=v[1].value;a.textContent="Updating...",a.setAttribute("disabled","true");try{if(!(await fetch(`/api/games/${L}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({ehsFinal:parseInt(S,10),oppFinal:parseInt(C,10)})})).ok)throw new Error("Failed to update score");a.textContent="Updated!",setTimeout(()=>{a.textContent="Update Score",a.removeAttribute("disabled")},2e3)}catch{a.textContent="Error!",a.style.backgroundColor="#d9534f",setTimeout(()=>{a.textContent="Update Score",a.removeAttribute("disabled"),a.style.backgroundColor=""},3e3)}})})}else t.innerHTML="<p>No games found matching your criteria.</p>"}let c;e.addEventListener("input",()=>{clearTimeout(c),c=window.setTimeout(d,300)}),e.addEventListener("reset",()=>{setTimeout(d,0)})});
