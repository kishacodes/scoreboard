const f=e=>{if(!e)return"";const a={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",a)},$=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",h=document.body.dataset.page==="admin",L=e=>{if(h)return`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${f(e.gameDate)}</span>
            <span class="game-level">${$(e.teams)}</span>
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
        `);const i=e.updates&&e.updates.length>0?`
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
            <span class="game-date">${f(e.gameDate)}</span>
            <span class="game-level">${$(e.teams)}</span>
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
            ${i}
          </div>
        </div>
      `}};document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),a=document.querySelector(".scoreboard-container");if(!e||!a)return;async function i(){const c=new FormData(e),d=new URLSearchParams,p=c.get("team"),l=c.get("teams"),m=c.get("gameDate");p&&d.append("team",p),l&&d.append("teams",l),m&&d.append("gameDate",m);const r=await(await fetch(`/api/games?${d.toString()}`)).json();for(const s of r)if(!s.updates)try{const o=await fetch(`/api/games/${s.id}/updates`);o.ok?s.updates=await o.json():s.updates=[]}catch{s.updates=[]}if(r&&r.length>0){const s=r.map(L).join("");a.innerHTML=`<div class="scoreboard-grid">${s}</div>`,h&&a.querySelectorAll(".update-button").forEach(o=>{o.addEventListener("click",async g=>{const t=g.target,u=t.closest(".game-card"),y=u.dataset.gameId,v=u.querySelectorAll(".team-score-input"),b=v[0].value,C=v[1].value;t.textContent="Updating...",t.setAttribute("disabled","true");try{if(!(await fetch(`/api/games/${y}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({ehsFinal:parseInt(b,10),oppFinal:parseInt(C,10)})})).ok)throw new Error("Failed to update score");t.textContent="Updated!",setTimeout(()=>{t.textContent="Update Score",t.removeAttribute("disabled")},2e3)}catch{t.textContent="Error!",t.style.backgroundColor="#d9534f",setTimeout(()=>{t.textContent="Update Score",t.removeAttribute("disabled"),t.style.backgroundColor=""},3e3)}})})}else a.innerHTML="<p>No games found matching your criteria.</p>"}let n;e.addEventListener("input",()=>{clearTimeout(n),n=window.setTimeout(i,300)}),e.addEventListener("reset",()=>{setTimeout(i,0)})});
