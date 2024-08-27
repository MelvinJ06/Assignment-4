document.addEventListener("DOMContentLoaded",() => {
        const entryList = document.getElementById("entry-list");
        const totleIncome = document.getElementById("total-income");
        const totalExpenses = document.getElementById("total-expenses");
        const netBalance = document.getElementById("net-balance");
        const addEntryButton = document.getElementById("add-entry");
        const updateEntryButton = document.getElementById("update-entry");
        const descriptionInput = document.getElementById("description");
        const amountInput = document.getElementById("amount");
        const typeSelect = document.getElementById("type");
        const filterRadios = document.querySelectorAll('input[name="filter"]');

        //load from the local storage

        let entries = JSON.parse(localStorage.getItem("entries")) || [];

        let editingIndex = -1; //index of the array that being edited

        //function to calculate and update total

        const calculateTotal = () => {
            let income = 0;
            let expenses = 0;
            entries.forEach(entry=>{
                if(entry.type === "income") {
                    income += parseFloat(entry.amount);
                }else{
                    expenses += parseFloat(entry.amount);
                }
            });

            totleIncome.textContent = income.toFixed(2);
            totalExpenses.textContent = expenses.toFixed(2);
            netBalance.textContent = (income-expenses).toFixed(2);
        };

        const rendeEntries = (filter = 'all') => {
            entryList.innerHTML= '';
            entries.filter(entry => filter === 'all' || entry.type === filter )
                  .forEach((entry, index)=>{
                    const li = document.createElement('li');
                    li.innerHTML = `
                    ${entry.description} - ${entry.amount} (${entry.type})
                    <button onclick = "editEntry(${index})">Edit</button>
                    <button onclick = "deleteEntry(${index})">Delete</button>
                    `
                    entryList.appendChild(li)
                  });
                  calculateTotal();
        };

        const addEntry = () => {
            const description = descriptionInput.value;
            const amount = parseFloat(amountInput.value);
            const type = typeSelect.value;

             if(description && !isNaN(amount) && amount > 0){
                if(editingIndex > -1){
                    entries[editingIndex] = {description,amount,type};
                    editingIndex = -1;
                    addEntryButton.style.display = "inline";
                    updateEntryButton.style.display = "none";
                }else{
                    entries.push({description,amount,type})
                }

                localStorage.setItem("entries",JSON.stringify(entries));
                rendeEntries();

                descriptionInput.value = '';
                amountInput.value = '';
                typeSelect.value = 'income';

             }
        };

        window.editEntry = (index) => {
            const entry = entries[index];
            descriptionInput.value = entry.description;
            amountInput.value = entry.amount;
            typeSelect.value = entry.type;
            editingIndex = index;
            addEntryButton.style.display = 'none';
            updateEntryButton.style.display = "inline"; 
        };

        window.deleteEntry = (index) => {
            entries.splice(index, 1);
            localStorage.setItem('entries',JSON.stringify(entries));
            rendeEntries()
        }

        addEntryButton.addEventListener('click' , addEntry)

        updateEntryButton.addEventListener('click' , addEntry)

        filterRadios.forEach(radio => {
            radio.addEventListener('change', ()=>{
                rendeEntries(radio.value);
            })
        })
       
        rendeEntries();
})