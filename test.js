document.getElementById("giftButton").addEventListener("click", async function() {
    const gifts = await fetchAllGifts();
    const availableGifts = gifts.filter(gift => !gift.Given);

    if (availableGifts.length === 0) {
        // Since all gifts have been taken, clear the currently displayed gift
        document.getElementById("selectedGift").innerText = "Все подарочки разобрали! Ждем следующего года вместе";
        document.getElementById("giftDescription").innerText = "";
        updatePreviousGiftsList(gifts.filter(gift => gift.Given));
        return;
    }

    // The rest of the code remains the same
    let selectedGift = availableGifts[Math.floor(Math.random() * availableGifts.length)];
    document.getElementById("selectedGift").innerText = "Твой подарочек месяца: " + selectedGift.Name;
    document.getElementById("giftDescription").innerText = selectedGift.Description; // Display the description

    // Update the gift status to Given: true
    const updateSuccess = await updateGiftStatus(selectedGift.id);
    if (updateSuccess) {
        console.log("Gift status updated successfully");
    }

    updatePreviousGiftsList(gifts.filter(gift => gift.Given));
});