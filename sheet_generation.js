async function createCSV(data, name) {
    const csvData = [];
  
    csvData.push([
        'TYPE',
        'NAME',
        'DESCRIPTION',
        'PRICE',
        'COST PRICE',
        'PROMOTIONAL PRICE',
        'IMAGE',
        'POS CODE',
        'ITEM AVAILABILITY',
        'COMPLEMENT TYPE',
        'MIN QUANTITY',
        'MAX QUANTITY',
        'COMPLEMENT CALCULATION',
    ]);
  
    const scrapedData = data;
  
    scrapedData.forEach(categoryData => {
        const categoryName = categoryData.categoryName;
        csvData.push(['Category', categoryName]);
  
        categoryData.productsCategory.forEach(productData => {
            const productName = productData.title;
            const productDescription = productData.description;
            const productPrice = productData.price;
            const promotionPrice = productData.promoPrice;
            const imgSrc = productData.imgSrc;
            const posCode = ''; // Add POS code here, if available
  
            // Fill in POS code and item availability if available
            if (posCode && productData.availability) {
                const availability = productData.availability;
                csvData.push(['Product', productName, productDescription, productPrice, promotionPrice, imgSrc, posCode, availability]);
            } else {
                csvData.push(['Product', productName, productDescription, productPrice, '', promotionPrice, imgSrc]);
            }
  
            // Check if complementsDict exists before iterating
            if (productData.complementsDict && productData.complementsDict.length > 0) {
                productData.complementsDict.forEach(complementData => {
                    const complementName = complementData.nameComplement;
                    const complementType = complementData.typeComplement;
                    const complementRequired = complementData.required ? 'Required' : 'Not Required';
                    const complementMinQtd = complementData.minQtd;
                    const complementMaxQtd = complementData.maxQtd;
  
                    csvData.push(['Complement', complementName, '', '', '', '', '', '', '', complementType, complementMinQtd, complementMaxQtd]);
  
                    complementData.options.forEach(option => {
                        const optionName = option.optionTitle;
                        const optionPrice = option.optionPrice;
                        const optionDescription = option.optionDescription;
                        const optionImg = option.optionImg ? option.optionImg : "";
  
                        csvData.push(['Option', optionName, optionDescription, optionPrice, '', '', optionImg, '', '', '', '', '']);
                    });
                });
            }
        });
    });
  
    // Convert to CSV using the PapaParse library
    const csv = Papa.unparse(csvData);
  
    // Create a Blob with the CSV content
    const blob = new Blob([csv], { type: 'text/csv' });
  
    // Create a URL object for the Blob
    const url = URL.createObjectURL(blob);
  
    // Create a download link
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
  
    const fileName = name !== "" ? name : "product_spreadsheet";
  
    a.download = `${fileName}.csv`; // File download name
  
    // Append the link to the document and simulate a click on it
    document.body.appendChild(a);
    a.click();
  
    // Clean up and revoke the URL object
    URL.revokeObjectURL(url);
  
    // Remove the link after the download
    document.body.removeChild(a);
  }
  