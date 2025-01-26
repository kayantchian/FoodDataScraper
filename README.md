<!-- PROJECT LOGO-->
<br />
<div align="center">
  <a>
    <img src="images/logo.png" alt="Logo">
  </a>
</div>

# FoodDataScraper

FoodDataScraper is a browser extension that performs **web scraping** on predefined restaurant menu websites. It collects data from these menus and generates automated spreadsheets, optimizing the internal menu registration process for businesses.

## Features

- Collects data from menus of restaurants such as **Saipos**, **CardapioWeb**, **Dino**, and more.
- Generates a **CSV** spreadsheet with the following data:
  - Item type (Product, Complement, Option)
  - Name, description, price, image
  - Minimum and maximum quantities for complements
  - POS code and item availability (if available)
- Simple interface to select the desired restaurant and initiate the data collection process.
- **Scalable design**: The scraping system is designed to support any website, not just restaurants. You can create a new scraper for any desired website by adding a custom scraper class to the [scrapys folder](https://github.com/kayantchian/FoodDataScraper/tree/main/scrapys). The `HandlerScrapy` class will automatically manage and execute the new scraper. However, each new scraper must be developed specifically for the target website, considering its unique structure and requirements.

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
2. Open the website you want to scrape.
3. Select the corresponding website (e.g., restaurant) from the dropdown menu in the extension.
4. Click the **Collect Data** button to start scraping the menu data.
5. After the scraping process is complete, the extension will automatically generate a CSV file for download with the extracted information.

## Adding a New Scraper

The extension is designed to support scraping from any website. To add a new scraper:
1. Create a custom scraper class in the [scrapys folder](https://github.com/kayantchian/FoodDataScraper/tree/main/scrapys).
2. Implement the necessary methods to handle the website's specific structure and data extraction logic.
3. The `HandlerScrapy` class will automatically integrate and execute your new scraper based on the selected website in the interface.

**Note:** Although the current implementation focuses on restaurant menu scraping, the system's architecture is flexible enough to adapt to other use cases with custom scrapers.

## License

This project is licensed under the **MIT License** - see the **[LICENSE](LICENSE)** file for details.
