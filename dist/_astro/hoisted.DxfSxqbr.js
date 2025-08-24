const v=e=>{if(!e)return"";const a={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",a)},g=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",f=document.body.dataset.page==="admin",L=e=>f?`
        <div class="game-card" data-game-id="${e.id}">
          <div class="game-header">
            <span class="game-date">${v(e.gameDate)}</span>
            <span class="game-level">${g(e.teams)}</span>
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
      `:`
        <div class="game-card">
          <div class="game-header">
            <span class="game-date">${v(e.gameDate)}</span>
            <span class="game-level">${g(e.teams)}</span>
          </div>
          <div class="game-body">
            <div class="team">
              <span class="team-name">${e.ehs}</span>
              <span class="team-score">${e.ehsFinal}</span>
            </div>
            <div class="team">
              <span class="team-name">${e.opp}</span>
              <span class="team-score">${e.oppFinal}</span>
            </div>
          </div>
          ${e.comments?`
          <div class="game-footer">
            <p class="game-comment">${e.comments}</p>
          </div>
          `:""}
        </div>
      `;document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),a=document.querySelector(".scoreboard-container");if(!e||!a){console.error("Filter form or scoreboard container not found!");return}async function r(){const n=new FormData(e),s=new URLSearchParams,i=n.get("team"),d=n.get("teams"),m=n.get("gameDate");i&&s.append("team",i),d&&s.append("teams",d),m&&s.append("gameDate",m);const o=await(await fetch(`/api/games?${s.toString()}`)).json();if(o&&o.length>0){const b=o.map(L).join("");a.innerHTML=`<div class="scoreboard-grid">${b}</div>`,f&&a.querySelectorAll(".update-button").forEach(h=>{h.addEventListener("click",async y=>{const t=y.target,p=t.closest(".game-card"),$=p.dataset.gameId,l=p.querySelectorAll(".team-score-input"),C=l[0].value,T=l[1].value;t.textContent="Updating...",t.setAttribute("disabled","true");try{if(!(await fetch(`/api/games/${$}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({ehsFinal:parseInt(C,10),oppFinal:parseInt(T,10)})})).ok)throw new Error("Failed to update score");t.textContent="Updated!",setTimeout(()=>{t.textContent="Update Score",t.removeAttribute("disabled")},2e3)}catch(u){console.error("Update Error:",u),t.textContent="Error!",t.style.backgroundColor="#d9534f",setTimeout(()=>{t.textContent="Update Score",t.removeAttribute("disabled"),t.style.backgroundColor=""},3e3)}})})}else a.innerHTML="<p>No games found matching your criteria.</p>"}let c;e.addEventListener("input",()=>{clearTimeout(c),c=window.setTimeout(r,300)}),e.addEventListener("reset",()=>{setTimeout(r,0)})});
