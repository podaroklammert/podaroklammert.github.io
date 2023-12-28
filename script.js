let gifts = ["Massage", "Roses", "Chocolate", "Book", "Candle", "Perfume", "Dinner", "Movie Night", "Wine", "Cheese Tasting", "Concert Tickets", "Cooking Class"];
let previousGifts = [];

document.getElementById("giftButton").addEventListener("click", function() {
    let availableGifts = gifts.filter(gift => !previousGifts.includes(gift));
    if (availableGifts.length === 0) {
        document.getElementById("selectedGift").innerText = "All gifts have been given!";
        return;
    }

    let selectedGift = availableGifts[Math.floor(Math.random() * availableGifts.length)];
    previousGifts.push(selectedGift);
    document.getElementById("selectedGift").innerText = "Your gift is: " + selectedGift;
    updatePreviousGiftsList();
});

function updatePreviousGiftsList() {
    let list = document.getElementById("previousGifts");
    list.innerHTML = ""; // Clear the list
    previousGifts.forEach(gift => {
        let listItem = document.createElement("li");
        listItem.innerText = gift;
        list.appendChild(listItem);
    });
}

