
class scrapyInstaDelivery {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""

    }

    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
    async verifyClosed(){
      let cardBody = document.querySelector('.card-body');
      let closed = cardBody.querySelector('.badge-danger');
      var bool
      console.log(closed)
      if(closed){
        bool = true
      }
      else {
        bool = false
      }
      return bool
    }
    // [*]  Função responsável por pegar o preço do produto; em caso de promoções, pegar o preço original.
    async getPriceProduct(priceText){
      var multiplePrices = priceText.includes('\n');
      var productPrice;
      if (multiplePrices) {
        let priceElements = priceText.split('\n').map(e => e.trim()).filter(Boolean);
        productPrice = priceElements[0].replace(/[^\d,.]/g, '').replace('.', ',');
      } else {
        productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',');
      }
      return productPrice;
    }
    // [*]  Função responsável por determinar as quantidades max, min das opções de cada complemento
    async getComplementQuantityRequired(complementType) {
      // Remover parênteses e espaços extras
      let cleanedType = complementType.replace(/[()]/g, '').trim();
      // Identificar se é Obrigatório ou Opcional
      let isOptional = cleanedType.toLowerCase().includes('opcional');
      let isRequired = !isOptional
      // Encontrar os números presentes na string
      let matches = cleanedType.match(/(\d+)/g);
      // Definir maxQuantity baseado nos matches
      let maxQuantity = matches ? parseInt(matches[matches.length - 1], 10) : 1;
      let minQuantity = 0
      if(isRequired){
        minQuantity = maxQuantity
      }
      return [isRequired,minQuantity,maxQuantity];
    }
    // [*] Função responsável por verificar o tipo do complemento (sua repetição, multiplicidade)
    async getComplementType(complementExpandable, Quantity){
      let hasButton = complementExpandable.querySelector('.update-button')
      let repetion
      let type
      if (hasButton){
        repetion = " com repeticao"
      }
      else {
        repetion = " sem repeticao"
      }
      if(Quantity>1){
        type = "Mais de uma opcao" + repetion
      }
      else{
        type = "Apenas uma opcao"
      }
      return type
    }
    
    // [*] Função responsável por separar o nome do complemento do seu tipo
    async cleanUpText(text) { 
    // Remove espaços extras e quebras de linha
    let cleanedText = text.trim().replace(/\s+/g, ' ');
    // Encontrar o texto entre parênteses
    let matches = cleanedText.match(/\(([^)]*)\)/);
    // Se houver correspondências, extraia o texto entre parênteses
    let complementType = matches ? matches[1] : '';
    // Remova o texto entre parênteses de cleanedText
    cleanedText = cleanedText.replace(/\([^)]*\)/g, '');
    return [cleanedText.trim(), complementType.trim()];
}


