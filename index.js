      
        let jsonData = null; // This will hold the imported JSON

        document.getElementById('jsonFileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function(uploadedData) { // Defining the behavior, for when readAsText is called
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
                alert("Please upload a JSON file first.");
                return;
            }
            try{
            const prefix = "AutoPOSID";
            let counter = 1;
            // const usedExternalIds = new Set();
            
            ["items", "options"].forEach(itemsOrOptionsCategory => {
                jsonData[itemsOrOptionsCategory].forEach(eachItemOrOptions => {
                    let externalId;        
                        externalId = `${prefix}_${counter}`;
                        counter++;        
            
                    eachItemOrOptions.external_id = externalId;
                });
            });
            
            document.getElementById('output').value = JSON.stringify(jsonData, null, 4);

            // Convert the modified JSON to a Blob
            const jsonString = JSON.stringify(jsonData, null, 4);
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.download = 'PosID_registered_menu.json'; // Set the desired filename
            link.href = URL.createObjectURL(blob); // Create an object URL for the Blob

            // Trigger the download by clicking the link programmatically
            link.click();  
            
            }catch(e){

            alert("Something went wrong\n" + e)
            
            }
        }


        function removeJSON() {
                jsonData = null
                counter = 1         
                document.getElementById('jsonFileInput').value = '';            
            }
        


        