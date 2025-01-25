class HandlerScrapy {
  constructor() {
      // Initialize instances of the scrapers
      this.scrapyDino = new scrapyDino();
      this.scrapyAnotai = new ScrapyAnotai();
      this.scrapyGoomer = new ScrapyGoomer();
      this.scrapyCoisaRuim = new ScrapyCoisaRuim();
      this.scrapyWhatsApp = new ScrapyWhatsApp();
      this.scrapySemola = new scrapySemola();
      this.scrapyOlaClick = new ScrapyOlaClick();
      this.scrapyInstaDelivery = new scrapyInstaDelivery();
      this.scrapyHubt = new scrapyHubt();
      this.scrapyJotaja = new scrapyJotaja();
      this.scrapyYooga = new scrapyYooga();
      this.scrapyCardapioDigital = new scrapyCardapioDigital();
      this.scrapySaipos = new scrapySaipos();
      this.scrapyNeemo = new scrapyNeemo();
      this.scrapyCardapioWeb = new scrapyCardapioWeb();
      this.scrapyDiggy = new scrapyDiggy();
  }

  async handleScrapyChoice(restaurant) {
      // Determines which scraper to use based on the selected restaurant
      if (restaurant === 'Dino') {
          await alert("Starting...");
          await this.scrapyDino.clickProductCards();
          const scrapedData = this.scrapyDino.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyDino.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Anotai') {
          await alert("Starting...");
          await this.scrapyAnotai.checkAndScrape();
          const scrapedData = this.scrapyAnotai.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyAnotai.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Yooga') {
          await alert("Starting...");
          await this.scrapyYooga.clickProductCards();
          const scrapedData = this.scrapyYooga.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyYooga.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'WhatsApp') {
          await alert("Starting...");
          await this.scrapyWhatsApp.clickProductCards();
          const scrapedData = this.scrapyWhatsApp.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyWhatsApp.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Semola') {
          await alert("Starting...");
          await this.scrapySemola.clickProductCards();
          const scrapedData = this.scrapySemola.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapySemola.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Jotaja') {
          await alert("Starting...");
          await this.scrapyJotaja.clickProductCards();
          const scrapedData = this.scrapyJotaja.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyJotaja.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'CardapioDigital') {
          await alert("Starting...");
          await this.scrapyCardapioDigital.clickProductCards();
          const scrapedData = this.scrapyCardapioDigital.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyCardapioDigital.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Hubt') {
          await alert("Starting...");
          await this.scrapyHubt.clickProductCards();
          const scrapedData = this.scrapyHubt.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyHubt.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Goomer') {
          await alert("Starting...");
          await this.scrapyGoomer.clickProductCards();
          const scrapedData = this.scrapyGoomer.scrapedData;
          await alert("Completed");
          await createCSV(scrapedData);

      } else if (restaurant === 'OlaClick') {
          await alert("Starting...");
          await this.scrapyOlaClick.clickProductCards();
          const scrapedData = this.scrapyOlaClick.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyOlaClick.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Saipos') {
          await alert("Starting...");
          await this.scrapySaipos.clickProductCards();
          const scrapedData = this.scrapySaipos.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapySaipos.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Neemo') {
          await alert("Starting...");
          await this.scrapyNeemo.clickProductCards();
          const scrapedData = this.scrapyNeemo.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyNeemo.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Diggy') {
          await alert("Starting...");
          await this.scrapyDiggy.clickProductCards();
          const scrapedData = this.scrapyDiggy.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyDiggy.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'Coisa Ruim') {
          await alert("Starting...");
          await this.scrapyCoisaRuim.clickProductCards();
          const scrapedData = this.scrapyCoisaRuim.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyCoisaRuim.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'CardapioWeb') {
          await alert("Starting...");
          await this.scrapyCardapioWeb.clickProductCards();
          const scrapedData = this.scrapyCardapioWeb.scrapedData;
          await alert("Completed");
          const titleRestaurant = this.scrapyCardapioWeb.titleRestaurant;
          await createCSV(scrapedData, titleRestaurant);

      } else if (restaurant === 'InstaDelivery') {
          const verifyClosed = await this.scrapyInstaDelivery.verifyClosed();
          if (verifyClosed) {
              alert("The restaurant is closed. Please try again when it is open.");
          } else {
              await alert("Starting...");
              await this.scrapyInstaDelivery.clickProductCards();
              const scrapedData = this.scrapyInstaDelivery.scrapedData;
              await alert("Completed");
              const titleRestaurant = this.scrapyInstaDelivery.titleRestaurant;
              await createCSV(scrapedData, titleRestaurant);
          }
      } else {
          await alert('Invalid restaurant');
      }
  }
}

// Export the HandlerScrapy class
window.HandlerScrapy = HandlerScrapy;

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.restaurante) {
      const handlerScrapy = new HandlerScrapy();
      await handlerScrapy.handleScrapyChoice(request.restaurante);
  }
});
