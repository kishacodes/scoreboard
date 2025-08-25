const $=e=>{if(!e)return"";const a={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",a)},h=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",g=document.body.dataset.page==="admin",L=e=>{if(g)return`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${$(e.gameDate)}</span>
            <span class="game-level">${h(e.teams)}</span>
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
      `;{let a="";e.final===1?a=`
          <div class="game-status">
            <span class="game-final">FINAL</span>
          </div>
        `:(e.qtr||e.timeInqtr)&&(a=`
          <div class="game-status">
            ${e.qtr?`<span class="game-quarter">${e.qtr}</span>`:""}
            ${e.timeInqtr?`<span class="game-time">${e.timeInqtr}</span>`:""}
          </div>
        `);const r=e.updates&&e.updates.length>0?`
        <div class="game-updates">
          <details class="updates-details">
            <summary class="updates-heading">Recent Updates (${e.updates.length})</summary>
            <ul class="updates-list">
              ${e.updates.map(n=>`
                <li class="update-item">
                  <div class="update-row">
                    <span class="update-text" title="${n.update_text}">${n.update_text}</span>
                    <span class="update-timestamp">${n.created_at}</span>
                  </div>
                </li>
              `).join("")}
            </ul>
          </details>
        </div>
      `:"";return`
        <div class="game-card">
          <div class="game-header">
            <span class="game-date">${$(e.gameDate)}</span>
            <span class="game-level">${h(e.teams)}</span>
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
            ${r}
          </div>
        </div>
      `}};document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),a=document.querySelector(".scoreboard-container");if(!e||!a){console.error("Filter form or scoreboard container not found!");return}async function r(){const c=new FormData(e),i=new URLSearchParams,p=c.get("team"),l=c.get("teams"),m=c.get("gameDate");p&&i.append("team",p),l&&i.append("teams",l),m&&i.append("gameDate",m);const d=await(await fetch(`/api/games?${i.toString()}`)).json();for(const s of d)if(!s.updates)try{const o=await fetch(`/api/games/${s.id}/updates`);o.ok?s.updates=await o.json():s.updates=[]}catch(o){console.error(`Error fetching updates for game ${s.id}:`,o),s.updates=[]}if(d&&d.length>0){const s=d.map(L).join("");a.innerHTML=`<div class="scoreboard-grid">${s}</div>`,g&&a.querySelectorAll(".update-button").forEach(o=>{o.addEventListener("click",async b=>{const t=b.target,u=t.closest(".game-card"),y=u.dataset.gameId,v=u.querySelectorAll(".team-score-input"),C=v[0].value,T=v[1].value;t.textContent="Updating...",t.setAttribute("disabled","true");try{if(!(await fetch(`/api/games/${y}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({ehsFinal:parseInt(C,10),oppFinal:parseInt(T,10)})})).ok)throw new Error("Failed to update score");t.textContent="Updated!",setTimeout(()=>{t.textContent="Update Score",t.removeAttribute("disabled")},2e3)}catch(f){console.error("Update Error:",f),t.textContent="Error!",t.style.backgroundColor="#d9534f",setTimeout(()=>{t.textContent="Update Score",t.removeAttribute("disabled"),t.style.backgroundColor=""},3e3)}})})}else a.innerHTML="<p>No games found matching your criteria.</p>"}let n;e.addEventListener("input",()=>{clearTimeout(n),n=window.setTimeout(r,300)}),e.addEventListener("reset",()=>{setTimeout(r,0)})});
