// Fetch all gifts from the Netlify function
async function fetchAllGifts() {
    try {
        const response = await fetch('/.netlify/functions/fetchAllGifts'); // Make sure the function name matches
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching gifts: ", error);
        return []; // Return an empty array in case of error
    }
}

function updatePreviousGiftsList(givenGifts) {
    let list = document.getElementById("previousGifts");
    list.innerHTML = ""; // Clear the list
    givenGifts.forEach(gift => {
        let listItem = document.createElement("li");
        listItem.innerText = gift.Name;
        list.appendChild(listItem);
    });
}


// Clear the list of given gifts on the webpage
function clearPreviousGiftsList() {
    let list = document.getElementById("previousGifts");
    list.innerHTML = ""; // Clear the list
}


async function updateGiftStatus(giftId) {
    try {
        const response = await fetch('/.netlify/functions/updateGift', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: giftId })
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating gift status: ", error);
        return false;
    }
}

document.getElementById("resetButton").addEventListener("click", async function() {
    try {
        const response = await fetch('/.netlify/functions/resetGifts', { method: 'POST' });
        if (response.ok) {
            console.log("Gifts reset successfully");
            clearPreviousGiftsList(); // Clear the list of previous gifts
            // Optionally, refresh the available gifts list
            const gifts = await fetchAllGifts();
            const availableGifts = gifts.filter(gift => !gift.Given);
            updatePreviousGiftsList(availableGifts); // Update the list with available (now all) gifts
        } else {
            console.error("Failed to reset gifts");
        }
    } catch (error) {
        console.error("Error resetting gifts: ", error);
    }
});



document.getElementById("giftButton").addEventListener("click", async function() {
    const gifts = await fetchAllGifts();
    const availableGifts = gifts.filter(gift => !gift.Given);

    if (availableGifts.length === 0) {
        document.getElementById("selectedGift").innerText = "All gifts have been given!";
        return;
    }

    let selectedGift = availableGifts[Math.floor(Math.random() * availableGifts.length)];
    document.getElementById("selectedGift").innerText = "Your gift is: " + selectedGift.Name;

    // Update the gift status to Given: true
    const updateSuccess = await updateGiftStatus(selectedGift.id);
    if (updateSuccess) {
        console.log("Gift status updated successfully");
    }

    updatePreviousGiftsList(gifts.filter(gift => gift.Given));
});
