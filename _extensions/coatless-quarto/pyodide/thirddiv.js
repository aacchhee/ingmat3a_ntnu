// Create the third inner div element for "ApiKey" 
    const thirdInnerDiv = document.createElement("div");
    thirdInnerDiv.setAttribute("id", "qpyodide-enter-apiKey");
    thirdInnerDiv.classList.add("quarto-title-meta-input");
    thirdInnerDiv.innerText = "";

    // Create the fourth inner div element for "BaseUrl" 
    const fourthInnerDiv = document.createElement("div");
    fourthInnerDiv.setAttribute("id", "qpyodide-enter-baseUrl");
    fourthInnerDiv.classList.add("quarto-title-meta-input");
    fourthInnerDiv.innerText = "";

    if (globalThis.backend == "groq"){
      var apiKeyInput = document.createElement('input');
      apiKeyInput.type = 'text';
      apiKeyInput.id = `apiKeyInput`;
      apiKeyInput.placeholder = 'Enter your API Key'; 
      apiKeyInput.style.width = '600px'; // Adjust width as needed

      // Create the save button
      var saveButton = document.createElement('button');
      saveButton.id = 'saveApiKeyButton';
      saveButton.className = 'btn  btn-default qpyodide-button qpyodide-button-saveKey';
      saveButton.type = 'button';
      saveButton.innerText = 'Save API Key';
      saveButton.style.margin = '10px';

      // Add event listener to the button to save the API key in session storage
      saveButton.addEventListener('click', function() {
        var groqApiKey = apiKeyInput.value;
        if (groqApiKey) {
            sessionStorage.setItem('groqApiKey', groqApiKey);
            alert('API Key saved successfully!');
            checkAndHideSettings();
        } else {
            alert('Please enter a valid API Key.');
        }
      });

      // Append the input field and save button to the div
      fourthInnerDiv.appendChild(apiKeyInput);
      fourthInnerDiv.appendChild(saveButton);
      
      var baseUrlInput = document.createElement('input');
      baseUrlInput.type = 'text';
      baseUrlInput.id = `baseUrlInput`;
      baseUrlInput.placeholder = 'Enter your Base Url'; 
      baseUrlInput.style.width = '600px'; // Adjust width as needed

      // Create the save button
      var saveButton2 = document.createElement('button');
      saveButton2.id = 'saveBaseUrlButton';
      saveButton2.className = 'btn  btn-default qpyodide-button qpyodide-button-saveUrl';
      saveButton2.type = 'button';
      saveButton2.innerText = 'Save Base Url';
      saveButton2.style.margin = '10px';

      // Add event listener to the button to save the API key in session storage
      saveButton2.addEventListener('click', function() {
        var baseUrl = baseUrlInput.value;
        if (baseUrl) {
            sessionStorage.setItem('baseUrlInput', baseUrl);
            alert('Base Url saved successfully!');
            checkAndHideSettings();
        } else {
            alert('Please enter a valid base Url.');
        }
      });

      // Append the input field and save button to the div
      thirdInnerDiv.appendChild(baseUrlInput);
      thirdInnerDiv.appendChild(saveButton2);

      // Create the gear icon
      var settingsIcon = document.createElement('i');
      settingsIcon.classList.add('fa-solid', 'fa-gear');
      settingsIcon.id = 'settingsIcon';
      settingsIcon.style.fontSize = '20px';
      settingsIcon.style.cursor = 'pointer';
      settingsIcon.style.display = 'inline-block';
      settingsIcon.style.position = 'absolute';
      settingsIcon.style.right = '0';

      // Add the event to the gear icon to toggle the fields' visibility
      settingsIcon.addEventListener('click', toggleSettings);

      // Append the gear icon to the desired container
      firstInnerDiv.appendChild(settingsIcon);
      

      // Function to toggle the visibility of input fields
      function toggleSettings() {
          var isVisible = apiKeyInput.style.display !== 'none';
          
          // Show or hide the fields
          apiKeyInput.style.display = isVisible ? 'none' : 'inline-block';
          saveButton.style.display = isVisible ? 'none' : 'inline-block';
          baseUrlInput.style.display = isVisible ? 'none' : 'inline-block';
          saveButton2.style.display = isVisible ? 'none' : 'inline-block';
      }

      // Function to check if both values are saved and hide the fields if applicable
      function checkAndHideSettings() {
        var savedApiKey = sessionStorage.getItem('groqApiKey');
        var savedBaseUrl = sessionStorage.getItem('baseUrlInput');
        
        // Both values must be present to hide the fields
        if (savedApiKey && savedBaseUrl) {
            toggleSettings(); // Hide fields
        }
      }

      // Initial visibility of the fields based on saved values
      document.addEventListener('DOMContentLoaded', function() {
          // Prüfen, ob bereits Werte in Session Storage sind
          var savedApiKey = sessionStorage.getItem('groqApiKey');
          var savedBaseUrl = sessionStorage.getItem('baseUrlInput');
          
          // If values are saved, hide the fields
          if (savedApiKey && savedBaseUrl) {
              apiKeyInput.value = savedApiKey;
              baseUrlInput.value = savedBaseUrl;
              toggleSettings(); // Hide fields
          }
      });
    }
