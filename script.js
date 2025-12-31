

// Function to display the last given gift on the webpage
async function displayLastGivenGift() {
    try {
      const response = await fetch('/.netlify/functions/getLastGivenGift');
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const lastGivenGift = await response.json();
      
      // Check if the last given gift data is valid and has content
      if (lastGivenGift && lastGivenGift.Name) {
        // Display the last given gift details
        document.getElementById("selectedGift").innerText = "Твой подарочек месяца: " + lastGivenGift.Name;
        document.getElementById("giftDescription").innerText = lastGivenGift.Description;
      } else {
        // If the gift data is not valid, do not display any current gift
        document.getElementById("selectedGift").innerText = "";
        document.getElementById("giftDescription").innerText = "";
      }
    } catch (error) {
      // Handle any errors during the fetch operation
      console.error("Error fetching the last given gift: ", error);
      // Ensure nothing is displayed if there's an error
      document.getElementById("selectedGift").innerText = "";
      document.getElementById("giftDescription").innerText = "";
    }
  }
  
// Fetch all gifts from the Netlify function
async function fetchAllGifts() {
    try {
        // Check if there's a year parameter in the URL for testing
        const urlParams = new URLSearchParams(window.location.search);
        const yearParam = urlParams.get('year');
        const url = yearParam
            ? `/.netlify/functions/fetchAllGifts?year=${yearParam}`
            : '/.netlify/functions/fetchAllGifts';

        const response = await fetch(url);
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
    let title = document.getElementById("previousGiftsTitle");
    list.innerHTML = ""; // Clear the list
    if (givenGifts.length > 0) {
        title.style.display = "block"; // Show the title if there are gifts
        givenGifts.forEach(gift => {
            let listItem = document.createElement("li");
            listItem.innerText = gift.Name;
            list.appendChild(listItem);
        });
    } else {
        title.style.display = "none"; // Hide the title if there are no gifts
    }
}


// Clear the list of given gifts on the webpage
function clearPreviousGiftsList() {
    let list = document.getElementById("previousGifts");
    let title = document.getElementById("previousGiftsTitle");
    list.innerHTML = ""; // Clear the list
    title.style.display = "none"; // Hide the title as the list is empty
    document.getElementById("selectedGift").innerText = "";
    document.getElementById("giftDescription").innerText = "";
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



// Function to get the value of a URL query parameter by name
function getQueryParamByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


function controlResetButtonVisibility() {
    const isAdmin = getQueryParamByName('admin') === '1';
    const resetButton = document.getElementById('resetButton');
    if (isAdmin) {
        resetButton.style.display = 'block'; // Show if admin
    }
}


// One single 'DOMContentLoaded' event listener
document.addEventListener('DOMContentLoaded', async function() {
    // Display the last given gift
    await displayLastGivenGift();
  
    // Control the reset button visibility based on URL query parameter
    controlResetButtonVisibility();
    
    // Set up your event listeners for giftButton and resetButton
    document.getElementById("giftButton").addEventListener("click", async function() {
        const gifts = await fetchAllGifts();
        const availableGifts = gifts.filter(gift => !gift.Given);
    
        if (availableGifts.length === 0) {
            document.getElementById("selectedGift").innerText = "Все подарочки разобрали! Ждем следующего года вместе";
            document.getElementById("giftDescription").innerText = ""; // Clear the description
            updatePreviousGiftsList(gifts.filter(gift => gift.Given));
            return;
        }
    
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
    
    
    document.getElementById("resetButton").addEventListener("click", async function() {
        try {
            const response = await fetch('/.netlify/functions/resetGifts', { method: 'POST' });
            if (response.ok) {
                console.log("Gifts reset successfully");
                clearPreviousGiftsList(); // Clear the list of previous gifts
            } else {
                console.error("Failed to reset gifts");
            }
        } catch (error) {
            console.error("Error resetting gifts: ", error);
        }
    });
});
