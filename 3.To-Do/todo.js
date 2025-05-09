document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("itemInput");
    const addButton = document.getElementById("addButton");
    const list = document.getElementById("itemList");
    const markAllBtn = document.getElementById("markAll");
    const unmarkAllBtn = document.getElementById("unmarkAll");
    const themeSelect = document.getElementById("themeSelect");
    const listNameInput = document.getElementById("listName");
    const createListBtn = document.getElementById("createListBtn");
    const selectList = document.getElementById("selectList");
    
    let currentList = localStorage.getItem("currentList") || "Standardlista";
    let lists = JSON.parse(localStorage.getItem("allLists")) || [currentList];
    updateListDropdown();
    
    let storedItems = loadList(currentList);
    storedItems.forEach(item => addItemToDOM(item.text, item.purchased));
    
    addButton.addEventListener("click", () => {
        const value = input.value.trim();
        if (value === "") return;
        
        const newItem = { text: value, purchased: false };
        storedItems.push(newItem);
        saveCurrentList();
        addItemToDOM(value, false);
        
        input.value = "";
        input.focus();
    });
    
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") addButton.click();
    });
    
    function addItemToDOM(text, isPurchased) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        
        const span = document.createElement("span");
        span.textContent = text;
        span.classList.add("flex-grow-1");
        if (isPurchased) span.classList.add("purchased");
        
        span.addEventListener("click", () => {
            span.classList.toggle("purchased");
            const index = Array.from(list.children).indexOf(li);
            storedItems[index].purchased = span.classList.contains("purchased");
            saveCurrentList();
        });
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-sm btn-danger ms-2";
        deleteBtn.textContent = "Ta bort";
        
        deleteBtn.addEventListener("click", () => {
            const index = Array.from(list.children).indexOf(li);
            storedItems.splice(index, 1);
            saveCurrentList();
            li.remove();
        });
        
        li.appendChild(span);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    }
    
    function saveCurrentList() {
        localStorage.setItem(`list_${currentList}`, JSON.stringify(storedItems));
    }
    
    function loadList(name) {
        return JSON.parse(localStorage.getItem(`list_${name}`)) || [];
    }
    
    // Hantera tema
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(`${savedTheme}-theme`);
    themeSelect.value = savedTheme;
    
    themeSelect.addEventListener("change", () => {
        document.body.classList.remove("light-theme", "dark-theme", "green-theme");
        const selected = themeSelect.value;
        document.body.classList.add(`${selected}-theme`);
        localStorage.setItem("theme", selected);
    });
    
    // Markera/avmarkera alla
    markAllBtn.addEventListener("click", () => {
        list.querySelectorAll("li span").forEach((span, i) => {
            span.classList.add("purchased");
            storedItems[i].purchased = true;
        });
        saveCurrentList();
    });
    
    unmarkAllBtn.addEventListener("click", () => {
        list.querySelectorAll("li span").forEach((span, i) => {
            span.classList.remove("purchased");
            storedItems[i].purchased = false;
        });
        saveCurrentList();
    });
    
    // Skapa ny lista
    createListBtn.addEventListener("click", () => {
        const newName = listNameInput.value.trim();
        if (newName === "" || lists.includes(newName)) return;
        lists.push(newName);
        localStorage.setItem("allLists", JSON.stringify(lists));
        localStorage.setItem("currentList", newName);
        currentList = newName;
        listNameInput.value = "";
        
        updateListDropdown();
        selectList.value = currentList;
        
        list.innerHTML = "";
        storedItems = [];
        saveCurrentList(); // skapa tom lista
    });
    
    // Växla lista
    selectList.addEventListener("change", () => {
        currentList = selectList.value;
        localStorage.setItem("currentList", currentList);
        storedItems = loadList(currentList);
        list.innerHTML = "";
        storedItems.forEach(item => addItemToDOM(item.text, item.purchased));
    });
    
    function updateListDropdown() {
        selectList.innerHTML = "";
        lists.forEach(name => {
            const opt = document.createElement("option");
            opt.value = name;
            opt.textContent = name;
            selectList.appendChild(opt);
        });
        selectList.value = currentList;
    }
});
