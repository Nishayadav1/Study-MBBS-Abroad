document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("validationForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const countrySelect = document.getElementById("country");
    const flagImg = document.getElementById("flag");
    const phoneCodeSpan = document.getElementById("phoneCode");
    const phoneInput = document.getElementById("phoneNumber");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const countryError = document.getElementById("countryError");
    const phoneError = document.getElementById("phoneError");
  
    let countries = [];
  
    // Fetch countries from Restcountries API
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        countries = data.map(country => ({
          name: country.name.common,
          flag: country.flags.svg,
          phoneCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "")
        }));
        populateCountryDropdown();
        setDefaultCountry("India"); // Set India as the default country
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
  
    // Populate country dropdown
    function populateCountryDropdown() {
      countrySelect.innerHTML = '<option value="">Select a country</option>';
      countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country.name;
        option.textContent = country.name;
        countrySelect.appendChild(option);
      });
    }
  
    // Set default country (India)
    function setDefaultCountry(countryName) {
      const defaultCountry = countries.find(c => c.name === countryName);
      if (defaultCountry) {
        countrySelect.value = defaultCountry.name;
        flagImg.src = defaultCountry.flag;
        phoneCodeSpan.textContent = defaultCountry.phoneCode;
      }
    }
  
    // Update flag and phone code on country selection
    countrySelect.addEventListener("change", function () {
      const selectedCountry = countries.find(c => c.name === this.value);
      if (selectedCountry) {
        flagImg.src = selectedCountry.flag;
        phoneCodeSpan.textContent = selectedCountry.phoneCode;
      } else {
        flagImg.src = "";
        phoneCodeSpan.textContent = "";
      }
    });
  
    // Form validation
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let isValid = true;
  
      // Name validation
      if (!nameInput.value.trim()) {
        nameError.textContent = "Name is required.";
        isValid = false;
      } else {
        nameError.textContent = "";
      }
  
      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = "Invalid email format.";
        isValid = false;
      } else {
        emailError.textContent = "";
      }
  
      // Country validation
      if (!countrySelect.value) {
        countryError.textContent = "Please select a country.";
        isValid = false;
      } else {
        countryError.textContent = "";
      }
  
      // Phone number validation
      const selectedCountry = countries.find(c => c.name === countrySelect.value);
      if (selectedCountry) {
        const phonePattern = new RegExp(`^\\${selectedCountry.phoneCode}\\d{${selectedCountry.phoneCode.length + 6,10}}$`);
        if (!phonePattern.test(phoneInput.value)) {
          phoneError.textContent = `Phone number must start with ${selectedCountry.phoneCode} and be 10 digits long.`;
          isValid = false;
        } else {
          phoneError.textContent = "";
        }
      }
  
      if (isValid) {
        alert("Form submitted successfully!");
        form.reset();
        flagImg.src = "";
        phoneCodeSpan.textContent = "";
      }
    });
  
    // Initialize
    fetchCountries();
  });