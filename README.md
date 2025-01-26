<!-- PROJECT LOGO-->
<br />
<div align="center">
  <a>
    <img src="images/logo.png" alt="Logo">
  </a>
</div>

FoodDataScraper is a browser extension that performs **web scraping** on predefined restaurant menu websites. It collects data from these menus and generates automated spreadsheets, optimizing the internal menu registration process for businesses.

## Features

- Collects data from menus of restaurants such as **Saipos**, **CardapioWeb**, **Dino**, and more.
- Generates a **CSV** spreadsheet with the following data:
  - Item type (Product, Complement, Option)
  - Name, description, price, image
  - Minimum and maximum quantities for complements
  - POS code and item availability (if available)
- Simple interface to select the desired restaurant and initiate the data collection process.

## Installation

### Steps to Install the Extension

1. **Download the project** to your computer:
   - Click on the **Code** button on GitHub and select **Download ZIP**.
   - Extract the ZIP file into a folder of your choice.

2. **Load the extension in your browser**:
   - Open the browser and go to the extensions page.
   - Enable Developer Mode (usually found at the top-right corner).
   - Click on **Load unpacked** or **Load temporary extension** (depending on your browser).
   - Select the folder where you extracted the project.

3. The extension will be loaded and available for use in your browser.

## How to Use

1. Click on the extension icon in your browser's toolbar.
2. Open the restaurant website you want to scrape.
3. Select the corresponding restaurant from the dropdown menu in the extension.
4. Click the **Collect Data** button to start scraping the menu data.
5. After the scraping process is complete, the extension will automatically generate a CSV file for download with the extracted information.

## License
This project is licensed under the **MIT License** - see the **[LICENSE](LICENSE)** file for details.