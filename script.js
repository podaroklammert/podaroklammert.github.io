

// Russian month names in genitive case (for "подарочек января")
const RUSSIAN_MONTHS = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

// Russian month names in accusative case (for "Подарочек на Январь")
const RUSSIAN_MONTHS_ACCUSATIVE = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Get current month (supports ?month=X override for testing)
function getCurrentMonth() {
    const urlParams = new URLSearchParams(window.location.search);
    const monthParam = urlParams.get('month');
    if (monthParam !== null) {
        return parseInt(monthParam); // 0-11
    }
    return new Date().getMonth(); // 0-11
}

// Get current month name in Russian (genitive case)
function getCurrentMonthName() {
    const month = getCurrentMonth();
    return RUSSIAN_MONTHS[month];
}

// Check if user can get a new gift this month
// Returns true if: no gifts given yet, OR last gift was given in a previous month
async function canGetGiftThisMonth(givenGiftsCount) {
    const currentMonth = getCurrentMonth();

    // If no gifts given yet this year, user can get first gift
    if (givenGiftsCount === 0) {
        return true;
    }

    // User can get gift if current month number >= gifts already given
    // e.g., in January (month 0), can get gift if 0 gifts given
    // in February (month 1), can get gift if 0 or 1 gifts given
    return currentMonth >= givenGiftsCount;
}

// Check if admin mode is enabled
function isAdminMode() {
    return getQueryParamByName('admin') === '1';
}

