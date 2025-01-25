class ScrapyCoisaRuim {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
    }
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
  
    async checkAndScrape() {
      await this.sleep(500);
      const categoryCards = document.querySelectorAll('.category-card__container');
      if (categoryCards.length > 0) {
        await this.clickCategoryCards();
      } else {
        await this.clickProductCards();
      }
    }
  
   
    async checkRepetition(complementExpandable) { 
      let button = complementExpandable.querySelector(".text-decoration-none.material-green");
      if (button) {
        return "com repeticao";
      } else {
        return "sem repeticao";
      }
  }
  
  
    async processTypeComplement(typeComplement, complementExpandable) {
      const complement = typeComplement.trim();
      let repetition = await this.checkRepetition(complementExpandable);
      let type = "";
      let minQtd = 0;
      let maxQtd = 0;


    if (complement.match(/^Escolha até (\d+) opções/)) {
        const maxItems = parseInt(complement.match(/^Escolha até (\d+) opções/)[1], 10);
        type = 'Mais de uma opcao ' + repetition;
        maxQtd = maxItems;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }else if (complement.match(/^Escolha até (\d+) opção/)) {
        type = 'Apenas uma opcao ';
        minQtd = 0;
        maxQtd = 1;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }
      else if (complement.match(/^Selecione de (\d+) a (\d+) sabores/)) {
        const minMaxItems = complement.match(/\d+/g);
        const minItems = parseInt(minMaxItems[0], 20);
        const maxItems = parseInt(minMaxItems[1], 20);
        type = 'Mais de uma opcao sem repeticao' ;
        minQtd = minItems;
        maxQtd = maxItems;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }else if (complement.match(/^Escolha pelo menos 1 e no máximo 1 opção./)) {
        type = 'Apenas uma opcao ';
        maxQtd = 1;
        minQtd = 1;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }else if (complement.match(/^Escolha pelo menos \d+ e no máximo \d+ opções.$/)) {
        const minMaxItems = complement.match(/\d+/g);
        const minItems = parseInt(minMaxItems[0], 20);
        const maxItems = parseInt(minMaxItems[1], 20);
        type = 'Mais de uma opcao ' + repetition;
        minQtd = minItems;
        maxQtd = maxItems;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }
      return [type, minQtd, maxQtd];
    }
  
    async clickProductCards() {
      console.log("executando..");
      await this.sleep(1000);
      let categoryDivs = document.querySelectorAll('.products-section.clearfix.js-products-section');
  
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
          let categoryDivs = document.querySelectorAll('.products-section.clearfix.js-products-section');
          let categoryDiv = categoryDivs[categoryIndex];
          let categoryNameElement = categoryDiv.querySelector('.title.title--cover');
          let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
          console.log(categoryName);
          let productCards = categoryDiv.querySelectorAll(".items-list-item.js-items-list-item-tooltip");
  
          let productData = [];
          let complementsDict;
          for await (const productIndex of [...Array(productCards.length).keys()]) {
              let categoryDivs = document.querySelectorAll('.products-section.clearfix.js-products-section');
              let categoryDiv = categoryDivs[categoryIndex];
              let productCards = categoryDiv.querySelectorAll(".items-list-item.js-items-list-item-tooltip");
              let productCard = productCards[productIndex];
  
              await this.sleep(500);
              if (productCard.querySelector('.badge') && productCard.querySelector('.badge').textContent === 'Esgotado') {
                  console.log("Produto esgotado, pulando...");
                  continue; // Pular para o próximo produto se estiver esgotado
              }

              let productContainer = ""
              let titleElement = ""
              let priceElement = ""
              let imgElement = ""
              let descricaoElement = ""
              

              titleElement = productCard.querySelector('.title');
              descricaoElement = productCard.querySelector('.description ');
              imgElement =  productCard.querySelector('img');


              productCard.click();
              await this.sleep(500);
  
              productContainer = document.querySelector('.modal-content.w920');
              titleElement = productContainer.querySelector('.item-name');
              priceElement = productContainer.querySelector('.add-to-cart-btn.btn.js-add-item');
              imgElement = productContainer.querySelector('img');
              descricaoElement = productContainer.querySelector('.box-text');
              let productTitle = titleElement ? titleElement.textContent : "";
              let priceText = priceElement ? priceElement.textContent : "";
              let productPrice = priceText.replace(/[^0-9,]+/g, '').trim();
              let imgSrc = imgElement ? imgElement.src : "";
              let productDescricao = descricaoElement ? descricaoElement.textContent : "";
  
              complementsDict = [];
            await this.sleep(2000)
            let complementExpandables = document.querySelectorAll('.item-properties, .make-your-pizza-body');
            
            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.property, .js-section-rules-pizza section-rules-pizza');
              
              
              let optionsComplement = [];
    
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {
                let typeComplementElement = complementElement.querySelector('.description, .js-section-rules-pizza section-rules-pizza');
                let complementNameElement = complementElement.querySelector('.title, .js-section-rules-pizza section-rules-pizza');
                let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
  
                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable)
                let complementName = complementNameElement ? complementNameElement.textContent : "";
                // Pegar nome de cada opção do complemento da iteração
                
  
                let optionsElement = complementExpandable.querySelectorAll('li, .items-list-item');
                
                for await (const optionElement of optionsElement) {
                  let optionTitleElement = optionElement.querySelector('.option-name, .name, .title');
                  
                  let optionPriceElement = optionElement.querySelector('.option-price, .formatted-price, .price-value');
                  let optionDescriptionElement = optionElement.querySelector('.option-description, .description');
                  let optionImgELement = optionElement.querySelector('img');
                  //let optionQtdElement = optionElement.querySelector('span.text-grey-3');
    
                  let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                  let optionDescription = optionDescriptionElement ? optionDescriptionElement.textContent : "";
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  let optionPrice = optionPriceText.replace(/[^0-9,]/g, '').replace(/^(\d+),(\d{2})$/, '$1,$2');
                  let optionImg = "";
                  //let optionQtd = optionQtdElement ? optionQtdElement.textContent : "";
                  
    
    
                  optionsComplement.push({
                    optionTitle: optionTitle,
                    optionPrice: optionPrice,
                    optionDescription: optionDescription,
                    optionImg: optionImg
                  });
                }
    
                complementsDict.push({
                  nameComplement: complementName,
                  typeComplement: typeComplement,
                  minQtd: minQtd,
                  maxQtd: maxQtd,
                  options: optionsComplement
                })
                console.log("- - - - - - - - - - - - - - - - - ")
                console.log("NOME DO COMPLEMENTO: ",complementName)
                console.log("TEXTO DO TIPO DO COMPLEMENTO: ",typeComplementText.trim())
                console.log("TIPO DO COMPLEMENT: ",typeComplement)
                console.log("QUANTIDADE MIN: ",minQtd)
                console.log("QUANTIDADE MAX: ",maxQtd)
                console.log("OPÇOES: ",optionsComplement)
                console.log("- - - - - - - - - - - - - - - - - ")
                console.log("                                  ")
              }
            }
            
            productData.push({
              title: productTitle,
              price: productPrice,
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
            await this.sleep(1000)
            
        }
        this.scrapedData.push({
          categoryName: categoryName,
          productsCategory: productData
        });
        //await this.backPage(); 
      }
      //alert("Finalizado!")
  }
  
  
  async backPage() {
    await this.sleep(1000);
    let back = document.querySelector('.material-icons.close-button.js-modal-close')
    if (back) {
      console.log("Voltou")
      back.click()
  }
  }
  }
  
  function desativarAlerta() {
    const alertContainer = document.querySelector('[data-testid="alert-container"]');
    if (alertContainer) {
      alertContainer.remove();
    }
  }
  // Chame a função desativarAlerta antes de executar outras ações
  desativarAlerta();
 1  