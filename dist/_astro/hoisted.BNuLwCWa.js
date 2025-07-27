const p=e=>{if(!e)return"";const a={year:"numeric",month:"long",day:"numeric",timeZone:"UTC"};return new Date(e).toLocaleDateString("en-US",a)},l=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",u=e=>`
    <div class="game-card">
      <div class="game-header">
        <span class="game-date">${p(e.gameDate)}</span>
        <span class="game-level">${l(e.teams)}</span>
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
  `;document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("filter-form"),a=document.querySelector(".scoreboard-container");if(!e||!a){console.error("Filter form or scoreboard container not found!");return}async function o(){const n=new FormData(e),t=new URLSearchParams,c=n.get("team"),i=n.get("teams"),m=n.get("gameDate");c&&t.append("team",c),i&&t.append("teams",i),m&&t.append("gameDate",m);const s=await(await fetch(`/api/games?${t.toString()}`)).json();if(s&&s.length>0){const d=s.map(u).join("");a.innerHTML=`<div class="scoreboard-grid">${d}</div>`}else a.innerHTML="<p>No games found matching your criteria.</p>"}let r;e.addEventListener("input",()=>{clearTimeout(r),r=window.setTimeout(o,300)}),e.addEventListener("reset",()=>{setTimeout(o,0)})});