async processComplements(productModal) {
  var complementsDict = [];
  var complementExpandables = productModal.querySelectorAll(".col-md-12.complement, .col-md-10.col-sm-10");

  for await (const complementExpandable of complementExpandables) {
      if (complementExpandable.classList.contains('col-md-10')) {
          var complementElements = complementExpandable.querySelectorAll('.item-desc');
          var optionsComplement = [];

          for await (const complementElement of complementElements) {
              var complementTitleElement = complementElement.querySelector('i');
              var complementName = complementTitleElement ? complementTitleElement.nextSibling.textContent.trim() : '';

              // Captura a quantidade de opções e se a opção é obrigatória ou não
              var [Required, minQtd, maxQtd] = await this.getComplementQuantityRequired(complementType);

              // Verifica se tem repetição e o tipo 'mais de uma opção' ou não.
              var typeComplement = await this.getComplementType(complementExpandable, maxQtd);

              // Pegar nome de cada opção do complemento da iteração
              var optionsElement = complementExpandable.querySelectorAll('.form-check');
              for await (const optionElement of optionsElement) {
                  var optionTitleElement = optionElement.querySelector('.item-complement, .complement-name');
                  var optionPriceElement = optionElement.querySelector('.sub-item-price');

                  var optionTitle = optionTitleElement ? optionTitleElement.textContent.trim() : "";
                  var optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  var optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',');
                  var optionDescription = "";

                  optionsComplement.push({
                      optionTitle: optionTitle,
                      optionPrice: optionPrice,
                      optionDescription: optionDescription
                  });
              }
          }
      }
      if (complementExpandable.classList.contains('col-md-12')) {
          var complementElements = complementExpandable.querySelectorAll('.complement-font');
          var optionsComplement = [];

          // Pegar o nome de cada complemento
          for await (const complementElement of complementElements) {
              var complementNameElement = complementElement.textContent;
              // Separa o nome do complemento do seu tipo e.g: (Obrigatório) 0/2
              var [complementName, complementType] = await this.cleanUpText(complementNameElement);

              // Captura a quantidade de opções e se a opção é obrigatória ou não
              var [Required, minQtd, maxQtd] = await this.getComplementQuantityRequired(complementType);

              // Verifica se tem repetição e o tipo 'mais de uma opção' ou não.
              var typeComplement = await this.getComplementType(complementExpandable, maxQtd);

              // Pegar nome de cada opção do complemento da iteração
              var optionsElement = complementExpandable.querySelectorAll('.form-check');
              for await (const optionElement of optionsElement) {
                  var optionTitleElement = optionElement.querySelector('.item-complement, .complement-name');
                  var optionPriceElement = optionElement.querySelector('.sub-item-price');
                  var optionImgElement = optionElement.querySelector('.image-icon')

                  var optionTitle = optionTitleElement ? optionTitleElement.textContent.trim() : "";
                  var optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  var optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',');
                  var optionImg = optionImgElement ? optionImgElement.src : "";
                  var optionDescription = "";

                  optionsComplement.push({
                      optionTitle: optionTitle,
                      optionPrice: optionPrice,
                      optionDescription: optionDescription,
                      optionImg : optionImg
                  });
              }

              complementsDict.push({
                  nameComplement: complementName,
                  typeComplement: typeComplement,
                  minQtd: minQtd,
                  maxQtd: maxQtd,
                  options: optionsComplement
              });

              console.log("- - - - - - - - - - - - - - - - - ")
              console.log("NOME DO COMPLEMENTO: ", complementName)
              console.log("TIPO DO COMPLEMENTO: ", typeComplement)
              console.log("QUANTIDADE MIN: ", minQtd)
              console.log("QUANTIDADE MAX: ", maxQtd)
              console.log("OPÇOES: ", optionsComplement)
              console.log("- - - - - - - - - - - - - - - - - ")
              console.log("                                  ")
              
          }
      }
  }
  return [complementsDict, Required, maxQtd];
}



    // [*] Função responsável por clicar em avançar e executar a captura dos complementos em cada página.
    async calculateComplements(productModal) { 
      let buttons = productModal.querySelectorAll('.add-cart-button');

      // Filtrar os botões para encontrar o botão "Avançar"
      let avancarButton = Array.from(buttons).find(button => button.textContent.includes('Avançar'));

      while (avancarButton) {
        // Executar processComplements e obter o retorno
        let [complementsDict, isRequired, maxQtd] = await this.processComplements(productModal);
    
        // Se o complemento for obrigatório, clique em pelo menos uma opção antes de avançar
        if (isRequired) {
          // Implemente a lógica para clicar em uma opção do complemento obrigatório
          await this.clickOptionForRequiredComplement(complementsDict, maxQtd);
        }
        else{
        // Clique no botão "Avançar"
        avancarButton.click();
        }
        // Aguarde um tempo para a próxima página carregar
        await this.sleep(1500);
    
        // Busque novamente os botões dentro do productModal
        buttons = productModal.querySelectorAll('.add-cart-button');

        // Filtrar os botões para encontrar o botão "Avançar"
        avancarButton = Array.from(buttons).find(button => button.textContent.includes('Avançar'));
    }
    }
    
    async clickOptionForRequiredComplement(complementExpandable, maxQtd = 1) {
        let optionElement = complementExpandable.querySelector('.form-check');
        let plusButton = optionElement.querySelector('.fas.fa-plus-square')
          if(plusButton){
            for (let i = 0; i < maxQtd; i++){
              await this.sleep(400)
              plusButton.click();
            }
          }
          else{
            let radioInput = optionElement.querySelector('input')
            radioInput.click()
            await this.sleep(400)
          }
    }


  //Função principal =============

    async clickProductCards() {
      console.log("executando..")
      await this.sleep(500)

      this.titleRestaurant = document.title || '';
      console.log(this.titleRestaurant)
      let categoryDivs = document.querySelectorAll('.card.mb-4')

      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        await this.sleep(500);
        let categoryDivs = document.querySelectorAll('.card.mb-4');
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('.group-image-name');
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";

        let productCards = categoryDiv.querySelectorAll('.item-container.w-100 .col-md-12.item, .col-md-12 .nopadding .mb-4');

        let productData = [];
        for await (const productIndex of [...Array(productCards.length).keys()]) {
          await this.sleep(500)
          let categoryDivs = document.querySelectorAll('.card.mb-4')
          let categoryDiv = categoryDivs[categoryIndex];
          let productCards = categoryDiv.querySelectorAll('.item-container.w-100 .col-md-12.item, .col-md-12 .nopadding .mb-4')
          let productCard = productCards[productIndex];
          let conferir = productCard.querySelector('.strikePrice');

          let priceElement = 0
          let promoPriceElement = 0 
          if(conferir){
            priceElement = productCard.querySelector('.strikePrice');
            promoPriceElement = productCard.querySelector('.price');
          }else{
            priceElement = productCard.querySelector('.price');
          }
          

          productCard.scrollIntoView()
          await this.sleep(500)
          productCard.click()
          await this.sleep(1000)
          let esgotado = document.querySelector('.v--modal-box.v--modal')
          let modal = document.querySelector('.modal-content'); 
          
          if(modal.textContent == "\n      Item indisponível (zerado)        \n     \n        Ok!\n      "){
            document.querySelector("button").click();
            continue;
          }
          if(esgotado){
            
            let botao = document.querySelector('.btn.btn-primary')
            botao.click()
          }
          await this.sleep(1000)
          let bebidaAlcoolica = document.querySelector('#age-verification > div > div.v--modal-box.v--modal')

          if(bebidaAlcoolica){
            let botao = document.querySelector('#age-verification > div > div.v--modal-box.v--modal > div > div.modal-header > button')
            botao.click()
          }
          await this.sleep(1000)

          if(modal){
            let botao = document.querySelector('#app > div.container-fluid.nopadding > div.v--modal-overlay > div > div.v--modal-box.v--modal > div > form > div.modal-header > button')
            botao.click()
          }


            await this.sleep(1500)
            let productModal = document.querySelector('.modal-content');
            let titleElement = productModal.querySelector('.modal-title');
            let imgElement = productModal.querySelector('img[alt="Item image"]')
            let descricaoElement = productModal.querySelector('.item-description')
            let productTitle = titleElement ? titleElement.textContent : "";
            let priceText = priceElement.textContent.trim();
            let promoPriceText = promoPriceElement.textContent;
            let productPrice = await this.getPriceProduct(priceText);
            let promoProductPrice = await this.getPriceProduct(promoPriceText);
            let imgSrc = imgElement ? imgElement.src : "";
            let productDescricao = descricaoElement ? descricaoElement.textContent : "";

            let [complementsDict, isRequired, maxQtd] = await this.processComplements(productModal)

            productData.push({
              title: productTitle,
              price: productPrice,
              promoPrice: promoProductPrice,
              imgSrc: imgSrc,
              descricao: productDescricao,
              complementsDict: complementsDict
            });
            console.log("- - - - - - - - - - - - - - - - - ")
            console.log("NOME PRODUTO: ", productTitle)
            console.log("PREÇO PRODUTO: ", productPrice)
            console.log("IMAGEM: ", imgSrc)
            console.log("DESCRIÇAO: ", productDescricao)
            console.log("- - - - - - - - - - - - - - - - - ")
            console.log("                                  ")
            await this.backPage();
          }
        
        this.scrapedData.push({
          categoryName: categoryName,
          productsCategory: productData
        });
        console.log("Categoria adicionada")
        }
      }

  async backPage() {
    console.log("Voltou!")
    await this.sleep(1000);
    let back = document.querySelector('.modal-title-close, .update-button');
    if (back) {
      back.click()
  }
    await this.sleep(1000);
  }
}