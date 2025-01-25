class ScrapyAnotai {
  constructor() {
    this.scrapedData = [];
    this.titleRestaurant = ""
  }

  sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }

  async checkAndScrape() {
    await this.sleep(500);
    const categoryCards = document.querySelectorAll('.category-card__container, .box.-img');
    if (categoryCards.length > 0) {
      await this.clickCategoryCards();
    } else {
      await this.clickProductCards();
    }
  }

  async clickCategoryCards() {
      let categoryGrid = document.querySelector('.category-grid, .categories-grid');
      let categoryCards = categoryGrid.querySelectorAll('.category-card__container, .box.-img');

  
      for await (const categoryCardIndex of [...Array(categoryCards.length).keys()]) {
          await this.sleep(500);

          let categoryGrid = document.querySelector('.category-grid, .categories-grid');
          let categoryCards = categoryGrid.querySelectorAll('.category-card__container, .box.-img');
          let categoryCard = categoryCards[categoryCardIndex];
  
          console.log({ categoryCards, categoryCard });
          // Adicione um tempo de espera antes do clique para garantir que a página esteja pronta
          await this.sleep(1000);
          // Use o método scrollIntoView para garantir que o elemento esteja visível
          categoryCard.scrollIntoView();
          // Clique no elemento
          categoryCard.click();
          console.log("clicou")
          // Aguarde um tempo suficiente após o clique antes de chamar clickProductCards
          await this.sleep(1000);
          // Chame clickProductCards
          await this.clickProductCards();
          console.log("executou!")
          // Aguarde antes de voltar à página anterior
          await this.sleep(1000);
          // Volte à página anterior
          await this.backPage();
      }
  }

  async checkRepetition(complementExpandable) { 
    let button = complementExpandable.querySelector(".icon-container.-align");
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
  
    if (complement.match(/^Escolha (\d+) itens/)) {
      const itemCount = parseInt(complement.match(/^Escolha (\d+) itens/)[1], 10);
        type = 'Mais de uma opcao ' + repetition;
        minQtd = itemCount;
        maxQtd = itemCount;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      
    }else if (complement.match(/^Escolha até (\d+) itens/)) {
      const maxItems = parseInt(complement.match(/^Escolha até (\d+) itens/)[1], 10);
      type = 'Mais de uma opcao ' + repetition;
      maxQtd = maxItems;
      console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
    }else if (complement.match(/^Escolha até (\d+) item/)) {
      type = 'Apenas uma opcao ';
      maxQtd = 1;
      console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
    }else if (complement.match(/^Escolha de \d+ até \d+ itens$/)) {
      const minMaxItems = complement.match(/\d+/g);
      const minItems = parseInt(minMaxItems[0], 10);
      const maxItems = parseInt(minMaxItems[1], 10);
      type = 'Mais de uma opcao ' + repetition;
      minQtd = minItems;
      maxQtd = maxItems;
      console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
    }else if ("Escolha 1 item") {
      type = 'Apenas uma opcao ';
      maxQtd = 1;
      minQtd = 1;
      console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
    }
    return [type, minQtd, maxQtd];
  }

  async clickProductCards() {
    console.log("executando..");
    await this.sleep(1000);
    let categoryDivs = document.querySelectorAll('.category-container');

    for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        let categoryDivs = document.querySelectorAll('.category-container, .category-details');
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('h2.title, .navigation-header__title');
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
        console.log(categoryName);
        let productCards = categoryDiv.querySelectorAll(".item-card.item");

        let productData = [];
        let complementsDict;
        for await (const productIndex of [...Array(productCards.length).keys()]) {
            let categoryDivs = document.querySelectorAll('.category-container');
            let categoryDiv = categoryDivs[categoryIndex];
            let productCards = categoryDiv.querySelectorAll(".item-card.item");
            let productCard = productCards[productIndex];

            await this.sleep(500);
            if (productCard.querySelector('.badge') && productCard.querySelector('.badge').textContent === 'Esgotado') {
                console.log("Produto esgotado, pulando...");
                continue; // Pular para o próximo produto se estiver esgotado
            }
            productCard.click();
            await this.sleep(500);

            let productContainer = document.querySelector('.item-header-container,  .profile');
            let titleElement = productContainer.querySelector('span.font-5, .name');
            let priceElement = productContainer.querySelector('span.price__now.font-3, .price-value');
            let imgElement = productContainer.querySelector('img');
            let descricaoElement = productContainer.querySelector('span.weight-400, .description');
            let productTitle = titleElement ? titleElement.textContent : "";
            let priceText = priceElement ? priceElement.textContent : "";
            let productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',');
            let imgSrc = imgElement ? imgElement.src : "";
            let productDescricao = descricaoElement ? descricaoElement.textContent : "";

            complementsDict = [];
          await this.sleep(2000)
          let complementExpandables = document.querySelectorAll('.expandable, .collapse');
          
          for await (const complementExpandable of complementExpandables) {
            let complementElements = complementExpandable.querySelectorAll('.expandable__fixed.pointer.bg-grey-12, .header.-expandable');
            
            
            let optionsComplement = [];
  
            // Pegar o nome de cada complemento
            for await (const complementElement of complementElements) {
              let typeComplementElement = complementElement.querySelector('.expandable__fixed__header__text__subtitle.font-1.text-grey, .description');
              let complementNameElement = complementElement.querySelector('.expandable__fixed__header__text__title.font-2.text-black, .title');
              let requiredElement = complementElement.querySelector('.badge');
              let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";

              let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable)
              let required = requiredElement ? requiredElement.textContent : "";
              let complementName = complementNameElement ? complementNameElement.textContent : "";
              // Pegar nome de cada opção do complemento da iteração
              

              let optionsElement = complementExpandable.querySelectorAll('.chooser.column.w-100.no-user-select.chooser, .additional-item');
              
              for await (const optionElement of optionsElement) {
                let optionTitleElement = optionElement.querySelector('.weight-700.text-black.font-1, .name');
                let optionPriceElement = optionElement.querySelector('.price__now.weight-600.font-1, .price');
                let optionDescriptionElement = optionElement.querySelector('.chooser-info__description.text-grey-2.text-left.font-1.mb-1, .description');
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
          await this.sleep(1000)
          window.history.back();
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

  window.history.back()
//   let back = document.querySelector('.icon-container.navigation-header__back__icon, .icon, .floating-btn.-back')
//   if (back) {
//     console.log("Voltou")
//     back.click()
// }
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
