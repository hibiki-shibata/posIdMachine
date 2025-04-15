
let jsonData = null;
let fileName = "";
const posidPrefix = "AUTO_POSID";

// handle JSON file uploads
document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    fileName = file.name;

    if (file) {
        const reader = new FileReader();

        reader.onload = function (uploadedData) {
            try {
                jsonData = JSON.parse(uploadedData.target.result);
            } catch (error) {
                alert("Invalid JSON format. Please check the file.");
            }
        };

        reader.readAsText(file);
    }
});


async function processJSON() {
    if (!jsonData) {
        alert("Please select a JSON file first. \nClick \"Choose File\", and select your menu JSON file exported from menu editor.");
        return;
    }
    try {
        let counter = 1;
        const usedExternalIds = new Set();

        posidForItems(counter, usedExternalIds)
        posidForOptionItems(counter, usedExternalIds)


        document.getElementById('output').value = JSON.stringify(jsonData, null, 4); // Display in Textarea

        // Convert the modified JSON to a Blob
        const jsonString = JSON.stringify(jsonData);
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.download = `$has_posID_${fileName}` // Set Filename
        link.href = URL.createObjectURL(blob); // Create an object URL for the Blob

        link.click(); // Trigger the download by clicking the link programmatically

    } catch (e) {
        alert("Something went wrong:(\nError content:\n" + e)
    }
}



async function posidForItems(counter, usedExternalIds) {
    // Items and Option Categories
    ["items", "options"].forEach(itemsOrOptionsCategory => {
        jsonData[itemsOrOptionsCategory].forEach(eachItemOrOptions => {
            let externalId;
            do {
                externalId = `${posidPrefix}_${counter}`;
                counter++;
            } while (usedExternalIds.has(externalId));

            usedExternalIds.add(externalId); // Prevent Duplicated ID
            eachItemOrOptions.external_id = externalId;
        });
    });
}


async function posidForOptionItems(counter, usedExternalIds) {

    //For Opion Items
    jsonData["options"].forEach(optionCategories => {
        optionCategories.values.forEach(childOptionItems => {
            let externalId2;
            do {
                externalId2 = `${posidPrefix}_${counter}`;
                counter++;
            } while (usedExternalIds.has(externalId2));

            usedExternalIds.add(externalId2); // Prevent Duplicated ID
            childOptionItems.external_id = externalId2;
        })

    });
}



// "Remove File" button
function removeJSON() {
    try {
        jsonData = null
        fileName = ""
        counter = 1
        document.getElementById('jsonFileInput').value = '';
        document.getElementById('output').value = '';

    } catch (e) {
        alert("Something went wrong:(\nError content:\n" + e)
    }
}



