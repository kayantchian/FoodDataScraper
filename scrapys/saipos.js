class scrapySaipos {
  constructor() {
    this.scrapedData = [];
    this.titleRestaurant = ""
  }

  sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }

    async checkRepetition(complementExpandable) { 
      const plusButton = complementExpandable.querySelector('.more');     
      if (plusButton) {
        return "com repeticao";
      } else {
        return "sem repeticao";
      }
    }

    async processTypeComplement(typeComplement, complementExpandable, required) {
      const complement = typeComplement !== "" ? typeComplement : "";
      let repetition = await this.checkRepetition(complementExpandable);

        let minQtd = 0;
        let maxQtd = 0;

        if(required == "Obrigatório"){
          minQtd = 1
        }
        if(!typeComplement){
          maxQtd = 1
        }
        
        const minMatch = complement.match(/Escolha pelo menos (\d+) opções/);
        const minMatch2 = complement.match(/Escolha pelo menos 1 opção/);
        const minOneMatch = complement.match(/Escolha até 1 opção/);
        const matchSelectUntil = complement.match(/^Escolha até (\d+) opções/);

         if(minMatch){
          minQtd = parseInt(minMatch[1], 10)
          maxQtd = parseInt(minMatch[1], 10);
        }else if(matchSelectUntil){
          maxQtd = parseInt(matchSelectUntil[1], 10);
        }else if(minOneMatch){
          maxQtd = 1
        }else if(minMatch2){
          minQtd = 1;
          maxQtd = 1;
        }
      
        
        let type = maxQtd > 1 ? "Mais de uma opcao " + repetition : "Apenas uma opcao ";
      
        return [type, minQtd, maxQtd];
      }
    

  async clickProductCards() {
    console.log("executando..")
    await this.sleep(1000)
    let categoryDivs = document.querySelectorAll('section[_ngcontent-ng-c2250877296]');
    let categories = document.querySelectorAll('.categories-content');

    for (let categoryIndex = 0; categoryIndex < categoryDivs.length; categoryIndex++) {
      await this.sleep(500);
      
      let currentCategory = categories[categoryIndex];
      if (!currentCategory) continue; 
      let categoryNameElement = currentCategory.querySelector('.category-title');
      let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
      console.log(categoryName);
      let productCards = currentCategory.querySelectorAll(".col-12");
      let productData = [];
      
      for (let productIndex = 0; productIndex < productCards.length; productIndex++) {
        await this.sleep(1000);
        let currentCategory = categories[categoryIndex];
        let productCards = currentCategory.querySelectorAll(".col-12");
        let productCard = productCards[productIndex];
        if (!productCard) continue; 
        

          await this.sleep(500)
          productCard.scrollIntoView();
          productCard.click();
          // Agora, vamos adicionar um atraso antes de coletar os dados.
          await this.sleep(1000)
        console.log("clicou")
          let productModal = document.querySelector('.modal-content')
          let titleElement = productModal.querySelector('.title');
          let imgElement = productModal.querySelector('.img-fluid');
          let descricaoElement = productModal.querySelector('.description');
          let productTitle = titleElement ? titleElement.textContent : "";
          let imgSrc = imgElement ? imgElement.src : "";
          let productDescricao = descricaoElement ? descricaoElement.textContent : "";
          let priceElement = productModal.querySelector('.price');
          let priceText = priceElement ? priceElement.textContent : "";
          let productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',')
  
          let complementsDict = []
          let complementExpandables = document.querySelectorAll('.content-item')

          for await (const complementExpandable of complementExpandables) {

            let optionsComplement = [];

              
              let typeComplementElement = complementExpandable.querySelector('.text-options.dark-text');
              let requiredElement = complementExpandable.querySelector('.tag.tag-required')
              let complementNameElement = complementExpandable.querySelector('.fw-medium.dark-text');
              let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
              let required = ""
              
              if(requiredElement){
                let requiredText = requiredElement.textContent.trim();
                required = requiredElement ? requiredElement.textContent : "";
                typeComplementText = typeComplementText.replace(requiredText, '');
              }

              let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable, required)
              let complementName = complementNameElement ? complementNameElement.textContent : "";
              // Pegar nome de cada opção do complemento da iteração
              await this.sleep(500)
              let optionsElement = complementExpandable.querySelectorAll('.d-flex.justify-content-between');
              for await (const optionElement of optionsElement) {
                let optionTitleElement = optionElement.querySelector('.product-name');
                let optionPriceElement = optionElement.querySelector('.product-price');
                let optionDescriptionElement = optionElement.querySelector('.product-description.product-description-without-photo')
                //let optionQtdElement = optionElement.querySelector('span.text-grey-3');
  
                let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                let optionPrice = optionPriceText.replace(/[^0-9,]/g, '').replace('.', ',');
                //let optionQtd = optionQtdElement ? optionQtdElement.textContent : "";
                let optionDescription = optionDescriptionElement ? optionDescriptionElement.textContent : "";
  
                optionsComplement.push({
                  optionTitle: optionTitle,
                  optionPrice: optionPrice,
                  optionDescription: optionDescription
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
              // console.log("TEXTO DO TIPO DO COMPLEMENTO: ",typeComplementText.trim())
              console.log("TIPO DO COMPLEMENT: ",typeComplement)
              console.log("QUANTIDADE MIN: ",minQtd)
              console.log("QUANTIDADE MAX: ",maxQtd)
              console.log("REQUERED: ",required)
              console.log("OPÇOES: ",optionsComplement)
              console.log("- - - - - - - - - - - - - - - - - ")
              console.log("                                  ")
            
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
          console.log("DESCRIÇAO: ", productDescricao)
          console.log("PREÇO PRODUTO: ", productPrice)
          console.log("IMAGEM: ", imgSrc)
          console.log("- - - - - - - - - - - - - - - - - ")
          console.log("                                  ")
          await this.sleep(500)
          await this.backPage();
          await this.sleep(500)
        
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
  let back = document.querySelector('.btn-close.d-flex.justify-content-center.align-items-center')
  if (back) {
    back.click()
}}
}