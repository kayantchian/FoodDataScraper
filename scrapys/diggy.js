class scrapyDiggy {
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
      let button = complementExpandable.querySelector(".MuiButtonBase-root.MuiIconButton-root");
      if (button) {
        return "com repeticao";
      } else {
        return "sem repeticao";
      }
  }
  
  
  async processTypeComplement(typeComplement, complementExpandable, required) {
    const complement = typeComplement.trim();
    let repetition = await this.checkRepetition(complementExpandable);
    let type = "";
    let minQtd = required === "Obrigatorio" ? 1 : 0;
    let maxQtd = 0;
  
    if (complement.match(/^Escolha (\d+) opção\.$/)) {
      const itemCount = parseInt(complement.match(/^Escolha (\d+) opção\.$/)[1], 10);
      type = "Apenas uma opcao";
      minQtd = itemCount;
      maxQtd = itemCount;
    } else if (complement.match(/^Escolha até (\d+) opções\.$/)) {
      const maxItems = parseInt(complement.match(/^Escolha até (\d+) opções\.$/)[1], 10);
      type = 'Mais de uma opcao ' + repetition;
      maxQtd = maxItems;
    }else if (complement.match(/^Escolha até 1 opção\.$/)){
        type = "Apenas uma opcao";
        minQtd = 0;
        maxQtd = 1;
      }
  
    console.log('type:', type, 'minQtd:', minQtd, 'maxQtd:', maxQtd);
    return [type, minQtd, maxQtd];
  }
  
async clickProductCards() {
    console.log("executando..");
    await this.sleep(1000);
    let categoryDivs = document.querySelectorAll('.px-5.my-5');
  
    for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
      let categoryDiv = categoryDivs[categoryIndex];
      let categoryNameElement = categoryDiv.querySelector('.line-clamp-2.font-bold');
      let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
      console.log(categoryName);
      let productCards = categoryDiv.querySelectorAll(".flex.flex-col.overflow-hidden.height-auto.text-foreground");
  
      let productData = [];
      let complementsDict;
      for await (const productIndex of [...Array(productCards.length).keys()]) {
        let productCard = productCards[productIndex];
  
        await this.sleep(500);
        productCard.click();
        await this.sleep(500);
  
        let productContainer = document.querySelector('.flex.flex-col.relative.z-50.w-full');
        let titleElement = productContainer.querySelector('.MuiTypography-root.MuiTypography-h6');
        let priceElement = productContainer.querySelector('footer > div > button');
        let imgElement = productContainer.querySelector('img');
        let descricaoElement = productContainer.querySelector('.MuiTypography-root.MuiTypography-body1');
        let productTitle = titleElement ? titleElement.textContent : "";
        let priceText = priceElement ? priceElement.textContent : "";
        let productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',');
        let imgSrc = imgElement ? imgElement.src : "";
        let productDescricao = descricaoElement ? descricaoElement.textContent : "";
  
        complementsDict = [];
        await this.sleep(2000);
        let complementExpandables = document.querySelectorAll('.sc-8890ee39-4.iwVtN');
  
        for await (const complementExpandable of complementExpandables) {
          let complementElements = complementExpandable.querySelectorAll('.sc-8890ee39-5.gJrexQ');
  
          let optionsComplement = [];
  
          for await (const complementElement of complementElements) {
            let typeComplementElement = complementElement.querySelector('.sc-8890ee39-8.kiBcik');
            let complementNameElement = complementElement.querySelector('.sc-6f212666-4.kXHjyh');
            let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
            let requiredElement = complementElement.querySelector('.MuiChip-root');
  
            let required = requiredElement ? requiredElement.textContent : "";
            let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable, required);
            let complementName = complementNameElement ? complementNameElement.textContent : "";
  
            let optionsElements = complementExpandable.querySelectorAll('.sc-8890ee39-6.csDSlL');
  
            for await (const optionElement of optionsElements) {
            let optionTitleElement = optionElement.querySelector('.sc-6f212666-5.UQpae.mt-2');
            let optionPriceElement = optionElement.querySelector('.sc-6f212666-5.UQpae:not(.mt-2)');
            let optionDescriptionElement = optionElement.querySelector('.sc-6f212666-5.UQpae.mt-2.text-xs');
            let imgElement = optionElement.querySelector('img');

            let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
            let optionDescription = optionDescriptionElement ? optionDescriptionElement.textContent : "";
            let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "R$ 0,00";
            let optionPrice = optionPriceText.replace(/[^\d,]/g, '').replace('.', ',');
            let optionImg = imgElement ? imgElement.src : "";


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
              required: required,
              options: optionsComplement
            });
  
            console.log("- - - - - - - - - - - - - - - - - ");
            console.log("NOME DO COMPLEMENTO: ", complementName);
            console.log("TEXTO DO TIPO DO COMPLEMENTO: ", typeComplementText.trim());
            console.log("TIPO DO COMPLEMENTO: ", typeComplement);
            console.log("QUANTIDADE MIN: ", minQtd);
            console.log("QUANTIDADE MAX: ", maxQtd);
            console.log("REQUIRED: ", required);
            console.log("OPÇÕES: ", optionsComplement);
            console.log("- - - - - - - - - - - - - - - - - ");
            console.log("                                  ");
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
    let back = document.querySelector('.icon-container.navigation-header__back__icon')
    if (back) {
      console.log("Voltou")
      back.click()
  }
  }
  }
  
  function desativarAlerta() {
    const alertContainer = document.querySelector('[aria-label="Close"]');
    if (alertContainer) {
      alertContainer.remove();
    }
  }
  // Chame a função desativarAlerta antes de executar outras ações
  desativarAlerta();
  