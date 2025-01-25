//Feito por Alexandre

class scrapyYooga {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
    }
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
  
   
  
    async getPriceProduct(priceText) {
        let productPrice;
      
        if (priceText) {
          const regex = /R\$\s*([\d,.]+)/g;
          const matches = priceText.match(regex);
      
          if (matches && matches.length > 1) {
            // Pega o segundo preço encontrado
            productPrice = matches[1].replace(/[^\d,.]/g, '').replace('.', ',');
          } else if (matches && matches.length === 1) {
            // Se houver apenas um preço, pega o primeiro
            productPrice = matches[0].replace(/[^\d,.]/g, '').replace('.', ',');
          }
        }
      
        return productPrice;
      }
      

      
  
      async checkRepetition(complementExpandable) { 
        const plusButton = complementExpandable.querySelector('.option-plus.md.hydrated');     
        if(plusButton){ 
        plusButton.click(); 
        await this.sleep(200)
        plusButton.click();
        await this.sleep(200)
        const counter = complementExpandable.querySelector('.option-qty');
        const counterValue = parseInt(counter.textContent, 10);
        if (counterValue > 1) {
          return "com repeticao";
        } else if (counterValue === 1) {
          return "sem repeticao";
        }
      } else {
        return "sem repeticao";
      }
    }
  
      async processTypeComplement(typeComplement, complementExpandable, required) {
        const complement = typeComplement !== "" ? typeComplement : "";
        let repetition = await this.checkRepetition(complementExpandable);
          let minQtd = 0;
          let maxQtd = 0;
          if (required === "OBRIGATÓRIO") {
            minQtd = 1;
          }

          const minMaxMatch = complement.match(/(\d+) (de|até) (\d+)/);
          const minMatch = complement.match(/pelo menos (\d+)/);
          const matchSelectUntil = complement.match(/^Escolha até (\d+) opções/);

          if (minMaxMatch) {
            maxQtd = parseInt(minMaxMatch[3], 10);
          }else if(minMatch){
            if (minMatch) {
              minQtd = parseInt(minMatch[1], 10);
              
            }
            const maxMatch = complement.match(/máx\. (\d+)/);
            if (maxMatch) {
              maxQtd = parseInt(maxMatch[1], 10);
            }
            
          }else if(matchSelectUntil){
            maxQtd = parseInt(matchSelectUntil[1], 10);
          }else if(complement === "Escolha até uma opção"){
            maxQtd = 1
          }
        
        
          let type = maxQtd > 1 ? "Mais de uma opcao " + repetition : "Apenas uma opcao ";
        
          return [type, minQtd, maxQtd];
        }
      
  
    async clickProductCards() {
      console.log("executando..")

      this.titleRestaurant = (document.querySelector('.store-title') || {}).textContent || '';

      await this.sleep(1000)
      let categoryDivs = document.querySelectorAll('.sticky-category-element.md.hydrated');
    
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        await this.sleep(500)
        let categoryDivs = document.querySelectorAll('.sticky-category-element.md.hydrated');
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('.store-category-name');
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
        let productCards = categoryDiv.querySelectorAll(".store-item.ion-activatable.ripple-parent.px-3.md.hydrated");
    
        let productData = [];
        for await (const productIndex of [...Array(productCards.length).keys()]) {
          await this.sleep(1000)
          let categoryDivs = document.querySelectorAll('.sticky-category-element.md.hydrated');
          let categoryDiv = categoryDivs[categoryIndex];
          let productCards = categoryDiv.querySelectorAll((".store-item.ion-activatable.ripple-parent.px-3.md.hydrated"));
          let productCard = productCards[productIndex];
          
            await this.sleep(500)
            productCard.scrollIntoView();
            productCard.click();
            // Agora, vamos adicionar um atraso antes de coletar os dados.
            await this.sleep(1000)
            let productModal = document.querySelector('.modal-wrapper.sc-ion-modal-md')
            let titleElement = productModal.querySelector('.item-name');
            let priceElement = productModal.querySelector('.item-price');
            let imgElement = productModal.querySelector('img');
            let descricaoElement = productModal.querySelector('.item-description');
            let productTitle = titleElement ? titleElement.textContent : "";
            let priceText = priceElement ? priceElement.textContent : "";
            let productPrice = await this.getPriceProduct(priceText)
            let imgSrc = imgElement ? imgElement.src : "";
            let productDescricao = descricaoElement ? descricaoElement.textContent : "";
    
            let complementsDict = []
            let complementExpandables = document.querySelectorAll('.sticky-choice-element.md.hydrated');
            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.choice-header.md.hydrated');
              let optionsComplement = [];
              
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {
                complementElement.scrollIntoView();
                let typeComplementElement = complementElement.querySelector('.mt-2.f-12.text-medium-gray');
                let requiredElement = complementElement.querySelector('.ion-text-right.choice-required');
                let complementNameElement = complementElement.querySelector('.d-inline-block');
                
                let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
                let required = requiredElement ? requiredElement.textContent : "";
                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable,required)
                let complementName = complementNameElement ? complementNameElement.textContent : "";
                // Pegar nome de cada opção do complemento da iteração
                let optionsElement = complementExpandable.querySelectorAll('.option-container');
                for await (const optionElement of optionsElement) {
                  let optionTitleElement = optionElement.querySelector('.option-name');
                  let optionPriceElement = optionElement.querySelector('.option-price');
                  //let optionQtdElement = optionElement.querySelector('span.text-grey-3');
                  let optionDescriptionElement = optionElement.querySelector('.item-description');
    
                  let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',');
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
            // console.log("DESCRIÇAO: ", productDescricao)
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
    let back = document.querySelector('.md.button.button-clear.in-toolbar.button-has-icon-only.ion-activatable.ion-focusable.hydrated')
    if (back) {
      back.click()
  }}
  }
 