// Function to display the last given gift on the webpage
// Returns the gift object if found, null otherwise
async function displayLastGivenGift() {
    try {
      // Check if there's a year parameter in the URL for testing
      const urlParams = new URLSearchParams(window.location.search);
      const yearParam = urlParams.get('year');
      const url = yearParam
          ? `/.netlify/functions/getLastGivenGift?year=${yearParam}`
          : '/.netlify/functions/getLastGivenGift';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const lastGivenGift = await response.json();

      // Check if the last given gift data is valid and has content
      if (lastGivenGift && lastGivenGift.Name) {
        // Display the last given gift details with current month name
        const monthName = getCurrentMonthName();
        // Set label and gift name separately for better visual hierarchy
        const giftLabel = document.getElementById("giftLabel");
        if (giftLabel) {
            giftLabel.innerText = "Подарочек на" + RUSSIAN_MONTHS_ACCUSATIVE[getCurrentMonth()];
        }
        document.getElementById("selectedGift").innerText = lastGivenGift.Name;
        document.getElementById("giftDescription").innerText = lastGivenGift.Description;
        // Hide instruction text when gift is displayed
        const instructionText = document.getElementById("instructionText");
        if (instructionText) instructionText.style.display = "none";
        return lastGivenGift;
      } else {
        // If the gift data is not valid, do not display any current gift
        const giftLabelEmpty = document.getElementById("giftLabel");
        if (giftLabelEmpty) giftLabelEmpty.innerText = "";
        document.getElementById("selectedGift").innerText = "";
        document.getElementById("giftDescription").innerText = "";
        // Show instruction text when no gift
        const instructionText = document.getElementById("instructionText");
        if (instructionText) instructionText.style.display = "block";
        return null;
      }
    } catch (error) {
      // Handle any errors during the fetch operation
      console.error("Error fetching the last given gift: ", error);
      // Ensure nothing is displayed if there's an error
      const giftLabelErr = document.getElementById("giftLabel");
      if (giftLabelErr) giftLabelErr.innerText = "";
      document.getElementById("selectedGift").innerText = "";
      document.getElementById("giftDescription").innerText = "";
      return null;
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

async function skipGift(giftId) {
    try {
        const response = await fetch('/.netlify/functions/skipGift', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: giftId })
        });
        return response.ok;
    } catch (error) {
        console.error("Error skipping gift: ", error);
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
    // Set up your event listeners for giftButton and resetButton
    const giftButton = document.getElementById("giftButton");
    const rejectButton = document.getElementById("rejectButton");
    const originalButtonText = giftButton.innerText;

    // Track current selected gift for rejection
    let currentSelectedGift = null;

    // Display the last given gift and set it as current for rejection
    const lastGift = await displayLastGivenGift();
    if (lastGift) {
        currentSelectedGift = lastGift;
        rejectButton.style.display = "block";
    }

    // Load and display previously given gifts
    const gifts = await fetchAllGifts();
    updatePreviousGiftsList(gifts.filter(gift => gift.Given));

    // Control the reset button visibility based on URL query parameter
    controlResetButtonVisibility();

    // Check if button should be disabled based on month (skip for admin)
    async function updateButtonState() {
        if (isAdminMode()) {
            giftButton.disabled = false;
            giftButton.innerText = originalButtonText;
            return;
        }

        const gifts = await fetchAllGifts();
        const givenGifts = gifts.filter(gift => gift.Given);
        const availableGifts = gifts.filter(gift => !gift.Given);

        // If all gifts are given, disable button
        if (availableGifts.length === 0) {
            giftButton.disabled = true;
            giftButton.innerText = "Все подарки получены";
            return;
        }

        // Check if user already got gift this month
        const canGet = await canGetGiftThisMonth(givenGifts.length);
        if (!canGet) {
            giftButton.disabled = true;
            giftButton.innerText = "Ждём следующего месяца! ✨";
        } else {
            giftButton.disabled = false;
            giftButton.innerText = originalButtonText;
        }
    }

    // Initial button state check
    await updateButtonState();

    giftButton.addEventListener("click", async function() {
        // Check month restriction (skip for admin)
        if (!isAdminMode()) {
            const allGifts = await fetchAllGifts();
            const givenCount = allGifts.filter(gift => gift.Given).length;
            const canGet = await canGetGiftThisMonth(givenCount);

            if (!canGet) {
                document.getElementById("selectedGift").innerText = "Ждём следующего месяца! ✨";
                document.getElementById("giftDescription").innerText = "";
                return;
            }
        }

        // Disable button and show loading spinner
        giftButton.disabled = true;
        giftButton.innerHTML = '<span class="spinner"></span>Открываем...';

        try {
            const gifts = await fetchAllGifts();
            const availableGifts = gifts.filter(gift => !gift.Given);

            if (availableGifts.length === 0) {
                document.getElementById("selectedGift").innerText = "Все подарочки разобрали! Ждем следующего года вместе";
                document.getElementById("giftDescription").innerText = ""; // Clear the description
                updatePreviousGiftsList(gifts.filter(gift => gift.Given));
                rejectButton.style.display = "none";
                // Keep button disabled
                giftButton.innerText = "Все подарки получены";
                return;
            }

            let selectedGift = availableGifts[Math.floor(Math.random() * availableGifts.length)];
            currentSelectedGift = selectedGift;
            const monthName = getCurrentMonthName();
            // Set label and gift name separately for better visual hierarchy
            const giftLabel = document.getElementById("giftLabel");
            if (giftLabel) {
                giftLabel.innerText = "Подарочек на" + RUSSIAN_MONTHS_ACCUSATIVE[getCurrentMonth()];
            }
            document.getElementById("selectedGift").innerText = selectedGift.Name;
            document.getElementById("giftDescription").innerText = selectedGift.Description;
            // Hide instruction text when gift is displayed
            const instructionText = document.getElementById("instructionText");
            if (instructionText) instructionText.style.display = "none";

            // Stop spinner immediately after showing gift (before database update)
            giftButton.disabled = false;
            giftButton.innerText = originalButtonText;

            // Show reject button so user can reject this gift
            rejectButton.style.display = "block";

            // Update the gift status to Given: true (in background)
            const updateSuccess = await updateGiftStatus(selectedGift.id);
            if (updateSuccess) {
                console.log("Gift status updated successfully");
            }

            // Update previous gifts list
            updatePreviousGiftsList(gifts.filter(gift => gift.Given));

            // Update button state after gift is given
            await updateButtonState();
        } catch (error) {
            console.error("Error getting gift:", error);
            // Re-enable button on error
            giftButton.disabled = false;
            giftButton.innerText = originalButtonText;
        }
    });

    // Reject button click handler
    rejectButton.addEventListener("click", async function() {
        if (!currentSelectedGift) {
            return;
        }

        // Ask for confirmation before skipping
        const confirmed = confirm("Точно пропускаем подарок? Он больше не появится в этом году.");
        if (!confirmed) {
            return;
        }

        // Disable reject button and show loading
        rejectButton.disabled = true;
        rejectButton.innerHTML = '<span class="spinner"></span>Отклоняем...';

        try {
            // Skip the current gift
            const skipSuccess = await skipGift(currentSelectedGift.id);
            if (skipSuccess) {
                console.log("Gift skipped successfully");
            }

            // Fetch fresh data and draw a new gift
            const gifts = await fetchAllGifts();
            const availableGifts = gifts.filter(gift => !gift.Given);

            if (availableGifts.length === 0) {
                document.getElementById("selectedGift").innerText = "Все подарочки разобрали! Ждем следующего года вместе";
                document.getElementById("giftDescription").innerText = "";
                rejectButton.style.display = "none";
                giftButton.disabled = true;
                giftButton.innerText = "Все подарки получены";
                currentSelectedGift = null;
                return;
            }

            // Select a new random gift
            let newGift = availableGifts[Math.floor(Math.random() * availableGifts.length)];
            currentSelectedGift = newGift;
            const monthName = getCurrentMonthName();
            // Set label and gift name separately for better visual hierarchy
            const giftLabelNew = document.getElementById("giftLabel");
            if (giftLabelNew) {
                giftLabelNew.innerText = "Подарочек на" + RUSSIAN_MONTHS_ACCUSATIVE[getCurrentMonth()];
            }
            document.getElementById("selectedGift").innerText = newGift.Name;
            document.getElementById("giftDescription").innerText = newGift.Description;

            // Re-enable reject button
            rejectButton.disabled = false;
            rejectButton.innerText = "Не хочу этот подарок";

            // Mark new gift as given
            const updateSuccess = await updateGiftStatus(newGift.id);
            if (updateSuccess) {
                console.log("New gift status updated successfully");
            }

            // Update previous gifts list
            updatePreviousGiftsList(gifts.filter(gift => gift.Given));

        } catch (error) {
            console.error("Error rejecting gift:", error);
            rejectButton.disabled = false;
            rejectButton.innerText = "Не хочу этот подарок";
        }
    });

    document.getElementById("resetButton").addEventListener("click", async function() {
        try {
            const response = await fetch('/.netlify/functions/resetGifts', { method: 'POST' });
            if (response.ok) {
                console.log("Gifts reset successfully");
                clearPreviousGiftsList(); // Clear the list of previous gifts

                // Fetch and display available gifts as confirmation
                const gifts = await fetchAllGifts();
                const availableGifts = gifts.filter(gift => !gift.Given);

                // Show confirmation message with count
                document.getElementById("selectedGift").innerText =
                    "✅ Подарки сброшены! Доступно подарков: " + availableGifts.length;

                // Show list of available gifts in description
                const giftNames = availableGifts.map(gift => "• " + gift.Name).join("\n");
                document.getElementById("giftDescription").innerText = giftNames;
            } else {
                console.error("Failed to reset gifts");
            }
        } catch (error) {
            console.error("Error resetting gifts: ", error);
        }
    });
});
