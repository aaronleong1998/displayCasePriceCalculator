function calculatePrice() {
    const width = parseFloat(document.getElementById('width').value);
    const length = parseFloat(document.getElementById('length').value);
    const height = parseFloat(document.getElementById('height').value);

    const panels = [
        { w: width, h: length },
        { w: width, h: height },
        { w: length, h: height },
        { w: width, h: length },
        { w: width, h: height },
        { w: length, h: height }
    ];

    const sheetWidth = 120;
    const sheetHeight = 60;
    const sheetArea = sheetWidth * sheetHeight;

    let usedArea = 0;
    let sheetsRequired = 1;  // Start with at least one sheet
    let currentSheetArea = 0;

    panels.forEach(panel => {
        let panelArea = panel.w * panel.h;
        currentSheetArea += panelArea;

        // If current sheet area exceeds one sheet, increment sheet count
        if (currentSheetArea > sheetArea) {
            sheetsRequired++;
            currentSheetArea = panelArea; // Start a new sheet with this panel's area
        }

        usedArea += panelArea;
    });

    // Calculate material cost based on actual sheets required
    let materialCost = sheetsRequired * 40;

    // Calculate unused area
    const unusedArea = (sheetsRequired * sheetArea) - usedArea;

    // Adjust cost based on the proportion of material used
    const usedMaterialProportion = usedArea / (sheetsRequired * sheetArea);
    const deduction = materialCost * (1 - usedMaterialProportion);
    materialCost -= deduction;

    // Final price calculation
    const finalPrice = materialCost * 3;

    // Display the final price
    document.getElementById('price').innerText = finalPrice.toFixed(2);
}

function updateThicknessOptions() {
    console.log('updateThicknessOptions called'); // Debugging line
    const color = document.getElementById('sheet-color').value;
    const thicknessSelect = document.getElementById('sheet-thickness');

    // Clear existing options
    thicknessSelect.innerHTML = '';

    // Initialize options based on the selected color
    let options = [];
    if (color === 'transparent') {
        options = [1, 3, 5, 10];
    } else if (color === 'gold-mirror' || color === 'silver-mirror' || color === 'rose-gold-mirror') {
        options = [2];
    } else if (color === 'black' || color === 'white') {
        options = [2, 3, 5, 10];
    } else if (color === 'colour-acrylic' || color === 'tinted-acrylic') {
        options = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    // Populate the dropdown with new options
    options.forEach(thickness => {
        const option = document.createElement('option'); // Create a new option element
        option.value = thickness; // Set the value attribute
        option.textContent = `${thickness} mm`; // Set the display text
        thicknessSelect.appendChild(option); // Add the option to the select element
    });

    // If no options are available, show a default message
    if (options.length === 0) {
        const noOptions = document.createElement('option');
        noOptions.textContent = 'No options available';
        thicknessSelect.appendChild(noOptions);
    }
}

function calculateRawSheetPrice() {
    // Get user input
    const color = document.getElementById('sheet-color').value;
    const thickness = parseFloat(document.getElementById('sheet-thickness').value);
    const width = parseFloat(document.getElementById('sheet-width').value);
    const height = parseFloat(document.getElementById('sheet-height').value);

    // Validate input
    if (isNaN(thickness) || isNaN(width) || isNaN(height)) {
        alert('Please enter valid dimensions and thickness.');
        return;
    }

    // Convert dimensions to feet for calculations
    const widthFeet = width / 30.48; // Convert cm to feet
    const heightFeet = height / 30.48;

    // Pricing data (price per full sheet in RM)
    const prices = {
        transparent: { 1: 60, 2: 96, 3: 120, 4: 164, 5: 209, 6: 253, 8: 347, 10: 422 },
        'black-white': { 2: 106, 3: 132, 4: 181, 5: 230, 6: 279, 8: 381, 10: 464 },
        'colour-acrylic': { 2: 110, 3: 138, 4: 189, 5: 240, 6: 279, 8: 381, 10: 464 },
        'tinted-acrylic': { 2: 115, 3: 144, 4: 197, 5: 251, 6: 251, 8: 347, 10: 422 },
        'gold-mirror': { 2: 140 },
        'silver-mirror': { 2: 140 },
        'rose-gold-mirror': { 2: 160 },
    };

    // Get price per full sheet
    let pricePerFullSheet;
    if (color === 'gold-mirror' || color === 'silver-mirror' || color === 'rose-gold-mirror') {
        pricePerFullSheet = prices[color][2];
    } else if (prices[color] && prices[color][thickness]) {
        pricePerFullSheet = prices[color][thickness];
    } else {
        alert('Invalid selection or pricing unavailable for this combination.');
        return;
    }

    // Check for maximum dimension limits
    if (widthFeet > 6 || heightFeet > 6) {
        document.getElementById('raw-sheet-price').textContent = 'Unable to quote';
        return;
    }

    // Area of the full sheet (6x4ft) in square feet
    const fullSheetArea = 6 * 4; // 6x4 ft sheet

    // Check if it fits within a 3x2ft sheet
    const sheetWidth = 3 * 30.48; // 3 feet in cm
    const sheetHeight = 2 * 30.48; // 2 feet in cm

    // Calculate fit count for both orientations
    const fitCountOriginal = Math.floor(sheetWidth / width) * Math.floor(sheetHeight / height);
    const fitCountSwapped = Math.floor(sheetWidth / height) * Math.floor(sheetHeight / width);

    // Use the maximum fit count
    const fitCount = Math.max(fitCountOriginal, fitCountSwapped);

    let finalPrice;
    if (fitCount > 0) {
        // Fits within a 3x2ft sheet
        const pricePerQuarterSheet = pricePerFullSheet / 4;
        finalPrice = Math.ceil((pricePerQuarterSheet / fitCount) * 2); // Multiplier = 2 for normal fit
    } else {
        // Exceeds 3x2ft dimensions, use area-based calculation
        const requestedArea = widthFeet * heightFeet;
        const areaRatio = fullSheetArea / requestedArea;

        if (areaRatio < 1) {
            document.getElementById('raw-sheet-price').textContent = 'Unable to quote';
            return;
        }

        finalPrice = Math.ceil((pricePerFullSheet / areaRatio) * 3.2); // Multiplier = 3.2 for area-based calculation
    }

    // Display the result
    document.getElementById('raw-sheet-price').textContent = `RM ${finalPrice}`;
}

