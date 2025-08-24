import"./hoisted.DxfSxqbr.js";async function i(a){try{const t=await fetch(`/api/games/${a}/updates`);if(!t.ok)throw new Error("Failed to load updates");const o=await t.json(),e=document.getElementById(`update-history-${a}`);if(!e)return;if(o.length===0){e.style.display="none";return}e.style.display="block",e.innerHTML=o.map(n=>`
        <div class="update-item">
          <div class="update-meta">
            <span class="update-user">${n.user_email.split("@")[0]}</span>
            <span class="update-time">${new Date(n.created_at).toLocaleString()}</span>
          </div>
          <div class="update-text">${n.update_text}</div>
        </div>
      `).join("")}catch(t){console.error("Error loading update history:",t)}}document.addEventListener("click",async a=>{const t=a.target;if(!t.classList.contains("update-button"))return;const o=t.closest(".game-card"),e=o.dataset.gameId,n=o.querySelectorAll(".team-score-input"),s=o.querySelector(".update-text-input"),c=s?.value.trim()||"",l=n[0].value,p=n[1].value,r=t.textContent;t.textContent="Updating...",t.setAttribute("disabled","true");try{if(!(await fetch(`/api/games/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({ehsFinal:parseInt(l,10),oppFinal:parseInt(p,10),updateText:c})})).ok)throw new Error("Failed to update score");s&&(s.value=""),await i(e),t.textContent="Updated!",setTimeout(()=>{t.textContent=r,t.removeAttribute("disabled")},2e3)}catch(d){console.error("Update Error:",d),t.textContent="Error!",t.style.backgroundColor="#d9534f",setTimeout(()=>{t.textContent=r,t.removeAttribute("disabled"),t.style.backgroundColor=""},3e3)}});document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".game-card").forEach(a=>{const t=a.dataset.gameId;t&&i(t)})});
