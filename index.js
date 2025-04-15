
let jsonData = null;
let fileName = "";

// handle JSON file uploads
document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    fileName = file.name;

    if (file) {
        const reader = new FileReader();
        reader.onload = function (uploadedData) {
            try {
                jsonData = JSON.parse(uploadedData.target.result);
                // alert("JSON file loaded successfully!");
            } catch (error) {
                alert("Invalid JSON format. Please check the file.");
            }
        };

        reader.readAsText(file);

    }
});


function processJSON() {
    if (!jsonData) {
        alert("Please upload a JSON file first. \nClick \"Choose File\" and select your menu JSON file exported from menu editor.");
        return;
    }
    try {
        const prefix = "AutoPOSID";
        let counter = 1;
        const usedExternalIds = new Set();

        // Items and Option Categories
        ["items", "options"].forEach(itemsOrOptionsCategory => {
            jsonData[itemsOrOptionsCategory].forEach(eachItemOrOptions => {
                let externalId;
                do {
                    externalId = `${prefix}_${counter}`;
                    counter++;
                } while (usedExternalIds.has(externalId));

                usedExternalIds.add(externalId); // Prevent Duplicated ID
                eachItemOrOptions.external_id = externalId;
            });
        });


        //For Opion Items
        jsonData["options"].forEach(optionCategories => {
            optionCategories.values.forEach(childOptionItems => {
                let externalId2;
                do {
                    externalId2 = `${prefix}_${counter}`;
                    counter++;
                } while (usedExternalIds.has(externalId2));

                usedExternalIds.add(externalId2); // Prevent Duplicated ID
                childOptionItems.external_id = externalId2;
            })

        });

        document.getElementById('output').value = JSON.stringify(jsonData, null, 4);

        // Convert the modified JSON to a Blob
        // const jsonString = JSON.stringify(jsonData, null, 4);
        const jsonString = JSON.stringify(jsonData);
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.download = `$has_posID_${fileName}` // Set the desired filename
        link.href = URL.createObjectURL(blob); // Create an object URL for the Blob

        // Trigger the download by clicking the link programmatically
        link.click();

        removeJSON();

    } catch (e) {
        alert("Something went wrong\n" + e)
    }
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
        console.log(e)
    }
}



