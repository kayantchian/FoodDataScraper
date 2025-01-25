class scrapySemola {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
    }
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
  
   
  
    async checkRepetition(complementExpandable) { 
      let button = complementExpandable.querySelector("[data-testid='btn-plus']");
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
      let minQtd = 0;
      let maxQtd = 0;
        
      if(required === "OBRIGATÓRIO"){
        minQtd = 1
      }
      else{
        minQtd = 0
      }
    
      if (complement.match(/^Escolha (\d+) opção/)) {
        const itemCount = parseInt(complement.match(/^Escolha (\d+) opção/)[1], 10);
          type = 'Mais de uma opcao ' + repetition;
          minQtd = itemCount;
          maxQtd = itemCount;
          console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
        
      }else if (complement.match(/^Escolha até (\d+) opções/)) {
        const maxItems = parseInt(complement.match(/^Escolha até (\d+) opções/)[1], 10);
        type = 'Mais de uma opcao ' + repetition;
        minQtd
        maxQtd = maxItems;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }else if (complement.match(/^Escolha até (\d+) opção/)) {
        type = 'Apenas uma opcao ';
        maxQtd = 1;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }else if ("Escolha 1 opção") {
        type = 'Apenas uma opcao ';
        maxQtd = 1;
        minQtd = 1;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }else if (complement.match(/^Escolha entre \d+ e \d+ opções$/)) {
        const minMaxItems = complement.match(/\d+/g);
        const minItems = parseInt(minMaxItems[0], 10);
        const maxItems = parseInt(minMaxItems[1], 10);
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
      let categoryDivs = document.querySelectorAll('div[data-cy="product-list"] > div')
  
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
          let categoryDivs = document.querySelectorAll('div[data-cy="product-list"] > div');
          let categoryDiv = categoryDivs[categoryIndex];
          let categoryNameElement = categoryDiv.querySelector('.MuiTypography-root.MuiTypography-h6.css-lqh13o');
          let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
          console.log(categoryName);
          let productCards = categoryDiv.querySelectorAll(".MuiBox-root.css-1ck107");
  
          let productData = [];
          let complementsDict;
          for await (const productIndex of [...Array(productCards.length).keys()]) {
              let categoryDivs = document.querySelectorAll('div[data-cy="product-list"] > div');
              let categoryDiv = categoryDivs[categoryIndex];
              let productCards = categoryDiv.querySelectorAll(".MuiBox-root.css-1ck107");
              let productCard = productCards[productIndex];
  
              await this.sleep(500);
              if (productCard.querySelector('.badge') && productCard.querySelector('.badge').textContent === 'Esgotado') {
                  console.log("Produto esgotado, pulando...");
                  continue; // Pular para o próximo produto se estiver esgotado
              }
              productCard.click();
              await this.sleep(2000);
  
              let productContainer = document.querySelector('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-dow93b');
              let titleElement = productContainer.querySelector('.MuiTypography-root.MuiTypography-h4.css-1a9urfw');
              let priceElement = productContainer.querySelector('.product-info__price-container.MuiBox-root.css-tdqnlp');
              let imgElement = productContainer.querySelector('img');
              let descricaoElement = productContainer.querySelector('.MuiTypography-root.MuiTypography-body1product-info__description.css-mcxaxb');
              let productTitle = titleElement ? titleElement.textContent : "";
              let priceText = priceElement ? priceElement.textContent : "";
              let productPrice = 0 
              if(priceText != "A partir de "){
                productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',');
              }
                
              let imgSrc = imgElement ? imgElement.src : "";
              let productDescricao = descricaoElement ? descricaoElement.textContent : "";
  
              complementsDict = [];
            await this.sleep(2500)
            let complementExpandables = document.querySelectorAll('.MuiBox-root.css-178yklu');
            
            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.MuiBox-root.css-l7jr7n');
              
              
              let optionsComplement = [];
    
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {
                let typeComplementElement = complementElement.querySelector('.MuiTypography-root.MuiTypography-body2.css-1vvxjg8');
                let complementNameElement = complementElement.querySelector('.MuiTypography-root.MuiTypography-h6.css-lqh13o');
                let requiredElement = complementElement.querySelector('.MuiChip-root.MuiChip-tag.MuiChip-sizeMedium.MuiChip-colorPrimary ');
                let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
                let required = requiredElement ? requiredElement.textContent : "";
  
                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable, required )
                let complementName = complementNameElement ? complementNameElement.textContent : "";
                // Pegar nome de cada opção do complemento da iteração
                
  
                let optionsElement = complementExpandable.querySelectorAll('.MuiBox-root.css-17rpjm7');
                
                for await (const optionElement of optionsElement) {
                  let optionTitleElement = optionElement.querySelector('.MuiTypography-root.MuiTypography-body1.css-860fmm');
                  let optionPriceElement = optionElement.querySelector('.MuiTypography-root.MuiTypography-body2.option-info__price.css-1vvxjg8');
                  let optionDescriptionElement = optionElement.querySelector('.MuiTypography-root.MuiTypography-body2.css-11ixqqy');
                  let optionImgELement = optionElement.querySelector('img');
                  //let optionQtdElement = optionElement.querySelector('span.text-grey-3');
    
                  let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                  let optionDescription = optionDescriptionElement ? optionDescriptionElement.textContent : "";
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',');
                  let optionImg = optionImgELement ? optionImgELement.src : "";
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
                  required: required,
                  options: optionsComplement
                })
                console.log("- - - - - - - - - - - - - - - - - ")
                console.log("NOME DO COMPLEMENTO: ",complementName)
                console.log("TEXTO DO TIPO DO COMPLEMENTO: ",typeComplementText.trim())
                console.log("TIPO DO COMPLEMENT: ",typeComplement)
                console.log("QUANTIDADE MIN: ",minQtd)
                console.log("QUANTIDADE MAX: ",maxQtd)
                console.log("REQUERED: ",required)
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
            await this.sleep(2000)
            
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
    let back = document.querySelector('.icon-container.navigation-header__back__icon, .icon')
    if (back) {
      console.log("Voltou")
      back.click()
  }
  }
  }
  
  function desativarAlerta() {
    const alertContainer = document.querySelector('body > div.MuiModal-root.css-8ndowl > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-dow93b > div.product__wrapper--header.MuiBox-root.css-1trmes0 > button');
    if (alertContainer) {
      alertContainer.remove();
    }
  }
  // Chame a função desativarAlerta antes de executar outras ações
  desativarAlerta();
  