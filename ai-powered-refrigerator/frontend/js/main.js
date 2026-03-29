// --- 0. GLOBAL DATA ---
let items = [];

// --- 1. INITIAL LOAD (MEMORY) ---
window.onload = () => {
    const savedData = localStorage.getItem('fridge_items');
    if (savedData) {
        items = JSON.parse(savedData);
        renderSimpleList();
    }
    updateClock();
};

// --- 2. CLOCK & SENSOR LOGIC ---
function updateClock() {
    // 1. SELECTORS
    const clockTime = document.getElementById('clock');
    const clockDate = document.getElementById('clock-date');
    const tempEl = document.querySelector('.fridge-temp'); 
    const freezerEl = document.querySelector('.freezer-temp');
    const humidityEl = document.querySelector('.fridge-humidity');
    const statusEl = document.querySelector('.fridge-status');

    const now = new Date();

    // 2. TIME & DATE (Standard Updates)
    if (clockTime) clockTime.innerText = now.toLocaleTimeString();
    if (clockDate) clockDate.innerText = now.toDateString();

    // 3. FRIDGE JITTER (Changes by ±0.2)
    if (tempEl) {
        const val = (4 + (Math.random() * 0.4 - 0.2)).toFixed(1);
        tempEl.innerText = `${val}°C`;
        
        // Bonus: Dynamic Status Logic
        if (statusEl) {
            if (val > 4.1) {
                statusEl.innerText = "STABILIZING";
                statusEl.style.color = "#ffa726"; // Warning Orange
            } else {
                statusEl.innerText = "COOL";
                statusEl.style.color = "#00e5ff"; // Professional Cyan
            }
        }
    }

    // 4. FREEZER JITTER (Changes by ±0.2)
    if (freezerEl) {
        const val = (-18 + (Math.random() * 0.4 - 0.2)).toFixed(1);
        freezerEl.innerText = `${val}°C`;
    }

    // 5. HUMIDITY JITTER (Changes by ±1%)
    if (humidityEl) {
        const val = (68 + (Math.random() * 2 - 1)).toFixed(0);
        humidityEl.innerText = `${val}%`;
    }
}

// Ensure this is set to 1000ms (1 second)
setInterval(updateClock, 1000);
updateClock();



// --- 3. INVENTORY MANAGEMENT ---
function addItem() {
    const nameEl = document.getElementById('inp-name');
    const dateEl = document.getElementById('inp-date');
    const qtyEl = document.getElementById('inp-qty');
    const catEl = document.getElementById('inp-cat');

    if (!nameEl.value || !dateEl.value || !catEl.value) {
        alert("Please fill in Name, Date, and Category!");
        return;
    }

    items.push({
        name: nameEl.value,
        date: dateEl.value,
        qty: qtyEl.value || "N/A",
        category: catEl.value
    });

    // Save to Memory
    localStorage.setItem('fridge_items', JSON.stringify(items));

    nameEl.value = "";
    qtyEl.value = "";
    renderSimpleList();
}

function deleteItem(index) {
    items.splice(index, 1);
    
    // Update Memory
    localStorage.setItem('fridge_items', JSON.stringify(items));

    const container = document.getElementById('items-loaded');
    
    if (items.length === 0) {
        container.innerHTML = "";
        const recipeSection = document.getElementById('recipe-section');
        if(recipeSection) recipeSection.style.display = "none";
    } else {
        // If we are looking at cards, stay in card mode. Otherwise, simple list.
        const isAnalysisMode = container.innerHTML.includes('analysis-card');
        if (isAnalysisMode) {
            analyzeItems(); 
        } else {
            renderSimpleList();
        }
    }
}

function renderSimpleList() {
    const container = document.getElementById('items-loaded');
    if (items.length === 0) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <h4 style="color: #888; margin-top: 15px; font-size: 12px;">PENDING ANALYSIS:</h4>
        ${items.map((item, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #aaa; margin-bottom: 6px; border-bottom: 1px solid #1a2a3a; padding: 4px 0;">
                <span>• ${item.name} (${item.qty})</span>
                <button onclick="deleteItem(${index})" style="background:transparent; color:#ff5252; border:none; cursor:pointer; font-weight:bold;">✕</button>
            </div>
        `).join('')}
    `;
}

// --- 4. BACKEND COMMUNICATION (AI ANALYSIS) ---
async function analyzeItems() {
    if (items.length === 0) return alert("Fridge is empty!");

    const btn = document.querySelector('button[onclick="analyzeItems()"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = "<span>Searching AI Brain...</span>";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    try {
        const res = await fetch("http://127.0.0.1:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: items })
        });

        const data = await res.json();
        
        renderAnalysisCards(data.analysis);
        displayRecipes(data.recipes); 

    } catch (err) {
        alert("Check if api.py is running!");
    } finally {
        btn.innerHTML = originalText;
        btn.style.opacity = "1";
        btn.disabled = false;
    }
}

// --- 5. UI RENDERING ---

function displayRecipes(recipes) {
    const recipeSection = document.getElementById('recipe-section');
    const recipeList = document.getElementById('recipe-list');
    
    if (!recipeSection || !recipeList) return;

    if (recipes && recipes.length > 0) {
        recipeSection.style.display = "block";
        recipeList.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" style="background: rgba(0, 229, 255, 0.05); border-left: 4px solid #00e5ff; padding: 10px; margin-bottom: 8px; border-radius: 4px; font-size: 13px; color: #e0f7fa;">
                <span style="margin-right: 8px;">🍳</span> Suggesting: <strong>${recipe}</strong>
            </div>
        `).join('');
    } else {
        recipeSection.style.display = "none";
    }
}

function renderAnalysisCards(data) {
    const container = document.getElementById('items-loaded');
    container.innerHTML = `<h4 style="color: #00e5ff; margin: 20px 0 10px 0; font-size: 12px; letter-spacing: 1px;">AI ANALYSIS DASHBOARD</h4>`;

    container.innerHTML += data.map((item, index) => {
        // Find the index in the ORIGINAL items array to delete correctly
        const originalIndex = items.findIndex(i => i.name === item.name);
        
        return `
            <div class="analysis-card" style="position: relative; background: white; color: #333; margin-bottom: 12px; padding: 15px; border-radius: 12px; display: flex; flex-direction: column; gap: 8px;">
                <button onclick="deleteItem(${originalIndex})" style="position: absolute; top: 10px; right: 10px; background: #f0f0f0; color: #ff5252; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold;">✕</button>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="font-size: 15px; color: #333;">${item.name}</strong> 
                        <span style="color: #888; font-size: 11px;">${item.qty}</span>
                        <div style="font-size: 11px; color: #666;">Health score: ${item.ml_score}/100</div>
                    </div>
                    <span class="status-badge status-${item.status}" style="font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: bold; text-transform: uppercase;">${item.status}</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="flex-grow: 1; height: 6px; background: #eee; border-radius: 10px; overflow: hidden;">
                        <div style="width: ${item.ml_score}%; height: 100%; background: ${item.status === 'expired' ? '#ff5252' : item.status === 'expiring' ? '#ffa726' : '#66bb6a'};"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}