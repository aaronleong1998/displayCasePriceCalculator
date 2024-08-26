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

